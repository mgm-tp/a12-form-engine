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

import { deepStrictEqual, notStrictEqual } from "assert";
import { ok, strictEqual } from "assert/strict";
import { mock } from "node:test";

import { useContext, type ComponentType } from "react";

import { DocumentPath, KernelMessage } from "@com.mgmtp.a12.client/client-data";
import { DocumentContext } from "@com.mgmtp.a12.contentengine/contentengine-core";
import { query } from "@com.mgmtp.a12.devtools/react";

import { MessageGroupContainerModule } from "../../../../main/core/contentElements/modules/messageGroupContainer/messageGroupContainerModule.js";
import type { EditableElementList } from "../../../../main/core/contentElements/modules/messageGroupContainer/useCollectEditableElements.js";
import {
	MESSAGE_GROUP_CONTAINER_TYPE,
	MessageGroupContext,
	type CollectedDocumentElementIds,
	type MessageGroupContainerNode,
	type MessageGroupContainerNodeProps,
	type MessageGroupFilter
} from "../../../../main/core/index.js";
import { FORM_ELEMENTS_NAMESPACE } from "../../../../main/core/namespace.js";
import { mockDocumentContext } from "../../../mocks/mockDocumentContext.js";
import { getMockMessage } from "../../../mocks/mockError.js";
import { renderWrapper } from "../../../rtl-utils/render-wrapper.js";

describe("core.contentElements", () => {
	describe("MessageGroupContainer", () => {
		it("renders a MessageGroupContext", () => {
			const mockNode = getMockNode();

			const editableElements = [
				{ nodeId: "node1", elementId: "field1", label: [{ locale: "en", text: "label1" }] },
				{ nodeId: "node2", elementId: "field2", label: [{ locale: "en", text: "label2" }] }
			];

			const AssertionComponent = setup(
				mockNode,
				{
					fieldIds: ["field1"],
					groupIds: ["group1"]
				},
				editableElements
			);

			const props = query(AssertionComponent).props();

			strictEqual(props.context.id, mockNode.id);
			deepStrictEqual(props.context.editableElements, editableElements);
			notStrictEqual(props.context.getGroupedValidationMessages, undefined);
			notStrictEqual(props.context.getUngroupedValidationMessages, undefined);
		});

		describe("get grouped/ungrouped validation messages", () => {
			it("only considers elements from the props if autoCollectNodes is undefined", () => {
				const mockNode = getMockNode({ fields: ["field1"], groups: ["group1"], rules: ["/rule1"] });
				const collectedIds = { fieldIds: ["field2"], groupIds: ["group2"] }; // these should not be grouped

				const AssertionComponent = setup(mockNode, collectedIds);

				const props = query(AssertionComponent).props();

				const { getGroupedValidationMessages, getUngroupedValidationMessages } = props.context;

				const allMessages = setupMessages();

				const groupedResult = getGroupedValidationMessages(allMessages).map(e => e.errorCode);
				const ungroupedResult = getUngroupedValidationMessages(allMessages).map(e => e.errorCode);

				deepStrictEqual(groupedResult, [
					"field1-error",
					"allFields-error",
					"group1-error",
					"allGroups-error",
					"rule1-error",
					"field1-formalError"
				]);
				deepStrictEqual(ungroupedResult, [
					"field2-error",
					"field3-error",
					"group2-error",
					"group3-error",
					"rule2-error",
					"field2-formalError",
					"field3-formalError"
				]);
			});

			it("considers elements from the props and auto collected elements if autoCollectNodes is true", () => {
				const mockNode = getMockNode({
					fields: ["field1"],
					groups: ["group1"],
					rules: ["/rule1"],
					autoCollectNodes: true
				});
				const collectedIds = { fieldIds: ["field2"], groupIds: ["group2"] };

				const AssertionComponent = setup(mockNode, collectedIds);

				const props = query(AssertionComponent).props();

				const { getGroupedValidationMessages, getUngroupedValidationMessages } = props.context;

				const allMessages = setupMessages();

				const groupedResult = getGroupedValidationMessages(allMessages).map(e => e.errorCode);
				const ungroupedResult = getUngroupedValidationMessages(allMessages).map(e => e.errorCode);

				deepStrictEqual(groupedResult, [
					"field1-error",
					"field2-error",
					"allFields-error",
					"group1-error",
					"group2-error",
					"allGroups-error",
					"rule1-error",
					"field1-formalError",
					"field2-formalError"
				]);
				deepStrictEqual(ungroupedResult, [
					"field3-error",
					"group3-error",
					"rule2-error",
					"field3-formalError"
				]);
			});

			it("groups formal errors if ignoreFormalErrors is undefined", () => {
				const mockNode = getMockNode({ fields: ["field1", "field2", "field3"] });

				const AssertionComponent = setup(mockNode);

				const props = query(AssertionComponent).props();

				const { getGroupedValidationMessages, getUngroupedValidationMessages } = props.context;

				const allMessages = setupMessages();

				const groupedResult = getGroupedValidationMessages(allMessages).map(e => e.errorCode);
				const ungroupedResult = getUngroupedValidationMessages(allMessages).map(e => e.errorCode);

				ok(groupedResult.includes("field1-formalError"));
				ok(groupedResult.includes("field2-formalError"));
				ok(groupedResult.includes("field3-formalError"));

				ok(!ungroupedResult.includes("field1-formalError"));
				ok(!ungroupedResult.includes("field2-formalError"));
				ok(!ungroupedResult.includes("field3-formalError"));
			});

			it("does not group formal errors if ignoreFormalErrors is true", () => {
				const mockNode = getMockNode({
					fields: ["field1", "field2", "field3"],
					ignoreFormalErrors: true
				});

				const AssertionComponent = setup(mockNode);

				const props = query(AssertionComponent).props();

				const { getGroupedValidationMessages, getUngroupedValidationMessages } = props.context;

				const allMessages = setupMessages();

				const groupedResult = getGroupedValidationMessages(allMessages).map(e => e.errorCode);
				const ungroupedResult = getUngroupedValidationMessages(allMessages).map(e => e.errorCode);

				ok(!groupedResult.includes("field1-formalError"));
				ok(!groupedResult.includes("field2-formalError"));
				ok(!groupedResult.includes("field3-formalError"));

				ok(ungroupedResult.includes("field1-formalError"));
				ok(ungroupedResult.includes("field2-formalError"));
				ok(ungroupedResult.includes("field3-formalError"));
			});
		});
	});
});

