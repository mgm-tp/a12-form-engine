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
import type { ElementLibrary, RuntimeNode } from "@com.mgmtp.a12.contentengine/contentengine-core";
import { ElementModule } from "@com.mgmtp.a12.contentengine/contentengine-core";
import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { toContentModelNode } from "./collectEditableRuntimeNodes.js";
import type { EditableElement } from "./useCollectEditableElements.js";

/**
 * Resolves the document path of a data element referenced from the given data context.
 *
 * @internal
 */
export type ResolveDocumentPath = (
	dataContext: DataReference,
	elementId: string
) => EntityInstancePath;

/**
 * The editable elements a runtime node stands for, one per data element it references, in the
 * order the node references them.
 *
 * Unresolved references are dropped.
 *
 * @internal
 * Exported for testing.
 */
export function toEditableElements(
	library: ElementLibrary,
	node: RuntimeNode,
	resolveDocumentPath: ResolveDocumentPath
): EditableElement[] {
	const contentModelNode = toContentModelNode(node);
	const dataBinding = ElementModule.getDataBinding(library, contentModelNode);

	if (dataBinding?.role !== "input") {
		return [];
	}

	const label = ElementModule.getNodeLabel(library, contentModelNode);

	function toElement(elementId: string): EditableElement[] {
		const documentPath = resolveDocumentPathOrNothing(
			resolveDocumentPath,
			node.dataContext,
			elementId
		);

		return documentPath ? [{ nodeId: node.nodeId, label, documentPath }] : [];
	}

	return dataBinding.getElementReferences(contentModelNode).flatMap(toElement);
}

/**
 * The document path of the referenced element, or nothing when it cannot be resolved in the given
 * data context.
 */
function resolveDocumentPathOrNothing(
	resolveDocumentPath: ResolveDocumentPath,
	dataContext: DataReference,
	elementId: string
): EntityInstancePath | undefined {
	try {
		return resolveDocumentPath(dataContext, elementId);
	} catch {
		return undefined;
	}
}
