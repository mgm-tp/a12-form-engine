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

import type { NodeData, NodePath } from "@com.mgmtp.a12.contentengine/contentengine-core";
import { DefaultElementModules } from "@com.mgmtp.a12.contentengine/contentengine-default-element-library";
import type {
	DocumentElementReference,
	ModelState,
	Selector
} from "@com.mgmtp.a12.contentengine/contentengine-editor";
import {
	DocumentModelUtils,
	ErrorMessages,
	ModelStateSelector,
	Throwable
} from "@com.mgmtp.a12.contentengine/contentengine-editor";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

/**
 * @internal
 *
 * FIXME: The code in this file has been copied and slightly adapted from the
 * Content Editor to make it more generic and suitable for our use cases.
 *
 * The Content Editor should at least extend candidateGroups to also align it
 * with candidateFields, which also returns fields from ancestor groups and
 * not just from the current group.
 *
 * Is there also a use case for only showing fields/groups from the current
 * group and ignore ancestors?
 *
 * Is there a case where the result should contain a mixture of fields and
 * groups? Then we should definitely have a candidateElements function, so
 * that fields/groups on the same level are next to each other in the resulting
 * list.
 */
export function candidateElements(options?: {
	traverseRepeatableGroups: true;
}): Selector<
	ModelState,
	(
		nodePath: NodePath,
		predicate?: (element: DocumentModel.Element) => boolean
	) => Throwable<DocumentElementReference<DocumentModel.Element>[]>
> {
	return state => (nodePath, predicate) => {
		const nodeData = ModelStateSelector.nodeDataByPath(nodePath)(state);

		if (!nodeData) {
			return Throwable.Failure(
				new Error(`Can not find node data with path ${JSON.stringify(nodePath)}`)
			);
		}

		const documentModel = ModelStateSelector.documentModel()(state);

		if (!documentModel) {
			return Throwable.Failure(new Error(ErrorMessages.missingDocumentModel()));
		}

		const upperGroup = closestUpperGroup()(state)(nodeData);

		if (upperGroup.isErr()) {
			return upperGroup;
		}

		const parentGroups = getParentGroups()(state)(upperGroup.value);

		if (parentGroups.isErr()) {
			return parentGroups;
		}

		return Throwable.Success(
			uniqueBy(
				[...parentGroups.value, upperGroup.value].flatMap(group =>
					DocumentModelUtils.filterChildElements(
						group,
						(element): element is DocumentModel.Element => predicate?.(element) ?? true,
						options
					)
				),
				({ element }) => element.id
			)
		);
	};
}

function getParentGroups(): Selector<
	ModelState,
	(
		groupReference: DocumentElementReference<DocumentModel.Group>
	) => Throwable<DocumentElementReference<DocumentModel.Group>[]>
> {
	return state => {
		return groupReference => {
			const documentModelService = ModelStateSelector.documentModelService()(state);

			if (!documentModelService) {
				return Throwable.Failure(new Error(ErrorMessages.missingDocumentModelService()));
			}

			const result: DocumentElementReference<DocumentModel.Group>[] = [];

			for (let index = 1; index < groupReference.path.length; index++) {
				const parentGroupPath = groupReference.path.slice(0, index);
				const parentGroup = documentModelService?.getElementByPath(parentGroupPath);

				if (parentGroup.type !== "Group") {
					return Throwable.Failure(
						new Error(ErrorMessages.invalidDocumentModelGroupElement(parentGroup.id))
					);
				}

				result.push({ element: parentGroup, path: parentGroupPath });
			}

			return Throwable.Success(result);
		};
	};
}

/** @internal */
export function closestUpperGroup(): Selector<
	ModelState,
	(nodeData: NodeData) => Throwable<DocumentElementReference<DocumentModel.Group>>
> {
	return state => nodeData => {
		const documentModel = ModelStateSelector.documentModel()(state);
		const documentModelService = ModelStateSelector.documentModelService()(state);
		const baseGroup = ModelStateSelector.baseGroup()(state);

		if (!documentModel || !documentModelService) {
			return Throwable.Failure(new Error(ErrorMessages.missingDocumentModel()));
		}

		let parentGroupNode = ModelStateSelector.parentNodeData(nodeData)(state);

		while (
			parentGroupNode !== undefined &&
			!DefaultElementModules.Group.isNodeInstance(parentGroupNode.node)
		) {
			parentGroupNode = ModelStateSelector.parentNodeData(parentGroupNode)(state);
		}

		if (!parentGroupNode) {
			if (baseGroup.isErr()) {
				return baseGroup;
			}

			if (baseGroup.value === undefined) {
				return Throwable.Failure(new Error(ErrorMessages.missingBaseGroup()));
			}

			return Throwable.Success(baseGroup.value);
		}

		if (!DefaultElementModules.Group.isNodeInstance(parentGroupNode.node)) {
			return Throwable.Failure(
				new Error(`Expect a group node. Got: ${JSON.stringify(parentGroupNode.node)}`)
			);
		}

		const { groupId } = parentGroupNode.node.props;

		const groupElementPath = Throwable.wrap(() => documentModelService.getModelPathById(groupId));

		if (groupElementPath.isErr()) {
			return groupElementPath;
		}

		const groupElement = Throwable.wrap(() =>
			documentModelService.getElementByPath(groupElementPath.value)
		);

		if (groupElement.isErr()) {
			return groupElement;
		}

		if (groupElement.value.type !== "Group") {
			return Throwable.Failure(new Error(ErrorMessages.invalidDocumentModelGroupElement(groupId)));
		}

		return Throwable.Success({ element: groupElement.value, path: groupElementPath.value });
	};
}

function uniqueBy<T, U>(array: T[], keyExtractor: (element: T) => U): T[] {
	const seen = new Set<U>();

	return array.filter(item => {
		const key = keyExtractor(item);

		if (seen.has(key)) {
			return false;
		}

		seen.add(key);

		return true;
	});
}
