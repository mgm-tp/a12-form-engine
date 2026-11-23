// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { createContext } from "react";
import type { ComponentType } from "react";

import { TableTemplate } from "@com.mgmtp.a12.widgets/widgets-core/lib/table/main/template/index.js";
import type { TableTemplateProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/table/main/template/table.tpl.api.js";
import type { BaseColumnType } from "@com.mgmtp.a12.widgets/widgets-core/lib/table/new-api/column.api.js";
import type { TableComponentRenderers } from "@com.mgmtp.a12.widgets/widgets-core/lib/table/new-api/table-renderer.api.js";
import type { TableProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/table/new-api/table.api.js";
import {
	DefaultTableComponentRenderers,
	Table
} from "@com.mgmtp.a12.widgets/widgets-core/lib/table/new-api/table.view.js";

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
