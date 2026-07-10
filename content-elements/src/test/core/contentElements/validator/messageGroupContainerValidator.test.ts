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

import { MESSAGE_GROUP_CONTAINER_TYPE } from "../../../../main/core/contentElements/modules/messageGroupContainer/messageGroupContainerNode.js";
import { messageGroupContainerValidator } from "../../../../main/core/contentElements/modules/messageGroupContainer/messageGroupContainerValidator.js";
import { MESSAGE_GROUP_DISPLAY_TYPE } from "../../../../main/core/contentElements/modules/messageGroupDisplay/messageGroupDisplayNode.js";
import { FORM_ELEMENTS_NAMESPACE } from "../../../../main/core/namespace.js";

describe("core.contentElements.validator", () => {
	describe("MessageGroupContainerValidator", () => {
		it("returns an error for a missing Document Model reference if the props contain any references", () => {
			const testProps = [
				{
					fields: ["field"]
				},
				{
					groups: ["group"]
				},
				{
					rules: ["rule"]
				}
			];

			for (const props of testProps) {
				const messages = messageGroupContainerValidator(
					validationContext(
						testNode({
							type: MESSAGE_GROUP_CONTAINER_TYPE,
							...props
						}),
						true
					)
				);
				deepStrictEqual(messages, [
					{
						severity: "Error",
						message: `This element requires a Document Model.`
					}
				]);
			}
		});

		// ensure consistent error state between model tree and settings panel
		// (no references in the settings panel => no error for invalid references)
		it("returns no error for a missing Document Model reference if the props do not contain any references", () => {
			const messages = messageGroupContainerValidator(
				validationContext(
					testNode({
						type: MESSAGE_GROUP_CONTAINER_TYPE
					}),
					true
				)
			);

			deepStrictEqual(messages, []);
		});

		it("returns errors for invalid field or group references", () => {
			const fieldId = "field";
			const fieldPath = "/root/group/field";

			const groupId = "group";
			const groupPath = "/root/group";

			const invalidId = "/invalid/path";

			const messages = messageGroupContainerValidator(
				validationContext(
					testNode({
						type: MESSAGE_GROUP_CONTAINER_TYPE,
						fields: [groupId, invalidId],
						groups: [fieldId, invalidId]
					})
				)
			);

			deepStrictEqual(messages, [
				{
					severity: "Error",
					message: `The path ${groupPath} points to a group. A field was expected.`
				},
				{
					severity: "Error",
					message: `No Document Model element found for id "${invalidId}".`
				},
				{
					severity: "Error",
					message: `The path ${fieldPath} points to a field. A group was expected.`
				},
				{
					severity: "Error",
					message: `No Document Model element found for id "${invalidId}".`
				}
			]);
		});

		it("returns a warning if the container does not contain a MessageGroupDisplay element", () => {
			const messages = messageGroupContainerValidator(
				validationContext(
					testNode({
						type: MESSAGE_GROUP_CONTAINER_TYPE,
						fields: ["field"],
						groups: ["group"],
						withoutDisplay: true
					})
				)
			);

			deepStrictEqual(messages, [
				{
					severity: "Warning",
					message:
						"This element does not contain any Message Group Display. " +
						"Messages, that are grouped by this element's configuration might not be displayed anywhere if no Message Group Display element is added."
				}
			]);
		});

		it("returns no messages if all field/group references are valid", () => {
			const messages = messageGroupContainerValidator(
				validationContext(
					testNode({
						type: MESSAGE_GROUP_CONTAINER_TYPE,
						fields: ["field", "repeatableField"],
						groups: ["group", "repeatableGroup"]
					})
				)
			);

			strictEqual(messages.length, 0);
		});

		it("returns no messages for other nodes", () => {
			const messages = messageGroupContainerValidator(
				validationContext(testNode({ type: "test" }))
			);

			strictEqual(messages.length, 0);
		});
	});
});

function validationContext(node: ContentModel.Node, noDocumentModel?: true): NodeValidationContext {
	return {
		node,
		nodePath: [],
		contentModel: cm(),
		referencedModels: noDocumentModel ? [] : [dm()]
	};
}

function cm(): ContentModel {
	return {} as unknown as ContentModel;
}

function testNode(options: {
	type: string;
	fields?: string[];
	groups?: string[];
	rules?: string[];
	withoutDisplay?: true;
}): ContentModel.Node {
	const { type, fields, groups, rules, withoutDisplay } = options;

	return {
		type,
		namespace: FORM_ELEMENTS_NAMESPACE,
		id: "test",
		props: {
			fields,
			groups,
			rules,
			ignoreFormalErrors: false
		},
		children: withoutDisplay
			? []
			: [
					{
						type: MESSAGE_GROUP_DISPLAY_TYPE,
						namespace: FORM_ELEMENTS_NAMESPACE,
						id: "display",
						props: {}
					}
				]
	};
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
								id: "group",
								type: "Group",
								repeatability: 1,
								name: "group",
								elements: [
									{
										id: "field",
										name: "field",
										type: "Field",
										fieldType: {
											type: "StringType"
										}
									}
								]
							},
							{
								id: "repeatableGroup",
								type: "Group",
								repeatability: 99,
								name: "repeatableGroup",
								elements: [
									{
										id: "repeatableField",
										name: "repeatableField",
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
