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
import { IR } from "../../../../../utils/test-model-helpers/inline.repeat.js";

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

const { createModelPath } = ModelHelpers;

export function describeTestForNumberFilter(models: Models): void {
	const COLUMN_NAME = IR.SortingAndFiltering.ID_L1_NUMBER_COLUMN;
	const textlineRange = textLineRangeFunctions(COLUMN_NAME);

	const ERROR_MESSAGE: FilterParseError = {
		type: "FilterParseError",
		error: {
			errorCode: "zahlHatUngueltigeZeichen",
			errorKey: "kernel.formalErrors.ZAHL_MIT_UNGUELTIGEN_ZEICHEN",
			errorText: { key: "", defaults: { en: "Only numbers are allowed." } },
			severity: "ERROR"
		},
		value: "abc"
	};

	it("is disabled when the disable state is true", () => {
		disabledFilterTest(models, textlineRange.queryAll, 2);
	});

	it("is not readonly when the readonly state is true", () => {
		readonlyFilterTest(models, textlineRange.queryAll, 2);
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
					from: { message: ERROR_MESSAGE },
					to: { data: 123 },
					filterNull: true
				},
				undefined,
				undefined,
				{
					from: { message: ERROR_MESSAGE },
					to: { data: 123 },
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
			await clearFilterValueTest(
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
					from: { message: ERROR_MESSAGE },
					to: { data: 123 },
					filterNull: false
				},
				undefined,
				undefined,
				{
					from: { message: ERROR_MESSAGE },
					to: { data: 123 },
					filterNull: true
				}
			);
		});
	});

	describe("change the `to` value", () => {
		it("changes the filter value when the input is not empty", async () => {
			await changeFilterValueTest(models, COLUMN_NAME, textlineRange.triggerChange("to", "123"), {
				from: null,
				to: { data: 123 }
			});
		});

		it("changes the filter value when the input is zero", async () => {
			await changeFilterValueTest(models, COLUMN_NAME, textlineRange.triggerChange("to", "0"), {
				from: null,
				to: { data: 0 }
			});
		});

		it("removes leading zeros from the input", async () => {
			await changeFilterValueTest(
				models,
				COLUMN_NAME,
				textlineRange.triggerChange("to", "0001230"),
				{
					from: null,
					to: { data: 1230 }
				}
			);

			await changeFilterValueTest(models, COLUMN_NAME, textlineRange.triggerChange("to", "0000"), {
				from: null,
				to: { data: 0 }
			});
		});

		it("clears the filter value if the input is empty", async () => {
			await clearFilterValueTest(
				models,
				COLUMN_NAME,
				{ from: null, to: { data: 0 } },
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
		it("changes the filter value when the input is not empty", async () => {
			await changeFilterValueTest(models, COLUMN_NAME, textlineRange.triggerChange("from", "123"), {
				from: { data: 123 },
				to: null
			});
		});

		it("changes the filter value when the input is zero", async () => {
			await changeFilterValueTest(models, COLUMN_NAME, textlineRange.triggerChange("from", "0"), {
				from: { data: 0 },
				to: null
			});
		});

		it("removes leading zeros from the input", async () => {
			await changeFilterValueTest(
				models,
				COLUMN_NAME,
				textlineRange.triggerChange("from", "0001230"),
				{
					to: null,
					from: { data: 1230 }
				}
			);

			await changeFilterValueTest(
				models,
				COLUMN_NAME,
				textlineRange.triggerChange("from", "0000"),
				{
					to: null,
					from: { data: 0 }
				}
			);
		});

		it("clears the filter value if the input is empty", async () => {
			await clearFilterValueTest(
				models,
				COLUMN_NAME,
				{ from: { data: 0 }, to: null },
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

	describe("shows the right rows", () => {
		const COLUMN_PATH = createModelPath(...REPEAT_MODEL_PATH, COLUMN_NAME);

		const rows: RepeatRow[] = setupArrayFixture(() => {
			const createRowForNumber = (rowIndex: number, value: string | number | null) => {
				return createRow(COLUMN_PATH, "L1_Number", rowIndex, value);
			};

			return [
				createRowForNumber(0, 19),
				createRowForNumber(1, -2),
				createRowForNumber(2, "005"),
				createRowForNumber(3, 3),
				createRowForNumber(4, 67.56),
				createRowForNumber(5, "001.2"),
				createRowForNumber(6, "0045.2"),
				createRowForNumber(7, "0000"),
				createRowForNumber(8, null)
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
				[8]
			);
		});

		it("filters the rows by the `to` value", () => {
			deepStrictEqual(
				filterRows(
					rows,
					{
						[COLUMN_NAME]: { columnPath: COLUMN_PATH, filter: { to: { data: 3 }, from: null } }
					},
					models.formModel,
					models.documentModel
				).map(r => r.rowIndexInDocument),
				[1, 3, 5, 7]
			);
		});

		it("filters the rows by the `from` value", () => {
			deepStrictEqual(
				filterRows(
					rows,
					{
						[COLUMN_NAME]: { columnPath: COLUMN_PATH, filter: { to: null, from: { data: 2 } } }
					},
					models.formModel,
					models.documentModel
				).map(r => r.rowIndexInDocument),
				[0, 2, 3, 4, 6]
			);
		});

		it("filters the rows by the `from` and `to` value", () => {
			deepStrictEqual(
				filterRows(
					rows,
					{
						[COLUMN_NAME]: {
							columnPath: COLUMN_PATH,
							filter: { to: { data: 20 }, from: { data: 3 } }
						}
					},
					models.formModel,
					models.documentModel
				).map(r => r.rowIndexInDocument),
				[0, 2, 3]
			);
		});

		it("filters the rows by the `to` value if the `from` value is invalid", () => {
			deepStrictEqual(
				filterRows(
					rows,
					{
						[COLUMN_NAME]: {
							columnPath: COLUMN_PATH,
							filter: { to: { data: 3 }, from: { message: ERROR_MESSAGE } }
						}
					},
					models.formModel,
					models.documentModel
				).map(r => r.rowIndexInDocument),
				[1, 3, 5, 7]
			);
		});

		it("filters the rows by the `from` value if the `to` value is invalid", () => {
			deepStrictEqual(
				filterRows(
					rows,
					{
						[COLUMN_NAME]: {
							columnPath: COLUMN_PATH,
							filter: { to: { message: ERROR_MESSAGE }, from: { data: 2 } }
						}
					},
					models.formModel,
					models.documentModel
				).map(r => r.rowIndexInDocument),
				[0, 2, 3, 4, 6]
			);
		});
	});
}
