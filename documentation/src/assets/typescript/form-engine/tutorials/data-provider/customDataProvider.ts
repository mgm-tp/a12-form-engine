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

// tag::content[]
import { call, put, select, type SagaGenerator } from "typed-redux-saga";

import {
	Activity,
	ActivityActions,
	ActivitySagas,
	ActivitySelectors
} from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import { NEW_INSTANCE_IDENTIFIER } from "@com.mgmtp.a12.client/client-core/lib/core/application/index.js";
import type { DataProvider } from "@com.mgmtp.a12.client/client-core/lib/core/data/index.js";
import type { Model } from "@com.mgmtp.a12.client/client-core/lib/core/model/index.js";
import {
	extractModelsInScenePayload,
	ModelSagas,
	ReferencedModel
} from "@com.mgmtp.a12.client/client-core/lib/core/model/index.js";
import type { FormModel } from "@com.mgmtp.a12.formengine/formengine-core";
import {
	createEmptyDocument,
	FormActivity,
	isFormModel,
	preProcessDocument
} from "@com.mgmtp.a12.formengine/formengine-core";
import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { DocumentServiceFactory } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/facade.js";

// The kernel document service to be used for parsing and formatting of the dates in the document.
const documentService = new DocumentServiceFactory().getDocumentService();

