// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { FormModel as OldFormModel } from "../version-37.1.0/FormModel.js";

import type { FormModel } from "./FormModel.js";

export default function removeValueAndFieldRefFromNonRelevantCases(
	oldModel: OldFormModel
): FormModel {
	oldModel.content.fieldConfiguration?.field
		?.flatMap(field => field.dependentField?.case ?? [])
		.filter(c => c.notRelevant === true && (c.fieldRef || c.value))
		.forEach(c => {
			delete (c as { value?: unknown }).value;
			delete (c as { fieldRef?: unknown }).fieldRef;
		});

	return oldModel as FormModel;
}
