// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { deepStrictEqual, strictEqual } from "node:assert/strict";

import type {
	ContentModel,
	NodeValidationContext
} from "@com.mgmtp.a12.contentengine/contentengine-core";

import { MESSAGE_GROUP_CONTAINER_TYPE } from "../../../../main/core/contentElements/modules/messageGroupContainer/messageGroupContainerNode.js";
import { MESSAGE_GROUP_DISPLAY_TYPE } from "../../../../main/core/contentElements/modules/messageGroupDisplay/messageGroupDisplayNode.js";
import { messageGroupDisplayValidator } from "../../../../main/core/contentElements/modules/messageGroupDisplay/messageGroupDisplayValidator.js";
import { FORM_ELEMENTS_NAMESPACE } from "../../../../main/core/namespace.js";

describe("MessageGroupDisplayValidator", () => {
	it("returns a warning if the element is not nested in any MessageGroupContainer", () => {
		const messages = messageGroupDisplayValidator(
			validationContext(
				testNode({ type: MESSAGE_GROUP_DISPLAY_TYPE, id: "displayWithoutContainer" })
			)
		);

		deepStrictEqual(messages, [
			{
				severity: "Warning",
				message:
					"This element is not nested in any Message Group Container. " +
					"A Message Group Display without a Message Group Container will not display any messages."
			}
		]);
	});

	it("returns a warning if the node has children", () => {
		const messages = messageGroupDisplayValidator(
			validationContext(
				testNode({
					type: MESSAGE_GROUP_DISPLAY_TYPE,
					id: "displayInContainer",
					children: [testNode({ type: "test", id: "test1" })]
				})
			)
		);

		deepStrictEqual(messages, [
			{
				severity: "Warning",
				message: "Child elements are not supported for this element."
			}
		]);
	});

	it("returns no messages if the element is nested in a MessageGroupContainer", () => {
		const messages = messageGroupDisplayValidator(
			validationContext(testNode({ type: MESSAGE_GROUP_DISPLAY_TYPE, id: "displayInContainer" }))
		);

		strictEqual(messages.length, 0);
	});

	it("returns no messages for other nodes", () => {
		const messages = messageGroupDisplayValidator(
			validationContext(testNode({ type: "test", id: "test1" }))
		);

		strictEqual(messages.length, 0);
	});
});

function validationContext(node: ContentModel.Node): NodeValidationContext {
	return {
		node,
		nodePath: [],
		contentModel: cm(),
		referencedModels: []
	};
}

function cm(): ContentModel {
	return {
		header: { modelType: "content" } as unknown as ContentModel["header"],
		content: {
			root: testNode({
				type: "test",
				id: "test1",
				children: [
					testNode({
						type: MESSAGE_GROUP_CONTAINER_TYPE,
						id: "container",
						children: [
							testNode({
								type: "test",
								id: "test2",
								children: [
									testNode({
										type: MESSAGE_GROUP_DISPLAY_TYPE,
										id: "displayInContainer"
									})
								]
							})
						]
					}),
					testNode({
						type: "test",
						id: "test3",
						children: [
							testNode({
								type: MESSAGE_GROUP_DISPLAY_TYPE,
								id: "displayWithoutContainer"
							})
						]
					})
				]
			})
		}
	};
}

function testNode(options: {
	type: string;
	id: string;
	children?: ContentModel.Node[];
}): ContentModel.Node {
	const { type, id, children } = options;

	return {
		type,
		namespace: FORM_ELEMENTS_NAMESPACE,
		id,
		props: {},
		children
	};
}
