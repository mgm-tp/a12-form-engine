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

import type { ModelProcessor } from "@com.mgmtp.a12.client/client-core/lib/core/model/index.js";
import { Model } from "@com.mgmtp.a12.client/client-core/lib/core/model/index.js";

import {
	defaultValueParser,
	unmarshallFormModel
} from "../../../../../models/internal/utils/unmarshallFormModel.js";

/**
 * The default processor for form models
 */
export const FormModelProcessor: ModelProcessor = {
	modelType: "form",
	processModel(model, referencedModels) {
		const documentModelReferences = model.header.modelReferences?.filter(
			ref => ref.modelType === "document"
		);

		if (documentModelReferences?.length !== 1) {
			return createPostProcessingFailedError(
				{ name: model.header.id, modelType: "form" },
				`Expected to find one reference for a model of type document. Found: ${documentModelReferences?.length}`
			);
		}

		const dm = referencedModels[documentModelReferences[0].reference];

		if (!dm || Model.Error.isInstance(dm) || !Model.isDocumentAndValidationModel(dm)) {
			return createPostProcessingFailedError(
				{ name: model.header.id, modelType: "form" },
				`Referenced document model does not exist`
			);
		}

		try {
			return unmarshallFormModel(model, dm, defaultValueParser(dm));
		} catch (error) {
			return createPostProcessingFailedError({ name: model.header.id, modelType: "form" }, error);
		}
	}
};

function createPostProcessingFailedError({ name }: Model.Descriptor, error?: unknown): Model.Error {
	return {
		type: "POST_PROCESSING_FAILED",
		message: `Post processing for model "${name}" failed.`,
		source: error
	};
}
