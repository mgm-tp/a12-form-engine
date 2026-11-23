// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Action } from "typescript-fsa";

import type { Commands } from "../../actions.js";
import type { EngineStore } from "../../store.js";

import { splitRepeatState } from "../splitRepeatState.js";

/** @internal */
export function handlePushScreen(
	state: EngineStore.UIState,
	action: Action<Commands.PushScreenPayload>
): EngineStore.UIState {
	const splittedRepeatState = action.payload.repeatState
		? splitRepeatState(action.payload.repeatState)
		: undefined;

	return {
		...state,
		screenLocation: [
			...state.screenLocation,
			{
				path: action.payload.path,
				locationPath: action.payload.locationPath,
				repeatInstanceState: splittedRepeatState?.repeatInstanceState
			}
		],
		repeatStaticState: splittedRepeatState?.repeatStaticState
			? {
					...state.repeatStaticState,
					...splittedRepeatState.repeatStaticState
				}
			: state.repeatStaticState
	};
}
