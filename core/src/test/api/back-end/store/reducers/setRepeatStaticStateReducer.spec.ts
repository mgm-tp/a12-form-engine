// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { deepStrictEqual } from "node:assert/strict";

import { Commands, UiStateSelectors } from "../../../../../back-end/store/index.js";
import type { EngineStore } from "../../../../../back-end/store/internal/store.js";
import type { ReadonlyObjectMap } from "../../../../../models/index.js";
import { SetupHelpers } from "../../../../utils/setup.js";

const { createTestStore } = SetupHelpers;

describe("api.back-end.store.reducers", () => {
	const baseScreenState: EngineStore.ScreenState = {
		path: [],
		locationPath: [{ elementName: "NestedRepeat" }]
	};

	const repeatStaticState: ReadonlyObjectMap<EngineStore.Repeat.StaticState> = {
		"/modelPath/to/repeat": {
			filterRowOpen: true,
			filters: {
				["abc"]: {
					columnPath: [{ elementName: "abc" }],
					filter: { filterValue: "abc" }
				}
			},
			sortingState: {
				orderPath: [{ elementName: "xyz" }],
				sorting: "desc"
			}
		}
	};

	const newRepeatStaticState: ReadonlyObjectMap<EngineStore.Repeat.StaticState> = {
		"path/to/other/repeat": {
			filterRowOpen: false
		}
	};

	describe("setRepeatStaticStateReducer", () => {
		it("sets the repeatStaticState to the one described in the payload", () => {
			const storeConfig = {
				data: { dirty: false, document: {} },
				ui: {
					screenLocation: [baseScreenState],
					repeatStaticState
				}
			};

			const store = createTestStore({ storeConfig });
			store.dispatch(Commands.setRepeatStaticState({ repeatStaticState: newRepeatStaticState }));

			const actualRepeatStaticState = UiStateSelectors.repeatStaticState()(store.getState());
			deepStrictEqual(actualRepeatStaticState, newRepeatStaticState);
		});

		it("un-sets the repeatStaticState, when the payload has an undefined repeatStaticState", () => {
			const storeConfig = {
				data: { dirty: false, document: {} },
				ui: {
					screenLocation: [baseScreenState],
					repeatStaticState
				}
			};

			const store = createTestStore({ storeConfig });
			store.dispatch(Commands.setRepeatStaticState({}));

			const actualRepeatStaticState = UiStateSelectors.repeatStaticState()(store.getState());
			deepStrictEqual(actualRepeatStaticState, undefined);
		});
	});
});
