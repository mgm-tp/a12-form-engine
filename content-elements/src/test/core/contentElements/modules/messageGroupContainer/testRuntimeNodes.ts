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

import type { DataReference } from "@com.mgmtp.a12.client/client-data";
import type { ContentModel, RuntimeNode } from "@com.mgmtp.a12.contentengine/contentengine-core";
import { RuntimeNodeId } from "@com.mgmtp.a12.contentengine/contentengine-core";

/**
 * A node of the expanded tree, built the way the Content Engine builds it, so that tests can state
 * a rendered tree directly instead of driving a whole engine to produce one.
 */
export function createRuntimeNode(
	node: ContentModel.Node,
	dataContext: DataReference,
	children: readonly RuntimeNode[] = []
): RuntimeNode {
	return {
		nodeId: RuntimeNodeId.create(node.id, dataContext),
		modelNodeId: node.id,
		dataContext,
		type: node.type,
		namespace: node.namespace,
		props: node.props,
		children
	};
}

/**
 * The sub-tree a repeatable group expands to: the group node once per instance, each carrying the
 * children built for that instance's data context. Mirrors what `expandTree` reports for a Group.
 */
export function createRepeatedInstances(
	groupNode: ContentModel.Node,
	dataContexts: readonly DataReference[],
	createChildren: (dataContext: DataReference) => readonly RuntimeNode[]
): RuntimeNode[] {
	return dataContexts.map(dataContext =>
		createRuntimeNode(groupNode, dataContext, createChildren(dataContext))
	);
}
