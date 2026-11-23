// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Dispatch } from "redux";

import { Commands } from "../actions.js";
import { DataSelectors } from "../selectors/data.js";
import { UiStateSelectors } from "../selectors/ui-state.js";
import type { EngineState } from "../store.js";

/** @internal */
export function updateDataDirtyState(dispatch: Dispatch, state: EngineState): void {
	const dirty = DataSelectors.dirty()(state);
	const currentScreenLocationStack = UiStateSelectors.screenLocationStack()(state);
	const screenDirty = UiStateSelectors.currentScreenLocation()(state).dirty;

	if (!dirty && currentScreenLocationStack.length === 1) {
		dispatch(Commands.setDataDirty(true));
	}

	if (!screenDirty && currentScreenLocationStack.length > 1) {
		dispatch(
			Commands.changeScreenState({
				index: currentScreenLocationStack.length - 1,
				dirty: true
			})
		);
	}
}

/** @internal */
export function updateUiDirtyState(dispatch: Dispatch, state: EngineState): void {
	const currentScreenLocationStack = UiStateSelectors.screenLocationStack()(state);
	const screenDirty = UiStateSelectors.currentScreenLocation()(state).dirty;
	const uiDirty = UiStateSelectors.dirty()(state);
	if (!uiDirty) {
		dispatch(Commands.setUIDirty(true));
	}

	if (!screenDirty && currentScreenLocationStack.length > 1) {
		dispatch(
			Commands.changeScreenState({
				index: currentScreenLocationStack.length - 1,
				dirty: true
			})
		);
	}
}
