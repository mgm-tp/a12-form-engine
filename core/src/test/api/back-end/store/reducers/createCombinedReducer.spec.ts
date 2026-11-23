// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { notStrictEqual, strictEqual } from "node:assert/strict";

import {
	Commands,
	createCombinedReducer,
	createEngineStore,
	DataSelectors,
	UiStateSelectors
} from "../../../../../back-end/store/index.js";
import { US_LOCALE } from "../../../../utils/localization.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";

describe("api.back-end.store.reducers", () => {
	const models = setupModelsFixture("buttons");

	describe("createCombinedReducer", () => {
		it("always updates the data dirty state on Command setDataDirty", () => {
			const initialState = createEngineStore({
				models,
				locale: US_LOCALE,
				data: {}
			});
			const reducer = createCombinedReducer(initialState);

			const states = [initialState];

			for (const stateChange of [false, false, true, true]) {
				states.push(reducer(states[states.length - 1], Commands.setDataDirty(stateChange)));
				strictEqual(DataSelectors.dirty()(states[states.length - 1]), stateChange);
				notStrictEqual(states[states.length - 2], states[states.length - 1]);
			}
		});

		it("always updates the ui dirty state on Command setUIDirty", () => {
			const initialState = createEngineStore({
				models,
				locale: US_LOCALE,
				data: {}
			});
			const reducer = createCombinedReducer(initialState);

			const states = [initialState];

			for (const stateChange of [false, false, true, true]) {
				states.push(reducer(states[states.length - 1], Commands.setUIDirty(stateChange)));
				strictEqual(UiStateSelectors.dirty()(states[states.length - 1]), stateChange);
				notStrictEqual(states[states.length - 2], states[states.length - 1]);
			}
		});
	});
});
