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

import type { ComponentType } from "react";

import type {
	Localizer,
	ValueConversion
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import type { InfiniteScrollOptions } from "@com.mgmtp.a12.widgets/widgets-core/lib/table/new-api/infinite-scroll.api.js";

import type { RepeatProps } from "../RepeatProps.js";

import type { TableStyleOptions } from "./TableStyleOptions.js";
import type { BodyRowProps } from "./body/RepeatBodyRow.js";
import type { BodyContentCellProps } from "./body/overviewBodyContentCell.js";
import type { PaginatedRepeatData } from "./repeat-data.js";
import type { DefaultRowActionResult } from "./row-actions/DefaultRowActionResult.js";
import type { RowActionButtonsProps } from "./row-actions/standard/StandardRowActionButtons.js";
import type { RepeatTableColumn } from "./tableColumnTypes.js";

/** @internal */
export interface RepeatTemplateProps extends RepeatProps {
	readonly defaultRowAction?: DefaultRowActionResult;
	readonly tableStyleOptions?: TableStyleOptions;

	readonly EditViewButton?: ComponentType<RowActionButtonsProps>;
	readonly ErrorHintButton?: ComponentType<RowActionButtonsProps>;

	readonly BodyContentCell: ComponentType<BodyContentCellProps>;

	readonly defaultColumnVerticalAlignment: "top" | "middle" | "bottom";
	readonly BodyRow: ComponentType<BodyRowProps>;

	readonly additionalLeftColumns?: RepeatTableColumn[];

	readonly dataRole: string;
}

/** @internal */
export interface RepeatTableProps extends RepeatTemplateProps {
	readonly uiId: string;
	readonly cardView?: boolean;
	readonly columns: RepeatTableColumn[];
	readonly processedData: PaginatedRepeatData;
	readonly totalNumberOfRows: number;
	readonly infiniteScrolling?: {
		readonly style: React.CSSProperties | undefined;
		readonly infiniteScrollOptions: InfiniteScrollOptions;
	};
	readonly localizer: Localizer;
	readonly converter: ValueConversion;
}
