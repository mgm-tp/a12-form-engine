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

export function executeTestForDateTimeSorting(models: Models, locale: Locale): void {
	const COLUMN_NAME = "fieldbasedrepeatoverviewcolumn-98625";

	const COLUMN_PATH = createModelPath(...REPEAT_MODEL_PATH, COLUMN_NAME);
	const date_asc_sorting_order = [
		null,
		null,
		new Date("2019-05-13T08:00:00.000Z"),
		new Date("2019-05-14T06:00:00.000Z"),
		new Date("2019-05-15T13:25:00.000Z")
	];

	const rows: RepeatRow[] = setupArrayFixture(() => {
		const createRowForDateTime = (rowIndex: number, value: Date | null) => {
			return createRow(COLUMN_PATH, "L1_DateTime", rowIndex, value);
		};
		return [
			createRowForDateTime(0, new Date("2019-05-15T13:25:00.000Z")),
			createRowForDateTime(1, new Date("2019-05-14T06:00:00.000Z")),
			createRowForDateTime(2, null),
			createRowForDateTime(3, new Date("2019-05-13T08:00:00.000Z")),
			createRowForDateTime(4, null)
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
			date_asc_sorting_order
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
			date_asc_sorting_order.reverse()
		);
	});

	it("returns original order of rows if no sorting order is given", () => {
		deepStrictEqual(sort(rows, COLUMN_PATH, locale, models.formModel, models.documentModel), rows);
	});
}
