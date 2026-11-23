// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { deepStrictEqual } from "node:assert/strict";

import type { Locale } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type { Models } from "../../../../../../back-end/store/internal/store.js";
import type { RepeatRow } from "../../../../../../view/internal/components/form-engine/repeat/components/tableColumnTypes.js";
import { sort } from "../../../../../../view/internal/utilities/sorting.js";
import { ModelHelpers } from "../../../../../utils/model-helpers.js";
import { setupArrayFixture } from "../../../../../utils/setupFixture.js";
import { REPEAT_MODEL_PATH } from "../../filter/filter.utils.js";

import { createRow } from "./utils.js";

const { createModelPath } = ModelHelpers;

export function executeTestForBooleanSorting(models: Models, locale: Locale): void {
	const COLUMN_NAME = "fieldbasedrepeatoverviewcolumn-1ccd0";
	const COLUMN_PATH = createModelPath(...REPEAT_MODEL_PATH, COLUMN_NAME);
	const boolean_asc_sorting_order = [false, false, false, true, true];
	const rows: RepeatRow[] = setupArrayFixture(() => {
		const createRowForBoolean = (rowIndex: number, value: boolean | null, uiValue: string) => {
			return createRow(COLUMN_PATH, "L1_Boolean", rowIndex, value, uiValue);
		};
		return [
			createRowForBoolean(0, true, "true"),
			createRowForBoolean(1, false, "false"),
			createRowForBoolean(2, true, "true"),
			createRowForBoolean(3, false, "false"),
			createRowForBoolean(4, false, "false")
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
			boolean_asc_sorting_order
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
			boolean_asc_sorting_order.reverse()
		);
	});

	it("returns original order of rows if no sorting order is given", () => {
		deepStrictEqual(sort(rows, COLUMN_PATH, locale, models.formModel, models.documentModel), rows);
	});
}
