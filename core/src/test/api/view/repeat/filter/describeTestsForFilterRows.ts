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

import { deepStrictEqual, strictEqual } from "node:assert/strict";

import type { Models } from "../../../../../back-end/store/index.js";
import type { RepeatRow } from "../../../../../view/internal/components/form-engine/repeat/components/tableColumnTypes.js";
import { filterRows } from "../../../../../view/internal/utilities/filtering.js";
import { createModelPath } from "../../../../utils/createModelPath.js";
import { setupArrayFixture } from "../../../../utils/setupFixture.js";
import { IR } from "../../../../utils/test-model-helpers/inline.repeat.js";
import { createDocumentPath } from "../../../../utils/createDocumentPath.js";

import { REPEAT_MODEL_PATH } from "./filter.utils.js";

export function describeTestsForFilterRows(models: Models) {
	const stringColumnPath = createModelPath(
		...REPEAT_MODEL_PATH,
		IR.SortingAndFiltering.ID_L1_STRING_COLUMN
	);
	const numberColumnPath = createModelPath(
		...REPEAT_MODEL_PATH,
		IR.SortingAndFiltering.ID_L1_NUMBER_COLUMN
	);

	const rows: RepeatRow[] = setupArrayFixture(() => {
		const createRow = (rowIndex: number, stringValue: string, numberValue: number) => {
			const rowPath = createDocumentPath(["Root"], ["Nested_L1", rowIndex + 1]);

			return {
				path: rowPath,
				rowIndexInDocument: rowIndex,
				values: [
					{
						data: stringValue,
						path: [...rowPath, ...createDocumentPath(["L1_String"])],
						formModelPath: stringColumnPath,
						ui: ""
					},
					{
						data: numberValue,
						path: [...rowPath, ...createDocumentPath(["L1_Number"])],
						formModelPath: numberColumnPath,
						ui: ""
					}
				]
			};
		};

		return [
			createRow(0, "Row 2", 11),
			createRow(1, "row 1", 5),
			createRow(2, "row 3", 2),
			createRow(3, "Row 11", -4)
		];
	});

	it("does not filter the rows if no filter exists", () => {
		strictEqual(filterRows(rows, {}, models.formModel, models.documentModel), rows);
	});

	it("filters the rows by matching the filter word", () => {
		deepStrictEqual(
			filterRows(
				rows,
				{
					[IR.SortingAndFiltering.ID_L1_STRING_COLUMN]: {
						columnPath: stringColumnPath,
						filter: { filterValue: "Row 1" }
					},
					[IR.SortingAndFiltering.ID_L1_NUMBER_COLUMN]: {
						columnPath: numberColumnPath,
						filter: { to: { data: 3 }, from: null }
					}
				},
				models.formModel,
				models.documentModel
			).map(r => r.rowIndexInDocument),
			[3]
		);
	});
}
