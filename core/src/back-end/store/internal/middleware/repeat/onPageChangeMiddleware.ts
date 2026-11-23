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
 * Listens to Events.Repeat.changePage
 *
 * Dispatches Commands.changeRepeatInstanceStateEntry with the new page.
 */
export const onPageChangeMiddleware: Middleware<{}, EngineState> = api => next => action => {
	const result = next(action);
	if (Events.Repeat.changePage.match(action)) {
		const repeatFormModelPath = action.payload.repeatFormModelPath;
		const currentScreenLocation = UiStateSelectors.currentScreenLocation()(api.getState());
		const repeatStateEntry = UiStateSelectors.repeatInstanceStateEntry(repeatFormModelPath)(
			api.getState()
		);

		api.dispatch(
			Commands.changeRepeatInstanceStateEntry({
				locationPath: currentScreenLocation.locationPath,
				repeatFormModelPath,
				entry: {
					...repeatStateEntry,
					page: action.payload.page,
					newRow: undefined,
					expandedRowPath: undefined
				}
			})
		);

		const screenLocationStack = UiStateSelectors.screenLocationStack()(api.getState());
		api.dispatch(
			Commands.changeScreenState({
				index: screenLocationStack.length - 1,
				focusedComponent: {
					formModelPath: repeatFormModelPath
				}
			})
		);
	}
	return result;
};
