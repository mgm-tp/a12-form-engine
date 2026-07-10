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
import { setupArrayFixture, setupFixture } from "../../../../../utils/setupFixture.js";
import { REPEAT_MODEL_PATH } from "../../filter/filter.utils.js";
import { createModelPath } from "../../../../../utils/createModelPath.js";
import { loadData } from "../../../../../utils/setup.js";

import { getData, getRows } from "./utils.js";

export function executeTestForExpressionSorting(models: Models, locale: Locale): void {
	const COLUMN_NAME = "L1_Expression";
	const COLUMN_ID = "expressionrepeatoverviewcolumn-4ed39";
	const COLUMN_PATH = createModelPath(...REPEAT_MODEL_PATH, COLUMN_NAME);

	const fixture = setupFixture(() => ({
		document: loadData("repeat", "data", models.documentModel)
	}));

	const rows: ReadonlyArray<RepeatRow> = setupArrayFixture(() =>
		getRows(models, fixture.document, locale, undefined, COLUMN_ID, "en")
	);

	const expression_asc_sorting_order = [
		"",
		"<p><strong>row 1</strong> ➡ 10</p>\n",
		"<p><strong>row 11</strong> ➡ 1</p>\n",
		"<p><strong>Row 2</strong> ➡ 2</p>\n",
		"<p><strong>row 3</strong> ➡ 3</p>\n",
		"<p><strong>Row 4</strong> ➡ </p>\n"
	];

	it("sorts the table in ascending order using the current locale", () => {
		const sortedRows = sort(
			rows,
			COLUMN_PATH,
			locale,
			models.formModel,
			models.documentModel,
			"asc"
		);
		deepStrictEqual(
			sortedRows.map(r => getData(r, COLUMN_NAME)),
			expression_asc_sorting_order
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
			sortedRows.map(r => getData(r, COLUMN_NAME)),
			expression_asc_sorting_order.reverse()
		);
	});

	it("returns original order of rows if no sorting order is given", () => {
		deepStrictEqual(sort(rows, COLUMN_PATH, locale, models.formModel, models.documentModel), rows);
	});
}
