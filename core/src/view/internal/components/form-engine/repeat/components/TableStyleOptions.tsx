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

import { FormModel } from "../../../../../../models/internal/form-model.js";

/** @internal */
export interface TableStyleOptions {
	readonly infiniteScrolling?: boolean;
	readonly tableHeight?: number;
	readonly rowHeight?: number;
	readonly actionColumnWidth?: number;
}

/**
 * Returns the InfiniteScrollingOptions for `repeat`, if enabled.
 * `cardHeight` is used instead of `rowHeight` only if it exists and cardView is enabled.
 * @internal
 */
export function getTableStyleOptions(
	repeat: FormModel.InlineRepeat | FormModel.DetachedRepeat | FormModel.EmbeddedRepeat,
	useCardView?: boolean
): TableStyleOptions | undefined {
	const rowHeight =
		repeat.tableStyle?.cardHeight && useCardView
			? repeat.tableStyle.cardHeight
			: repeat.tableStyle?.rowHeight;

	const infiniteScrolling =
		FormModel.InlineRepeat.isInstance(repeat) || FormModel.DetachedRepeat.isInstance(repeat)
			? repeat.infiniteScrolling
			: undefined;

	return infiniteScrolling && repeat.tableStyle?.tableHeight && repeat.tableStyle?.rowHeight
		? {
				infiniteScrolling: infiniteScrolling,
				tableHeight: repeat.tableStyle.tableHeight,
				rowHeight,
				actionColumnWidth: repeat.tableStyle?.actionColumnWidth
			}
		: !infiniteScrolling
			? {
					rowHeight,
					actionColumnWidth: repeat.tableStyle?.actionColumnWidth
				}
			: undefined;
}
