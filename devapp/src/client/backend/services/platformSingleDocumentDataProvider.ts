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

import type { SagaGenerator } from "typed-redux-saga";
import { call, put, select } from "typed-redux-saga";

import { setThumbnails } from "@com.mgmtp.a12.client/client-core/lib/core/activity/a12-internal/thumbnails/action.js";
import { convertThumbnailResponse } from "@com.mgmtp.a12.client/client-core/lib/core/activity/a12-internal/thumbnails/slice.js";
import {
	Activity,
	ActivityActions,
	ActivitySagas,
	ActivitySelectors
} from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import { NEW_INSTANCE_IDENTIFIER } from "@com.mgmtp.a12.client/client-core/lib/core/application/index.js";
import type { DataProvider } from "@com.mgmtp.a12.client/client-core/lib/core/data/index.js";
import { LocaleSelectors } from "@com.mgmtp.a12.client/client-core/lib/core/locale/index.js";
import {
	extractModelsInScenePayload,
	ModelSagas,
	ReferencedModel
} from "@com.mgmtp.a12.client/client-core/lib/core/model/index.js";
import { Dispatcher } from "@com.mgmtp.a12.dataservices/dataservices-access/lib/dispatch/index.js";
import type { RequestSelectorMap } from "@com.mgmtp.a12.formengine/formengine-core";
import { DefaultRequestSelectorMap, FormActivity } from "@com.mgmtp.a12.formengine/formengine-core";

import { existingDocumentRequested } from "../../reducer/actions.js";

import { RequestBuilder } from "./RequestBuilder.js";

export interface PlatformSingleDocumentDataProviderOptions {
	/**
	 * Allows customization of the request made by the DataProvider per operation (load, save, delete)
	 */
	readonly requestSelectorMap?: RequestSelectorMap;
}

export function createPlatformSingleDocumentDataProvider(
	options?: PlatformSingleDocumentDataProviderOptions
): DataProvider {
	const name = "PlatformSingleDocumentDataProvider";

	const requestSelectorMap = options?.requestSelectorMap ?? DefaultRequestSelectorMap;

	return {
		name,
		canHandle({ activityId, activities, action }: DataProvider.CanHandleConfig): boolean {
			const instance = activities[activityId]?.descriptor.instance;

			return instance !== undefined && referencesDirectFormModelInScene(action);
		},
		*provideData(config: DataProvider.ProvideDataConfig): SagaGenerator<void> {
			const { language } = yield* select(LocaleSelectors.locale());

			const activity = yield* select(ActivitySelectors.activityById(config.activityId));

			if (activity === undefined) {
				throw new Error(`No activity found for id ${config.activityId}.`);
			}
			const instance = activity.descriptor.instance;
			if (instance === undefined) {
				throw new Error("Instance must be set");
			}

			const defaultDataHolder = config.dataHolders.find(
				Activity.DataHolder.hasDescriptor(activity.descriptor)
			);
			if (defaultDataHolder === undefined) {
				throw new Error(`No default DataHolder found for activityId ${config.activityId}`);
			}

			switch (config.operation) {
				case "load":
					{
						const loadRequest = yield* select(requestSelectorMap.load(config));

						const [
							{
								result: {
									entries: [entry]
								}
							},
							thumbnailResponse
						] = yield* call(() =>
							Dispatcher.rpc(language, [loadRequest, RequestBuilder.loadAllThumbnailURLs()])
						);

						if (entry === undefined) {
							throw new Error(`No document entry found for docRef ${instance}`);
						}

						const { document: loadedDocument } = entry;

						if (!isObjectEmpty(thumbnailResponse.result)) {
							yield* put(
								setThumbnails({
									activityId: config.activityId,
									thumbnails: convertThumbnailResponse(thumbnailResponse)
								})
							);
						}

						yield* call(() => ModelSagas.waitForModelsLoaded(activity.id));

						yield* put(
							existingDocumentRequested({
								activityId: activity.id,
								loadedDocument
							})
						);
					}
					break;
				case "save":
					{
						const { datasourceActivityId, data: oldData } = defaultDataHolder;
						const initiatingActivityId = activity.initiatingActivityId;

						const { updateActivityData, saving } = config.details;

						if (!FormActivity.Data.SingleDocumentData.isInstance(oldData)) {
							throw new Error("Activity does not contain suitable data!");
						}

						const saveRequest = yield* select(requestSelectorMap.save(config));
						const [{ result }] = yield* call(() => Dispatcher.rpc(language, [saveRequest]));

						const data =
							instance === NEW_INSTANCE_IDENTIFIER
								? { document: { ...oldData.document, id: result.docRef } }
								: oldData;

						if (datasourceActivityId !== undefined) {
							yield* put(
								ActivityActions.setData({
									activityId: datasourceActivityId,
									data
								})
							);
						}

						if (updateActivityData) {
							yield* put(ActivityActions.setData({ activityId: config.activityId, data }));
						}

						yield* put(
							saving.done({
								instance:
									"document" in data && Activity.Data.Document.isInstance(data.document)
										? data.document.id
										: undefined
							})
						);

						// we need to store the relatedActivityId before, we do the activity's commit
						const relatedActivityId = datasourceActivityId || initiatingActivityId;
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

						const deleteRequest = yield* select(requestSelectorMap.delete(config));

						yield* call(Dispatcher.rpc, language, [deleteRequest]);

						yield* put(ActivityActions.reloadData({ activityId: config.activityId }));
					}
					break;
			}
		}
	};
}

function isObjectEmpty(value: Record<string, unknown>): boolean {
	return Object.keys(value).length === 0;
}

function referencesDirectFormModelInScene(action?: ActivityActions.DataReducerAction): boolean {
	const { modelsInScene } = extractModelsInScenePayload(action) ?? {};

	return modelsInScene?.some(r => r.direct && getModelType(r) === "form") ?? false;
}

function getModelType(r: ReferencedModel.Instance): string | undefined {
	return ReferencedModel.isLoaded(r)
		? r.model.header.modelType
		: ReferencedModel.isNotLoaded(r)
			? r.model.modelType
			: undefined;
}
