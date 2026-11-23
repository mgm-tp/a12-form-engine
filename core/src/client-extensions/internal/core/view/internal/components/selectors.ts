// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Header } from "@com.mgmtp.a12.base/base-model-api/lib/main/header/index.js";
import type { Model as ModelAPI } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { Model, ModelSelectors } from "@com.mgmtp.a12.client/client-core/lib/core/model/index.js";
import type { Selector } from "@com.mgmtp.a12.client/client-core/lib/core/store/index.js";

import { assertExists } from "../../../../../../back-end/utils/internal/assertions.js";

type ModelTypeGuard<T extends ModelAPI> = (m: ModelAPI) => m is T;

function defaultModelTypeGuard<T extends ModelAPI>(_model: ModelAPI): _model is T {
	return true;
}

/**
 * @internal
 */
export const InternalModelSelectors = {
	/**
	 * Selects the ui model of the current scene
	 * and its document model from the state.
	 */
	uiModelAndDocumentModelLoadedByActivityId<T extends ModelAPI>(
		activityId: string,
		modelDescriptor: {
			readonly modelType: string;
			readonly documentModel?: string;
		},
		typeGuard: ModelTypeGuard<T> = defaultModelTypeGuard
	): Selector<ModelResult.ModelsLoaded<T>> {
		return state => {
			const criteria = { activityId, ...modelDescriptor };
			const uiModel = ModelSelectors.modelInScene(criteria, typeGuard)(state);
			if (uiModel === undefined) {
				const error = ModelSelectors.modelErrorInScene(criteria)(state);
				return { stateChanged: error !== undefined, returnValue: error };
			}

			const documentModelName = InternalModelSelectors.getDocumentModelReference(uiModel);

			const result = ModelSelectors.modelLoaded(
				documentModelName,
				Model.isDocumentAndValidationModel
			)(state);
			if (result.returnValue === undefined || Model.Error.isInstance(result.returnValue)) {
				return { stateChanged: result.stateChanged, returnValue: result.returnValue };
			}

			return {
				stateChanged: true,
				returnValue: { uiModel, documentAndValidationModel: result.returnValue.model }
			};
		};
	},
	getDocumentModelReference({ header }: { readonly header: Header }): string {
		const { reference } = header.modelReferences?.find(x => x.modelType === "document") || {};
		if (reference === undefined) {
			throw new Error(`Could not find any document model reference in ${header.id}.`);
		}
		return reference;
	},
	/**
	 * Selects the name of the referenced DM of the FM of an activity, if it exists
	 */
	referencedDocumentModelName(state: object, activityId: string): string {
		const modelDescriptors = ModelSelectors.modelDescriptorsByActivityId(activityId)(state);
		const { genericModels } = ModelSelectors.modelGraph()(state);

		const fmName = modelDescriptors.find(d => d.modelType === "form")?.name;
		const dmName = genericModels
			?.find(m => m.modelId === fmName)
			?.modelReferences?.find(({ modelType }) => modelType === "document")?.reference;

		assertExists(dmName, "Referenced document model must exist in the form of the current scene!");

		return dmName;
	}
};

export namespace ModelResult {
	/**
	 * @internal
	 */
	export interface LoadedEngineModels<T extends ModelAPI = ModelAPI> {
		readonly uiModel: T;
		readonly documentAndValidationModel: Model.DocumentAndValidationModel;
	}

	/**
	 * @internal
	 */
	export interface ModelsLoaded<T extends ModelAPI = ModelAPI> {
		readonly stateChanged: boolean;
		readonly returnValue: LoadedEngineModels<T> | Model.Error | undefined;
	}
}
