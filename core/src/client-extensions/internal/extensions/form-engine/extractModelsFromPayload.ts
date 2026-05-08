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
