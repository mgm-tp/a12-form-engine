// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { Model } from "@com.mgmtp.a12.client/client-core/lib/core/model/index.js";
import type { Models } from "@com.mgmtp.a12.formengine/formengine-core";
import { isFormModel } from "@com.mgmtp.a12.formengine/formengine-core";

/** @internal */
export function toFormAndDocumentModel(models: unknown[]): Required<Models> {
	const formModel = models.find(isFormModel);
	const documentModelAndCode = models.find(Model.isDocumentAndValidationModel);
	if (!formModel || !documentModelAndCode) {
		throw new Error("Expected models to exist!");
	}
	const { generatedCodeAccessor: validatorProvider, ...documentModel } = documentModelAndCode;
	return {
		formModel,
		documentModel,
		validatorProvider
	};
}
