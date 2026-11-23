// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { useMemo } from "react";
import { useSelector } from "react-redux";
import type { DefaultRootState } from "react-redux";

import type { ContentModel } from "@com.mgmtp.a12.contentengine/contentengine-core";
import { useDocumentContext } from "@com.mgmtp.a12.contentengine/contentengine-core";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { FORM_ELEMENTS_NAMESPACE } from "../../../namespace.js";

import { MESSAGE_GROUP_DISPLAY_TYPE } from "../messageGroupDisplay/messageGroupDisplayNode.js";

import {
	isMessageGroupContainerNode,
	MESSAGE_GROUP_CONTAINER_TYPE
} from "./messageGroupContainerNode.js";

export type CollectedDocumentElementIds = { fieldIds: string[]; groupIds: string[] };

export interface CollectDocumentElementIdsOptions {
	/** When true, also collects ids from elements nested inside child MessageGroupContainerNodes. Defaults to false. */
	traverseNested?: true;
}

/**
 * Collects all of the DocumentElementIds of fields and groups that are referenced by some form element in the given MessageGroupContainerNode.
 * Does not collect DocumentElementIds that are nested in another MessageGroupContainerNode unless `traverseNested` is set to true.
 */
export function useCollectDocumentElementIds(
	node?: ContentModel.Node
): CollectedDocumentElementIds {
	const { getElementById: getDocumentElementById } = useDocumentContext(c => c.model);

	const getElementByIdFromState = useMemo(() => {
		return (state: DefaultRootState) => (elementId: string) =>
			getDocumentElementById(state, elementId);
	}, [getDocumentElementById]);

	const getElementById = useSelector(getElementByIdFromState);

	const documentElementIds = useMemo(() => {
		return collectDocumentElementIds(getElementById, node);
		// oxlint-disable-next-line react/exhaustive-deps
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
 * Elements nested in another MessageGroupContainer are not shown in the parent container..
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
