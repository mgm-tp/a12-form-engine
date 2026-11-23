// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { strictEqual, notStrictEqual } from "node:assert/strict";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";

import { Commands, Events, UiStateSelectors } from "../../../../../back-end/store/index.js";
import { DocumentHelpers } from "../../../../utils/document-helpers.js";
import { US_LOCALE } from "../../../../utils/localization.js";
import { ModelHelpers } from "../../../../utils/model-helpers.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";

const { createModelPath } = ModelHelpers;
const { createDocumentPath } = DocumentHelpers;
const { createTestStore } = SetupHelpers;

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
