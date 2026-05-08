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
 * 1. Open-Source License – EUPL v1.2
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
