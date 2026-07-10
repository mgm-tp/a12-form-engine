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

// Middlewares

import type { Middleware } from "redux";

import { ActivityActions } from "@com.mgmtp.a12.client/client-core";
import {
	Commands,
	FormEngineActions,
	ModelSelectors,
	preProcessDocument
} from "@com.mgmtp.a12.formengine/formengine-core";
import type {
	EngineStore,
	MiddlewareOptions,
	ReadonlyObjectMap
} from "@com.mgmtp.a12.formengine/formengine-core";
import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { previewEngineStateSelector } from "../setup/kernelOptions.js";
import { triggerComputeAndValidate } from "../store/previewSlice.js";

export function createRecomputePreviewDataMiddleware(
	middlewareOptions: MiddlewareOptions
): Middleware {
	return api => next => action => {
		const result = next(action);

		if (triggerComputeAndValidate.match(action)) {
			const engineState = previewEngineStateSelector(action.payload.activityId)(api.getState());

			if (engineState) {
				const formModel = ModelSelectors.formModel()(engineState);
				const documentModel = ModelSelectors.documentModel()(engineState);
				const validatorProvider = ModelSelectors.validationCode()(engineState);
				const kernelOptions = middlewareOptions.kernelOptionsProvider?.(engineState);

				if (validatorProvider === undefined) {
					throw new Error("Expected validation code to be present");
				}

				const preProcessingResult = preProcessDocument({
					document: action.payload.document as GroupInstance,
					models: {
						formModel,
						documentModel,
						validatorProvider
					},
					isNewInstance: false,
					kernelOptions
				});

				api.dispatch(
					ActivityActions.setData({
						activityId: action.payload.activityId,
						data: { document: preProcessingResult.document }
					})
				);

				const messages: ReadonlyObjectMap<EngineStore.Validation.Entry> =
					preProcessingResult.messages ?? {};
				api.dispatch(
					FormEngineActions.command({
						activityId: action.payload.activityId,
						engineEvent: Commands.setMessageState({
							messages
						})
					})
				);
			}
		}

		return result;
	};
}
