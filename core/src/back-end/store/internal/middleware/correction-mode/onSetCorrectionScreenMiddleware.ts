// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Middleware } from "redux";

import { isObjectEmpty } from "../../../../utils/internal/guards.js";
import { Commands, Events } from "../../actions.js";
import { UiStateSelectors } from "../../selectors/ui-state.js";
import type { EngineState } from "../../store.js";

/**
 * @internal
 *
 * Listens to Events.CorrectionMode.onSetCorrectionScreenStateTriggered
 *
 * Dispatches Commands.setCorrectionScreenState with the new state of the correction screen.
 */
export const onSetCorrectionScreenStateTriggeredMiddleware: Middleware<{}, EngineState> =
	api => next => action => {
		const result = next(action);
		if (Events.CorrectionMode.CorrectionView.show.match(action)) {
			const state = api.getState();
			const correctionScreenState = UiStateSelectors.correctionScreenState()(state);
			api.dispatch(
				Commands.CorrectionMode.setCorrectionScreenState({
					correctionScreen: {
						...correctionScreenState,
						visible: action.payload.show,
						showDetailsState:
							action.payload.show === false ? {} : correctionScreenState.showDetailsState
					}
				})
			);

			if (action.payload.show) {
				return result;
			}

			const { visible } = UiStateSelectors.validationBarState()(api.getState());
			if (!visible) {
				return result;
			}

			const messages = UiStateSelectors.messages()(api.getState());
			if (isObjectEmpty(messages)) {
				return result;
			}

			const screenLocationStack = UiStateSelectors.screenLocationStack()(api.getState());
			api.dispatch(
				Commands.changeScreenState({
					index: screenLocationStack.length - 1,
					focusedComponent: { formModelPath: [], subElement: "validation-bar" }
				})
			);
		}
		return result;
	};
