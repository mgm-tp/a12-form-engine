// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type {
	Localizer,
	ValueConversion
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { RepeatData } from "../../../../data/internal/repeat.js";
import type { FormModel } from "../../../../models/index.js";
import type IExternalEnumerationProvider from "../../../services/external-enumeration-provider.js";

import type { EngineState } from "../store.js";

/**
 * @internal
 *
 * Calculates the index of a row in the document after filtering and sorting
 */
export function calculateViewIndexOfRow(
	repeat: FormModel.Repeat,
	repeatFormModelPath: ModelPath,
	repeatDocumentPath: EntityInstancePath,
	state: EngineState,
	converter: ValueConversion,
	localizer: Localizer,
	externalEnumerationProvider: IExternalEnumerationProvider,
	indexOfTouchedRow: number
): number | undefined {
	const rows = RepeatData.getRowsByPath({
		externalEnumerationProvider,
		converter,
		localizer,
		state,
		repeatDocumentPath,
		repeatFormModelPath,
		optimize: RepeatData.getOptimizationParameters(repeatFormModelPath, state)
	});

	const sortedAndFilteredRows = RepeatData.sortAndFilterData({
		data: rows,
		filterExpression: repeat.filterExpressionTree,
		includeNewRow: true,
		repeatFormModelPath,
		state
	});

	const rowIndex = sortedAndFilteredRows.findIndex(
		row => row.rowIndexInDocument === indexOfTouchedRow
	);

	return rowIndex >= 0 ? rowIndex : undefined;
}
