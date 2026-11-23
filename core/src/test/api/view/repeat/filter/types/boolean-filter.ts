// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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

import { createRow } from "./utils.js";

const { createModelPath } = ModelHelpers;

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
