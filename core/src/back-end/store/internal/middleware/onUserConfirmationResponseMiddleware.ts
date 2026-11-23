// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Middleware } from "redux";

import { Commands, Events } from "../actions.js";
import { UiStateSelectors } from "../selectors/ui-state.js";

/** @internal */
export const onUserConfirmationResponseMiddleware: Middleware = api => next => action => {
	if (Events.userConfirmationResponse.match(action)) {
		if (action.payload) {
			const actionConfirmationRequest = UiStateSelectors.actionConfirmationRequested()(
				api.getState()
			);
			actionConfirmationRequest?.actionsToDispatch.forEach(api.dispatch);
		}
		api.dispatch(Commands.clearUserConfirmation());
	}
	return next(action);
};
