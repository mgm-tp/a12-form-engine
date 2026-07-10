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

import { createContext } from "react";
import type { ComponentType } from "react";

import {
	TableTemplate,
	DefaultTableComponentRenderers,
	Table
} from "@com.mgmtp.a12.widgets/widgets-core";
import type {
	TableTemplateProps,
	BaseColumnType,
	TableComponentRenderers,
	TableProps
} from "@com.mgmtp.a12.widgets/widgets-core";

import type { WithDataTestId } from "../../../../../back-end/utils/internal/types.js";

/** @internal */
export interface TableWidgetMap<
	RowType = unknown,
	ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>
> extends TableComponentRenderers<RowType, ColumnType> {
	readonly Table: ComponentType<TableProps<RowType, ColumnType>>;

	readonly TableTemplate: {
		readonly Body: ComponentType<TableTemplateProps.BodyProps>;
		readonly BodyRow: ComponentType<TableTemplateProps.BodyRowProps>;
		readonly BodyCell: ComponentType<TableTemplateProps.BodyCellProps>;
		readonly Foot: ComponentType<TableTemplateProps.FootProps>;
		readonly FootRow: ComponentType<TableTemplateProps.FootRowProps>;
		readonly FootCell: ComponentType<TableTemplateProps.FootCellProps>;
		readonly ExpandableRow: ComponentType<TableTemplateProps.ExpandableRowProps>;
		readonly ExpandableRowBody: ComponentType<TableTemplateProps.ExpandableRowBodyProps>;
		readonly ExpandableRowFooter: ComponentType<
			WithDataTestId<TableTemplateProps.ExpandableRowFooterProps>
		>;
	};
}

/** @internal */
export const DefaultTableWidgetMap: TableWidgetMap = {
	Table,
	TableTemplate: {
		Body: TableTemplate.Body,
		BodyRow: TableTemplate.BodyRow,
		BodyCell: TableTemplate.BodyCell,
		Foot: TableTemplate.Foot,
		FootRow: TableTemplate.FootRow,
		FootCell: TableTemplate.FootCell,
		ExpandableRow: TableTemplate.ExpandableRow,
		ExpandableRowBody: TableTemplate.ExpandableRowBody,
		ExpandableRowFooter: TableTemplate.ExpandableRowFooter
	},
	...DefaultTableComponentRenderers
};

/** @internal */
export const TableWidgetMapContext = createContext<TableWidgetMap>(DefaultTableWidgetMap);
