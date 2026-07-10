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

import type { Models } from "../../../../../../back-end/store/internal/store.js";
import type { RepeatRow } from "../../../../../../view/internal/components/form-engine/repeat/components/tableColumnTypes.js";
import { filterRows } from "../../../../../../view/internal/utilities/filtering.js";
import { setupArrayFixture } from "../../../../../utils/setupFixture.js";
import { createModelPath } from "../../../../../utils/createModelPath.js";

import { checkBoxFunctions } from "../filter-functions/checkbox-filter.js";
import {
	changeFilterValueTest,
	clearFilterValueTest,
	disabledFilterTest,
	readonlyFilterTest,
	REPEAT_MODEL_PATH
} from "../filter.utils.js";

import { createRow } from "./utils.js";

export function describeTestForBooleanFilter(models: Models): void {
	const COLUMN_NAME = "fieldbasedrepeatoverviewcolumn-1ccd0";
	const CHECKBOXES = ["yes", "no", "empty"];
	const checkbox = checkBoxFunctions(COLUMN_NAME, CHECKBOXES);

	it("is disabled when the disable state is true", () => {
		disabledFilterTest(models, checkbox.queryAll, 3);
	});

	it("is not readonly when the readonly state is true", () => {
		readonlyFilterTest(models, checkbox.queryAll, 3);
	});

	describe("change the `true` value", () => {
		it("sets the filter value when the input is selected", async () => {
			await changeFilterValueTest(models, COLUMN_NAME, checkbox.triggerChange("yes"), {
				filterTrue: true,
				filterFalse: false,
				filterNull: false
			});
		});

		it("clears the filter value if the input is not selected", async () => {
			await clearFilterValueTest(
				models,
				COLUMN_NAME,
				{ filterTrue: true, filterFalse: false, filterNull: false },
				checkbox.triggerChange("yes")
			);
		});
	});

	describe("change the `false` value", () => {
		it("sets the filter value when the input is selected", async () => {
			await changeFilterValueTest(models, COLUMN_NAME, checkbox.triggerChange("no"), {
				filterTrue: false,
				filterFalse: true,
				filterNull: false
			});
		});

		it("clears the filter value if the input is unselected", async () => {
			await clearFilterValueTest(
				models,
				COLUMN_NAME,
				{ filterTrue: false, filterFalse: true, filterNull: false },
				checkbox.triggerChange("no")
			);
		});
	});

	describe("change the `filterNull` value", () => {
		it("sets the filter value when the input is selected", async () => {
			await changeFilterValueTest(models, COLUMN_NAME, checkbox.triggerChange("empty"), {
				filterTrue: false,
				filterFalse: false,
				filterNull: true
			});
		});

		it("clears the filter value if the input is unselected", async () => {
			await clearFilterValueTest(
				models,
				COLUMN_NAME,
				{ filterTrue: false, filterFalse: false, filterNull: true },
				checkbox.triggerChange("empty")
			);
		});
	});

	describe("shows the right rows", () => {
		const COLUMN_PATH = createModelPath(...REPEAT_MODEL_PATH, COLUMN_NAME);
		const rows: RepeatRow[] = setupArrayFixture(() => {
			const createRowForBoolean = (rowIndex: number, value: boolean | null) => {
				return createRow(COLUMN_PATH, "L1_Boolean", rowIndex, value);
			};
			return [
				createRowForBoolean(0, true),
				createRowForBoolean(1, false),
				createRowForBoolean(2, true),
				createRowForBoolean(3, false),
				createRowForBoolean(4, true),
				createRowForBoolean(5, false),
				createRowForBoolean(6, null)
			];
		});

		it("filters the rows by the `true` value", () => {
			deepStrictEqual(
				filterRows(
					rows,
					{
						[COLUMN_NAME]: {
							columnPath: COLUMN_PATH,
							filter: { filterTrue: true, filterFalse: false, filterNull: false }
						}
					},
					models.formModel,
					models.documentModel
				).map(r => r.rowIndexInDocument),
				[0, 2, 4]
			);
		});

		it("filters the rows by the `false` value", () => {
			deepStrictEqual(
				filterRows(
					rows,
					{
						[COLUMN_NAME]: {
							columnPath: COLUMN_PATH,
							filter: { filterTrue: false, filterFalse: true, filterNull: false }
						}
					},
					models.formModel,
					models.documentModel
				).map(r => r.rowIndexInDocument),
				[1, 3, 5]
			);
		});

		it("filters the rows by the `null` value", () => {
			deepStrictEqual(
				filterRows(
					rows,
					{
						[COLUMN_NAME]: {
							columnPath: COLUMN_PATH,
							filter: { filterTrue: false, filterFalse: false, filterNull: true }
						}
					},
					models.formModel,
					models.documentModel
				).map(r => r.rowIndexInDocument),
				[6]
			);
		});

		it("filters the rows by the `true` and `false` value", () => {
			deepStrictEqual(
				filterRows(
					rows,
					{
						[COLUMN_NAME]: {
							columnPath: COLUMN_PATH,
							filter: { filterTrue: true, filterFalse: true, filterNull: true }
						}
					},
					models.formModel,
					models.documentModel
				),
				rows
			);
		});
	});
}
