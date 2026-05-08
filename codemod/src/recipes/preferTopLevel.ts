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

import {
	migrateImports,
	type ImportMigrationConfiguration,
	type Recipe
} from "@com.mgmtp.a12.devtools/codemod";

const packageName = "@com.mgmtp.a12.formengine/formengine-core";
const cePackageName = "@com.mgmtp.a12.formengine/formengine-content-elements";
const editorPackageName = "@com.mgmtp.a12.formengine/formengine-content-elements-editor";

const migrationConfig: ImportMigrationConfiguration = {
	pathMigrations: [
		{ from: `${packageName}/lib/**`, to: packageName },
		{ from: `${cePackageName}/lib/**`, to: cePackageName },
		{ from: `${editorPackageName}/lib/**`, to: editorPackageName }
	],

	// this type is exported twice (named and default), which needs special handling (see A12-17671)
	entityMigrations: [
		{
			from: {
				packageName,
				subPath: "lib/back-end/services/external-enumeration-provider", // cjs
				defaultImport: true
			},
			to: {
				packageName,
				subPath: "",
				entity: "IExternalEnumerationProvider"
			}
		},
		{
			from: {
				packageName,
				subPath: "lib/back-end/services/external-enumeration-provider.js", // esm
				defaultImport: true
			},
			to: {
				packageName,
				subPath: "",
				entity: "IExternalEnumerationProvider"
			}
		}
	]
};

export const preferTopLevelImportsRecipe: Recipe = {
	metadata: {
		id: "preferTopLevel",
		description: "Migrates imports from deep paths to top-level imports",
		supportedVersions: "^38.4.0"
	},

	execute(project): void {
		project.getSourceFiles().forEach(file => migrateImports(file, migrationConfig));
	}
};
