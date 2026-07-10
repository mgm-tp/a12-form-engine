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

import { createContext, useState } from "react";

import type { TableComponentRenderers } from "@com.mgmtp.a12.widgets/widgets-core";

import { DataContext } from "../../../view/internal/components/form-engine/data-context.js";
import type { RepeatRow } from "../../../view/internal/components/form-engine/repeat/components/tableColumnTypes.js";
import type { TableWidgetMap } from "../../../view/internal/components/form-engine/repeat/table-widget-map.js";

type SelectedRow = {
	row: RepeatRow;
	rowIndex: number;
};
type ContextMenuState = SelectedRow | undefined;
interface ContextMenuSetter {
	on(state: ContextMenuState): void;
}
export const ContextMenuContext = createContext<ContextMenuSetter>(undefined!);
export const RepeatContextMenu: TableWidgetMap["Table"] = props => {
	const ContextMenuRenderer = props.componentRenderers!.contextMenuRenderer!;

	const [contextMenuState, setContextMenuState] = useState<ContextMenuState>(undefined);

	const contextMenu =
		contextMenuState &&
		renderRepeatContextMenu(ContextMenuRenderer, contextMenuState, () => {
			setContextMenuState(undefined);
		});

	const contextMenuHandler: ContextMenuSetter = {
		on: setContextMenuState
	};

	return (
		<ContextMenuContext.Provider value={contextMenuHandler}>
			{contextMenu}
			{props.children}
		</ContextMenuContext.Provider>
	);
};
function renderRepeatContextMenu(
	contextMenuRenderer: TableComponentRenderers["contextMenuRenderer"],
	selectedRow: SelectedRow,
	closeHandler: () => void
) {
	return (
		<DataContext.Provider value={selectedRow.row.path}>
			<div data-role="portal">
				<div data-role="modal-overlay">
					{contextMenuRenderer!({
						row: selectedRow.row,
						rowIndex: selectedRow.rowIndex,
						closeHandler
					})}
				</div>
			</div>
		</DataContext.Provider>
	);
}
