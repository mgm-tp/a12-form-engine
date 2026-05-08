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

import { flow } from "fp-ts/lib/function.js";

import type {
	A12ApplicationConfig,
	ApplicationWithConfiguredFeature,
	RequireFeatures
} from "@com.mgmtp.a12.client/client-core/lib/core/application/index.js";
import {
	addAdditionalMiddlewares,
	addCustomSagas,
	addDataHandlers,
	addDataReducers,
	addView,
	combineFeatures,
	modifyView,
	setConfigured
} from "@com.mgmtp.a12.client/client-core/lib/core/application/index.js";
import {
	addModelProcessors,
	addSupportedModelVersion
} from "@com.mgmtp.a12.client/client-core/lib/extensions/modelLoader/index.js";

import type { MiddlewareOptions } from "../../../../back-end/store/index.js";
import type { Config } from "../../../../view/index.js";
import type { FormEngineSagaOptions } from "../../extensions/form-engine/index.js";
import {
	createFormEngineMiddlewares,
	formEngineDataReducers,
	formEngineSagas,
	FormEngineViews,
	platformAttachmentLoader
} from "../../extensions/form-engine/index.js";
import type { EmptyDocumentDataProviderOptions } from "../../extensions/form-engine/internal/createEmptyDocumentDataProvider.js";
import { createEmptyDocumentDataProvider } from "../../extensions/form-engine/internal/createEmptyDocumentDataProvider.js";
import { FormModelProcessor } from "../../extensions/http-connectors/internal/FormModelProcessor.js";
import type { PlatformSingleDocumentDataProviderOptions } from "../../extensions/platform-server-connectors/internal/providers/PlatformSingleDocumentDataProvider.js";
import { createPlatformSingleDocumentDataProvider } from "../../extensions/platform-server-connectors/internal/providers/PlatformSingleDocumentDataProvider.js";

const MODEL_TYPE = "form";
const SUPPORTED_MODEL_VERSIONS = ">=37.0.0 <=37.4.0";

// we use module augmentation to extend the A12ApplicationConfig type with more options
// for users, this is applied once they import anything from this file
// we must use the "internal" path as TS does not support module augmentation for re-exported types
// see https://github.com/microsoft/TypeScript/issues/12607
declare module "@com.mgmtp.a12.client/client-core/lib/core/application/internal/factories/applicationConfig.js" {
	interface A12ApplicationConfig {
		readonly formEngine?: {
			readonly viewConfig?: Partial<Config>;
			readonly emptyDocument?: EmptyDocumentDataProviderOptions;
			readonly singleDocument?: PlatformSingleDocumentDataProviderOptions;
			readonly sagas?: FormEngineSagaOptions;
			readonly middlewares?: Partial<MiddlewareOptions>;
		};
	}
}

/**
 * @experimental
 */
// this describe the features the FE depends on ("never" means must not exist yet, "true" means must exist)
// we should not allow multiple FE setups and must register FE model processors before the modelLoader is set
export type ApplicationWithFormEngineConfig = RequireFeatures<
	A12ApplicationConfig,
	{ formEngine?: never; modelLoader?: never }
>;

/**
 * @experimental
 */
export const withFormEngineDataHandlers = <T extends ApplicationWithFormEngineConfig>(cfg: T) =>
	addDataHandlers<T>(
		createEmptyDocumentDataProvider(cfg.formEngine?.emptyDocument),
		createPlatformSingleDocumentDataProvider(cfg.formEngine?.singleDocument)
	)(cfg);

/**
 * @experimental
 */
export const withFormEngineDataReducers = <T extends ApplicationWithFormEngineConfig>(cfg: T) =>
	addDataReducers<T>(...formEngineDataReducers)(cfg);

/**
 * @experimental
 */
export const withFormEngineSagas = <T extends ApplicationWithFormEngineConfig>(cfg: T) =>
	addCustomSagas<T>(
		...formEngineSagas({
			...cfg.formEngine?.sagas,
			attachmentLoader: cfg.formEngine?.sagas?.attachmentLoader ?? platformAttachmentLoader
		})
	)(cfg);

/**
 * @experimental
 */
export const withFormEngineMiddlewares = <T extends ApplicationWithFormEngineConfig>(cfg: T) =>
	addAdditionalMiddlewares<T>(...createFormEngineMiddlewares(cfg.formEngine?.middlewares))(cfg);

/**
 * @experimental
 */
export const withFormEngineView = <T extends ApplicationWithFormEngineConfig>(cfg: T) => {
	return addView<T>("FormEngine", FormEngineViews.FormEngine)(cfg);
};

/**
 * @experimental
 */
export const withConfiguredFormEngine = <T extends ApplicationWithFormEngineConfig>(cfg: T) => {
	if (!cfg.formEngine?.viewConfig) {
		return cfg;
	}
	return modifyView<T>("FormEngine", Component => {
		return props => <Component {...props} {...cfg.formEngine?.viewConfig} />;
	})(cfg);
};

/**
 * @experimental
 */
export const withFormModelSupport = <T extends ApplicationWithFormEngineConfig>(cfg: T) =>
	flow(
		addModelProcessors<T>(FormModelProcessor),
		addSupportedModelVersion(MODEL_TYPE, SUPPORTED_MODEL_VERSIONS)
	)(cfg);

/**
 * @experimental
 */
export const withFormEngine = <T extends ApplicationWithFormEngineConfig>(
	cfg: T
): ApplicationWithConfiguredFeature<T, "formEngine"> =>
	setConfigured<T, "formEngine">("formEngine")(
		combineFeatures(
			withFormEngineDataHandlers,
			withFormEngineDataReducers,
			withFormEngineMiddlewares,
			withFormEngineSagas,
			withFormEngineView,
			withConfiguredFormEngine,
			withFormModelSupport
		)(cfg)
	);
