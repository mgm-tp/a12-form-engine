// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { SummaryResult } from "../../../../../../data/internal/calculateSummaryResult.js";

import type { RepeatRow } from "./tableColumnTypes.js";

/** @internal */
export interface Data {
	readonly rows: RepeatRow[];
}

/** @internal */
export interface PaginatedRepeatData {
	readonly rows: ReadonlyArray<RepeatRow>;
	readonly totalNumberOfPages: number;
	readonly totalNumberOfRows: number;
	readonly pageNumber: number;
	readonly newRowShown?: boolean;
	readonly summaryResult?: SummaryResult;
}
