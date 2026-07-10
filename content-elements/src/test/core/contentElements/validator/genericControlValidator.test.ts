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

import { deepStrictEqual, strictEqual } from "node:assert/strict";

import type {
	ContentModel,
	NodeValidationContext
} from "@com.mgmtp.a12.contentengine/contentengine-core";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { genericControlValidator } from "../../../../main/core/contentElements/consistency/genericControlValidator.js";
import type { BaseControlProps } from "../../../../main/core/index.js";
import { FORM_ELEMENTS_NAMESPACE } from "../../../../main/core/namespace.js";

describe("core.contentElements.validator", () => {
	describe("genericControlValidator", () => {
		it("returns an error for a missing Document Model reference", () => {
			const messages = genericControlValidator({
				context: validationContext(testNode("test-type", "field1"), true),
				isNodeInstance: createIsNodeInstance(true)
			});

			deepStrictEqual(messages, [
				{
					severity: "Error",
					message: `This element requires a Document Model.`
				}
			]);
		});

		it("returns an error for an invalid reference", () => {
			const id = "invalid";

			const messages = genericControlValidator({
				context: validationContext(testNode("test-type", id)),
				isNodeInstance: createIsNodeInstance(true)
			});

			deepStrictEqual(messages, [
				{
					severity: "Error",
					message: `No Document Model element found for id "${id}".`
				}
			]);
		});

		it("returns an error for a reference to an element with incompatible granularity", () => {
			const id = "field2";
			const path = "/root/group2/field2";

			const messages = genericControlValidator({
				context: validationContext(testNode("test-type", id)),
				isNodeInstance: createIsNodeInstance(true)
			});

			deepStrictEqual(messages, [
				{
					severity: "Error",
					message:
						`The Document Model element at path ${path} is not ` +
						`compatible with the current data context /root/group1.`
				}
			]);
		});

		it("returns a warning if the node has children", () => {
			const messages = genericControlValidator({
				context: validationContext(testNode("test-type", "field1", true)),
				isNodeInstance: createIsNodeInstance(true)
			});

			deepStrictEqual(messages, [
				{
					severity: "Warning",
					message: "Child elements are not supported for this element."
				}
			]);
		});

		it("returns no messages if the node is valid", () => {
			const messagesField1 = genericControlValidator({
				context: validationContext(testNode("test-type", "field1")),
				isNodeInstance: createIsNodeInstance(true)
			});

			strictEqual(messagesField1.length, 0);

			const messagesFieldRoot = genericControlValidator({
				context: validationContext(testNode("test-type", "fieldRoot")),
				isNodeInstance: createIsNodeInstance(true)
			});

			strictEqual(messagesFieldRoot.length, 0);
		});

		it("returns no messages for other nodes", () => {
			const messages = genericControlValidator({
				context: validationContext(testNode("test-type", "")),
				isNodeInstance: createIsNodeInstance(false)
			});

			strictEqual(messages.length, 0);
		});

		it("returns all messages returned from additional checks", () => {
			const message1 = { message: "Message1" };
			const message2 = { message: "Message2" };
			const message3 = { message: "Message3" };

			const messages = genericControlValidator({
				context: validationContext(testNode("test-type", "field1")),
				isNodeInstance: createIsNodeInstance(true),
				additionalChecks: [() => [message1, message2], () => [message3]]
			});

			deepStrictEqual(messages, [message1, message2, message3]);
		});
	});
});

function createIsNodeInstance(result: boolean) {
	return (node: ContentModel.Node): node is ContentModel.Node<BaseControlProps> => result;
}

function testNode(
	type: string,
	id: string,
	withChildren?: true
): ContentModel.Node<BaseControlProps> {
	return {
		type,
		namespace: FORM_ELEMENTS_NAMESPACE,
		id: "test",
		props: {
			elementId: id
		},
		children: withChildren
			? [
					{
						type: "type",
						namespace: "namespace",
						id: "id",
						props: {}
					}
				]
			: []
	};
}

function validationContext(node: ContentModel.Node, noDocumentModel?: true): NodeValidationContext {
	return {
		node,
		nodePath: [],
		modelPath: [{ elementName: "root" }, { elementName: "group1" }],
		contentModel: cm(),
		referencedModels: noDocumentModel ? [] : [dm()]
	};
}

function cm(): ContentModel {
	return {} as unknown as ContentModel;
}

function dm(): DocumentModel {
	return {
		header: { modelType: "document" } as unknown as DocumentModel["header"],
		content: {
			modelInfo: {},
			modelConfig: {},
			modelRoot: {
				id: "ROOT",
				type: "Group",
				name: "ROOT_GROUP",
				repeatability: 1,
				elements: [
					{
						id: "root",
						type: "Group",
						repeatability: 1,
						name: "root",
						elements: [
							{
								id: "fieldRoot",
								name: "fieldRoot",
								type: "Field",
								fieldType: {
									type: "StringType"
								}
							},
							{
								id: "group1",
								type: "Group",
								repeatability: 5,
								name: "group1",
								elements: [
									{
										id: "field1",
										name: "field1",
										type: "Field",
										fieldType: {
											type: "StringType"
										}
									}
								]
							},
							{
								id: "group2",
								type: "Group",
								repeatability: 5,
								name: "group2",
								elements: [
									{
										id: "field2",
										name: "field2",
										type: "Field",
										fieldType: {
											type: "StringType"
										}
									}
								]
							}
						]
					}
				]
			}
		} as unknown as DocumentModel["content"]
	};
}
