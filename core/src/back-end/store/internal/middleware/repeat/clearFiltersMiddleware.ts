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
 * Listens to Events.Repeat.clearFilters and clears the filters of the repeat by
 * dispatching the respective command action.
 */
export const clearFiltersMiddleware: Middleware<{}, EngineState> = api => next => action => {
	const result = next(action);
	if (Events.Repeat.clearFilters.match(action)) {
		const repeatFormModelPath = action.payload.repeatFormModelPath;
		const repeatStaticStateEntry = UiStateSelectors.repeatStaticStateEntry(repeatFormModelPath)(
			api.getState()
		);

		api.dispatch(
			Commands.changeRepeatStaticStateEntry({
				repeatFormModelPath: action.payload.repeatFormModelPath,
				entry: {
					...repeatStaticStateEntry,
					filters: undefined
				}
			})
		);
	}
	return result;
};