export const mySingleDocumentDataProvider: DataProvider = {
	name: "MySingleDocumentDataProvider",

	/*
	 * This data provider should be considered during activity data loading, when
	 *
	 * - the activity descriptor has an instance defined (__NEW__ or concrete
	 * instance), which gives the hint that the activity manages a single
	 * document and not a list of documents
	 *
	 * - and in the application model or DynamicConfiguration there is a
	 * VIEW_ADD directive applying for the current activity, in which a form
	 * model is defined, which gives the hint that a Form Engine might be used
	 * as ViewComponent for the activity.
	 * NOTE: the form model should be defined "directly" in the scene, therefore we check the `direct` property as well
	 */
	canHandle({ activityId, activities, action }: DataProvider.CanHandleConfig): boolean {
		const instance = activities[activityId]?.descriptor.instance;
		const { modelsInScene } = extractModelsInScenePayload(action) ?? {};

		return (
			instance !== undefined &&
			(modelsInScene?.some(
				r =>
					r.direct &&
					(ReferencedModel.isLoaded(r)
						? r.model.header.modelType
						: ReferencedModel.isNotLoaded(r)
							? r.model.modelType
							: undefined) === "form"
			) ??
				false)
		);
	},

	*provideData(config: DataProvider.ProvideDataConfig): SagaGenerator<void> {
		const { activityId, dataHolders } = config;

		// prevent data handling, when the activity doesn't exist anymore.
		const activity = yield* select(ActivitySelectors.activityById(activityId));
		if (activity === undefined) {
			throw new Error(`No activity found for id ${activityId}.`);
		}

		// The instance we checked in canHandle shouldn't suddenly be missing.
		if (activity.descriptor.instance === undefined) {
			throw new Error(
				`Expected instance is missing in the descriptor of activity with id ${activityId}.`
			);
		}

		// The form engine expects the document in the activity's default data
		// holder. This data holder should be present.
		const defaultDataHolder = dataHolders.find(
			Activity.DataHolder.hasDescriptor(activity.descriptor)
		);
		if (defaultDataHolder === undefined) {
			throw new Error(`No default DataHolder found for activityId ${activityId}`);
		}

		switch (config.operation) {
			case "load":
				{
					// We wait for the models to be loaded, since we need the
					// document model to parse the dates in the document and the
					// form model for determining the preprocessing mode.
					// It is possible to achieve parallel loading of models and
					// data by moving this call after the document request.
					const [formModel, documentModelAndValidationCode] = yield* call(waitForModels, activity);

					// The validation code is extracted from the loaded document model
					const { generatedCodeAccessor: validatorProvider, ...documentModel } =
						documentModelAndValidationCode;

					let document: GroupInstance;

					if (activity.descriptor.instance === NEW_INSTANCE_IDENTIFIER) {
						// Creating a new document

						// The new document with initial values and rows as
						// defined in the form model.
						document = {
							id: NEW_INSTANCE_IDENTIFIER,
							modelId: documentModel.header.id,
							...createEmptyDocument(documentModel, formModel)
						};

						// Via this flag from the client application setup any
						// preprocessing of a new document can be skipped
						// regardless of the preprocessing mode defined in the
						// form model
						if (config.details.preComputeNewDocuments === false) {
							yield* put(ActivityActions.setData({ activityId, data: { document } }));
							return;
						}
					} else {
						// Loading an existing document

						// Here follows some dummy code for the example. Replace with real request code.
						type MyLoadDocumentResponse = {
							readonly docRef: string;
							readonly documentModelName: string;
							readonly document: object;
						};

						// replace with your document loading code
						const documentRequest: Promise<MyLoadDocumentResponse> = Promise.resolve(
							{} as unknown as MyLoadDocumentResponse
						);
						const documentResponse = yield* call(() => documentRequest);

						const { document: loadedDocument, docRef, documentModelName } = documentResponse;

						// The serialized date strings in the document are parsed to Date objects
						document = {
							...documentService.parseDates(loadedDocument, documentModelAndValidationCode),
							id: docRef,
							modelId: documentModelName
						};
					}

					// The preprocessing defined in the form model is executed
					// for the document. This can be computations only,
					// computations and dependency evaluation, or no
					// preprocessing. And it can differ for new or existing
					// documents.
					const preProcessingResult = preProcessDocument({
						document,
						isNewInstance: activity.descriptor.instance === NEW_INSTANCE_IDENTIFIER,
						models: {
							formModel,
							documentModel,
							validatorProvider
						}
					});

					// Handling of computation errors that might have occurred
					// during the preprocessing
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

					// The activity default data holder is updated with the
					// loaded data and the loading state set to loaded.
					yield* put(
						ActivityActions.setData({
							activityId,
							data: { document: preProcessingResult.document }
						})
					);
				}
				break;

			case "save":
				{
					const { updateActivityData, saving } = config.details;

					const { data: oldData, datasourceActivityId } = defaultDataHolder;
					if (oldData === undefined) {
						throw new Error("Cannot handle empty data");
					}

					if (!FormActivity.Data.SingleDocumentData.isInstance(oldData)) {
						throw new Error("Activity does not contain suitable data!");
					}

					const [formModel, documentModel] = yield* call(waitForModels, activity);

					// We remove all field and group instances from the document
					// which currently are "notRelevant" according to the form
					// model dependencies
					const relevantData = {
						...oldData,
						document: FormActivity.Data.filterDataByRelevance(oldData.document, {
							documentModel,
							formModel
						})
					};

					// We transform the date values in the document to the
					// kernel string representation. modelId and id are not part
					// of the document model and would lead to errors during the
					// formatting so they are removed before.
					const { modelId, id, ...documentWithoutModelAndDocumentId } = relevantData.document;
					const docForServer = documentService.formatDates(
						documentWithoutModelAndDocumentId,
						documentModel
					);

					type MyAddDocumentResponse = {
						readonly docRef: string;
					};

					let data: object | undefined;

					if (activity.descriptor.instance === NEW_INSTANCE_IDENTIFIER) {
						// replace with your document persistence code
						const addDocumentRequest: (
							docForServer: object
						) => Promise<MyAddDocumentResponse> = () =>
							Promise.resolve({} as unknown as MyAddDocumentResponse);

						const addDocumentResponse = yield* call(() => addDocumentRequest(docForServer));

						// The instance id returned from the persistence code is
						// set in the document
						data = { document: { ...relevantData.document, id: addDocumentResponse.docRef } };
					} else {
						// replace with your document modification code
						const modifyDocumentRequest: Promise<void> = Promise.resolve();

						yield* call(() => modifyDocumentRequest);

						data = relevantData;
					}

					if (data !== undefined) {
						// The data is updated in the data source activity
						if (datasourceActivityId !== undefined) {
							yield* put(
								ActivityActions.setData({
									activityId: datasourceActivityId,
									data
								})
							);
						}

						// The data is updated in the activity from the data provider configuration
						if (updateActivityData) {
							yield* put(ActivityActions.setData({ activityId, data }));
						}
					}

					// The activity data save operation is finalized by
					// dispatching a respective action from the data provider
					// configuration. This could be e.g. save.done or
					// commit.done from the ActivityActions.
					yield* put(
						saving.done({
							instance:
								"document" in data && Activity.Data.Document.isInstance(data.document)
									? data.document.id
									: undefined
						})
					);

					// In case there is some related activity, e.g. parent,
					// which shows the saved document among others, e.g. an
					// overview, this related activity can now be reloaded like
					// this.
					const relatedActivityId = datasourceActivityId ?? activity.initiatingActivityId;
					if (relatedActivityId) {
						yield* put(ActivityActions.reloadData({ activityId: relatedActivityId }));
					}
				}
				break;

			case "delete":
				{
					const { instanceId } = config.details;

					const childActivity = yield* select(
						ActivitySelectors.childActivityByInstanceId(activity, instanceId)
					);

					const activityInstance = childActivity ? childActivity.descriptor.instance : instanceId;

					// It might be necessary to cancel child activities before
					// the activity data is deleted.
					if (childActivity) {
						yield* put(
							ActivityActions.cancelRequested({
								activityIds: [childActivity.id]
							})
						);
						const cancelled = yield* call(ActivitySagas.waitForResponseCancelRequested);
						if (!cancelled) {
							return;
						}
					}

					if (defaultDataHolder.data === undefined) {
						throw new Error(`Cannot handle empty data"`);
					}

					if (activityInstance === undefined) {
						throw new Error("Instance must be set");
					}

					// replace with your document deletion code
					const deleteDocumentRequest: (docRef: string) => Promise<void> = () => Promise.resolve();
					yield* call(() => deleteDocumentRequest(activityInstance));

					// It might be necessary to trigger a reload of the activity
					// data to reflect the deleted data state in the ui.
					yield* put(ActivityActions.reloadData({ activityId: activity.id }));
				}
				break;

			default:
				throw new Error("Unknown operation");
		}
	}
};

/**
 * Saga to wait until the form model and its referenced document model for the
 * form engine activity are loaded by the client.
 */
function* waitForModels(
	activity: Activity
): SagaGenerator<[FormModel, Model.DocumentAndValidationModel]> {
	const models = yield* call(() => ModelSagas.waitForModelsLoaded(activity.id));

	const formModel = models.find(isFormModel);
	if (formModel === undefined) {
		throw new Error("Expected a form model to be present.");
	}

	const documentModelReference = formModel.header.modelReferences?.find(
		({ modelType }) => modelType === "document"
	);
	const documentModelAndValidationCode = models.find(
		(model): model is Model.DocumentAndValidationModel =>
			model.header.id === documentModelReference?.reference
	);
	if (documentModelAndValidationCode === undefined) {
		throw new Error("Expected to find the referenced document model");
	}

	return [formModel, documentModelAndValidationCode];
}
// end::content[]
