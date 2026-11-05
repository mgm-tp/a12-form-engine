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

import type {
	ContentModel,
	ElementLibrary,
	RuntimeNode
} from "@com.mgmtp.a12.contentengine/contentengine-core";
import { ElementModule } from "@com.mgmtp.a12.contentengine/contentengine-core";

import { MESSAGE_GROUP_DISPLAY_TYPE } from "../messageGroupDisplay/messageGroupDisplayNode.js";

/**
 * The nodes of an expanded content tree that let the user edit the data they reference, in the
 * order they render.
 *
 * Any element declaring itself as an input is collected, so project-specific inputs are
 * included without this function having to know them. Elements nested in a deeper
 * MessageGroupContainer are traversed as well.
 *
 * @internal
 * Exported for testing.
 */
export function collectEditableRuntimeNodes(
	library: ElementLibrary,
	nodes: readonly RuntimeNode[]
): RuntimeNode[] {
	function collectFromNodeAndItsChildren(node: RuntimeNode): RuntimeNode[] {
		const editedHere = editsReferencedData(library, node) ? [node] : [];

		return [...editedHere, ...collectEditableRuntimeNodes(library, node.children ?? [])];
	}

	return nodes.filter(isTraversableNode).flatMap(collectFromNodeAndItsChildren);
}

/**
 * The content model node a runtime node was expanded from, as the element modules expect it. The
 * runtime node carries everything an element reads — its type, its namespace and its props — under
 * different names.
 *
 * @internal
 */
export function toContentModelNode(node: RuntimeNode): ContentModel.Node {
	return {
		id: node.modelNodeId,
		namespace: node.namespace,
		type: node.type,
		props: node.props
	} as ContentModel.Node;
}

/**
 * Whether the given node lets the user edit the data it references, as its element declares.
 */
function editsReferencedData(library: ElementLibrary, node: RuntimeNode): boolean {
	return ElementModule.getDataBinding(library, toContentModelNode(node))?.role === "input";
}

/**
 * Elements nested in a MessageGroupDisplay are never traversed.
 */
function isTraversableNode(node: RuntimeNode): boolean {
	return node.type !== MESSAGE_GROUP_DISPLAY_TYPE;
}
