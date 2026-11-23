// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { UiId } from "../../../../../../../back-end/utils/internal/generateUiId.js";
import { FormModel } from "../../../../../../../models/internal/form-model.js";

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

	return repeat.screenReaderColumnRef && rowIndex !== undefined
		? FormModel.InlineRepeat.isInstance(repeat)
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
				})
		: undefined;
}

// a path to a column must be a specific one and not empty (meaning index > 0)
// -1 is necessary since we want the index of the row in the document (0-based)
function getRowIndexFromPath(rowPath: EntityInstancePath): number | undefined {
	const last = rowPath.at(-1);

	return last && last.index > 0 ? last.index - 1 : undefined;
}
