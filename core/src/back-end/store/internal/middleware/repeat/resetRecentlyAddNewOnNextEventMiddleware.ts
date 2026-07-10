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

import type { ActionCreator } from "@com.mgmtp.a12.client/typescript-fsa-redux-5-compat";

import { ReadonlyObjectMap } from "../../../../../models/internal/utils/json.js";
import { Commands, Events } from "../../actions.js";
import { UiStateSelectors } from "../../selectors/ui-state.js";
import type { EngineState, EngineStore } from "../../store.js";

/**
 * @internal
 *
 * Listens to any event action.
 *
 * This middleware removes the newRow.rowState, when it is "recentlyAdded", from the repeat state
 * right at the beginning of handling any new Event action.
 *
 * This will e.g. prevent the message "New entry doesn't match with filter option(s)" after clearing the repeat
 * via dependent group clear.
 */
export const resetRecentlyAddNewOnNextEventMiddleware: Middleware<{}, EngineState> =
	api => next => action => {
		if (selectAllRelevantActions().some(x => x.match(action))) {
			const oldLocationStack = UiStateSelectors.screenLocationStack()(api.getState());
			const locationStack = oldLocationStack.map(removeRecentlyAddedRowEntry);

			if (!isArrayShallowEqual(locationStack, oldLocationStack)) {
				api.dispatch(Commands.setLocationStack({ locationStack }));
			}
		}

		// Execute the removal of the recently added state before any other action occurs.
		return next(action);
	};

function removeRecentlyAddedRowEntry(
	screenState: EngineStore.ScreenState
): EngineStore.ScreenState {
	if (
		screenState.repeatInstanceState === undefined ||
		!hasRecentlyAddedRow(screenState.repeatInstanceState)
	) {
		return screenState;
	}

	const repeatInstanceState = Array.from(
		ReadonlyObjectMap.entries(screenState.repeatInstanceState)
	).reduce<ReadonlyObjectMap<EngineStore.Repeat.InstanceState>>((result, [key, value]) => {
		if (value.newRow !== undefined && value.newRow.rowState !== "recentlyAdded") {
			return { ...result, [key]: value };
		} else {
			return { ...result, [key]: { ...value, newRow: undefined } };
		}
	}, {});

	return { ...screenState, repeatInstanceState };
}

function hasRecentlyAddedRow(
	repeatInstanceState: ReadonlyObjectMap<EngineStore.Repeat.InstanceState>
): boolean {
	return (
		repeatInstanceState !== undefined &&
		Array.from(ReadonlyObjectMap.values(repeatInstanceState)).some(
			x => x.newRow !== undefined && x.newRow.rowState === "recentlyAdded"
		)
	);
}

/**
 * Returns all typescript-fsa action creators found in the given object.
 */
function getAllActions(obj: {}): ReadonlyArray<ActionCreator<unknown>> {
	return Array.from(ReadonlyObjectMap.values(obj)).reduce<ReadonlyArray<ActionCreator<unknown>>>(
		(result, property) => {
			if (typeof property === "object" && property !== null) {
				return [...result, ...getAllActions(property)];
			} else if (isActionCreator(property)) {
				return [...result, property];
			} else {
				return result;
			}
		},
		[]
	);
}

function isActionCreator(obj: unknown): obj is ActionCreator<unknown> {
	return (
		typeof obj === "function" &&
		obj.length === 2 &&
		"type" in obj &&
		typeof obj.type === "string" &&
		"match" in obj &&
		typeof obj.match === "function" &&
		obj.match.length === 1
	);
}

// This is a lazy function! On the first call it will replace itself.
let selectAllRelevantActions: () => ReadonlyArray<ActionCreator<unknown>> = () => {
	const allRelevantActions = getAllActions(Events);
	selectAllRelevantActions = () => allRelevantActions;
	return allRelevantActions;
};

function isArrayShallowEqual(a1: ReadonlyArray<unknown>, a2: ReadonlyArray<unknown>): boolean {
	return a1.length === a2.length && a1.every((x, i) => x === a2[i]);
}
