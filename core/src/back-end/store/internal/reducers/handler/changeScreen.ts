// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Action } from "typescript-fsa";

import type { Commands } from "../../actions.js";
import type { EngineStore } from "../../store.js";

/** @internal */
export function handleChangeScreen(
	state: EngineStore.UIState,
	action: Action<Commands.ChangeScreenPayload>
): EngineStore.UIState {
	return {
		...state,
		screenLocation: [
			{
				locationPath: [{ elementName: action.payload.screenName }],
				path: []
			}
		]
	};
}
