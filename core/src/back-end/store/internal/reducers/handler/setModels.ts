// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Action } from "typescript-fsa";

import type { Models } from "../../store.js";

/** @internal */
export function handleSetModels(_state: Models, action: Action<Models>): Models {
	return action.payload;
}
