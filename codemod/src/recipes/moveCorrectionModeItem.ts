// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Recipe } from "@com.mgmtp.a12.devtools/codemod";

const OLD_IMPORT_PATH =
	"@com.mgmtp.a12.formengine/formengine-core/lib/view/internal/components/form-engine/correction-mode/CorrectionModeItem";

const NEW_IMPORT_PATH = "@com.mgmtp.a12.formengine/formengine-core/lib/back-end/store";

export const moveCorrectionModeItemRecipe: Recipe = {
	metadata: {
		id: "moveCorrectionModeItem",
		description: "Rewrites an internal import path for CorrectionModeItem",
		supportedVersions: "^38.0.0"
	},

	execute(project) {
		for (const sourceFile of project.getSourceFiles()) {
			sourceFile.getImportDeclarations().forEach(id => {
				const specifier = id.getModuleSpecifierValue();

				if (specifier.startsWith(OLD_IMPORT_PATH)) {
					const isESMSyntax = specifier.endsWith(".js");

					id.setModuleSpecifier(`${NEW_IMPORT_PATH}${isESMSyntax ? "/index.js" : ""}`);
				}
			});
		}
	}
};
