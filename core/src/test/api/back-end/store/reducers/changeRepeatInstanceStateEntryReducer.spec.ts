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

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";

import { Commands, UiStateSelectors } from "../../../../../back-end/store/index.js";
import type { EngineStore } from "../../../../../back-end/store/internal/store.js";
import { DocumentPath } from "../../../../../models/index.js";
import { US_LOCALE } from "../../../../utils/localization.js";
import { ModelHelpers } from "../../../../utils/model-helpers.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { REPEAT_MODEL_PATH } from "../../../view/repeat/filter/filter.utils.js";

const { createTestStore } = SetupHelpers;
const { createModelPath } = ModelHelpers;

describe("api.back-end.store.reducers", () => {
	describe("changeRepeatInstanceStateEntryReducer", () => {
		it("will update the repeat state to the entry that was passed in the command payload", () => {
			const repeatFormModelPath = createModelPath(...REPEAT_MODEL_PATH);
			const locationPath = repeatFormModelPath.slice(0, 1);

			const entry: EngineStore.Repeat.InstanceState = {
				tableInteractionDocument: undefined,
				newRow: undefined,
				page: 1
			};

			const store = createTestStore({
				storeConfig: {
					locale: US_LOCALE,
					data: { dirty: false, document: {} },
					ui: {
						screenLocation: [
							{
								path: [],
								locationPath,
								repeatInstanceState: {
									"/SortingAndFiltering/sec1/inline-repeat-Nested_L1": {
										page: 2,
										newRow: {
											rowPath: [{ elementName: "abc", index: 0 }],
											rowState: "workingOn"
										}
									}
								}
							}
						]
					}
				}
			});
			store.dispatch(
				Commands.changeRepeatInstanceStateEntry({
					locationPath,
					repeatFormModelPath,
					entry
				})
			);
			const entryAfterStateChange = UiStateSelectors.repeatInstanceStateEntry(repeatFormModelPath)(
				store.getState()
			);
			deepStrictEqual(entryAfterStateChange, entry);
		});

		it("removes the document backup from the state entry when expandedRowPath is undefined", () => {
			const repeatFormModelPath = createModelPath(
				"SortingAndFiltering",
				"sec1",
				"embedded-repeat-Nested_L1"
			);
			const locationPath = repeatFormModelPath.slice(0, 1);

			const entry: EngineStore.Repeat.InstanceState = {
				expandedRowPath: undefined
			};

			const store = createTestStore({
				storeConfig: {
					locale: US_LOCALE,
					data: { dirty: false, document: { Root: { Nested_L1: [{}] } } },
					ui: {
						screenLocation: [
							{
								path: [],
								locationPath,
								repeatInstanceState: {
									[ModelPath.toString(repeatFormModelPath)]: {
										expandedRowPath: DocumentPath.fromString("/Root[1]/Nested_L1[1]"),
										tableInteractionDocument: { Root: { Nested_L1: [{}] } }
									}
								}
							}
						]
					}
				}
			});
			store.dispatch(
				Commands.changeRepeatInstanceStateEntry({
					locationPath,
					repeatFormModelPath,
					entry: { expandedRowPath: undefined }
				})
			);
			const entryAfterStateChange = UiStateSelectors.repeatInstanceStateEntry(repeatFormModelPath)(
				store.getState()
			);
			deepStrictEqual(entryAfterStateChange, { ...entry, tableInteractionDocument: undefined });
		});
	});
});
