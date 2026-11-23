// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";

import semver from "semver";
import type { TomlTable } from "smol-toml";
import { parse as parseToml } from "smol-toml";
import { parse as parseYaml } from "yaml";

const errors: string[] = [];

const REPO_ROOT = join(import.meta.dirname, "..");

// Validate dependencies from pnpm workspace

const yaml = await readFile(join(REPO_ROOT, "pnpm-workspace.yaml"), {
	encoding: "utf-8"
});

const { a12 } = parseYaml(yaml).catalogs;
const a12Keys = Object.keys(a12);

// Validate dependencies from libs.versions.toml

const libsToml = await readFile(join(REPO_ROOT, "gradle/libs.versions.toml"), {
	encoding: "utf-8"
});
const tomlVersions = parseToml(libsToml).versions as TomlTable;

// Match toml version keys to pnpm catalog entries by substring inclusion,
// e.g. toml key "dataservices" matches catalog entry "@com.mgmtp.a12.dataservices/dataservices-access".
// We cannot use the same name as toml forbids certain special characters.
Object.entries(tomlVersions).forEach(([tomlDep, tomlVersion]) => {
	const a12dep = a12Keys.find(key => key.includes(tomlDep));
	const range = a12dep && a12[a12dep];

	if (!a12dep || typeof range !== "string" || typeof tomlVersion !== "string") {
		return;
	}

	if (semver.prerelease(tomlVersion)) {
		if (tomlVersion !== range) {
			errors.push(`${tomlDep}@${tomlVersion} is a pre-release, the range should exactly match it.`);
		}
	} else if (semver.prerelease(range)) {
		errors.push(
			`${tomlDep}@${tomlVersion} is not a pre-release, the range must not be one as well`
		);
	} else if (!semver.satisfies(tomlVersion, range)) {
		errors.push(
			`Gradle libs dependency ${tomlDep}@${tomlVersion} does not satisfy its workspace range ${a12dep}@${range}`
		);
	}
});

if (errors.length > 0) {
	// oxlint-disable-next-line no-console
	console.error(errors.join("\n"));
	process.exitCode = errors.length;
}
