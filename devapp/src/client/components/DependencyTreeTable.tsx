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

import { useCallback, useState, type JSX } from "react";
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
