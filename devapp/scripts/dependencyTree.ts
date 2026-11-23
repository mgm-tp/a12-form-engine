// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { constants } from "node:buffer";
import { execSync } from "node:child_process";
import { env as processEnv } from "node:process";

import pkg from "../package.json" with { type: "json" };
import type { DependencyTreeTableNode } from "../src/client/components/DependencyTreeTable.ts";

interface DependencyTree {
	readonly name: string;
	readonly version: string;
	readonly dependencies?: Record<string, Omit<DependencyTree, "name">>;
}

// package.json is not stamped until publish, so the build version has to come from gradle
const rootVersion = processEnv.RELEASE_VERSION ?? pkg.version;

export function createDependencyTreeRoot(): DependencyTreeTableNode {
	const dependencyTree = JSON.parse(
		execSync("pnpm list --prod --json", {
			maxBuffer: constants.MAX_LENGTH,
			encoding: "utf8"
		})
	)[0] as DependencyTree;

	const rootId = "root";

	return {
		id: rootId,
		children: createNodes(rootId, dependencyTree.dependencies),
		data: [dependencyTree.name, rootVersion]
	};
}

function createNodes(
	parent: string,
	deps?: DependencyTree["dependencies"]
): DependencyTreeTableNode[] | undefined {
	return deps
		? Object.entries(deps).map(([name, { version, dependencies }]) => {
				// because of workspaces, the version of formengine/core is just a link
				const actualVersion = version.startsWith("link:") ? rootVersion : version;

				const id = `${parent}-${name}-${actualVersion}`;
				return {
					id,
					children: createNodes(id, dependencies),
					data: [name, actualVersion]
				};
			})
		: undefined;
}
