// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { Model } from "@com.mgmtp.a12.client/client-core/lib/core/model/index.js";
import type {
	ContentModel,
	NodeValidationContext,
	ValidationMessage
} from "@com.mgmtp.a12.contentengine/contentengine-core";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { DocumentServiceFactory } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/facade.js";

import { checkDmReference } from "../../consistency/checkDmReference.js";
import { checkValidElementReference } from "../../consistency/checkValidElementReference.js";

import { isMessageGroupDisplayNode } from "../messageGroupDisplay/messageGroupDisplayNode.js";

import { isMessageGroupContainerNode } from "./messageGroupContainerNode.js";

/** @internal */
export function messageGroupContainerValidator(
	context: NodeValidationContext
): ValidationMessage[] {
	const { node, referencedModels } = context;

	if (!isMessageGroupContainerNode(node)) {
		return [];
	}

	const result: ValidationMessage[] = [];

	result.push(...checkHasDisplay(node));

	const dm = referencedModels?.find(Model.isDocumentModel);

	if (node.props.fields?.length || node.props.groups?.length || node.props.rules?.length) {
		result.push(...checkDmReference(dm));
	}

	if (dm) {
		const documentModelService = new DocumentServiceFactory().getDocumentModelSearchService(dm);

		node.props.fields?.forEach(id => checkFieldOrGroup(id, "Field"));
		node.props.groups?.forEach(id => checkFieldOrGroup(id, "Group"));

		// FIXME: we cannot check the rule references, because the deserialized dm doesn't contain rules

		function checkFieldOrGroup(id: string, expectedType: "Field" | "Group") {
			const elementPath = documentModelService.getPathById(id) ?? [];
			const element = documentModelService.getByPath(elementPath);

			result.push(
				...checkValidElementReference({
					elementId: id,
					element
				}),
				...checkElementHasValidType(expectedType, elementPath, element)
			);
		}
	}

	return result;
}

function checkElementHasValidType(
	expectedType: "Field" | "Group",
	path: ModelPath,
	element?: DocumentModel.Element
): ValidationMessage[] {
	if (element && element.type !== expectedType) {
		return [
			{
				severity: "Error",
				message:
					`The path ${ModelPath.toString(path)} points to a ${element.type.toLocaleLowerCase()}. ` +
					`A ${expectedType.toLocaleLowerCase()} was expected.`
			}
		];
	}

	return [];
}

function checkHasDisplay(node: ContentModel.Node): ValidationMessage[] {
	if (!hasDisplayRecursive(node)) {
		return [
			{
				severity: "Warning",
				message:
					"This element does not contain any Message Group Display. " +
					"Messages, that are grouped by this element's configuration might not be displayed anywhere if no Message Group Display element is added."
			}
		];
	}

	return [];
}

function hasDisplayRecursive(node: ContentModel.Node): boolean {
	return node.children?.some(c => isMessageGroupDisplayNode(c) || hasDisplayRecursive(c)) ?? false;
}
