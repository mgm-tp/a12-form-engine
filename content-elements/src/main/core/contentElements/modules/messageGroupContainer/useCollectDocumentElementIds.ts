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

import type { ContentModel } from "@com.mgmtp.a12.contentengine/contentengine-core";
import { useDocumentContext } from "@com.mgmtp.a12.contentengine/contentengine-core";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { FORM_ELEMENTS_NAMESPACE } from "../../../namespace.js";

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
 * Collects all of the DocumentElementIds of fields and groups that are referenced by some form element in the given MessageGroupContainerNode.
 * Does not collect DocumentElementIds that are nested in another MessageGroupContainerNode.
 */
export function useCollectDocumentElementIds(
	node?: ContentModel.Node
): CollectedDocumentElementIds {
	const { getElementById: getDocumentElementById } = useDocumentContext(c => c.model);

	const getElementByIdFromState = useMemo(() => {
		return (state: object) => (elementId: string) => getDocumentElementById(state, elementId);
	}, [getDocumentElementById]);

	const getElementById = useSelector(getElementByIdFromState);

	const documentElementIds = useMemo(() => {
		return collectDocumentElementIds(getElementById, node);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [node]);

	return documentElementIds;
}

function collectDocumentElementIds(
	getDocumentElementById: (id: string) => DocumentModel.Element,
	node?: ContentModel.Node
): CollectedDocumentElementIds {
	const hasChildren = node?.children && node.children.length > 0;

	if (!hasChildren || !isMessageGroupContainerNode(node)) {
		return { fieldIds: [], groupIds: [] };
	}

	return collectDocumentElementIdsRecursive(node.children, getDocumentElementById);
}

function collectDocumentElementIdsRecursive(
	childNodes: ContentModel.Node[],
	getDocumentElementById: (id: string) => DocumentModel.Element
): CollectedDocumentElementIds {
	return childNodes.reduce<CollectedDocumentElementIds>(
		(collectedIds, childNode) => {
			if (!isTraversableNode(childNode.type)) {
				return collectedIds;
			}

			const dmElementId = collectDocumentElementId(childNode, getDocumentElementById);
			const childIds = collectDocumentElementIdsRecursive(
				childNode.children ?? [],
				getDocumentElementById
			);

			return {
				fieldIds: [...collectedIds.fieldIds, ...dmElementId.fieldIds, ...childIds.fieldIds],
				groupIds: [...collectedIds.groupIds, ...dmElementId.groupIds, ...childIds.groupIds]
			};
		},
		{ fieldIds: [], groupIds: [] }
	);
}

function collectDocumentElementId(
	node: ContentModel.Node,
	getDocumentElementById: (id: string) => DocumentModel.Element
): CollectedDocumentElementIds {
	if (!isCollectableFormElementNode(node)) {
		return { fieldIds: [], groupIds: [] };
	}

	const documentElement = getDocumentElementById(node.props.elementId);

	if (documentElement.type === "Group") {
		return { fieldIds: [], groupIds: [documentElement.id] };
	}

	if (documentElement.type === "Field") {
		return { fieldIds: [documentElement.id], groupIds: [] };
	}

	return { fieldIds: [], groupIds: [] };
}

/**
 * Elements nested in another MessageGroupContainer are not shown in the parent container.
 */
function isTraversableNode(nodeType: string): boolean {
	return nodeType !== MESSAGE_GROUP_CONTAINER_TYPE && nodeType !== MESSAGE_GROUP_DISPLAY_TYPE;
}

/**
 * Type guard to check if a node is a form element node with an elementId.
 */
function isCollectableFormElementNode(
	node: ContentModel.Node
): node is ContentModel.Node<{ elementId: string }> {
	return (
		isTraversableNode(node.type) &&
		node.namespace === FORM_ELEMENTS_NAMESPACE &&
		typeof node.props === "object" &&
		node.props !== null &&
		"elementId" in node.props
	);
}
