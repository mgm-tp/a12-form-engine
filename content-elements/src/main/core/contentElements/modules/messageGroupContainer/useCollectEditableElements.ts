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
import { useSelector } from "react-redux";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import { DocumentPath } from "@com.mgmtp.a12.client/client-data";
import type { ContentModel } from "@com.mgmtp.a12.contentengine/contentengine-core";
import {
	useDocumentContext,
	useDocumentPathContext
} from "@com.mgmtp.a12.contentengine/contentengine-core";
import type { LocalizedModelText } from "@com.mgmtp.a12.utils/utils-localization";
import type {
	DocumentModel,
	EntityInstancePath
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { BaseControlProps } from "../../../index.js";
import { FORM_ELEMENTS_NAMESPACE } from "../../../namespace.js";

import { MESSAGE_GROUP_DISPLAY_TYPE } from "../messageGroupDisplay/messageGroupDisplayNode.js";

import {
	MESSAGE_GROUP_CONTAINER_TYPE,
	type MessageGroupContainerNode
} from "./messageGroupContainerNode.js";

export interface EditableModelElement {
	readonly nodeId: string;
	readonly elementId: string;
	readonly label?: LocalizedModelText;
}

export interface EditableElement extends Omit<EditableModelElement, "elementId"> {
	readonly documentPath: EntityInstancePath;
}

/**
 * List of document element node references in the order they appear in the Content Model.
 */
export type EditableElementList = EditableElement[];

/**
 * A callback that extracts an {@link EditableModelElement} from a custom content node.
 * Return `null` for nodes that should not be collected.
 */
export type EditableModelElementExtractor = (
	node: ContentModel.Node
) => EditableModelElement | null;

/**
 * Collects a list of document element node references (fields and groups) in the order
 * they appear in the Content Model, traversing all nested MessageGroupContainerNodes.
 *
 * @param additionalExtractor - Optional extractor for custom content nodes not recognized
 *   by the built-in form elements. Pass a {@link EditableModelElementExtractor} to include
 *   project-specific nodes in the collected list.
 *   Make sure to pass a stable function here to avoid unnecessary recomputation.
 */
export function useCollectEditableElements(
	node: MessageGroupContainerNode,
	additionalExtractor?: EditableModelElementExtractor
): EditableElementList {
	const dataContextString = useDocumentPathContext(c => c.groupPath);

	const { getGroupInstanceRepeatability, getNotRelevant } = useDocumentContext(c => c.document);
	const { getModelPathById, getElementByPath } = useDocumentContext(c => c.model);

	// collect model elements only once
	const editableModelElements = useMemo(
		() => collectEditableModelElements(node, additionalExtractor),
		[node, additionalExtractor]
	);

	// expand model elements to runtime elements based on the current state
	return useSelector((state: object) => {
		const dataContext = DocumentPath.fromString(dataContextString);
		return editableModelElements.flatMap(e => {
			const documentPaths = getRelevantPathsInContext({
				elementId: e.elementId,
				dataContext,
				getModelPathById: id => getModelPathById(state, id),
				getElementByPath: path => getElementByPath(state, path),
				getRowCount: ref => getGroupInstanceRepeatability(state, ref),
				getNotRelevant: ref => getNotRelevant(state, ref)
			});

			return documentPaths.map(documentPath => ({ ...e, documentPath }));
		});
	}, isEditableElementListEqual);
}

/**
 * @internal
 * Exported for testing.
 */
export function collectEditableModelElements(
	node?: ContentModel.Node,
	additionalExtractor?: EditableModelElementExtractor
): EditableModelElement[] {
	const hasChildren = node?.children && node.children.length > 0;

	if (!hasChildren) {
		return [];
	}

	return collectEditableModelElementsRecursive(node.children, additionalExtractor);
}

function collectEditableModelElementsRecursive(
	childNodes: ContentModel.Node[],
	additionalExtractor?: EditableModelElementExtractor
): EditableModelElement[] {
	const nodeReferences: EditableModelElement[] = [];

	for (const childNode of childNodes) {
		if (!isTraversableNode(childNode.type)) {
			continue;
		}

		// Add current node reference if it's a collectable form element
		const nodeRef = createEditableModelElementIfCollectable(childNode, additionalExtractor);
		if (nodeRef) {
			nodeReferences.push(nodeRef);
		}

		// Recursively collect from children and maintain order
		const childReferences = collectEditableModelElementsRecursive(
			childNode.children ?? [],
			additionalExtractor
		);
		nodeReferences.push(...childReferences);
	}

	return nodeReferences;
}

function createEditableModelElementIfCollectable(
	node: ContentModel.Node,
	additionalExtractor?: EditableModelElementExtractor
): EditableModelElement | null {
	if (isCollectableFormElementNode(node)) {
		return {
			nodeId: node.id,
			elementId: node.props.elementId,
			label: node.props.label
		};
	}

	return additionalExtractor?.(node) ?? null;
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
 * @internal
 * Exported for testing.
 */
export function getRelevantPathsInContext(options: {
	elementId: string;
	dataContext: EntityInstancePath;
	getModelPathById: (id: string) => ModelPath;
	getElementByPath: (path: ModelPath) => DocumentModel.Element;
	getRowCount: (dataRef: string) => number;
	getNotRelevant: (dataRef: string) => boolean;
}): EntityInstancePath[] {
	const {
		elementId,
		dataContext,
		getModelPathById,
		getElementByPath,
		getRowCount,
		getNotRelevant
	} = options;

	const modelPath = getModelPathById(elementId);

	// Start with one empty path; each segment either extends all current paths
	// or fans them out across all row indices of a repeatable group.
	let results: EntityInstancePath[] = [[]];

	for (let idx = 0; idx < modelPath.length; idx++) {
		const segment = modelPath[idx];
		const pathUpToSegment = modelPath.slice(0, idx + 1);

		const dmElement = getElementByPath(pathUpToSegment);

		const isExpandable = isExpandableSegment(pathUpToSegment, dmElement, dataContext);

		if (isExpandable) {
			results = results.flatMap(currentPath => {
				const probe = DocumentPath.toString([
					...currentPath,
					{ elementName: segment.elementName, index: 0 }
				]);
				const numberOfRows = getRowCount(probe);

				return Array.from({ length: numberOfRows }, (_, i) => [
					...currentPath,
					{ ...segment, index: i + 1 }
				]);
			});
		} else {
			const indexForSegment = getIndex(pathUpToSegment, dmElement, dataContext);
			results.forEach(path => path.push({ ...segment, index: indexForSegment }));
		}
	}

	return results.filter(path => !getNotRelevant(DocumentPath.toString(path)));
}

/**
 * FIXME: This function assumes that repeatable groups (except multi-selects) should
 * always be expanded. However, this would break once the Group node allows to set
 * specific numeric or semantic indices instead of iterating over the entire group.
 * To fix this, we would need to introduce a dependency to the default content
 * elements, so that we can consider the Group node's settings here.
 */
function isExpandableSegment(
	pathUpToSegment: ModelPath,
	dmElement: DocumentModel.Element,
	dataContext: EntityInstancePath
): boolean {
	const isInContext =
		!ModelPath.equal(pathUpToSegment, dataContext) &&
		ModelPath.contains(pathUpToSegment, dataContext);
	const isRepeatableGroup = dmElement?.type === "Group" && dmElement.repeatability > 1;
	const isMultiSelect = dmElement?.type === "Group" && dmElement.usageType === "multi-select";

	return isInContext && isRepeatableGroup && !isMultiSelect;
}

function getIndex(
	pathUpToSegment: ModelPath,
	dmElement: DocumentModel.Element,
	dataContext: EntityInstancePath
): number {
	const isPrefixOfContext = ModelPath.contains(dataContext, pathUpToSegment);
	const indexOfContextSegment = isPrefixOfContext
		? dataContext.at(pathUpToSegment.length - 1)?.index
		: undefined;

	const isMultiSelect = dmElement?.type === "Group" && dmElement.usageType === "multi-select";

	return indexOfContextSegment !== undefined ? indexOfContextSegment : isMultiSelect ? 0 : 1;
}
