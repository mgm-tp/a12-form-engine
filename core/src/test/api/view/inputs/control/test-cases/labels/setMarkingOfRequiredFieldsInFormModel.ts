// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Models } from "../../../../../../../back-end/store/index.js";
import type { FormModel } from "../../../../../../../models/index.js";

export function setMarkingOfRequiredFieldsInFormModel(
	m: Models,
	markingOfRequiredFields?: FormModel.MarkingOfRequiredFields
): Models {
	const formModelWithRequiredSet: FormModel = {
		header: m.formModel.header,
		content: {
			...m.formModel.content,
			markingOfRequiredFields: markingOfRequiredFields
		}
	};
	return {
		...m,
		formModel: formModelWithRequiredSet
	};
}
