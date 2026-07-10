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

import { removePropsFromComponent } from "@com.mgmtp.a12.devtools/codemod";
import type { Recipe } from "@com.mgmtp.a12.devtools/codemod";

import { CORE_PACKAGE_NAME } from "../utils/packageNames.js";

const REMOVED_PROPS = {
	FormEngine: new Set([
		"name",
		"modelDescriptors",
		"configuration",
		"constraints",
		"ProgressComponent",
		"models",
		"uiState",
		"children"
	]),
	ScrollHandler: new Set([
		"name",
		"modelDescriptors",
		"configuration",
		"constraints",
		"ariaLevel",
		"ProgressComponent",
		"cardView"
	])
} as const;

const commonRemovalConfig = {
	namespaceName: "FormEngineViews",
	packageName: CORE_PACKAGE_NAME
};

export const removeFormEngineViewPropsRecipe: Recipe = {
	metadata: {
		id: "removeFormEngineViewProps",
		description:
			"Removes props that are no longer part of FormEngineViews.FormEngine/FormEngineTpl/ScrollHandler",
		supportedVersions: "^39.0.0"
	},

	execute(project): void {
		for (const sourceFile of project.getSourceFiles()) {
			removePropsFromComponent(sourceFile, {
				...commonRemovalConfig,
				componentName: "FormEngine",
				removedProps: REMOVED_PROPS.FormEngine
			});
			removePropsFromComponent(sourceFile, {
				...commonRemovalConfig,
				componentName: "FormEngineTpl",
				removedProps: REMOVED_PROPS.FormEngine
			});
			removePropsFromComponent(sourceFile, {
				...commonRemovalConfig,
				componentName: "ScrollHandler",
				removedProps: REMOVED_PROPS.ScrollHandler
			});
		}
	}
};
