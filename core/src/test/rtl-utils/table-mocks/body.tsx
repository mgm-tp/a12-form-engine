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

import { use } from "react";

import type { RepeatRow } from "../../../view/internal/components/form-engine/repeat/components/tableColumnTypes.js";
import type { TableWidgetMap } from "../../../view/internal/components/form-engine/repeat/table-widget-map.js";

import { BODY_CELL, BODY_ROW, TABLE_BODY } from "../data-roles.js";

import { ContextMenuContext } from "./RepeatContextMenu.js";
import { TableRenderContext } from "./table-context.js";

export const Body: TableWidgetMap["TableTemplate"]["Body"] = props => {
	return (
		<div role="rowgroup" data-role={TABLE_BODY} id={props.id}>
			{props.children}
		</div>
	);
};

export const BodyRenderer: TableWidgetMap["bodyRenderer"] = props => {
	const { data, ...rest } = props;
	const { bodyRowRenderer } = use(TableRenderContext);
	const rows = data.map((row, rowIndex) => bodyRowRenderer({ row, rowIndex, key: rowIndex }));
	return <Body {...rest}>{rows}</Body>;
};

export const BodyRow: TableWidgetMap["TableTemplate"]["BodyRow"] = props => {
	return (
		<div
			role="row"
			onContextMenu={props.onContextMenu}
			data-role={BODY_ROW}
			className={props.className}
			id={props.id}
			onClick={props.onClick}
			tabIndex={-1}
		>
			{props.children}
		</div>
	);
};

export const BodyRowRenderer: TableWidgetMap["bodyRowRenderer"] = props => {
	const {
		columns,
		bodyCellRenderer,
		TableTemplate: { BodyRow }
	} = use(TableRenderContext);

	const { row, rowIndex, id } = props;

	const cols = columns.map((column, index) =>
		bodyCellRenderer({ column, row, rowIndex, id: `${index}` })
	);

	return (
		<BodyRow
			id={id}
			key={rowIndex}
			title={props.title}
			interactive={props.interactive}
			onClick={props.onClick}
		>
			{cols}
		</BodyRow>
	);
};

export const BodyCell: TableWidgetMap["TableTemplate"]["BodyCell"] = props => {
	return (
		<span
			role="cell"
			onContextMenu={props.onContextMenu}
			data-role={BODY_CELL}
			className={props.className}
			id={props.id}
		>
			{props.children}
		</span>
	);
};

export const BodyCellRenderer: TableWidgetMap["bodyCellRenderer"] = props => {
	const {
		columns,
		bodyContentRenderer,
		TableTemplate: { BodyCell }
	} = use(TableRenderContext);
	const contextMenuProps = use(ContextMenuContext);

	const { row, rowIndex, column, id } = props;

	const columnIndex = columns.indexOf(column);

	const showContextMenu = isRepeatRow(row)
		? () => {
				contextMenuProps.on({ row, rowIndex });
			}
		: undefined;

	return (
		<BodyCell onContextMenu={showContextMenu} className={props.className} id={id} key={columnIndex}>
			{bodyContentRenderer(props)}
		</BodyCell>
	);
};

function isRepeatRow(row: unknown): row is RepeatRow {
	return (row as RepeatRow).rowIndexInDocument !== undefined;
}

export const bodyContentRenderer: TableWidgetMap["bodyContentRenderer"] = props => {
	const { row, rowIndex } = props;
	return props.column.dataGetter?.({ row, rowIndex });
};
