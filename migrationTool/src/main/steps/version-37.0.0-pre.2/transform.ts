// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { FormModel as OldFormModel } from "../version-37.0.0-pre.1/FormModel.js";

import type { FormModel } from "./FormModel.js";

export default function (model: OldFormModel): FormModel {
	const { amountSuffix, amountSuffixFieldRef, ...restContent } = model.content;

	const suffixValue = amountSuffix || amountSuffixFieldRef;

	return suffixValue
		? {
				...model,
				content: {
					amountSuffix: amountSuffix
						? { type: "static", value: suffixValue }
						: { type: "dynamic", fieldRef: suffixValue },
					...restContent
				}
			}
		: (model as unknown as FormModel);
}
