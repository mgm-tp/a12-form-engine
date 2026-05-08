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

import { emptySwitchFunctions } from "../filter-functions/empty-switch.js";
import { textLineFunctions } from "../filter-functions/textline-filter.js";
import {
	changeFilterValueTest,
	clearFilterValueTest,
	disabledFilterTest,
	readonlyFilterTest,
	REPEAT_MODEL_PATH
} from "../filter.utils.js";

import { createRow } from "./utils.js";

const { createModelPath } = ModelHelpers;

export function describeTestForStringFilter(
	models: Models,
	columnId: string,
	useLabel?: boolean
): void {
	const textline = textLineFunctions(columnId);

	it("is disabled when the disable state is true", () => {
		disabledFilterTest(models, wrapper => [textline.query(wrapper)], 1);
	});

	it("is not readonly when the readonly state is true", () => {
		readonlyFilterTest(models, wrapper => [textline.query(wrapper)], 1);
	});

	it("changes the filter value when the input is not empty", () => {
		changeFilterValueTest(models, columnId, textline.triggerChange("123"), {
			filterValue: "123"
		});
	});

	it("clears the filter value if the input is empty", () => {
		clearFilterValueTest(models, columnId, { filterValue: "abc" }, textline.triggerChange(""));
	});

	describe("when changing the empty switch", () => {
		const emptySwitch = emptySwitchFunctions(columnId);

		it("sets the `filterNull` value to true if its false", async () => {
			await changeFilterValueTest(
				models,
				columnId,
				emptySwitch.triggerChange(true),
				{
					filterValue: "",
					filterNull: true
				},
				undefined,
				undefined,
				{ filterValue: "", filterNull: false }
			);
		});

		it("keep existing filter values when changing `filterNull`", async () => {
			await changeFilterValueTest(
				models,
				columnId,
				emptySwitch.triggerChange(true),
				{
					filterValue: "test",
					filterNull: true
				},
				undefined,
				undefined,
				{
					filterValue: "test",
					filterNull: false
				}
			);
		});

		it("sets the `filterNull` value to true if it doesn't exist", async () => {
			await changeFilterValueTest(models, columnId, emptySwitch.triggerChange(true), {
				filterValue: "",
				filterNull: true
			});
		});

		it("clears the `filterNull` value when it is true", async () => {
			clearFilterValueTest(
				models,
				columnId,
				{ filterValue: "", filterNull: true },
				emptySwitch.triggerChange(false)
			);
		});

		it("does not clear the filter when other filter values exist", async () => {
			await changeFilterValueTest(
				models,
				columnId,
				emptySwitch.triggerChange(false),
				{
					filterValue: "test",
					filterNull: false
				},
				undefined,
				undefined,
				{
					filterValue: "test",
					filterNull: true
				}
			);
		});
	});

	describe("shows the right rows", () => {
		const COLUMN_PATH = createModelPath(...REPEAT_MODEL_PATH, columnId);

		const rows: RepeatRow[] = setupArrayFixture(() => {
			const createRowForString = (rowIndex: number, value: string | null, label?: string) => {
				return createRow(COLUMN_PATH, "DummyName", rowIndex, value, label);
			};

			return [
				createRowForString(0, "Row 2", "row 1"),
				createRowForString(1, "row 11", "row 2"),
				createRowForString(2, "row 3", "row 11"),
				createRowForString(3, "Row 4"),
				createRowForString(4, "row 1", "row 3"),
				createRowForString(5, "", "Row 1"),
				createRowForString(6, null)
			];
		});

		it("filters the rows by matching the filter word", () => {
			deepStrictEqual(
				filterRows(
					rows,
					{
						[columnId]: { columnPath: COLUMN_PATH, filter: { filterValue: "Row 1" } }
					},
					models.formModel,
					models.documentModel
				).map(r => r.rowIndexInDocument),
				useLabel ? [0, 2, 5] : [1, 4]
			);
		});

		it("filters the rows by empty value when `filterNull` is set", () => {
			deepStrictEqual(
				filterRows(
					rows,
					{
						[columnId]: { columnPath: COLUMN_PATH, filter: { filterNull: true, filterValue: "" } }
					},
					models.formModel,
					models.documentModel
				).map(r => r.rowIndexInDocument),
				useLabel ? [3, 6] : [5, 6]
			);
		});
	});
}
