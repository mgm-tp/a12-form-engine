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

import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { UiId } from "../../../../../../../back-end/utils/internal/generateUiId.js";
import { isFormModelInlineRepeat } from "../../../../../../../models/index.js";
import type { FormModel } from "../../../../../../../models/internal/form-model.js";

import type { RepeatRow } from "../tableColumnTypes.js";

/**
 * @internal
 *
 * When a screen reader column is modeled, returns the id of the cell
 * that will be used by screen readers to provide context for row actions.
 */
export function getScreenReaderCellId(
	repeat: FormModel.Repeat,
	rowOrPath: RepeatRow | EntityInstancePath,
	uiIdPrefix?: string
): string | undefined {
	const rowIndex =
		"rowIndexInDocument" in rowOrPath
			? rowOrPath.rowIndexInDocument
			: getRowIndexFromPath(rowOrPath);

	if (!repeat.screenReaderColumnRef) {
		return undefined;
	}

	if (rowIndex === undefined) {
		return undefined;
	}

	return isFormModelInlineRepeat(repeat)
		? UiId.generateForRepeatOverviewColumn({
				id: repeat.screenReaderColumnRef,
				uiIdPrefix,
				rowIndex
			})
		: // ER/DR do not render FieldOverviewColumns, so we use the body cell instead
			UiId.generateForRepeatTableBodyCell({
				id: repeat.screenReaderColumnRef,
				uiIdPrefix,
				rowIndex
			});
}

// a path to a column must be a specific one and not empty (meaning index > 0)
// -1 is necessary since we want the index of the row in the document (0-based)
function getRowIndexFromPath(rowPath: EntityInstancePath): number | undefined {
	const last = rowPath.at(-1);

	return last && last.index > 0 ? last.index - 1 : undefined;
}
