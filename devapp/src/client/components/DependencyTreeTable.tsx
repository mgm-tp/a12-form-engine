// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { useCallback, useState } from "react";
import type { JSX } from "react";
import { DndProvider } from "react-dnd";

import { DragAndDropUtils } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/drag-and-drop-utils.js";
import type {
	BaseTreeTableColumnType,
	BaseTreeTableNode,
	TreeTableRowEventHandlers,
	TreeTableRowStyling
} from "@com.mgmtp.a12.widgets/widgets-core/lib/tree-table/main/tree-table.api.js";
import { TreeTable } from "@com.mgmtp.a12.widgets/widgets-core/lib/tree-table/main/tree-table.view.js";
import { TreeContainer } from "@com.mgmtp.a12.widgets/widgets-core/lib/tree/main/tpl/tree-elements.tpl.js";

export interface DependencyTreeTableNode extends BaseTreeTableNode {
	readonly id: string;
	readonly children?: DependencyTreeTableNode[];
}
declare const __DEPENDENCY_TREE_ROOT__: DependencyTreeTableNode;

const dependencyColumns: BaseTreeTableColumnType[] = [
	{
		label: "Package Name",
		hierarchical: true
	},
	{
		label: "Version"
	}
];

export function DependencyTreeTable(): JSX.Element {
	const [collapsedNodes, setCollapsedNodes] = useState(createNodeMap);
	const rowEventHandlers: TreeTableRowEventHandlers = useCallback(({ row }) => {
		return {
			onArrowClick() {
				setCollapsedNodes(currentCollapsedNodes => ({
					...currentCollapsedNodes,
					[row.id]: !currentCollapsedNodes[row.id]
				}));
			}
		};
	}, []);

	const rowStyling: TreeTableRowStyling = useCallback(
		({ row }) => {
			return { collapsed: collapsedNodes[row.id] };
		},
		[collapsedNodes]
	);

	/**
	 * The DndProvider is necessary, because the TreeTable has built-in
	 * drag & drop behavior and therefore expects a drag & drop context
	 */
	return (
		<DndProvider
			backend={DragAndDropUtils.DefaultDndBackend}
			options={DragAndDropUtils.DefaultDndBackendOptions}
		>
			<TreeContainer fitToParent>
				<TreeTable
					root={__DEPENDENCY_TREE_ROOT__}
					columns={dependencyColumns}
					rowEventHandlers={rowEventHandlers}
					rowStyling={rowStyling}
				/>
			</TreeContainer>
		</DndProvider>
	);
}

function createNodeMap(): Record<string, boolean> {
	return collectIds(__DEPENDENCY_TREE_ROOT__).reduce(
		(nodeMap, id) => {
			nodeMap[id] = false;
			return nodeMap;
		},
		{} as Record<string, boolean>
	);
}

function collectIds(node: DependencyTreeTableNode): string[] {
	return [node.id, ...(node.children?.flatMap(collectIds) ?? [])];
}
