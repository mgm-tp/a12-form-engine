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

import type { Models } from "../../../../../../back-end/store/internal/store.js";
import type { RepeatRow } from "../../../../../../view/internal/components/form-engine/repeat/components/tableColumnTypes.js";
import { filterRows } from "../../../../../../view/internal/utilities/filtering.js";
import { ModelHelpers } from "../../../../../utils/model-helpers.js";
import { setupArrayFixture } from "../../../../../utils/setupFixture.js";

import { checkBoxFunctions } from "../filter-functions/checkbox-filter.js";
import {
	changeFilterValueTest,
	clearFilterValueTest,
	disabledFilterTest,
	readonlyFilterTest,
	REPEAT_MODEL_PATH
} from "../filter.utils.js";
import type { Interaction } from "../interaction.js";

import { createRow } from "./utils.js";

const { createModelPath } = ModelHelpers;

export function describeTestForMultiSelectFilter(models: Models): void {
	const COLUMN_NAME = "fieldbasedrepeatoverviewcolumn-96d91";
	const CHECKBOXES = ["V1", "V2", "V3"];
	const checkbox = checkBoxFunctions(COLUMN_NAME, CHECKBOXES);
	const changeV1andV2: () => Interaction = () => ["V1", "V2"].map(checkbox.triggerChange);

	it("is disabled when the disable state is true", () => {
		disabledFilterTest(models, checkbox.queryAll, 3);
	});

	it("is not readonly when the readonly state is true", () => {
		readonlyFilterTest(models, checkbox.queryAll, 3);
	});

	describe("filter mode 'or'", () => {
		describe("change a value", () => {
			it("sets the filter value when the input is selected", async () => {
				await changeFilterValueTest(models, COLUMN_NAME, checkbox.triggerChange("V1"), {
					values: { V1: true },
					mode: "or"
				});
			});

			it("clears the filter value if the input is unselected", async () => {
				await clearFilterValueTest(
					models,
					COLUMN_NAME,
					{ values: { V1: true }, mode: "or" },
					checkbox.triggerChange("V1")
				);
			});
		});

		describe("when changing the empty value", () => {
			it("sets the filter value when the input is selected", async () => {
				await changeFilterValueTest(models, COLUMN_NAME, checkbox.triggerChange("empty"), {
					values: {},
					filterNull: true,
					mode: "or"
				});
			});

			it("keep existing filter values when changing `filterNull`", async () => {
				await changeFilterValueTest(
					models,
					COLUMN_NAME,
					checkbox.triggerChange("empty"),
					{
						values: { V1: true, V2: true },
						mode: "or",
						filterNull: true
					},
					undefined,
					undefined,
					{ values: { V1: true, V2: true }, mode: "or" }
				);
			});

			it("clears the filter value if the input is unselected", async () => {
				await clearFilterValueTest(
					models,
					COLUMN_NAME,
					{ values: {}, filterNull: true, mode: "or" },
					checkbox.triggerChange("empty")
				);
			});

			it("does not clear the filter when filter values exist", async () => {
				await changeFilterValueTest(
					models,
					COLUMN_NAME,
					checkbox.triggerChange("empty"),
					{
						values: { V1: true, V2: true },
						mode: "or",
						filterNull: false
					},
					undefined,
					undefined,
					{
						values: { V1: true, V2: true },
						mode: "or",
						filterNull: true
					}
				);
			});
		});

		describe("change another value", () => {
			it("changes the filter value when the input is selected", async () => {
				await changeFilterValueTest(models, COLUMN_NAME, checkbox.triggerChange("V2"), {
					values: { V2: true },
					mode: "or"
				});
			});

			it("clears the filter value if the input is unselected", async () => {
				await clearFilterValueTest(
					models,
					COLUMN_NAME,
					{ values: { V2: true }, mode: "or" },
					wrapper => {
						checkbox.triggerChange("V2")(wrapper);
					}
				);
			});
		});

		describe("change multiple values", () => {
			it("changes the filter value when the input is selected", async () => {
				await changeFilterValueTest(models, COLUMN_NAME, changeV1andV2(), {
					values: { V1: true, V2: true },
					mode: "or"
				});
			});

			it("clears the filter value if the input is unselected", async () => {
				await clearFilterValueTest(
					models,
					COLUMN_NAME,
					{ values: { V1: true, V2: true }, mode: "or" },
					changeV1andV2()
				);
			});
		});
	});

	describe("filter mode 'and'", () => {
		/**
		 * Workaround to choose the filter mode without using the popup.
		 * The popup cannot be tested with react-test-renderer, because it
		 * renders a portal, which is not supported.
		 *
		 * TODO: Do we need to test the popup or is this good enough?
		 *
		 * FIXME: Extract separate test for FilterMode component
		 */
		// function chooseMode(wrapper: RtlRenderWrapper) {
		// 	const filterMode = query(wrapper.widgetMap.PopUpMenu).props();
		// 	filterMode.onClick("and");
		// }

		describe("change a value", () => {
			it("changes the filter value when the input is selected", async () => {
				await changeFilterValueTest(
					models,
					COLUMN_NAME,
					checkbox.triggerChange("V1"),
					{
						values: { V1: true },
						mode: "and"
					},
					undefined,
					undefined,
					{ mode: "and", values: {} }
				);
			});

			it("clears the filter value if the input is unselected", async () => {
				await clearFilterValueTest(
					models,
					COLUMN_NAME,
					{ values: { V1: true }, mode: "and" },
					checkbox.triggerChange("V1")
				);
			});
		});

		describe("change another value", () => {
			it("changes the filter value when the input is selected", async () => {
				await changeFilterValueTest(
					models,
					COLUMN_NAME,
					checkbox.triggerChange("V2"),
					{ values: { V2: true }, mode: "and" },
					undefined,
					undefined,
					{ mode: "and", values: {} }
				);
			});

			it("clears the filter value if the input is unselected", async () => {
				await clearFilterValueTest(
					models,
					COLUMN_NAME,
					{ values: { V2: true }, mode: "and" },
					checkbox.triggerChange("V2")
				);
			});
		});

		describe("change multiple values", () => {
			it("changes the filter value when the input is selected", async () => {
				await changeFilterValueTest(
					models,
					COLUMN_NAME,
					changeV1andV2(),
					{ values: { V1: true, V2: true }, mode: "and" },
					undefined,
					undefined,
					{ mode: "and", values: {} }
				);
			});

			it("clears the filter value if the input is unselected", async () => {
				await clearFilterValueTest(
					models,
					COLUMN_NAME,
					{ values: { V1: true, V2: true }, mode: "and" },
					changeV1andV2()
				);
			});
		});
	});

	describe("shows the right rows", () => {
		const COLUMN_PATH = createModelPath(...REPEAT_MODEL_PATH, COLUMN_NAME);

		const rows: RepeatRow[] = setupArrayFixture(() => {
			const createRowForMultiSelect = (
				rowIndex: number,
				value: string | number | boolean | Date | object | null
			) => {
				return createRow(COLUMN_PATH, "L1_MultiSelect", rowIndex, value);
			};
			return [
				createRowForMultiSelect(0, null),
				createRowForMultiSelect(1, [{ value: "V2" }]),
				createRowForMultiSelect(2, [{ value: "V1" }, { value: "V3" }]),
				createRowForMultiSelect(3, [{ value: "V1" }, { value: "V2" }, { value: "V3" }]),
				createRowForMultiSelect(4, [{ value: "V1" }]),
				createRowForMultiSelect(5, null),
				createRowForMultiSelect(6, [])
			];
		});

		describe("filter mode 'and'", () => {
			it("filters the rows by empty value when `filterNull` is set", () => {
				deepStrictEqual(
					filterRows(
						rows,
						{
							[COLUMN_NAME]: {
								columnPath: COLUMN_PATH,
								filter: { values: {}, filterNull: true, mode: "and" }
							}
						},
						models.formModel,
						models.documentModel
					).map(r => r.rowIndexInDocument),
					[0, 5, 6]
				);
			});

			it("filters the rows by empty value and another value", () => {
				deepStrictEqual(
					filterRows(
						rows,
						{
							[COLUMN_NAME]: {
								columnPath: COLUMN_PATH,
								filter: { values: { V3: true }, filterNull: true, mode: "and" }
							}
						},
						models.formModel,
						models.documentModel
					).map(r => r.rowIndexInDocument),
					[] // Using AND for empty and something else will always result in an empty set
				);
			});

			it("filters the rows by a value", () => {
				deepStrictEqual(
					filterRows(
						rows,
						{
							[COLUMN_NAME]: {
								columnPath: COLUMN_PATH,
								filter: { values: { V1: true }, mode: "and" }
							}
						},
						models.formModel,
						models.documentModel
					).map(r => r.rowIndexInDocument),
					[2, 3, 4]
				);
			});

			it("filters the rows by another value", () => {
				deepStrictEqual(
					filterRows(
						rows,
						{
							[COLUMN_NAME]: {
								columnPath: COLUMN_PATH,
								filter: { values: { V2: true }, mode: "and" }
							}
						},
						models.formModel,
						models.documentModel
					).map(r => r.rowIndexInDocument),
					[1, 3]
				);
			});

			it("filters the rows by multiple values", () => {
				deepStrictEqual(
					filterRows(
						rows,
						{
							[COLUMN_NAME]: {
								columnPath: COLUMN_PATH,
								filter: { values: { V1: true, V2: true }, mode: "and" }
							}
						},
						models.formModel,
						models.documentModel
					).map(r => r.rowIndexInDocument),
					[3]
				);
			});
		});

		describe("filter mode 'or'", () => {
			it("filters the rows by empty value when `filterNull` is set", () => {
				deepStrictEqual(
					filterRows(
						rows,
						{
							[COLUMN_NAME]: {
								columnPath: COLUMN_PATH,
								filter: { values: {}, filterNull: true, mode: "or" }
							}
						},
						models.formModel,
						models.documentModel
					).map(r => r.rowIndexInDocument),
					[0, 5, 6]
				);
			});

			it("filters the rows by empty value and another value", () => {
				deepStrictEqual(
					filterRows(
						rows,
						{
							[COLUMN_NAME]: {
								columnPath: COLUMN_PATH,
								filter: { values: { V3: true }, filterNull: true, mode: "or" }
							}
						},
						models.formModel,
						models.documentModel
					).map(r => r.rowIndexInDocument),
					[0, 2, 3, 5, 6]
				);
			});

			it("filters the rows by a value", () => {
				deepStrictEqual(
					filterRows(
						rows,
						{
							[COLUMN_NAME]: {
								columnPath: COLUMN_PATH,
								filter: { values: { V1: true }, mode: "or" }
							}
						},
						models.formModel,
						models.documentModel
					).map(r => r.rowIndexInDocument),
					[2, 3, 4]
				);
			});

			it("filters the rows by another value", () => {
				deepStrictEqual(
					filterRows(
						rows,
						{
							[COLUMN_NAME]: {
								columnPath: COLUMN_PATH,
								filter: { values: { V2: true }, mode: "or" }
							}
						},
						models.formModel,
						models.documentModel
					).map(r => r.rowIndexInDocument),
					[1, 3]
				);
			});

			it("filters the rows by multiple values", () => {
				deepStrictEqual(
					filterRows(
						rows,
						{
							[COLUMN_NAME]: {
								columnPath: COLUMN_PATH,
								filter: { values: { V1: true, V2: true }, mode: "or" }
							}
						},
						models.formModel,
						models.documentModel
					).map(r => r.rowIndexInDocument),
					[1, 2, 3, 4]
				);
			});
		});
	});
}
