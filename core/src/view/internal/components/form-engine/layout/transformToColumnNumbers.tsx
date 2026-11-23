// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { LayoutGridProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/layout/layout-grid/main/layout-grid.api.js";

/**
 * Transforms a layout string to a ColumnNumber array
 * @internal
 * @param layoutString A layout string from the form model in the form 'n_1-n_2-..-n_m'. Can be undefined.
 * @returns The numbers of the layout string as ColumnNumber array or undefined if the layoutString was undefined
 */
export function transformToColumnNumbers(
	layoutString?: string
): LayoutGridProps.ColumnNumber[] | undefined {
	return layoutString
		? (layoutString.split("-").map(Number) as LayoutGridProps.ColumnNumber[])
		: undefined;
}
