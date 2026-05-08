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

import { call, put, select } from "typed-redux-saga";

import {
	Activity,
	ActivityActions,
	ActivitySelectors
} from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import { NEW_INSTANCE_IDENTIFIER } from "@com.mgmtp.a12.client/client-core/lib/core/application/index.js";
import type { DataProvider } from "@com.mgmtp.a12.client/client-core/lib/core/data/index.js";
import { Model } from "@com.mgmtp.a12.client/client-core/lib/core/model/index.js";
import { StoreSagas } from "@com.mgmtp.a12.client/client-core/lib/core/store/index.js";

import { isFormModel } from "../../../../../models/internal/is-form-model.js";
import { EmptyDocument } from "../../../../../models/internal/utils/document-utils.js";
import { InternalModelSelectors } from "../../../core/view/internal/components/selectors.js";

import { PreProcessor } from "./preProcessDocument.js";
import { referencesDirectFormModelInScene } from "./referencesDirectFormModelInScene.js";

/**
 * Configuration options for computing and validating
 * the new document.
 * Please refer to the form-engine documentation
 * for more information about these parameters.
 */
export interface EmptyDocumentDataProviderOptions {
	readonly now?: Date;
}
/**
 * This DataProvider creates new A12 Documents.
 *
 * The DataProvider handles "load" operations on all Activities which have the
 * `"instance"` key set to the constant `NEW_INSTANCE_IDENTIFIER` (`"__NEW__"`).
 *
 * The new Document is created based on a Form Model and its underlying
 * Document Model. This Form Model is selected from the models referenced in the
 * current scene's directives.
 *
 * For heterogeneity, for each concrete Document Model, a Form Model must be
 * referenced in the scene and it must have the documentModel property set to the
 * name of the respective Document Model.
 *
 * Furthermore, if Activity.Descriptor.model is set, it must contain the ID of
 * the Document Model for which the Document should be created.
 */
export function createEmptyDocumentDataProvider(
	options?: EmptyDocumentDataProviderOptions
): DataProvider {
	const name = "EmptyDocumentDataProvider";
	return {
		name,
		canHandle({ operation, dataHolder, action }) {
			return (
				operation === "load" &&
				dataHolder.descriptor.instance === NEW_INSTANCE_IDENTIFIER &&
				referencesDirectFormModelInScene(action)
			);
		},
		*provideData({ activityId, dataHolders, ...config }) {
			if (config.operation !== "load") {
				throw new Error(`${name} does not support ${config.operation}.`);
			}

			const activity = yield* select(ActivitySelectors.activityById(activityId));
			if (activity === undefined) {
				throw new Error(`No activity found for id ${activityId}.`);
			}

			const activityDataHolder = dataHolders.find(
				Activity.DataHolder.hasDescriptor(activity.descriptor)
			);
			if (activityDataHolder === undefined) {
				throw new Error(
					`No data holder found for activity's descriptor ${JSON.stringify(activity.descriptor)}`
				);
			}

			// We need to wait for the models matching the document type
			// The homogeneous case still works because of the fallback implemented in the selector!
			const modelsSelector = InternalModelSelectors.uiModelAndDocumentModelLoadedByActivityId(
				activityId,
				{ modelType: "form", documentModel: activity.descriptor.model },
				isFormModel
			);
			const models = yield* call(() => StoreSagas.waitForStateChange(modelsSelector));

			if (models === undefined || Model.Error.isInstance(models)) {
				const errMessage = models?.message ?? "Cannot load necessary models.";

				throw new Error(errMessage);
			}

			const uiModel = models.uiModel;
			if (!isFormModel(uiModel)) {
				throw new Error("Loaded ui model is not a form model.");
			}

			const document = {
				id: NEW_INSTANCE_IDENTIFIER,
				modelId: models.documentAndValidationModel.header.id,
				...EmptyDocument.createEmptyDocument(models.documentAndValidationModel, uiModel)
			};
			if (config.details.preComputeNewDocuments === false) {
				yield* put(ActivityActions.setData({ activityId, data: { document } }));
				return;
			}

			const { generatedCodeAccessor: validatorProvider, ...documentModel } =
				models.documentAndValidationModel;

			const preProcessingResult = PreProcessor.preProcessDocument({
				document,
				isNewInstance: true,
				models: {
					formModel: uiModel,
					documentModel,
					validatorProvider
				},
				now: options?.now
			});

			if (preProcessingResult.messages) {
				const error: ActivityActions.ErrorPayload = {
					activityId,
					operationType: "loading",
					error: {
						errorCode: "INTERNAL_CLIENT_ERROR",
						message:
							"At least one computation failed during the initial computation for the document.",
						computationErrorMessages: preProcessingResult.messages
					}
				};
				yield* put(ActivityActions.error(error));
			}

			yield* put(
				ActivityActions.setData({
					activityId,
					data: { document: preProcessingResult.document }
				})
			);
		}
	};
}
