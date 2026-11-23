// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Action } from "typescript-fsa";

import type { Commands } from "../../actions.js";
import type { EngineStore } from "../../store.js";

import { splitRepeatState } from "../splitRepeatState.js";

/** @internal */
export function handleChangeScreenState(
	state: EngineStore.UIState,
	action: Action<Commands.ChangeScreenStatePayload>
): EngineStore.UIState {
	const { focusedComponent, locationPath, path, repeatState, index, dirty } = action.payload;
	const screenToChange = state.screenLocation[index];

	const splittedRepeatState = repeatState ? splitRepeatState(repeatState) : undefined;

	return {
		...state,
		screenLocation: [
			...state.screenLocation.slice(0, index),
			{
				focusedComponent: focusedComponent ? focusedComponent : screenToChange.focusedComponent,
				focusedComponentRequestCount: focusedComponent
					? (screenToChange.focusedComponentRequestCount || 0) + 1
					: screenToChange.focusedComponentRequestCount,
				locationPath: locationPath ? locationPath : screenToChange.locationPath,
				path: path ? path : screenToChange.path,
				repeatInstanceState: splittedRepeatState?.repeatInstanceState
					? splittedRepeatState.repeatInstanceState
					: screenToChange.repeatInstanceState,
				dirty: dirty !== undefined ? dirty : screenToChange.dirty
			},
			...state.screenLocation.slice(index + 1)
		],
		repeatStaticState: splittedRepeatState?.repeatStaticState
			? {
					...state.repeatStaticState,
					...splittedRepeatState.repeatStaticState
				}
			: state.repeatStaticState
	};
}
