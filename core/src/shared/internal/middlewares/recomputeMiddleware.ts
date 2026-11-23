// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
