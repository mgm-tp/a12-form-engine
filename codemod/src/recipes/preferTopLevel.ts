// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { migrateImports } from "@com.mgmtp.a12.devtools/codemod";
import type { ImportMigrationConfiguration, Recipe } from "@com.mgmtp.a12.devtools/codemod";

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
