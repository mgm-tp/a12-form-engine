// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
