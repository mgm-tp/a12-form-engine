// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Middleware } from "redux";

import { Events } from "../actions.js";
import type { EngineState } from "../store.js";

import { updateUiDirtyState } from "./updateDirtyState.js";

/**
 * @internal
 *
 * Listens to Events.inputTouched.
 *
 * Dispatches always setUIDirty Command.
 */
export const onInputTouchedMiddleware: Middleware<{}, EngineState> = api => next => action => {
	const result = next(action);
	if (Events.inputTouched.match(action)) {
		updateUiDirtyState(api.dispatch, api.getState());
	}
	return result;
};
