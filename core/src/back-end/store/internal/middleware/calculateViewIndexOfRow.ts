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