function setup(
	mockNode: MessageGroupContainerNode,
	groupedElements: CollectedDocumentElementIds = { fieldIds: [], groupIds: [] },
	editableElements: EditableElementList = []
): ComponentType<{ context: MessageGroupFilter }> {
	const AssertionComponent: ComponentType<{ context: MessageGroupFilter }> = mock.fn();
	const ContextConsumer = () => {
		const context = useContext(MessageGroupContext);
		return <AssertionComponent context={context} />;
	};

	const baseDocContext = mockDocumentContext();
	const mockDocContext = {
		...baseDocContext,
		model: {
			...baseDocContext.model,
			getModelPathById: (_state: object, id: string) => [{ elementName: id }]
		}
	};

	renderWrapper(
		<DocumentContext.Provider value={mockDocContext}>
			<MessageGroupContainerModule.renderer node={mockNode}>
				<ContextConsumer />
			</MessageGroupContainerModule.renderer>
		</DocumentContext.Provider>,
		{
			functionMap: {
				useCollectDocumentElementIds: () => groupedElements,
				useCollectEditableElements: () => editableElements
			}
		}
	);

	return AssertionComponent;
}

function setupMessages() {
	return [
		getMockMessage({
			errorCode: "field1-error",
			referencedFields: [DocumentPath.fromString("/field1[1]")]
		}),
		getMockMessage({
			errorCode: "field2-error",
			referencedFields: [DocumentPath.fromString("/field2[1]")]
		}),
		getMockMessage({
			errorCode: "field3-error",
			referencedFields: [DocumentPath.fromString("/field3[1]")]
		}),
		getMockMessage({
			errorCode: "allFields-error",
			referencedFields: [
				DocumentPath.fromString("/field1[1]"),
				DocumentPath.fromString("/field2[1]"),
				DocumentPath.fromString("/field3[1]")
			]
		}),

		getMockMessage({
			errorCode: "group1-error",
			referencedFields: [DocumentPath.fromString("/group1[1]")]
		}),
		getMockMessage({
			errorCode: "group2-error",
			referencedFields: [DocumentPath.fromString("/group2[1]")]
		}),
		getMockMessage({
			errorCode: "group3-error",
			referencedFields: [DocumentPath.fromString("/group3[1]")]
		}),
		getMockMessage({
			errorCode: "allGroups-error",
			referencedFields: [
				DocumentPath.fromString("/group1[1]"),
				DocumentPath.fromString("/group2[1]"),
				DocumentPath.fromString("/group3[1]")
			]
		}),

		getMockMessage({ errorCode: "rule1-error", rulePath: "/rule1" }),
		getMockMessage({ errorCode: "rule2-error", rulePath: "/rule2" }),

		getMockMessage({
			errorCode: "field1-formalError",
			referencedFields: [DocumentPath.fromString("/field1[1]")],
			rulePath: KernelMessage.FORMAL_VALIDATION
		}),
		getMockMessage({
			errorCode: "field2-formalError",
			referencedFields: [DocumentPath.fromString("/field2[1]")],
			rulePath: KernelMessage.FORMAL_VALIDATION
		}),
		getMockMessage({
			errorCode: "field3-formalError",
			referencedFields: [DocumentPath.fromString("/field3[1]")],
			rulePath: KernelMessage.FORMAL_VALIDATION
		})
	];
}

function getMockNode(options?: MessageGroupContainerNodeProps): MessageGroupContainerNode {
	return {
		id: "test-node-id",
		namespace: FORM_ELEMENTS_NAMESPACE,
		type: MESSAGE_GROUP_CONTAINER_TYPE,
		props: {
			fields: [],
			groups: [],
			rules: [],
			...options
		}
	};
}
