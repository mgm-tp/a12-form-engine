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

import { deepStrictEqual } from "node:assert/strict";

import { Commands, UiStateSelectors } from "../../../../../back-end/store/index.js";
import type { EngineStore } from "../../../../../back-end/store/internal/store.js";
import type { ReadonlyObjectMap } from "../../../../../models/index.js";
import { createDocumentPath } from "../../../../utils/createDocumentPath.js";
import { createModelPath } from "../../../../utils/createModelPath.js";
import { createTestStore } from "../../../../utils/setup.js";

describe("api.back-end.store.reducers", () => {
	const baseScreenState: EngineStore.ScreenState = {
		path: [],
		locationPath: [{ elementName: "NestedRepeat" }],
		repeatInstanceState: {
			"/NestedRepeat/sec2/inline-repeat-Nested_L1": {
				page: 1
			}
		}
	};

	const path = createDocumentPath(["Root"], ["Nested_L1"]);
	const locationPath = createModelPath(
		"NestedRepeat",
		"sec1",
		"inline-repeat-Nested_L1",
		"inline-repeat-Nested_L1-detail-screen"
	);

	const repeatState: ReadonlyObjectMap<EngineStore.Repeat.Entry> = {
		"/NestedRepeat/sec1/inline-repeat-Nested_L1/inline-repeat-Nested_L1-detail-screen/inline-repeat-Nested_L2":
			{
				page: 1,
				newRow: {
					rowPath: createDocumentPath(["Root"], ["Nested_L1"], ["Nested_L2"]),
					rowState: "recentlyAdded"
				}
			}
	};

	const screenLocationWithNewScreen: EngineStore.ScreenState[] = [
		baseScreenState,
		{
			locationPath,
			path,
			repeatInstanceState: repeatState
		}
	];

	describe("pushScreenReducer", () => {
		it("will add the screen described in the payload to the location stack", () => {
			const storeConfig = {
				data: { dirty: false, document: {} },
				ui: {
					screenLocation: [baseScreenState]
				}
			};

			const store = createTestStore({ storeConfig });
			store.dispatch(Commands.pushScreen({ path, locationPath, repeatState }));

			const actualScreenLocation = UiStateSelectors.screenLocationStack()(store.getState());
			deepStrictEqual(actualScreenLocation, screenLocationWithNewScreen);
		});
	});

	describe("dropScreenReducer", () => {
		it("will remove the last screen from the stack", () => {
			const storeConfig = {
				data: { dirty: false, document: {} },
				ui: {
					screenLocation: screenLocationWithNewScreen
				}
			};

			const store = createTestStore({ storeConfig });
			store.dispatch(Commands.dropScreen());

			const actualLocationStack = UiStateSelectors.screenLocationStack()(store.getState());
			deepStrictEqual(actualLocationStack, [baseScreenState]);
		});
	});

	describe("setLocationStackReducer", () => {
		it("will set the location stack described in the payload", () => {
			const storeConfig = {
				data: { dirty: false, document: {} },
				ui: {
					screenLocation: [baseScreenState]
				}
			};

			const expectedStack: EngineStore.ScreenState[] = [
				{
					locationPath,
					path,
					repeatInstanceState: repeatState
				}
			];

			const store = createTestStore({ storeConfig });
			store.dispatch(
				Commands.setLocationStack({
					locationStack: expectedStack
				})
			);

			const actualLocationStack = UiStateSelectors.screenLocationStack()(store.getState());
			deepStrictEqual(actualLocationStack, expectedStack);
		});
	});
});
