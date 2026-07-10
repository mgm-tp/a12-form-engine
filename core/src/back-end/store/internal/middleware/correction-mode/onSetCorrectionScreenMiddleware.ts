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
