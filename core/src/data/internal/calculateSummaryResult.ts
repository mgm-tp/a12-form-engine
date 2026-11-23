// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";

import type { Mutable } from "../../back-end/utils/internal/types.js";
import { FormModel } from "../../models/index.js";
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
		return FormModel.FieldOverviewColumn.isInstance(column) && column.showSummary
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
