// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Middleware } from "redux";

import { Commands, Events } from "../../actions.js";
import { UiStateSelectors } from "../../selectors/ui-state.js";
import type { EngineState } from "../../store.js";

/** @internal */
export const onShowDetailsTriggeredMiddleware: Middleware<{}, EngineState> =
	api => next => action => {
		const result = next(action);
		if (Events.CorrectionMode.CorrectionView.showDetails.match(action)) {
			const state = api.getState();
			const correctionScreenState = UiStateSelectors.correctionScreenState()(state);
			api.dispatch(
				Commands.CorrectionMode.setCorrectionScreenState({
					correctionScreen: {
						...correctionScreenState,
						showDetailsState: {
							...correctionScreenState.showDetailsState,
							[action.payload.element]: action.payload.showDetails
						}
					}
				})
			);
		}
		return result;
	};
