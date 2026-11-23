// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { createContext, useState } from "react";

import type { TableComponentRenderers } from "@com.mgmtp.a12.widgets/widgets-core/lib/table/new-api/table-renderer.api.js";

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
