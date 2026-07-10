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

import { call, put, select } from "typed-redux-saga";

import type { ActivityActions, DataProvider } from "@com.mgmtp.a12.client/client-core";
import {
	Activity,
	ActivitySelectors,
	extractModelsInScenePayload,
	ModelSelectors,
	NEW_INSTANCE_IDENTIFIER,
	ReferencedModel,
	StoreSagas
} from "@com.mgmtp.a12.client/client-core";
import { kernelOptionsProvider } from "@com.mgmtp.a12.formengine/formengine-a12internal-preview";

import { newDocumentRequested } from "../../reducer/actions.js";

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
export function mockCreateEmptyDocumentDataProvider(): DataProvider {
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

			const options = yield* select(kernelOptionsProvider);

			yield* put(
				newDocumentRequested({
					activityId,
					kernelOptions: options,
					preComputeNewDocuments: false === config.details.preComputeNewDocuments
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
