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

import type { Locale } from "@com.mgmtp.a12.utils/utils-localization";

import type { Models } from "../../../../../../back-end/store/internal/store.js";
import type { RepeatRow } from "../../../../../../view/internal/components/form-engine/repeat/components/tableColumnTypes.js";
import { sort } from "../../../../../../view/internal/utilities/sorting.js";
import { setupArrayFixture } from "../../../../../utils/setupFixture.js";
import { IR } from "../../../../../utils/test-model-helpers/inline.repeat.js";
import { REPEAT_MODEL_PATH } from "../../filter/filter.utils.js";
import { createModelPath } from "../../../../../utils/createModelPath.js";

import { createRow } from "./utils.js";

export function executeTestForStringSorting(models: Models, locale: Locale): void {
	const COLUMN_PATH = createModelPath(
		...REPEAT_MODEL_PATH,
		IR.SortingAndFiltering.ID_L1_STRING_COLUMN
	);
	const string_asc_sorting_order = [null, "row 1", "row 11", "Row 2", "row 3", "Row 4"];

	const rows: RepeatRow[] = setupArrayFixture(() => {
		const createRowForNumber = (rowIndex: number, value: string | null) => {
			return createRow(COLUMN_PATH, "L1_String", rowIndex, value);
		};
		return [
			createRowForNumber(0, "row 3"),
			createRowForNumber(1, "Row 4"),
			createRowForNumber(2, null),
			createRowForNumber(3, "row 11"),
			createRowForNumber(5, "Row 2"),
			createRowForNumber(6, "row 1")
		];
	});

	it("sorts the table in ascending order", () => {
		const sortedRows = sort(
			rows,
			COLUMN_PATH,
			locale,
			models.formModel,
			models.documentModel,
			"asc"
		);
		deepStrictEqual(
			sortedRows.map(r => r.values[0].data),
			string_asc_sorting_order
		);
	});

	it("sorts the table in descending order", () => {
		const sortedRows = sort(
			rows,
			COLUMN_PATH,
			locale,
			models.formModel,
			models.documentModel,
			"desc"
		);
		deepStrictEqual(
			sortedRows.map(r => r.values[0].data),
			string_asc_sorting_order.reverse()
		);
	});

	it("returns original order of rows if no sorting order is given", () => {
		deepStrictEqual(sort(rows, COLUMN_PATH, locale, models.formModel, models.documentModel), rows);
	});
}
