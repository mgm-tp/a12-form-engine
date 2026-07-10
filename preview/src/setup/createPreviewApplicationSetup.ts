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

import type { Middleware } from "redux";

import type {
	ActivityReducers,
	ApplicationSetup,
	ModelLoader
} from "@com.mgmtp.a12.client/client-core";
import {
	ActivityActions,
	APPLICATION_MODEL_PLACEHOLDER,
	ApplicationFactories,
	NEW_INSTANCE_IDENTIFIER
} from "@com.mgmtp.a12.client/client-core";
import { DirtyHandlingFactories } from "@com.mgmtp.a12.client/client-core/dirtyHandling";
import type {
	AttachmentLoader,
	MiddlewareOptions
} from "@com.mgmtp.a12.formengine/formengine-core";
import { formEngineDataReducers, formEngineSagas } from "@com.mgmtp.a12.formengine/formengine-core";

import { createPreviewFormEngineMiddlewares } from "../middlewares/createPreviewFormEngineMiddlewares.js";
import { previewReducers } from "../store/previewSlice.js";

export interface PreviewApplicationSetupOptions {
	/** Required: drives formEngineSagas for attachment loading */
	readonly attachmentLoader: AttachmentLoader;

	/**
	 * Model loader for application models.
	 * Defaults to a stub loader — in standalone preview, model loading is driven by incoming
	 * messages rather than a real backend. Pass a real loader when the consumer manages its
	 * own model loading (e.g. the devapp loading from a backend or local file system).
	 */
	readonly modelLoader?: ModelLoader;

	/** Consumer-supplied data providers (completely consumer-specific — no preview default) */
	readonly dataHandlers?: ApplicationFactories.Config["dataHandlers"];

	/** Additional data reducers appended after [formEngineDataReducers, ...previewReducers] */
	readonly additionalDataReducers?: ActivityReducers.DataReducer[];

	/** Consumer-specific sagas appended after formEngineSagas */
	readonly additionalSagas?: NonNullable<ApplicationFactories.Config["customSagas"]>;

	/**
	 * Options passed to createPreviewFormEngineMiddlewares.
	 * Use to inject a custom kernelOptionsProvider, externalEnumerationProvider, etc.
	 */
	readonly middlewareOptions?: Partial<MiddlewareOptions>;

	/** Consumer-specific middlewares appended after createPreviewFormEngineMiddlewares */
	readonly additionalMiddlewares?: Middleware[];

	/** Consumer-specific root reducer */
	readonly rootReducer?: ApplicationFactories.Config["rootReducer"];

	/** Consumer-specific store enhancer composer (e.g. Redux DevTools) */
	readonly composeEnhancer?: ApplicationFactories.Config["composeEnhancer"];

	/**
	 * Actions dispatched once after the store is created.
	 * Defaults to a single {@link ActivityActions.create} that opens the initial preview activity.
	 * Pass an empty array to opt out — for example when activity lifecycle is managed externally
	 * via deep linking rather than a fixed startup action.
	 */
	readonly setupActions?: ApplicationFactories.Config["setupActions"];
}

/**
 * Creates an {@link ApplicationSetup} preconfigured for the Form-Engine preview.
 *
 * Bakes in the boilerplate shared by all preview consumers:
 * - stub model loader (model loading is driven by incoming preview messages, not a real loader)
 * - combined formEngineDataReducers + previewReducers
 * - initial activity setup action
 * - DirtyHandling platform sagas override
 * - formEngineSagas
 * - createPreviewFormEngineMiddlewares
 *
 * Consumers only provide what genuinely varies: their attachment loader, data handlers,
 * any additional sagas/middlewares, and optional store customizations.
 */
export function createPreviewApplicationSetup(
	options: PreviewApplicationSetupOptions
): ApplicationSetup {
	return ApplicationFactories.createApplicationSetup({
		model: APPLICATION_MODEL_PLACEHOLDER,
		modelLoader: options.modelLoader ?? PREVIEW_MODEL_LOADER,
		dataHandlers: options.dataHandlers,
		dataReducers: [
			...formEngineDataReducers,
			...previewReducers,
			...(options.additionalDataReducers ?? [])
		],
		setupActions: options.setupActions ?? [
			ActivityActions.create({
				activityDescriptor: { instance: NEW_INSTANCE_IDENTIFIER }
			})
		],
		overridePlatformSagas: DirtyHandlingFactories.createSagas(),
		customSagas: [
			...formEngineSagas({ attachmentLoader: options.attachmentLoader }),
			...(options.additionalSagas ?? [])
		],
		additionalMiddlewares: [
			...createPreviewFormEngineMiddlewares(options.middlewareOptions),
			...(options.additionalMiddlewares ?? [])
		],
		rootReducer: options.rootReducer,
		composeEnhancer: options.composeEnhancer
	});
}

const PREVIEW_MODEL_LOADER: ModelLoader = {
	name: "previewModelLoader",
	async load() {
		return {};
	}
};
