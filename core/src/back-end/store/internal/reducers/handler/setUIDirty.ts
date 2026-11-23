// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Action } from "typescript-fsa";

import type { EngineStore } from "../../store.js";

/** @internal */
export function handleSetUIDirty(
	state: EngineStore.UIState,
	action: Action<boolean>
): EngineStore.UIState {
	return {
		...state,
		dirty: action.payload
	};
}
