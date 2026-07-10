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

import { notStrictEqual, strictEqual } from "node:assert/strict";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";

import { Commands, Events, UiStateSelectors } from "../../../../../back-end/store/index.js";
import { createDocumentPath } from "../../../../utils/createDocumentPath.js";
import { createModelPath } from "../../../../utils/createModelPath.js";
import { US_LOCALE } from "../../../../utils/localization.js";
import { createTestStore } from "../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";

describe("api.back-end.store.middleware", () => {
	describe("resetRecentlyAddNewOnNextEventMiddleware", () => {
		const repeat = createModelPath("SortingAndFiltering", "sec1", "inline-repeat-Nested_L1");
		const roRepeat = createModelPath(
			"SortingAndFiltering",
			"sec2",
			"inline-repeat-Nested_L1_ReadOnly"
		);

		const models = setupModelsFixture("repeat", "inline");

		describe("given a store with a new row with `recentlyAdded`", () => {
			it("listens to any action from `Events` and removes new row state", () => {
				const store = createTestStore({
					storeConfig: {
						models,
						locale: US_LOCALE,
						data: {}
					}
				});

				const oldRepeatState = UiStateSelectors.repeatInstanceStateEntry(repeat)(store.getState());
				const oldRoRepeatState = UiStateSelectors.repeatInstanceStateEntry(roRepeat)(
					store.getState()
				);

				store.dispatch(
					Commands.changeRepeatInstanceStateEntry({
						locationPath: createModelPath("SortingAndFiltering"),
						repeatFormModelPath: repeat,
						entry: {
							...oldRepeatState,
							newRow: {
								rowPath: createDocumentPath(["Root"], ["Nested_L1"]),
								rowState: "recentlyAdded"
							}
						}
					})
				);

				store.dispatch(
					Commands.changeRepeatInstanceStateEntry({
						locationPath: createModelPath("SortingAndFiltering"),
						repeatFormModelPath: roRepeat,
						entry: {
							...oldRoRepeatState,
							newRow: {
								rowPath: createDocumentPath(["Root"], ["Nested_L1"]),
								rowState: "recentlyAdded"
							}
						}
					})
				);

				store.dispatch(
					Events.eventButton({ name: "XXX", buttonPath: ModelPath.fromString("test/me") })
				);

				const repeatStateEntry = UiStateSelectors.repeatInstanceStateEntry(repeat)(
					store.getState()
				);
				strictEqual(repeatStateEntry!.newRow, undefined);

				const roRepeatStateEntry = UiStateSelectors.repeatInstanceStateEntry(roRepeat)(
					store.getState()
				);
				strictEqual(roRepeatStateEntry!.newRow, undefined);
			});
		});

		describe("given a store with a new row with `workingOn`", () => {
			it("does change the new row state", () => {
				const store = createTestStore({
					storeConfig: {
						models,
						locale: US_LOCALE,
						data: {}
					}
				});

				const oldRepeatState = UiStateSelectors.repeatInstanceStateEntry(repeat)(store.getState());

				store.dispatch(
					Commands.changeRepeatInstanceStateEntry({
						locationPath: createModelPath("SortingAndFiltering"),
						repeatFormModelPath: repeat,
						entry: {
							...oldRepeatState,
							newRow: {
								rowPath: createDocumentPath(["Root"], ["Nested_L1"]),
								rowState: "workingOn"
							}
						}
					})
				);

				store.dispatch(
					Events.eventButton({ name: "XXX", buttonPath: ModelPath.fromString("test/me") })
				);

				const newRepeatStateEntry = UiStateSelectors.repeatInstanceStateEntry(repeat)(
					store.getState()
				);
				notStrictEqual(newRepeatStateEntry!.newRow, undefined);

				strictEqual(newRepeatStateEntry!.newRow!.rowState, "workingOn");
			});
		});
	});
});
