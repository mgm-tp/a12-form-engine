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

import { useSelector } from "react-redux";

import { DocumentPath } from "@com.mgmtp.a12.client/client-data";
import type { ContentModel } from "@com.mgmtp.a12.contentengine/contentengine-core";
import {
	createRuntimeTreeContext,
	expandTree,
	RuntimeNodeId,
	useContentEngineContext,
	useDocumentContext,
	useDocumentPathContext,
	useElementLibrary
} from "@com.mgmtp.a12.contentengine/contentengine-core";
import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import type { LocalizedModelText } from "@com.mgmtp.a12.utils/utils-localization";

import { collectEditableRuntimeNodes } from "./collectEditableRuntimeNodes.js";
import type { MessageGroupContainerNode } from "./messageGroupContainerNode.js";
import type { ResolveDocumentPath } from "./toEditableElements.js";
import { toEditableElements } from "./toEditableElements.js";

export interface EditableElement {
	/**
	 * The id the node was rendered with, combining the Content Model node and the data context it
	 * rendered in. Equal to the id the node itself derives its HTML id from, which is what lets a
	 * link focus it.
	 */
	readonly nodeId: string;

	/**
	 * The label the Content Model author gave the node, still to be localized. Undefined when they
	 * gave none, leaving the caller to fall back to the label of the referenced data element.
	 */
	readonly label?: LocalizedModelText;

	readonly documentPath: EntityInstancePath;
}

/**
 * List of document element node references in the order they are rendered.
 */
export type EditableElementList = EditableElement[];

/**
 * Collects a list of document element node references (fields and groups) in the order they are
 * rendered, traversing all nested MessageGroupContainerNodes.
 *
 * Any element of the installed Content Engine element libraries is collected that declares itself
 * as an input, so project-specific elements are included without this hook having to know them.
 */
export function useCollectEditableElements(node: MessageGroupContainerNode): EditableElementList {
	const baseDataContext = useDocumentPathContext(c => c.groupPath);
	const documentContext = useDocumentContext(c => c);
	const { getModelPathById, getElementByPath } = useDocumentContext(c => c.model);
	const size = useContentEngineContext(c => c.size);

	const library = useElementLibrary();

	return useSelector((state: object) => {
		const context = createRuntimeTreeContext({
			state,
			documentContext,
			baseDataContext,
			environment: "runtime",
			size,
			modelService: {
				getPathById: id => getModelPathById(state, id),
				getElementByPath: path => getElementByPath(state, path)
			}
		});

		const resolveDocumentPath: ResolveDocumentPath = (dataContext, elementId) =>
			DocumentPath.fromString(context.resolveDataContext(dataContext, elementId, 0));

		const editableNodes = collectEditableRuntimeNodes(
			library,
			expandTree(library, toModelNode(node), context)
		);

		return editableNodes.flatMap(runtimeNode =>
			toEditableElements(library, runtimeNode, resolveDocumentPath)
		);
	}, isEditableElementListEqual);
}

function isEditableElementListEqual(a: EditableElementList, b: EditableElementList): boolean {
	if (a.length !== b.length) {
		return false;
	}
	return a.every(
		(item, i) =>
			item.nodeId === b[i].nodeId &&
			item.label === b[i].label &&
			DocumentPath.equal(item.documentPath ?? [], b[i].documentPath ?? [])
	);
}

/**
 * Replaces the runtime id of a node by the model id.
 */
function toModelNode(node: ContentModel.Node): ContentModel.Node {
	return {
		...node,
		id: RuntimeNodeId.getModelNodeId(node.id)
	};
}
