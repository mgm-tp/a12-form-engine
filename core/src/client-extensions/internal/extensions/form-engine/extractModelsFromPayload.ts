// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ActivityActions } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import type { ReferencedModel } from "@com.mgmtp.a12.client/client-core/lib/core/model/index.js";
import {
	isActivityActionWithModelsInScenePayload,
	Model
} from "@com.mgmtp.a12.client/client-core/lib/core/model/index.js";

import type { Models } from "../../../../back-end/store/internal/store.js";
import type { FormModel } from "../../../../models/internal/form-model.js";
import { isFormModel } from "../../../../models/internal/is-form-model.js";
import { assertCondition, assertNotNullish } from "../../core/assertion.js";

/** @internal */
export function extractModelsFromPayload(payload: ActivityActions.ActivityActionPayload): Models {
	assertCondition(isActivityActionWithModelsInScenePayload(payload));

	const { model: formModel } = assertNotNullish(payload.modelsInScene.find(isDirectFormModel));

	const modelReference = formModel.header.modelReferences?.find(
		({ modelType }) => modelType === "document"
	);

	const dm = payload.modelsInScene.find(isReferencedDM(modelReference?.reference));

	const { generatedCodeAccessor, ...documentModel } = assertNotNullish(dm?.model);

	return {
		formModel,
		documentModel,
		validatorProvider: generatedCodeAccessor
	};
}

function isDirectFormModel(
	value: ReferencedModel.Instance
): value is ReferencedModel.Loaded<FormModel> {
	return value.direct === true && isFormModel(value.model);
}

function isReferencedDM(
	reference?: string
): (
	value: ReferencedModel.Instance
) => value is ReferencedModel.Loaded<Model.DocumentAndValidationModel> {
	return (value): value is ReferencedModel.Loaded<Model.DocumentAndValidationModel> =>
		Model.isDocumentAndValidationModel(value.model) && value.model.header.id === reference;
}
