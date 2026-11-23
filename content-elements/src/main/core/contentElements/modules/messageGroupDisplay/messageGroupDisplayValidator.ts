// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type {
	NodeValidationContext,
	ValidationMessage
} from "@com.mgmtp.a12.contentengine/contentengine-core";
import { NodeUtilities } from "@com.mgmtp.a12.contentengine/contentengine-core";
import type { ContentModel } from "@com.mgmtp.a12.contentengine/contentengine-core";

import { checkNoChildren } from "../../consistency/checkNoChildren.js";

import { isMessageGroupContainerNode } from "../messageGroupContainer/messageGroupContainerNode.js";

import type { MessageGroupDisplayNode } from "./messageGroupDisplayNode.js";
import { isMessageGroupDisplayNode } from "./messageGroupDisplayNode.js";

/** @internal */
export function messageGroupDisplayValidator(context: NodeValidationContext): ValidationMessage[] {
	const { node, contentModel } = context;

	if (!isMessageGroupDisplayNode(node)) {
		return [];
	}

	const result: ValidationMessage[] = [];

	const rootNode = contentModel.content.root;

	result.push(...checkNoChildren(node));

	if (rootNode) {
		result.push(...checkNestedInContainer(node, rootNode));
	}

	return result;
}

function checkNestedInContainer(
	checkedNode: MessageGroupDisplayNode,
	rootNode: ContentModel.Node
): ValidationMessage[] {
	const nodePath = NodeUtilities.findNodePath(rootNode, n => n.id === checkedNode.id);

	if (!nodePath?.some(isMessageGroupContainerNode)) {
		return [
			{
				severity: "Warning",
				message:
					"This element is not nested in any Message Group Container. " +
					"A Message Group Display without a Message Group Container will not display any messages."
			}
		];
	}

	return [];
}
