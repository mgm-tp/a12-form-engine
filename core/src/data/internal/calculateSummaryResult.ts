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

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";

import type { Mutable } from "../../back-end/utils/internal/types.js";
import type { FormModel } from "../../models/index.js";
import { isFormModelFieldOverviewColumn } from "../../models/internal/FormModelGuards.js";
import type { RepeatRow } from "../../view/internal/components/form-engine/repeat/components/tableColumnTypes.js";

/** @internal */
export interface SummaryResult {
	readonly [columnId: string]: number | undefined;
}

/** @internal */
export function calculateSummaryResult(
	repeatColumns: readonly FormModel.RepeatOverviewColumn[],
	rowData: readonly RepeatRow[]
): SummaryResult {
	return repeatColumns.reduce((summaryResult, column) => {
		return isFormModelFieldOverviewColumn(column) && column.showSummary
			? {
					...summaryResult,
					[column.id]: calculateSumForColumn(column, rowData)
				}
			: summaryResult;
	}, {} as Mutable<SummaryResult>);
}

function calculateSumForColumn(
	fieldColumn: FormModel.FieldOverviewColumn,
	rowData: readonly RepeatRow[]
): number | undefined {
	return rowData.reduce(
		(sum, repeatRow) => {
			const v = repeatRow.values.find(v => ModelPath.equal(v.path, fieldColumn.elementPath));

			return typeof v?.data === "number" ? (sum ?? 0) + v.data : sum;
		},
		undefined as number | undefined
	);
}
