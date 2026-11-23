// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { FormModel } from "../../../../models/internal/form-model.js";

/** @internal */
export function checkScope(
	readonlyState: boolean,
	type: FormModel.ButtonEnablementEnum,
	scope: FormModel.ScopeEnum = "ALWAYS"
): boolean {
	if (readonlyState && scope === `${type}_IN_READONLY_MODE`) {
		return true;
	}

	if (!readonlyState && scope === `${type}_IN_EDIT_MODE`) {
		return true;
	}

	return false;
}
