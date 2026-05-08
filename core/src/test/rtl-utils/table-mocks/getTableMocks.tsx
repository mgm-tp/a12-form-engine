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

/**
 * Mocks for the table widget.
 *
 * Heads up: Be careful when using renderers with JSX <ExampleRenderer/>. This
 * can lead to unwanted re-mountings that in turn break focus behavior!
 */
import { use } from "react";

import type { BaseColumnType } from "@com.mgmtp.a12.widgets/widgets-core/lib/table/new-api/column.api.js";

import { RepeatTableColumn } from "../../../view/internal/components/form-engine/repeat/components/tableColumnTypes.js";
import type { TableWidgetMap } from "../../../view/internal/components/form-engine/repeat/table-widget-map.js";
import {
	DefaultTableWidgetMap,
	TableWidgetMapContext
} from "../../../view/internal/components/form-engine/repeat/table-widget-map.js";
import { DisableMockComponents } from "../../utils/disable-mocks.js";

import {
	ACTION_CELL,
	EXPANDABLE_ROW_BODY,
	HEAD_CELL,
	HEAD_CELL_CONTENT,
	TABLE_HEAD
} from "../data-roles.js";
import type { Mocked } from "../mock-map.js";

import {
	Body,
	BodyCell,
	BodyCellRenderer,
	bodyContentRenderer,
	BodyRenderer,
	BodyRow,
	BodyRowRenderer
} from "./body.js";
import { Foot, FootRenderer } from "./foot.js";
import { RepeatContextMenu } from "./RepeatContextMenu.js";
import { TableRenderContext } from "./table-context.js";

export const Table: TableWidgetMap["Table"] = props => {
	const widgetMap = use(TableWidgetMapContext);
	const widgetMapWithFormEngineComponents = {
		...widgetMap,
		...(props.componentRenderers ?? {})
	};

	return (
		<TableRenderContext.Provider
			value={{ columns: props.columns, ...widgetMapWithFormEngineComponents }}
		>
			<RepeatContextMenu {...props}>
				<TableContent {...props} />
			</RepeatContextMenu>
		</TableRenderContext.Provider>
	);
};

const TableContent: TableWidgetMap["Table"] = props => {
	const { data = [] } = props;
	const { columns, bodyRenderer, footRenderer, headFilterContentRenderer } =
		use(TableRenderContext);

	const HeadCellRenderer = props.componentRenderers!.headCellRenderer!;
	const head = columns.map((column, index) => <HeadCellRenderer column={column} key={index} />);
	const body = bodyRenderer({ data });
	const footer = footRenderer();

	const showFilterRow = undefined !== headFilterContentRenderer;

	const filter = showFilterRow
		? columns.map((column, index) => headFilterCellRenderer!({ column, id: `${index}` }))
		: undefined;

	return (
		<div id={props.id} role="table" tabIndex={-1}>
			<div role="rowgroup" data-role={TABLE_HEAD}>
				<div role="row">{head}</div>
				{filter && <div role="row">{filter}</div>}
			</div>
			{body}
			{footer}
		</div>
	);
};

const headCellDataTypeAttr = (col: BaseColumnType) => (col.actionColumn ? ACTION_CELL : undefined);

export const headCellRenderer: TableWidgetMap["headCellRenderer"] = props => {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const { headContentRenderer } = use(TableRenderContext);

	const { column } = props;

	const modelElementId = RepeatTableColumn.isColumnWithModelElement(column)
		? column.modelElement.id
		: undefined;

	const content = headContentRenderer({ column });

	return (
		<span
			role="columnheader"
			className={props.className}
			data-role={HEAD_CELL}
			data-type={headCellDataTypeAttr(column)}
			data-testid={modelElementId}
			key={modelElementId ?? "action"}
		>
			<div data-role={HEAD_CELL_CONTENT}>{content}</div>
		</span>
	);
};

const headFilterCellRenderer: TableWidgetMap["headFilterCellRenderer"] = props => {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const { headFilterContentRenderer } = use(TableRenderContext);

	const { column } = props;

	const content = headFilterContentRenderer!({ column });

	return (
		<span
			role="columnheader"
			className={props.className}
			data-role={HEAD_CELL}
			data-type={headCellDataTypeAttr(column)}
			key={props.id}
		>
			{content}
		</span>
	);
};

export const ExpandableRow: TableWidgetMap["TableTemplate"]["ExpandableRow"] = props => {
	return (
		<span role="row" id={props.id}>
			{props.children}
		</span>
	);
};

export const ExpandableRowBody: TableWidgetMap["TableTemplate"]["ExpandableRowBody"] = props => {
	return (
		<span role="cell" data-role={EXPANDABLE_ROW_BODY}>
			{props.children}
		</span>
	);
};

export const ExpandableRowFooter: TableWidgetMap["TableTemplate"]["ExpandableRowFooter"] =
	props => {
		return (
			<span role="cell" data-testid={props["data-testid"]}>
				{props.children}
			</span>
		);
	};

export function getTableWidgetMocks(): Mocked<TableWidgetMap> {
	return DisableMockComponents.components(() => DefaultTableWidgetMap)(tableWidgetMockMap);
}

const notImplemented = () => {
	throw new Error("Function not implemented.");
};

function tableWidgetMockMap(): TableWidgetMap {
	return {
		Table,
		TableTemplate: {
			Body,
			BodyRow,
			BodyCell,
			Foot,
			FootRow: notImplemented,
			FootCell: notImplemented,
			ExpandableRow,
			ExpandableRowBody,
			ExpandableRowFooter
		},
		headRenderer: notImplemented,
		headRowRenderer: notImplemented,
		headCellRenderer,
		headCellGroupRenderer: notImplemented,
		headContentRenderer: notImplemented,
		bodyRenderer: BodyRenderer,
		infiniteScrollBodyRenderer: notImplemented,
		virtualizedBodyRenderer: notImplemented,
		bodyRowRenderer: BodyRowRenderer,
		bodyCellRenderer: BodyCellRenderer,
		bodyContentRenderer: bodyContentRenderer,
		placeHolderBodyRowRenderer: notImplemented,
		footRenderer: FootRenderer,
		footRowRenderer: notImplemented,
		footCellRenderer: notImplemented,
		footContentRenderer: notImplemented,
		dndBodyRowRenderer: notImplemented,
		dragSourceRenderer: notImplemented,
		dropTargetRenderer: notImplemented,
		dragPreviewRenderer: notImplemented
	};
}
