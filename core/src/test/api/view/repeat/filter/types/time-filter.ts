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
import { TimePickerRangeFunctions } from "../filter-functions/timepicker-range-filter.js";
import {
	changeFilterValueTest,
	clearFilterValueTest,
	disabledFilterTest,
	readonlyFilterTest,
	REPEAT_MODEL_PATH
} from "../filter.utils.js";

import { createRow } from "./utils.js";

const { createModelPath } = ModelHelpers;

export function describeTestForTimeFilter(models: Models, timeZoneModels: Models): void {
	const ERROR_MESSAGE: FilterParseError = {
		type: "FilterParseError",
		error: {
			errorCode: "datumFormatFalsch",
			errorKey: "kernel.formalErrors.DATUM_FORMAT",
			errorText: {
				key: "foo",
				defaults: { en: "Only dates in the format '$dateFormat$' are allowed." }
			},
			severity: "ERROR"
		},
		value: "abc"
	};

	it("is disabled when the disable state is true", () => {
		disabledFilterTest(models, timepickerRange.queryAll, 2);
	});

	it("is not readonly when the readonly state is true", () => {
		readonlyFilterTest(models, timepickerRange.queryAll, 2);
	});

	const COLUMN_NAME = "fieldbasedrepeatoverviewcolumn-35944";

	const COLUMN_NAME_TIMEZONE = "fieldbasedrepeatoverviewcolumn-8669f";

	const timepickerRange = TimePickerRangeFunctions(COLUMN_NAME);
	const timepickerRangeTZ = TimePickerRangeFunctions(COLUMN_NAME_TIMEZONE);

	describe("change the `to` value", () => {
		describe("with timezone === 'UTC'", () => {
			it("changes the filter value when the input is not empty", async () => {
				const value = new Date("1970-01-01T18:00:00.000Z");

				await changeFilterValueTest(
					models,
					COLUMN_NAME,
					timepickerRange.triggerChange("to", value),
					{
						from: null,
						to: { data: value }
					}
				);
			});
		});

		describe("with timezone === 'Europe/Berlin'", () => {
			it("changes the filter value when the input is not empty", async () => {
				const value = new Date("1970-01-01T17:00:00.000Z");

				await changeFilterValueTest(
					timeZoneModels,
					COLUMN_NAME_TIMEZONE,
					timepickerRangeTZ.triggerChange("to", value),
					{ from: null, to: { data: value } },
					undefined,
					true
				);
			});
		});

		it("clears the filter value if the input is empty", async () => {
			await clearFilterValueTest(
				models,
				COLUMN_NAME,
				{ from: null, to: { data: new Date("1970-01-01T18:00:00.000Z") } },
				timepickerRange.triggerChange("to", undefined)
			);
		});

		it("shows an error message on invalid value", async () => {
			await changeFilterValueTest(
				models,
				COLUMN_NAME,
				timepickerRange.triggerValidate("to", "abc"),
				{ from: null, to: { message: ERROR_MESSAGE } },
				wrapper => {
					notStrictEqual(timepickerRange.query("to")(wrapper).errorMessage, undefined);
				}
			);
		});
	});

	describe("change the `from` value", () => {
		describe("with timezone === 'UTC'", () => {
			it("changes the filter value when the input is not empty", async () => {
				const date = new Date("1970-01-01T18:00:00.000Z");
				await changeFilterValueTest(
					models,
					COLUMN_NAME,
					timepickerRange.triggerChange("from", date),
					{ from: { data: date }, to: null }
				);
			});
		});

		describe("with timezone === 'Europe/Berlin'", () => {
			it("changes the filter value when the input is not empty", async () => {
				const date = new Date("1970-01-01T17:00:00.000Z");
				await changeFilterValueTest(
					timeZoneModels,
					COLUMN_NAME_TIMEZONE,
					timepickerRangeTZ.triggerChange("from", date),
					{ from: { data: date }, to: null },
					undefined,
					true
				);
			});
		});

		it("clears the filter value if the input is empty", async () => {
			await clearFilterValueTest(
				models,
				COLUMN_NAME,
				{ from: { data: new Date("1970-01-01T18:00:00.000Z") }, to: null },
				timepickerRange.triggerChange("from", undefined)
			);
		});

		it("shows an error message on invalid value", async () => {
			await changeFilterValueTest(
				models,
				COLUMN_NAME,
				timepickerRange.triggerValidate("from", "abc"),
				{ from: { message: ERROR_MESSAGE }, to: null },
				wrapper => {
					notStrictEqual(timepickerRange.query("from")(wrapper).errorMessage, undefined);
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
					from: null,
					to: null,
					filterNull: true
				},
				undefined,
				undefined,
				{ from: null, to: null, filterNull: false }
			);
		});

		it("keep existing filter values when changing `filterNull`", async () => {
			await changeFilterValueTest(
				models,
				COLUMN_NAME,
				emptySwitch.triggerChange(true),
				{
					from: { data: new Date("1990-08-13T00:00:00.000Z") },
					to: { data: new Date("1990-08-14T00:00:00.000Z") },
					filterNull: true
				},
				undefined,
				undefined,
				{
					from: { data: new Date("1990-08-13T00:00:00.000Z") },
					to: { data: new Date("1990-08-14T00:00:00.000Z") },
					filterNull: false
				}
			);
		});

		it("sets the `filterNull` value to true if it doesn't exist", async () => {
			await changeFilterValueTest(models, COLUMN_NAME, emptySwitch.triggerChange(true), {
				from: null,
				to: null,
				filterNull: true
			});
		});

		it("clears the `filterNull` value when it is true", async () => {
			clearFilterValueTest(
				models,
				COLUMN_NAME,
				{ from: null, to: null, filterNull: true },
				emptySwitch.triggerChange(false)
			);
		});

		it("does not clear the filter when other filter values exist", async () => {
			await changeFilterValueTest(
				models,
				COLUMN_NAME,
				emptySwitch.triggerChange(false),
				{
					from: { data: new Date("1990-08-13T00:00:00.000Z") },
					to: { data: new Date("1990-08-14T00:00:00.000Z") },
					filterNull: false
				},
				undefined,
				undefined,
				{
					from: { data: new Date("1990-08-13T00:00:00.000Z") },
					to: { data: new Date("1990-08-14T00:00:00.000Z") },
					filterNull: true
				}
			);
		});
	});

	describe("shows the right rows", () => {
		const COLUMN_PATH = createModelPath(...REPEAT_MODEL_PATH, COLUMN_NAME);

		const rows: RepeatRow[] = setupArrayFixture(() => {
			const createRowForTime = (rowIndex: number, value: Date | null) => {
				return createRow(COLUMN_PATH, "L1_DateTime", rowIndex, value);
			};
			return [
				createRowForTime(0, new Date("1970-01-01T08:25:00.000Z")),
				createRowForTime(1, new Date("1970-01-01T06:10:00.000Z")),
				createRowForTime(2, new Date("1970-01-01T18:10:00.000Z")),
				createRowForTime(3, null)
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
				[3]
			);
		});

		it("filters the rows by the `to` value", () => {
			deepStrictEqual(
				filterRows(
					rows,
					{
						[COLUMN_NAME]: {
							columnPath: COLUMN_PATH,
							filter: { to: { data: new Date("1970-01-01T18:00:00.000Z") }, from: null }
						}
					},
					models.formModel,
					models.documentModel
				).map(r => r.rowIndexInDocument),
				[0, 1]
			);
		});

		it("filters the rows by the `from` value", () => {
			deepStrictEqual(
				filterRows(
					rows,
					{
						[COLUMN_NAME]: {
							columnPath: COLUMN_PATH,
							filter: { to: null, from: { data: new Date("1970-01-01T08:00:00.000Z") } }
						}
					},
					models.formModel,
					models.documentModel
				).map(r => r.rowIndexInDocument),
				[0, 2]
			);
		});

		it("filters the rows by the `from` and `to` value", () => {
			deepStrictEqual(
				filterRows(
					rows,
					{
						[COLUMN_NAME]: {
							columnPath: COLUMN_PATH,
							filter: {
								to: { data: new Date("1970-01-01T18:00:00.000Z") },
								from: { data: new Date("1970-01-01T06:00:00.000Z") }
							}
						}
					},
					models.formModel,
					models.documentModel
				).map(r => r.rowIndexInDocument),
				[0, 1]
			);
		});

		it("filters the rows by the `to` value if the `from` value is invalid", () => {
			deepStrictEqual(
				filterRows(
					rows,
					{
						[COLUMN_NAME]: {
							columnPath: COLUMN_PATH,
							filter: {
								to: { data: new Date("1970-01-01T18:00:00.000Z") },
								from: { message: ERROR_MESSAGE }
							}
						}
					},
					models.formModel,
					models.documentModel
				).map(r => r.rowIndexInDocument),
				[0, 1]
			);
		});

		it("filters the rows by the `from` value if the `to` value is invalid", () => {
			deepStrictEqual(
				filterRows(
					rows,
					{
						[COLUMN_NAME]: {
							columnPath: COLUMN_PATH,
							filter: {
								to: { message: ERROR_MESSAGE },
								from: { data: new Date("1970-01-01T08:00:00.000Z") }
							}
						}
					},
					models.formModel,
					models.documentModel
				).map(r => r.rowIndexInDocument),
				[0, 2]
			);
		});
	});
}
