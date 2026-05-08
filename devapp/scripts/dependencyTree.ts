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
 * 1. Open-Source License – EUPL v1.2
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

import { constants } from "node:buffer";
import { execSync } from "node:child_process";

import pkg from "../package.json" with { type: "json" };
import type { DependencyTreeTableNode } from "../src/client/components/DependencyTreeTable.ts";

interface DependencyTree {
	readonly name: string;
	readonly version: string;
	readonly dependencies?: Record<string, Omit<DependencyTree, "name">>;
}

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
		data: [dependencyTree.name, dependencyTree.version]
	};
}

function createNodes(
	parent: string,
	deps?: DependencyTree["dependencies"]
): DependencyTreeTableNode[] | undefined {
	return deps
		? Object.entries(deps).map(([name, { version, dependencies }]) => {
				// because of workspaces, the version of formengine/core is just a link
				const actualVersion = version.startsWith("link:") ? pkg.version : version;

				const id = `${parent}-${name}-${actualVersion}`;
				return {
					id,
					children: createNodes(id, dependencies),
					data: [name, actualVersion]
				};
			})
		: undefined;
}
