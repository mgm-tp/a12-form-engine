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

// Middlewares

import type { Middleware } from "redux";

import { ActivityActions } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { EngineStore, MiddlewareOptions } from "../../../back-end/store/index.js";
import { Commands, ModelSelectors } from "../../../back-end/store/index.js";
import { FormEngineActions } from "../../../client-extensions/index.js";
import { PreProcessor } from "../../../client-extensions/internal/extensions/form-engine/internal/preProcessDocument.js";
import type { ReadonlyObjectMap } from "../../../models/index.js";

import { previewEngineStateSelector } from "../nowValue.js";
import { triggerComputeAndValidate } from "../previewSlice.js";

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
				const now = middlewareOptions.nowProvider?.(engineState);

				if (validatorProvider === undefined) {
					throw new Error("Expected validation code to be present");
				}

				const preProcessingResult = PreProcessor.preProcessDocument({
					document: (action.payload.document ?? engineState.data.document) as GroupInstance,
					models: {
						formModel,
						documentModel,
						validatorProvider
					},
					isNewInstance: false,
					now
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
