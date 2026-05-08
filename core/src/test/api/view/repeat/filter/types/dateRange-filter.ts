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

import { deepStrictEqual, notStrictEqual } from "node:assert/strict";

import type { FilterParseError, Models } from "../../../../../../back-end/store/internal/store.js";
import type { RepeatRow } from "../../../../../../view/internal/components/form-engine/repeat/components/tableColumnTypes.js";
import { filterRows } from "../../../../../../view/internal/utilities/filtering.js";
import { ModelHelpers } from "../../../../../utils/model-helpers.js";
import { setupArrayFixture } from "../../../../../utils/setupFixture.js";

import { emptySwitchFunctions } from "../filter-functions/empty-switch.js";
import { textLineFunctions } from "../filter-functions/textline-filter.js";
import { changeFilterValueTest, clearFilterValueTest, REPEAT_MODEL_PATH } from "../filter.utils.js";

import { createRow } from "./utils.js";

const { createModelPath } = ModelHelpers;

export function executeTestForDateRangeFilter(models: Models, timeZoneModels: Models): void {
	const ERROR_MESSAGE: FilterParseError = {
		type: "FilterParseError",
		error: {
			errorCode: "datumBereichFormatFalsch",
			errorKey: "kernel.formalErrors.DATUM_BEREICH_FORMAT",
			errorText: {
				key: "foo",
				defaults: { en: "Only date ranges of the format $timeIntervalFormat$ are allowed." }
			},
			severity: "ERROR"
		},
		value: "abc-abc"
	};

	const COLUMN_NAME = "fieldbasedrepeatoverviewcolumn-39b72";
	const COLUMN_NAME_TIMEZONE = "fieldbasedrepeatoverviewcolumn-ffd98";

	const textline = textLineFunctions(COLUMN_NAME);
	const textlineTZ = textLineFunctions(COLUMN_NAME_TIMEZONE);

	describe("change the filter value", () => {
		describe("with timezone === 'UTC'", () => {
			it("changes the filter value when the input is not empty", async () => {
				await changeFilterValueTest(models, COLUMN_NAME, textline.triggerChange("01/01-01/05"), {
					filterRange: { data: [new Date("2022-01-01"), new Date("2022-01-05")] }
				});
			});
		});

		describe("with timezone === 'Europe/Berlin'", () => {
			it("changes the filter value when the input is not empty", async () => {
				await changeFilterValueTest(
					timeZoneModels,
					COLUMN_NAME_TIMEZONE,
					textlineTZ.triggerChange("01/01-01/05"),
					{
						filterRange: {
							data: [new Date("2021-12-31T23:00:00.000Z"), new Date("2022-01-04T23:00:00.000Z")]
						}
					},
					undefined,
					true
				);
			});
		});

		it("clears the filter value if the input is empty", () => {
			clearFilterValueTest(
				models,
				COLUMN_NAME,
				{ filterRange: { data: [new Date("2022-01-01"), new Date("2022-01-05")] } },
				textline.triggerChange("")
			);
		});

		it("shows an error message on invalid value", async () => {
			await changeFilterValueTest(
				models,
				COLUMN_NAME,
				textline.triggerChange("abc-abc"),
				{ filterRange: { message: ERROR_MESSAGE } },
				wrapper => {
					notStrictEqual(textline.query(wrapper).errorMessage, undefined);
				}
			);
		});
	});

	describe("when changing the empty switch", () => {
		const emptySwitch = emptySwitchFunctions(COLUMN_NAME);

		it("sets the `filterNull` value to true if its false", async () => {
			await changeFilterValueTest(
				models,
				COLUMN_NAME,
				emptySwitch.triggerChange(true),
				{
					filterRange: null,
					filterNull: true
				},
				undefined,
				undefined,
				{ filterRange: null, filterNull: false }
			);
		});

		it("keep existing filter values when changing `filterNull`", async () => {
			await changeFilterValueTest(
				models,
				COLUMN_NAME,
				emptySwitch.triggerChange(true),
				{
					filterRange: { data: [new Date("2022-01-01"), new Date("2022-01-05")] },
					filterNull: true
				},
				undefined,
				undefined,
				{
					filterRange: { data: [new Date("2022-01-01"), new Date("2022-01-05")] },
					filterNull: false
				}
			);
		});

		it("sets the `filterNull` value to true if it doesn't exist", async () => {
			await changeFilterValueTest(models, COLUMN_NAME, emptySwitch.triggerChange(true), {
				filterRange: null,
				filterNull: true
			});
		});

		it("clears the `filterNull` value when it is true", async () => {
			clearFilterValueTest(
				models,
				COLUMN_NAME,
				{ filterRange: null, filterNull: true },
				emptySwitch.triggerChange(false)
			);
		});

		it("does not clear the filter when other filter values exist", async () => {
			await changeFilterValueTest(
				models,
				COLUMN_NAME,
				emptySwitch.triggerChange(false),
				{
					filterRange: { data: [new Date("2022-01-01"), new Date("2022-01-05")] },
					filterNull: false
				},
				undefined,
				undefined,
				{
					filterRange: { data: [new Date("2022-01-01"), new Date("2022-01-05")] },
					filterNull: true
				}
			);
		});
	});

	describe("shows the right rows", () => {
		const COLUMN_PATH = createModelPath(...REPEAT_MODEL_PATH, COLUMN_NAME);
		const rows: RepeatRow[] = setupArrayFixture(() => {
			const createRowForDateRange = (rowIndex: number, value: Date[] | null) => {
				return createRow(COLUMN_PATH, "L1_DateRange_InterpretationOfYear", rowIndex, value);
			};
			return [
				createRowForDateRange(0, [
					new Date("2022-01-01T00:00:00.000Z"),
					new Date("2022-01-03T00:00:00.000Z")
				]),
				createRowForDateRange(1, [
					new Date("2021-12-01T00:00:00.000Z"),
					new Date("2022-01-03T00:00:00.000Z")
				]),
				createRowForDateRange(2, [
					new Date("2022-01-01T00:00:00.000Z"),
					new Date("2022-01-10T00:00:00.000Z")
				]),
				createRowForDateRange(3, null),
				createRowForDateRange(4, null)
			];
		});

		it("filters the rows by empty value when `filterNull` is set", () => {
			deepStrictEqual(
				filterRows(
					rows,
					{
						[COLUMN_NAME]: {
							columnPath: COLUMN_PATH,
							filter: { to: null, from: null, filterNull: true }
						}
					},
					models.formModel,
					models.documentModel
				).map(r => r.rowIndexInDocument),
				[3, 4]
			);
		});

		it("filters the rows by the filter value", () => {
			deepStrictEqual(
				filterRows(
					rows,
					{
						[COLUMN_NAME]: {
							columnPath: COLUMN_PATH,
							filter: {
								filterRange: { data: [new Date("2022-01-01"), new Date("2022-01-05")] }
							}
						}
					},
					models.formModel,
					models.documentModel
				).map(r => r.rowIndexInDocument),
				[0]
			);
		});
	});
}
