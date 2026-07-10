/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * Dual License
 * ------------
 * This source file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License - EUPL v1.2
 *    You may redistribute and/or modify this file under the terms of the
 *    European Union Public License, version 1.2 - see https://eupl.eu/.
 *
 * 2. Commercial License
 *    Alternatively, you may obtain a commercial license from
 *    mgm technology partners GmbH, that permits use of this software
 *    under different terms (including support and maintenance services).
 *
 *    Please contact a12-license@mgm-tp.com for more information.
 *
 * You must select and comply with exactly one of the above license options.
 *
 * Warranty Disclaimer (applies to either option)
 * ----------------------------------------------
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */

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
