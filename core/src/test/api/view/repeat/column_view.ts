// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { BaseColumnType } from "@com.mgmtp.a12.widgets/widgets-core/lib/table/new-api/column.api.js";
import type { TableProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/table/new-api/table.api.js";

import { assertNotNullish } from "../../../../client-extensions/internal/core/assertion.js";

export type ColumnViewHof = (query: () => TableProps) => (colLabel: string) => () => BaseColumnType;

export const ColumnByLabelView: ColumnViewHof = query => colLabel => () =>
	assertNotNullish(query().columns.find(LabelMatches(colLabel)));

const LabelMatches: (label: string) => (col: BaseColumnType) => boolean = label => col =>
	col.label === label;
