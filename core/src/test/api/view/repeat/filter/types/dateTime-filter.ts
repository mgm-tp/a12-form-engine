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

import { deepStrictEqual, notStrictEqual } from "node:assert/strict";

import type { FilterParseError, Models } from "../../../../../../back-end/store/internal/store.js";
import type { RepeatRow } from "../../../../../../view/internal/components/form-engine/repeat/components/tableColumnTypes.js";
import { filterRows } from "../../../../../../view/internal/utilities/filtering.js";
import { setupArrayFixture } from "../../../../../utils/setupFixture.js";
import { createModelPath } from "../../../../../utils/createModelPath.js";

import { emptySwitchFunctions } from "../filter-functions/empty-switch.js";
import { textLineRangeFunctions } from "../filter-functions/textline-range-filter.js";
import {
	changeFilterValueTest,
	clearFilterValueTest,
	disabledFilterTest,
	readonlyFilterTest,
	REPEAT_MODEL_PATH
} from "../filter.utils.js";

import { createRow } from "./utils.js";

export function describeTestForDateTimeFilter(models: Models, timeZoneModels: Models): void {
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

	const COLUMN_NAME = "fieldbasedrepeatoverviewcolumn-98625";

	const COLUMN_NAME_TIMEZONE = "fieldbasedrepeatoverviewcolumn-ecd0a";

	const textlineRange = textLineRangeFunctions(COLUMN_NAME);
	const textlineRangeTZ = textLineRangeFunctions(COLUMN_NAME_TIMEZONE);

	it("is disabled when the disable state is true", () => {
		disabledFilterTest(models, textlineRange.queryAll, 2);
	});

	it("is not readonly when the readonly state is true", () => {
		readonlyFilterTest(models, textlineRange.queryAll, 2);
	});

	describe("change the `to` value", () => {
		describe("with timezone === 'UTC'", () => {
			it("changes the filter value when the input is not empty", async () => {
				await changeFilterValueTest(
					models,
					COLUMN_NAME,
					textlineRange.triggerChange("to", "08/13/1990 06:00 PM"),
					{ from: null, to: { data: new Date("1990-08-13T18:00:00.000Z") } }
				);
			});
		});

		describe("with timezone === 'Europe/Berlin'", () => {
			it("changes the filter value when the input is not empty", async () => {
				await changeFilterValueTest(
					timeZoneModels,
					COLUMN_NAME_TIMEZONE,
					textlineRangeTZ.triggerChange("to", "08/13/1990 06:00 PM"),
					{ from: null, to: { data: new Date("1990-08-13T16:00:00.000Z") } },
					undefined,
					true
				);
			});
		});

		it("clears the filter value if the input is empty", async () => {
			await clearFilterValueTest(
				models,
				COLUMN_NAME,
				{ from: null, to: { data: new Date("1990-08-13T18:00:00.000Z") } },
				textlineRange.triggerChange("to", "")
			);
		});

		it("shows an error message on invalid value", async () => {
			await changeFilterValueTest(
				models,
				COLUMN_NAME,
				textlineRange.triggerChange("to", "abc"),
				{ from: null, to: { message: ERROR_MESSAGE } },
				wrapper => {
					notStrictEqual(textlineRange.query("to")(wrapper).errorMessage, undefined);
				}
			);
		});
	});

	describe("change the `from` value", () => {
		describe("with timezone === 'UTC'", () => {
			it("changes the filter value when the input is not empty", async () => {
				await changeFilterValueTest(
					models,
					COLUMN_NAME,
					textlineRange.triggerChange("from", "08/13/1990 06:00 PM"),
					{ from: { data: new Date("1990-08-13T18:00:00.000Z") }, to: null }
				);
			});
		});

		describe("with timezone === 'Europe/Berlin'", () => {
			it("changes the filter value when the input is not empty", async () => {
				await changeFilterValueTest(
					timeZoneModels,
					COLUMN_NAME_TIMEZONE,
					textlineRangeTZ.triggerChange("from", "08/13/1990 06:00 PM"),
					{ from: { data: new Date("1990-08-13T16:00:00.000Z") }, to: null },
					undefined,
					true
				);
			});
		});

		it("clears the filter value if the input is empty", async () => {
			await clearFilterValueTest(
				models,
				COLUMN_NAME,
				{ from: { data: new Date("1990-08-13T18:00:00.000Z") }, to: null },
				textlineRange.triggerChange("from", "")
			);
		});

		it("shows an error message on invalid value", async () => {
			await changeFilterValueTest(
				models,
				COLUMN_NAME,
				textlineRange.triggerChange("from", "abc"),
				{ from: { message: ERROR_MESSAGE }, to: null },
				wrapper => {
					notStrictEqual(textlineRange.query("from")(wrapper).errorMessage, undefined);
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
			const createRowForDateTime = (rowIndex: number, value: Date | null) => {
				return createRow(COLUMN_PATH, "L1_DateTime", rowIndex, value);
			};
			return [
				createRowForDateTime(0, new Date("2019-05-14T06:00:00.000Z")),
				createRowForDateTime(1, new Date("2019-05-13T08:00:00.000Z")),
				createRowForDateTime(2, new Date("2019-05-15T13:25:00.000Z")),
				createRowForDateTime(3, null),
				createRowForDateTime(4, new Date("2021-05-15T13:25:00.000Z"))
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
							filter: { to: { data: new Date("2019-05-14T05:00:00.000Z") }, from: null }
						}
					},
					models.formModel,
					models.documentModel
				).map(r => r.rowIndexInDocument),
				[1]
			);
		});

		it("filters the rows by the `from` value", () => {
			deepStrictEqual(
				filterRows(
					rows,
					{
						[COLUMN_NAME]: {
							columnPath: COLUMN_PATH,
							filter: { to: null, from: { data: new Date("2019-05-14T02:00:00.000Z") } }
						}
					},
					models.formModel,
					models.documentModel
				).map(r => r.rowIndexInDocument),
				[0, 2, 4]
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
								to: { data: new Date("2019-05-14T22:00:00.000Z") },
								from: { data: new Date("2019-05-13T06:00:00.000Z") }
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
								to: { data: new Date("2019-05-14T05:00:00.000Z") },
								from: { message: ERROR_MESSAGE }
							}
						}
					},
					models.formModel,
					models.documentModel
				).map(r => r.rowIndexInDocument),
				[1]
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
								from: { data: new Date("2019-05-14T02:00:00.000Z") }
							}
						}
					},
					models.formModel,
					models.documentModel
				).map(r => r.rowIndexInDocument),
				[0, 2, 4]
			);
		});
	});
}
