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

import { useMemo } from "react";
import { useSelector } from "react-redux";

import type { ContentModel, ElementLibrary } from "@com.mgmtp.a12.contentengine/contentengine-core";
import {
	ElementModule,
	useDocumentContext,
	useElementLibrary
} from "@com.mgmtp.a12.contentengine/contentengine-core";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { MESSAGE_GROUP_DISPLAY_TYPE } from "../messageGroupDisplay/messageGroupDisplayNode.js";

import {
	isMessageGroupContainerNode,
	MESSAGE_GROUP_CONTAINER_TYPE
} from "./messageGroupContainerNode.js";

export type CollectedDocumentElementIds = { fieldIds: string[]; groupIds: string[] };

/** @internal */
export const USE_COLLECT_DOCUMENT_ELEMENT_IDS_WRAPPER = {
	useCollectDocumentElementIds
};

/**
 * Collects all of the DocumentElementIds of fields and groups that are referenced by some input
 * element in the given MessageGroupContainerNode.
 * Does not collect DocumentElementIds that are nested in another MessageGroupContainerNode.
 *
 * Any element of the element library the node is rendered with is collected that declares itself as
 * editing the data it references, so project-specific elements are included without this hook having
 * to know them.
 *
 * Precondition: called while rendering a Content Engine, which is where the element library comes
 * from. Callers outside of one — the Content Editor's setting panel, for example — pass their
 * library to {@link useCollectDocumentElementIdsFromLibrary} instead.
 */
export function useCollectDocumentElementIds(
	node?: ContentModel.Node
): CollectedDocumentElementIds {
	const library = useElementLibrary();

	return useCollectDocumentElementIdsFromLibrary(library, node);
}

/**
 * Collects all of the DocumentElementIds of fields and groups that are referenced by some input element of
 * the given element library in the given MessageGroupContainerNode, the way
 * {@link useCollectDocumentElementIds} does for a node being rendered.
 */
export function useCollectDocumentElementIdsFromLibrary(
	library: ElementLibrary,
	node?: ContentModel.Node
): CollectedDocumentElementIds {
	const { getElementById: getDocumentElementById } = useDocumentContext(c => c.model);

	// read the referenced element ids from the content model only once
	const referencedElementIds = useMemo(
		() => collectReferencedElementIds(library, node),
		[library, node]
	);

	// look the referenced elements up in the document model of the current state
	return useSelector(
		(state: object) =>
			groupIdsByElementType(referencedElementIds, id => getDocumentElementById(state, id)),
		areCollectedDocumentElementIdsEqual
	);
}

/**
 * @internal
 * Exported for testing.
 */
export function collectReferencedElementIds(
	library: ElementLibrary,
	node?: ContentModel.Node
): string[] {
	const hasChildren = node?.children && node.children.length > 0;

	if (!hasChildren || !isMessageGroupContainerNode(node)) {
		return [];
	}

	return collectReferencedElementIdsRecursive(library, node.children);
}

function collectReferencedElementIdsRecursive(
	library: ElementLibrary,
	childNodes: ContentModel.Node[]
): string[] {
	function collectFromNodeAndItsChildren(node: ContentModel.Node): string[] {
		return [
			...getEditedElementReferences(library, node),
			...collectReferencedElementIdsRecursive(library, node.children ?? [])
		];
	}

	return childNodes.filter(isTraversableNode).flatMap(collectFromNodeAndItsChildren);
}

/**
 * The ids of the data elements the given node lets the user edit, in the order the node references
 * them. Empty for a node that edits no data at all, and for one whose data element the Content
 * Model author has not configured yet.
 */
function getEditedElementReferences(
	library: ElementLibrary,
	node: ContentModel.Node
): readonly string[] {
	const dataBinding = ElementModule.getDataBinding(library, node);

	return dataBinding?.role === "input" ? dataBinding.getElementReferences(node) : [];
}

/**
 * @internal
 * Exported for testing.
 */
export function groupIdsByElementType(
	elementIds: readonly string[],
	getDocumentElementById: (id: string) => DocumentModel.Element
): CollectedDocumentElementIds {
	const documentElements = elementIds.map(getDocumentElementById);

	return {
		fieldIds: documentElements.filter(isFieldElement).map(element => element.id),
		groupIds: documentElements.filter(isGroupElement).map(element => element.id)
	};
}

function isFieldElement(element: DocumentModel.Element): element is DocumentModel.Field {
	return element.type === "Field";
}

function isGroupElement(element: DocumentModel.Element): element is DocumentModel.Group {
	return element.type === "Group";
}

/**
 * Elements nested in another MessageGroupContainer are not shown in the parent container.
 */
function isTraversableNode(node: ContentModel.Node): boolean {
	return node.type !== MESSAGE_GROUP_CONTAINER_TYPE && node.type !== MESSAGE_GROUP_DISPLAY_TYPE;
}

function areCollectedDocumentElementIdsEqual(
	a: CollectedDocumentElementIds,
	b: CollectedDocumentElementIds
): boolean {
	return areIdListsEqual(a.fieldIds, b.fieldIds) && areIdListsEqual(a.groupIds, b.groupIds);
}

function areIdListsEqual(a: string[], b: string[]): boolean {
	return a.length === b.length && a.every((id, index) => id === b[index]);
}
