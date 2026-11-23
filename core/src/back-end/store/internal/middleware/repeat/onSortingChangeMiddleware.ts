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
 * Listens to Events.Repeat.sortingChange
 */
export const onSortingChangeMiddleware: Middleware<{}, EngineState> = api => next => action => {
	const result = next(action);
	if (Events.Repeat.sortingChange.match(action)) {
		const state = api.getState();
		const repeatFormModelPath = action.payload.repeatFormModelPath;
		const currentScreenLocation = UiStateSelectors.currentScreenLocation()(state);
		const repeatStaticStateEntry =
			UiStateSelectors.repeatStaticStateEntry(repeatFormModelPath)(state);
		const repeatInstanceStateEntry =
			UiStateSelectors.repeatInstanceStateEntry(repeatFormModelPath)(state);

		if (action.payload.sorting) {
			api.dispatch(
				Commands.changeRepeatStaticStateEntry({
					repeatFormModelPath,
					entry: {
						...repeatStaticStateEntry,
						sortingState: {
							orderPath: action.payload.orderPath,
							sorting: action.payload.sorting
						}
					}
				})
			);
			api.dispatch(
				Commands.changeRepeatInstanceStateEntry({
					locationPath: currentScreenLocation.locationPath,
					repeatFormModelPath,
					entry: {
						...repeatInstanceStateEntry,
						newRow: undefined,
						page: 1,
						expandedRowPath: undefined
					}
				})
			);
		} else {
			api.dispatch(
				Commands.changeRepeatStaticStateEntry({
					repeatFormModelPath: repeatFormModelPath,
					entry: {
						...repeatStaticStateEntry,
						sortingState: undefined
					}
				})
			);
			api.dispatch(
				Commands.changeRepeatInstanceStateEntry({
					locationPath: currentScreenLocation.locationPath,
					repeatFormModelPath,
					entry: {
						...repeatInstanceStateEntry,
						newRow: undefined,
						page: 1
					}
				})
			);
		}
	}
	return result;
};
