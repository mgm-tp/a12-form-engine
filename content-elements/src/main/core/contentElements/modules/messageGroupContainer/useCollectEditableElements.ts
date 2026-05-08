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

import { useMemo } from "react";

import type { ContentModel } from "@com.mgmtp.a12.contentengine/contentengine-core";
import type { LocalizedModelText } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type { BaseControlProps } from "../../../index.js";
import { FORM_ELEMENTS_NAMESPACE } from "../../../namespace.js";

import { MESSAGE_GROUP_DISPLAY_TYPE } from "../messageGroupDisplay/messageGroupDisplayNode.js";

import {
	MESSAGE_GROUP_CONTAINER_TYPE,
	type MessageGroupContainerNode
} from "./messageGroupContainerNode.js";

export interface EditableElement {
	readonly nodeId: string;
	readonly elementId: string;
	readonly label?: LocalizedModelText;
}

/**
 * List of document element node references in the order they appear in the Content Model.
 */
export type EditableElementList = EditableElement[];

/**
 * Collects a list of document element node references (fields and groups) in the order
 * they appear in the Content Model, traversing all nested MessageGroupContainerNodes.
 */
export function useCollectEditableElements(node: MessageGroupContainerNode): EditableElementList {
	const documentElementNodeIdsList = useMemo(() => {
		return collectEditableElements(node);
	}, [node]);

	return documentElementNodeIdsList;
}

/**
 * @internal
 * Exported for testing.
 */
export function collectEditableElements(node?: ContentModel.Node): EditableElementList {
	const hasChildren = node?.children && node.children.length > 0;

	if (!hasChildren) {
		return [];
	}

	return collectEditableElementsRecursive(node.children);
}

function collectEditableElementsRecursive(childNodes: ContentModel.Node[]): EditableElementList {
	const nodeReferences: EditableElement[] = [];

	for (const childNode of childNodes) {
		if (!isTraversableNode(childNode.type)) {
			continue;
		}

		// Add current node reference if it's a collectable form element
		const nodeRef = createEditableElementIfCollectable(childNode);
		if (nodeRef) {
			nodeReferences.push(nodeRef);
		}

		// Recursively collect from children and maintain order
		const childReferences = collectEditableElementsRecursive(childNode.children ?? []);
		nodeReferences.push(...childReferences);
	}

	return nodeReferences;
}

function createEditableElementIfCollectable(node: ContentModel.Node): EditableElement | null {
	if (!isCollectableFormElementNode(node)) {
		return null;
	}

	return {
		nodeId: node.id,
		elementId: node.props.elementId,
		label: node.props.label
	};
}

/**
 * Elements nested in a MessageGroupDisplay are never traversed.
 */
function isTraversableNode(nodeType: string): boolean {
	return nodeType !== MESSAGE_GROUP_DISPLAY_TYPE;
}

/**
 * Type guard to check if a node is a form element node with an elementId.
 */
function isCollectableFormElementNode(
	node: ContentModel.Node
): node is ContentModel.Node<BaseControlProps> {
	return (
		node.type !== MESSAGE_GROUP_CONTAINER_TYPE &&
		node.namespace === FORM_ELEMENTS_NAMESPACE &&
		typeof node.props === "object" &&
		node.props !== null &&
		"elementId" in node.props
	);
}
