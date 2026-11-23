// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ComponentType } from "react";

import type {
	Localizer,
	ValueConversion
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import type { InfiniteScrollOptions } from "@com.mgmtp.a12.widgets/widgets-core/lib/table/new-api/infinite-scroll.api.js";

import type { RepeatProps } from "../RepeatProps.js";

import type { BodyContentCellProps } from "./body/overviewBodyContentCell.js";
import type { BodyRowProps } from "./body/RepeatBodyRow.js";
import type { PaginatedRepeatData } from "./repeat-data.js";
import type { DefaultRowActionResult } from "./row-actions/DefaultRowActionResult.js";
import type { RowActionButtonsProps } from "./row-actions/standard/StandardRowActionButtons.js";
import type { RepeatTableColumn } from "./tableColumnTypes.js";
import type { TableStyleOptions } from "./TableStyleOptions.js";

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
