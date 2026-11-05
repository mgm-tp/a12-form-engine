/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * Dual License
 * ------------
 * This source file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License - EUPL v1.2
 *    You may redistribute and/or modify this file under the terms of the
 *    European Union Public License, version 1.2 - see https://eupl.eu/.
 *
 * 2. Commercial License
 *    Alternatively, you may obtain a commercial license from
 *    mgm technology partners GmbH, that permits use of this software
 *    under different terms (including support and maintenance services).
 *
 *    Please contact a12-license@mgm-tp.com for more information.
 *
 * You must select and comply with exactly one of the above license options.
 *
 * Warranty Disclaimer (applies to either option)
 * ----------------------------------------------
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */

// Validates the dependency declarations of all workspace packages against pnpm-lock.yaml:
// 1. Packages holding module level state (singletons, React contexts, stores) must be resolved
//    to exactly one instance. A second instance splits that state (see A12E-3742).
// 2. Every workspace package declares the non-optional peer dependencies of its direct
//    dependencies itself. Otherwise pnpm resolves them from elsewhere in the graph, which can
//    produce the additional instances checked by 1.

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";

import { parse as parseYaml } from "yaml";

const SINGLETON_PACKAGES = [
	"@com.mgmtp.a12.client/client-core",
	"@com.mgmtp.a12.client/client-data",
	"@com.mgmtp.a12.widgets/widgets-core",
	"react",
	"react-dom",
	"react-redux",
	"styled-components"
];

const IGNORED_PEERS: Readonly<Record<string, string>> = {
	eslint: "the ESLint plugins are loaded by oxlint",
	webpack: "source-map-loader runs under rspack"
};

type DependencyMap = Readonly<Record<string, string>>;

interface ImporterDependency {
	readonly version: string;
}

interface Importer {
	readonly dependencies?: Readonly<Record<string, ImporterDependency>>;
	readonly devDependencies?: Readonly<Record<string, ImporterDependency>>;
	readonly optionalDependencies?: Readonly<Record<string, ImporterDependency>>;
}

interface PeerDeclaration {
	readonly peerDependencies?: DependencyMap;
	readonly peerDependenciesMeta?: Readonly<Record<string, { readonly optional?: boolean }>>;
}

interface Lockfile {
	readonly importers: Readonly<Record<string, Importer>>;
	readonly packages: Readonly<Record<string, PeerDeclaration>>;
	readonly snapshots: Readonly<Record<string, unknown>>;
}

interface PackageJson extends PeerDeclaration {
	readonly name: string;
	readonly dependencies?: DependencyMap;
	readonly devDependencies?: DependencyMap;
	readonly optionalDependencies?: DependencyMap;
}

interface MissingPeer {
	readonly peer: string;
	readonly requiredBy: string;
}

const REPO_ROOT = join(import.meta.dirname, "..");

const lockfile = parseYaml(
	await readFile(join(REPO_ROOT, "pnpm-lock.yaml"), { encoding: "utf-8" })
) as Lockfile;

const errors = [...findDuplicatedSingletons(lockfile), ...(await findUndeclaredPeers(lockfile))];

const REMEDIATION = `
How to fix:
* A package with several instances usually has consumers that resolve its peer dependencies to
  different versions. Make sure there is a single instance of it in pnpm-lock.yaml: add the
  missing peer dependencies reported above as devDependencies with the catalog version
  ("catalog:" or "catalog:a12") to the reported workspace packages, then run "pnpm install".
* If a peer dependency is really not needed (e.g. it is only required by a tool that runs
  differently here), add it to IGNORED_PEERS in scripts/validateDependencies.ts with the reason.`;

if (errors.length > 0) {
	// oxlint-disable-next-line no-console
	console.error([...errors, REMEDIATION].join("\n"));
	process.exitCode = 1;
}

/** Reports singleton packages that pnpm resolved to more than one instance. */
function findDuplicatedSingletons({ snapshots }: Lockfile): string[] {
	const instanceKeys = Object.keys(snapshots);

	return SINGLETON_PACKAGES.flatMap(function toDuplicationError(name) {
		const instances = instanceKeys.filter(function isInstanceOf(key) {
			return packageNameOf(key) === name;
		});

		return instances.length > 1
			? [`${name} is resolved to ${instances.length} instances:\n  ${instances.join("\n  ")}`]
			: [];
	});
}

/** Reports non-optional peer dependencies of direct dependencies that a workspace package does not declare. */
async function findUndeclaredPeers(lockfile: Lockfile): Promise<string[]> {
	const errorsPerImporter = await Promise.all(
		Object.entries(lockfile.importers).map(function checkImporter([importerPath, importer]) {
			return findUndeclaredPeersOfImporter(lockfile, importerPath, importer);
		})
	);

	return errorsPerImporter.flat();
}

async function findUndeclaredPeersOfImporter(
	lockfile: Lockfile,
	importerPath: string,
	importer: Importer
): Promise<string[]> {
	const packageJson = await readPackageJson(join(REPO_ROOT, importerPath));
	const declared = new Set(
		Object.keys({
			...packageJson.dependencies,
			...packageJson.devDependencies,
			...packageJson.optionalDependencies,
			...packageJson.peerDependencies
		})
	);
	const directDependencies = Object.entries({
		...importer.dependencies,
		...importer.devDependencies,
		...importer.optionalDependencies
	});

	const requiredPeers = await Promise.all(
		directDependencies.map(async function toRequiredPeers([name, { version }]) {
			const peers = await requiredPeersOf(lockfile, importerPath, name, version);
			return peers.map(function toMissingPeer(peer): MissingPeer {
				return { peer, requiredBy: name };
			});
		})
	);

	const missingPeers = requiredPeers.flat().filter(function isUndeclared({ peer }) {
		return !declared.has(peer) && !(peer in IGNORED_PEERS) && peer !== packageJson.name;
	});

	return Object.entries(Object.groupBy(missingPeers, missingPeer => missingPeer.peer)).map(
		function toUndeclaredPeerError([peer, requirements]) {
			const requiredBy = (requirements ?? []).map(requirement => requirement.requiredBy);
			return `${packageJson.name} does not declare "${peer}", a peer dependency of ${requiredBy.join(", ")}`;
		}
	);
}

/** Returns the non-optional peer dependencies of a resolved dependency. */
async function requiredPeersOf(
	lockfile: Lockfile,
	importerPath: string,
	name: string,
	version: string
): Promise<string[]> {
	const declaration: PeerDeclaration | undefined = version.startsWith("link:")
		? await readPackageJson(join(REPO_ROOT, importerPath, version.slice("link:".length)))
		: lockfile.packages[`${name}@${version.split("(")[0]}`];

	return Object.keys(declaration?.peerDependencies ?? {}).filter(function isRequired(peer) {
		return declaration?.peerDependenciesMeta?.[peer]?.optional !== true;
	});
}

async function readPackageJson(directory: string): Promise<PackageJson> {
	return JSON.parse(await readFile(join(directory, "package.json"), { encoding: "utf-8" }));
}

/** Extracts the package name from a lockfile key like "@scope/name@1.0.0(peer@2.0.0)". */
function packageNameOf(lockfileKey: string): string {
	return lockfileKey.slice(0, lockfileKey.indexOf("@", 1));
}
