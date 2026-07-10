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

import type { Action, Dispatch, Middleware } from "redux";

import { Commands, Events } from "../../actions.js";
import { InternalUiStateSelectors, UiStateSelectors } from "../../selectors/ui-state.js";
import type { EngineState, EngineStore, FilterValue, RepeatFilter } from "../../store.js";
import { isDateRangeFilter, isRangeFilter } from "../../store.js";

/**
 * @internal
 *
 * Listens to Events.Repeat.filterValueChange
 *
 * Dispatches Commands.changeScreenRepeatState with the new state of the repeat.
 */
export function onFilterChangeMiddlewareFactory(): Middleware<{}, EngineState> {
	return api => next => action => {
		const result = next(action);

		if (Events.Repeat.filterValueChange.match(action)) {
			handle(action.payload, api.dispatch, api.getState(), action.payload.filter);
		} else if (Events.Repeat.filterParseError.match(action)) {
			const { columnId, repeatFormModelPath } = action.payload;

			const oldFilter = InternalUiStateSelectors.repeatFilterById(
				columnId,
				repeatFormModelPath
			)(api.getState());

			if (action.payload.errors.type === "RangeFilterParseError") {
				const fromParseError = action.payload.errors.fromError;
				const toParseError = action.payload.errors.toError;

				const toValue: FilterValue | null = toParseError
					? { message: toParseError }
					: oldFilter && isRangeFilter(oldFilter)
						? oldFilter.to
						: null;

				const fromValue: FilterValue | null = fromParseError
					? { message: fromParseError }
					: oldFilter && isRangeFilter(oldFilter)
						? oldFilter.from
						: null;

				handle(action.payload, api.dispatch, api.getState(), {
					to: toValue,
					from: fromValue
				});
			} else {
				const parseError = action.payload.errors;

				const value = parseError
					? { message: parseError }
					: oldFilter && isDateRangeFilter(oldFilter)
						? oldFilter.filterRange
						: null;

				handle(action.payload, api.dispatch, api.getState(), { filterRange: value });
			}
		}

		return result;
	};
}

function handle(
	params: Events.Repeat.FilterValueChangePayload | Events.Repeat.FilterParseErrorPayload,
	dispatch: Dispatch<Action>,
	state: EngineState,
	newFilter?: RepeatFilter
): void {
	const repeatStaticStateEntry = UiStateSelectors.repeatStaticStateEntry(
		params.repeatFormModelPath
	)(state);

	const filterState = repeatStaticStateEntry?.filters;

	const { [params.columnId]: _, ...filterStateWithoutCurrentColumn } = filterState ?? {};

	// A new filter should be added, if the filter is not null and if it is a range filter the values "from" and "to"
	// are not both null and "filterNull" is not falsy.
	// If neither is the case the filter is removed from the map.
	const filters: { [columnId: string]: EngineStore.Repeat.FilterEntry | undefined } | undefined =
		newFilter &&
		!(
			isRangeFilter(newFilter) &&
			newFilter.from === null &&
			newFilter.to === null &&
			!newFilter.filterNull
		) &&
		!(isDateRangeFilter(newFilter) && newFilter.filterRange === null && !newFilter.filterNull)
			? {
					...filterState,
					[params.columnId]: {
						columnPath: [...params.repeatFormModelPath, { elementName: params.columnId }],
						filter: newFilter
					}
				}
			: filterState
				? filterStateWithoutCurrentColumn
				: undefined;

	dispatch(
		Commands.changeRepeatStaticStateEntry({
			repeatFormModelPath: params.repeatFormModelPath,
			entry: {
				...repeatStaticStateEntry,
				filters: filters
			}
		})
	);
	const currentScreenLocation = UiStateSelectors.currentScreenLocation()(state);
	const repeatInstanceStateEntry = UiStateSelectors.repeatInstanceStateEntry(
		params.repeatFormModelPath
	)(state);
	dispatch(
		Commands.changeRepeatInstanceStateEntry({
			locationPath: currentScreenLocation.locationPath,
			repeatFormModelPath: params.repeatFormModelPath,
			entry: {
				...repeatInstanceStateEntry,
				page: 1,
				newRow: undefined,
				expandedRowPath: undefined
			}
		})
	);
}
