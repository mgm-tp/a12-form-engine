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

export function describeTestForEnumerationFilter(models: Models, columnId: string): void {
	const CHECKBOXES = ["empty", "V1", "V2", "V3"];
	const checkbox = checkBoxFunctions(columnId, CHECKBOXES);
	const changeV1andV2: () => Interaction = () => ["V1", "V2"].map(checkbox.triggerChange);

	it("is disabled when the disable state is true", () => {
		disabledFilterTest(models, checkbox.queryAll, 3);
	});

	it("is not readonly when the readonly state is true", () => {
		readonlyFilterTest(models, checkbox.queryAll, 3);
	});

	describe("change a value", () => {
		it("changes the filter value when the input is selected", async () => {
			await changeFilterValueTest(models, columnId, checkbox.triggerChange("V1"), {
				values: { V1: true }
			});
		});

		it("clears the filter value if the input is not selected", async () => {
			await clearFilterValueTest(
				models,
				columnId,
				{ values: { V1: true } },
				checkbox.triggerChange("V1")
			);
		});
	});

	describe("change another value", () => {
		it("changes the filter value when the input is selected", async () => {
			await changeFilterValueTest(models, columnId, checkbox.triggerChange("V2"), {
				values: { V2: true }
			});
		});

		it("clears the filter value if the input is not selected", async () => {
			await clearFilterValueTest(
				models,
				columnId,
				{ values: { V2: true } },
				checkbox.triggerChange("V2")
			);
		});
	});

	describe("change the empty value", () => {
		it("changes the filter value when the input is selected", async () => {
			await changeFilterValueTest(models, columnId, checkbox.triggerChange("empty"), {
				values: {},
				filterNull: true
			});
		});

		it("keep existing filter values when changing `filterNull`", async () => {
			await changeFilterValueTest(
				models,
				columnId,
				checkbox.triggerChange("empty"),
				{
					values: { V1: true, V2: true },
					filterNull: true
				},
				undefined,
				undefined,
				{ values: { V1: true, V2: true }, filterNull: false }
			);
		});

		it("clears the filter value if the input is not selected", async () => {
			await clearFilterValueTest(
				models,
				columnId,
				{ values: {}, filterNull: true },
				checkbox.triggerChange("empty")
			);
		});

		it("does not clear the filter when filter values exist", async () => {
			await changeFilterValueTest(
				models,
				columnId,
				checkbox.triggerChange("empty"),
				{
					values: { V1: true, V2: true },
					filterNull: false
				},
				undefined,
				undefined,
				{
					values: { V1: true, V2: true },
					filterNull: true
				}
			);
		});
	});

	describe("change multiple values", () => {
		it("changes the filter value when the input is selected", async () => {
			await changeFilterValueTest(models, columnId, changeV1andV2(), {
				values: { V1: true, V2: true }
			});
		});

		it("clears the filter value if the input is not selected", async () => {
			await clearFilterValueTest(
				models,
				columnId,
				{ values: { V1: true, V2: true } },
				changeV1andV2()
			);
		});
	});

	describe("shows the right rows", () => {
		const COLUMN_PATH = createModelPath(...REPEAT_MODEL_PATH, columnId);
		const rows: RepeatRow[] = setupArrayFixture(() => {
			const createRowForEnumeration = (rowIndex: number, value: string | null) => {
				return createRow(COLUMN_PATH, "DummyName", rowIndex, value);
			};
			return [
				createRowForEnumeration(0, "V1"),
				createRowForEnumeration(1, "V2"),
				createRowForEnumeration(2, "V1"),
				createRowForEnumeration(3, "V1"),
				createRowForEnumeration(4, ""),
				createRowForEnumeration(5, "V2"),
				createRowForEnumeration(6, null)
			];
		});

		it("filters the rows by empty value when `filterNull` is set", () => {
			deepStrictEqual(
				filterRows(
					rows,
					{
						[columnId]: { columnPath: COLUMN_PATH, filter: { values: {}, filterNull: true } }
					},
					models.formModel,
					models.documentModel
				).map(r => r.rowIndexInDocument),
				[4, 6]
			);
		});

		it("filters the rows by the a value", () => {
			deepStrictEqual(
				filterRows(
					rows,
					{
						[columnId]: { columnPath: COLUMN_PATH, filter: { values: { V1: true } } }
					},
					models.formModel,
					models.documentModel
				).map(r => r.rowIndexInDocument),
				[0, 2, 3]
			);
		});

		it("filters the rows by another value", () => {
			deepStrictEqual(
				filterRows(
					rows,
					{
						[columnId]: { columnPath: COLUMN_PATH, filter: { values: { V2: true } } }
					},
					models.formModel,
					models.documentModel
				).map(r => r.rowIndexInDocument),
				[1, 5]
			);
		});

		it("filters the rows by multiple values", () => {
			deepStrictEqual(
				filterRows(
					rows,
					{
						[columnId]: {
							columnPath: COLUMN_PATH,
							filter: { values: { V1: true, V2: true } }
						}
					},
					models.formModel,
					models.documentModel
				).map(r => r.rowIndexInDocument),
				[0, 1, 2, 3, 5]
			);
		});
	});
}
