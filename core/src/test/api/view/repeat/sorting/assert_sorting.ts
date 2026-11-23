// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { equal } from "node:assert/strict";

import type { SortOrder } from "@com.mgmtp.a12.widgets/widgets-core/lib/table/new-api/column.api.js";
import type { TableProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/table/new-api/table.api.js";

export type AssertSortingHof = (
	query: () => TableProps
) => (colLabel: string, sortOrder: SortOrder) => void;

export const AssertSorting: AssertSortingHof = query => (colLabel, sortOrder) => {
	const sortState = query().sortOptions?.sortState;
	equal(sortState?.column?.label, colLabel);
	equal(sortState?.order, sortOrder);
};
