// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Middleware } from "redux";

import { Commands, Events } from "../../actions.js";
import { UiStateSelectors } from "../../selectors/ui-state.js";
import type { EngineState } from "../../store.js";

/**
 * @internal
 *
 * Events.CorrectionMode.ValidationBar.showMessage
 *
 * Dispatches Commands.CorrectionMode.setValidationBarState with the new state of the validation-bar.
 */
export const onMessageChangeTriggeredMiddleware: Middleware<{}, EngineState> =
	api => next => action => {
		const result = next(action);
		if (Events.CorrectionMode.ValidationBar.showMessage.match(action)) {
			const state = api.getState();
			const validationBarState = UiStateSelectors.validationBarState()(state);
			api.dispatch(
				Commands.CorrectionMode.setValidationBarState({
					validationBar: {
						...validationBarState,
						currentMessageKey: action.payload.messageKey
					}
				})
			);
		}
		return result;
	};
