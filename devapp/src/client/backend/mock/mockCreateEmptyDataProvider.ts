// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { call, put, select } from "typed-redux-saga";

import type { ActivityActions } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import {
	Activity,
	ActivitySelectors
} from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import { NEW_INSTANCE_IDENTIFIER } from "@com.mgmtp.a12.client/client-core/lib/core/application/index.js";
import type { DataProvider } from "@com.mgmtp.a12.client/client-core/lib/core/data/index.js";
import {
	extractModelsInScenePayload,
	ModelSelectors,
	ReferencedModel
} from "@com.mgmtp.a12.client/client-core/lib/core/model/index.js";
import { StoreSagas } from "@com.mgmtp.a12.client/client-core/lib/core/store/index.js";

import { newDocumentRequested } from "../../reducer/actions.js";

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
export function mockCreateEmptyDocumentDataProvider(
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

			yield* call(() => StoreSagas.waitFor(ModelSelectors.allLoadedModelsInScene(activityId)));

			yield* put(
				newDocumentRequested({
					activityId,
					options,
					preComputeNewDocuments: config.details.preComputeNewDocuments
				})
			);
		}
	};
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
