// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
