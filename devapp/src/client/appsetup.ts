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

import type { ApplicationSetup } from "@com.mgmtp.a12.client/client-core/lib/core/application/index.js";
import {
	ApplicationFactories,
	ModuleRegistryProvider
} from "@com.mgmtp.a12.client/client-core/lib/core/application/index.js";
import {
	APPLICATION_MODEL_PLACEHOLDER,
	ModelActions
} from "@com.mgmtp.a12.client/client-core/lib/core/model/index.js";
import { DeepLinkingFactories } from "@com.mgmtp.a12.client/client-core/lib/extensions/deep-linking/index.js";
import { DirtyHandlingFactories } from "@com.mgmtp.a12.client/client-core/lib/extensions/dirtyHandling/index.js";

import {
	manipulatePushActionsForDeepLinkingMiddleware,
	setIndexPageIfEmpty
} from "./config/deepLink.js";
import { enableReduxDevTools } from "./config/enableReduxDevTools.js";
import { registerDevappCustomizations } from "./customizations/index.js";
import { devappModule, ModelIndexDataLoader } from "./modules/devappModule.js";
import { formEngineModule } from "./modules/formEngineModule.js";
import { existingDocumentRequestedReducer } from "./reducer/existingDocumentReducer.js";
import { newDocumentRequestedReducer } from "./reducer/newDocumentReducer.js";

export type CustomConfig = Required<
	Pick<ApplicationFactories.Config, "modelLoader" | "dataHandlers">
>;

export function createAppSetup({ modelLoader, dataHandlers }: CustomConfig): ApplicationSetup {
	ModuleRegistryProvider.getInstance().addModule(devappModule);
	ModuleRegistryProvider.getInstance().addModule(formEngineModule);

	registerDevappCustomizations();
	setIndexPageIfEmpty();

	return ApplicationFactories.createApplicationSetup({
		model: APPLICATION_MODEL_PLACEHOLDER,
		modelLoader,
		dataHandlers: [ModelIndexDataLoader, ...dataHandlers],
		additionalMiddlewares: [manipulatePushActionsForDeepLinkingMiddleware],
		overridePlatformSagas: DirtyHandlingFactories.createSagas(),
		customSagas: DeepLinkingFactories.createSagas({ applyTriggers: [ModelActions.setModelGraph] }),
		composeEnhancer: enableReduxDevTools(),
		dataReducers: [newDocumentRequestedReducer, existingDocumentRequestedReducer]
	});
}
