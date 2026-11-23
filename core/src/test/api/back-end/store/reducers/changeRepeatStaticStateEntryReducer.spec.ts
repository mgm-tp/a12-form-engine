// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { deepStrictEqual, notStrictEqual } from "node:assert/strict";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";

import { Commands, UiStateSelectors } from "../../../../../back-end/store/index.js";
import type { EngineStore } from "../../../../../back-end/store/internal/store.js";
import { US_LOCALE } from "../../../../utils/localization.js";
import { ModelHelpers } from "../../../../utils/model-helpers.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { REPEAT_MODEL_PATH } from "../../../view/repeat/filter/filter.utils.js";

const { createTestStore } = SetupHelpers;
const { createModelPath } = ModelHelpers;

describe("api.back-end.store.reducers", () => {
	describe("changeRepeatStateStaticEntryReducer", () => {
		it("will update the repeat state to the entry that was passed in the command payload", () => {
			const columnId = "fieldbasedrepeatoverviewcolumn-2c388";
			const locationPath = [{ elementName: "SortingAndFiltering" }];
			const repeatFormModelPath = createModelPath(...REPEAT_MODEL_PATH);

			const entry: EngineStore.Repeat.StaticState = {
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
			};

			const store = createTestStore({
				storeConfig: {
					locale: US_LOCALE,
					data: { dirty: false, document: {} },
					ui: {
						screenLocation: [
							{
								path: [],
								locationPath
							}
						],
						repeatStaticState: {
							"/SortingAndFiltering/sec1/inline-repeat-Nested_L1": {
								filterRowOpen: false,
								filters: {
									[columnId]: {
										columnPath: createModelPath(
											...REPEAT_MODEL_PATH,
											"fieldbasedrepeatoverviewcolumn-2c388"
										),
										filter: { filterValue: "Row 1" }
									}
								},
								sortingState: {
									orderPath: ModelPath.fromString(
										"/SortingAndFiltering/sec1/inline-repeat-Nested_L1/fieldbasedrepeatoverviewcolumn-2c388"
									),
									sorting: "asc"
								}
							}
						}
					}
				}
			});
			store.dispatch(
				Commands.changeRepeatStaticStateEntry({
					repeatFormModelPath,
					entry
				})
			);
			const entryAfterStateChange = UiStateSelectors.repeatStaticStateEntry(repeatFormModelPath)(
				store.getState()
			);
			notStrictEqual(entryAfterStateChange, undefined);
			deepStrictEqual(entryAfterStateChange, entry);
		});
	});
});
