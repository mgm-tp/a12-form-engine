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

import type { Locale } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type { Models } from "../../../../../../back-end/store/internal/store.js";
import type { RepeatRow } from "../../../../../../view/internal/components/form-engine/repeat/components/tableColumnTypes.js";
import { sort } from "../../../../../../view/internal/utilities/sorting.js";
import { ModelHelpers } from "../../../../../utils/model-helpers.js";
import { setupArrayFixture } from "../../../../../utils/setupFixture.js";
import { IR } from "../../../../../utils/test-model-helpers/inline.repeat.js";
import { REPEAT_MODEL_PATH } from "../../filter/filter.utils.js";

import { createRow } from "./utils.js";

const { createModelPath } = ModelHelpers;

export function executeTestForEnumerationSorting(models: Models, locale: Locale): void {
	const COLUMN_PATH = createModelPath(
		...REPEAT_MODEL_PATH,
		IR.SortingAndFiltering.ID_L1_ENUM_COLUMN
	);
	// V1: red, V2: yellow, V3: green
	const enumeration_asc_sorting_order = [null, "V3", "V3", "V1", "V2", "V2"];

	const rows: RepeatRow[] = setupArrayFixture(() => {
		const createRowForEnumeration = (rowIndex: number, value: string | null, uiValue: string) => {
			return createRow(COLUMN_PATH, "L1_Enumeration", rowIndex, value, uiValue);
		};
		return [
			createRowForEnumeration(0, "V2", "yellow"),
			createRowForEnumeration(1, null, ""),
			createRowForEnumeration(2, "V3", "green"),
			createRowForEnumeration(3, "V1", "red"),
			createRowForEnumeration(4, "V2", "yellow"),
			createRowForEnumeration(4, "V3", "green")
		];
	});

	it("sorts the table in ascending order by the ui value", () => {
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
			enumeration_asc_sorting_order
		);
	});

	it("sorts the table in descending order by the ui value", () => {
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
			enumeration_asc_sorting_order.reverse()
		);
	});

	it("returns original order of rows if no sorting order is given", () => {
		deepStrictEqual(sort(rows, COLUMN_PATH, locale, models.formModel, models.documentModel), rows);
	});
}
