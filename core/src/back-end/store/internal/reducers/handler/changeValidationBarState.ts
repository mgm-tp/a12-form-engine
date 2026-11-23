// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Action } from "typescript-fsa";

import type { Commands } from "../../actions.js";
import type { EngineStore } from "../../store.js";

/** @internal */
export function handleSetValidationBarState(
	state: EngineStore.UIState,
	action: Action<Commands.CorrectionMode.SetValidationBarStatePayload>
): EngineStore.UIState {
	const validationBar = action.payload.validationBar;
	return {
		...state,
		validationBar: {
			...state.validationBar,
			...validationBar
		}
	};
}
