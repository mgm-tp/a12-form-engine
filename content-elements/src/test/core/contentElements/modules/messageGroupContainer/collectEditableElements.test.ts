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

import { deepStrictEqual } from "node:assert/strict";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import { DocumentPath } from "@com.mgmtp.a12.client/client-data";
import type { ContentModel } from "@com.mgmtp.a12.contentengine/contentengine-core";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import type { LocalizedModelText } from "@com.mgmtp.a12.utils/utils-localization";

import { CHECKBOX_TYPE } from "../../../../../main/core/contentElements/modules/checkbox/checkboxNode.js";
import { MESSAGE_GROUP_CONTAINER_TYPE } from "../../../../../main/core/contentElements/modules/messageGroupContainer/messageGroupContainerNode.js";
import type { MessageGroupContainerNode } from "../../../../../main/core/contentElements/modules/messageGroupContainer/messageGroupContainerNode.js";
import {
	collectEditableModelElements,
	getRelevantPathsInContext
} from "../../../../../main/core/contentElements/modules/messageGroupContainer/useCollectEditableElements.js";
import type { EditableModelElementExtractor } from "../../../../../main/core/contentElements/modules/messageGroupContainer/useCollectEditableElements.js";
import { MESSAGE_GROUP_DISPLAY_TYPE } from "../../../../../main/core/contentElements/modules/messageGroupDisplay/messageGroupDisplayNode.js";
import type { MessageGroupDisplayNode } from "../../../../../main/core/contentElements/modules/messageGroupDisplay/messageGroupDisplayNode.js";
import { TEXT_LINE_TYPE } from "../../../../../main/core/contentElements/modules/textLine/textLineNode.js";
import type { BaseControlProps } from "../../../../../main/core/index.js";
import { FORM_ELEMENTS_NAMESPACE } from "../../../../../main/core/namespace.js";

describe("core.contentElements", () => {
	describe("collectEditableModelElements", () => {
		it("should return empty results when MessageGroupContainer has no children", () => {
			const node = createMessageGroupContainerNode();
			deepStrictEqual(collectEditableModelElements(node), []);
		});

		it("should collect elements from deeply nested structures", () => {
			const deepInput = createCheckboxNode("deep-field", testLabel("deep-field"));
			const deepInputFromAnotherMessageGroup = createTextLineNode(
				"deep-field-from-another-message-group",
				testLabel("deep-field-from-another-message-group")
			);
			const middleInput = createTextLineNode("middle-field", testLabel("middle-field"));
			const rootInput = createTextLineNode("root-field", testLabel("root-field"));
			const anotherRootInput = createCheckboxNode(
				"another-root-field",
				testLabel("another-root-field")
			);

			const deepContainer = createGenericContainerNode("deep-container", [
				createGenericContainerNode("deeper-container", [deepInput])
			]);
			const deepMessageGroupContainer = createMessageGroupContainerNode([
				deepInputFromAnotherMessageGroup
			]);
			const middleContainer = createGenericContainerNode("middle-container", [
				middleInput,
				deepContainer,
				deepMessageGroupContainer
			]);

			const node = createMessageGroupContainerNode([rootInput, middleContainer, anotherRootInput]);

			const expectedElements = [
				rootInput,
				middleInput,
				deepInput,
				deepInputFromAnotherMessageGroup,
				anotherRootInput
			].map(element => ({
				nodeId: element.id,
				elementId: element.props.elementId,
				label: testLabel(element.props.elementId)
			}));

			deepStrictEqual(collectEditableModelElements(node), expectedElements);
		});

		it("should collect elements from multiple MessageGroupDisplay nodes correctly", () => {
			const firstDisplay = createMessageGroupDisplayNode([createTextLineNode("hidden-field1")]);

			const secondDisplay = createMessageGroupDisplayNode([createCheckboxNode("hidden-field2")]);

			const node = createMessageGroupContainerNode([
				createTextLineNode("visible-field1"),
				firstDisplay,
				createCheckboxNode("visible-field2"),
				secondDisplay
			]);

			deepStrictEqual(collectEditableModelElements(node), [
				{ nodeId: "textline-visible-field1", elementId: "visible-field1", label: undefined },
				{ nodeId: "checkbox-visible-field2", elementId: "visible-field2", label: undefined }
			]);
		});

		it("should skip elements nested in MessageGroupDisplay", () => {
			const messageGroupDisplay = createMessageGroupDisplayNode([
				createTextLineNode("should-not-be-included")
			]);

			const node = createMessageGroupContainerNode([
				createTextLineNode("included-field"),
				messageGroupDisplay
			]);

			deepStrictEqual(collectEditableModelElements(node), [
				{ nodeId: "textline-included-field", elementId: "included-field", label: undefined }
			]);
		});

		it("should skip non-form element nodes", () => {
			const node = createMessageGroupContainerNode([
				createTextLineNode("form-field"),
				createNonFormElementNode()
			]);

			deepStrictEqual(collectEditableModelElements(node), [
				{ nodeId: "textline-form-field", elementId: "form-field", label: undefined }
			]);
		});

		it("should collect custom nodes using additionalExtractor", () => {
			const customNode = createNonFormElementNode();
			const node = createMessageGroupContainerNode([createTextLineNode("form-field"), customNode]);

			const additionalExtractor: EditableModelElementExtractor = n =>
				n.id === customNode.id
					? { nodeId: n.id, elementId: "custom-element-id", label: testLabel("custom-label") }
					: null;

			deepStrictEqual(collectEditableModelElements(node, additionalExtractor), [
				{ nodeId: "textline-form-field", elementId: "form-field", label: undefined },
				{ nodeId: customNode.id, elementId: "custom-element-id", label: testLabel("custom-label") }
			]);
		});

		it("should not collect custom nodes when additionalExtractor returns null", () => {
			const node = createMessageGroupContainerNode([
				createTextLineNode("form-field"),
				createNonFormElementNode()
			]);

			const additionalExtractor: EditableModelElementExtractor = () => null;

			deepStrictEqual(collectEditableModelElements(node, additionalExtractor), [
				{ nodeId: "textline-form-field", elementId: "form-field", label: undefined }
			]);
		});
	});

	describe("getRelevantPathsInContext", () => {
		it("does not return paths for non-existing data contexts", () => {
			const result = getRelevantPathsInContext({
				elementId: "test-id",
				dataContext: [],
				getModelPathById: () => ModelPath.fromString("/root/repeatable/nestedRepeatable/field"),
				getElementByPath,
				getRowCount: dataRef => (dataRef === "/root[1]/repeatable[2]/nestedRepeatable[0]" ? 0 : 3),
				getNotRelevant: () => false
			});

			deepStrictEqual(result, [
				DocumentPath.fromString("/root[1]/repeatable[1]/nestedRepeatable[1]/field[1]"),
				DocumentPath.fromString("/root[1]/repeatable[1]/nestedRepeatable[2]/field[1]"),
				DocumentPath.fromString("/root[1]/repeatable[1]/nestedRepeatable[3]/field[1]"),
				DocumentPath.fromString("/root[1]/repeatable[3]/nestedRepeatable[1]/field[1]"),
				DocumentPath.fromString("/root[1]/repeatable[3]/nestedRepeatable[2]/field[1]"),
				DocumentPath.fromString("/root[1]/repeatable[3]/nestedRepeatable[3]/field[1]")
			]);
		});

		it("does not return paths for non-relevant elements", () => {
			const result = getRelevantPathsInContext({
				elementId: "test-id",
				dataContext: [],
				getModelPathById: () => ModelPath.fromString("/root/repeatable/field"),
				getElementByPath,
				getRowCount: () => 3,
				getNotRelevant: dataRef => (dataRef === "/root[1]/repeatable[2]/field[1]" ? true : false)
			});

			deepStrictEqual(result, [
				DocumentPath.fromString("/root[1]/repeatable[1]/field[1]"),
				DocumentPath.fromString("/root[1]/repeatable[3]/field[1]")
			]);
		});

		it("does not expand path segments for multi-selects", () => {
			const result = getRelevantPathsInContext({
				elementId: "test-id",
				dataContext: [],
				getModelPathById: () => ModelPath.fromString("/root/repeatable/multiSelect"),
				getElementByPath,
				getRowCount: () => 3,
				getNotRelevant: () => false
			});

			deepStrictEqual(result, [
				DocumentPath.fromString("/root[1]/repeatable[1]/multiSelect[0]"),
				DocumentPath.fromString("/root[1]/repeatable[2]/multiSelect[0]"),
				DocumentPath.fromString("/root[1]/repeatable[3]/multiSelect[0]")
			]);
		});

		it("does not expand path segments for repeatable groups outside of the current data context", () => {
			const result = getRelevantPathsInContext({
				elementId: "test-id",
				dataContext: DocumentPath.fromString("/root[1]/repeatable[2]"),
				getModelPathById: () => ModelPath.fromString("/root/repeatable/nestedRepeatable/field"),
				getElementByPath,
				getRowCount: () => 3,
				getNotRelevant: () => false
			});

			deepStrictEqual(result, [
				DocumentPath.fromString("/root[1]/repeatable[2]/nestedRepeatable[1]/field[1]"),
				DocumentPath.fromString("/root[1]/repeatable[2]/nestedRepeatable[2]/field[1]"),
				DocumentPath.fromString("/root[1]/repeatable[2]/nestedRepeatable[3]/field[1]")
			]);
		});

		it("expands path segments for repeatable groups based on the document", () => {
			const result = getRelevantPathsInContext({
				elementId: "test-id",
				dataContext: [],
				getModelPathById: () => ModelPath.fromString("/root/repeatable/nestedRepeatable/field"),
				getElementByPath,
				getRowCount: () => 3,
				getNotRelevant: () => false
			});

			deepStrictEqual(result, [
				DocumentPath.fromString("/root[1]/repeatable[1]/nestedRepeatable[1]/field[1]"),
				DocumentPath.fromString("/root[1]/repeatable[1]/nestedRepeatable[2]/field[1]"),
				DocumentPath.fromString("/root[1]/repeatable[1]/nestedRepeatable[3]/field[1]"),
				DocumentPath.fromString("/root[1]/repeatable[2]/nestedRepeatable[1]/field[1]"),
				DocumentPath.fromString("/root[1]/repeatable[2]/nestedRepeatable[2]/field[1]"),
				DocumentPath.fromString("/root[1]/repeatable[2]/nestedRepeatable[3]/field[1]"),
				DocumentPath.fromString("/root[1]/repeatable[3]/nestedRepeatable[1]/field[1]"),
				DocumentPath.fromString("/root[1]/repeatable[3]/nestedRepeatable[2]/field[1]"),
				DocumentPath.fromString("/root[1]/repeatable[3]/nestedRepeatable[3]/field[1]")
			]);
		});
	});
});

function createTextLineNode(
	elementId: string,
	label?: LocalizedModelText
): ContentModel.Node<BaseControlProps> {
	return {
		id: `textline-${elementId}`,
		namespace: FORM_ELEMENTS_NAMESPACE,
		type: TEXT_LINE_TYPE,
		props: { elementId, label }
	};
}

function createCheckboxNode(
	elementId: string,
	label?: LocalizedModelText
): ContentModel.Node<BaseControlProps> {
	return {
		id: `checkbox-${elementId}`,
		namespace: FORM_ELEMENTS_NAMESPACE,
		type: CHECKBOX_TYPE,
		props: { elementId, label }
	};
}

function testLabel(label: string): LocalizedModelText {
	return [{ locale: "en", text: label }];
}

function createMessageGroupContainerNode(
	children?: ContentModel.Node[]
): MessageGroupContainerNode {
	return {
		id: "message-group-container",
		namespace: FORM_ELEMENTS_NAMESPACE,
		type: MESSAGE_GROUP_CONTAINER_TYPE,
		props: {},
		children
	};
}

function createMessageGroupDisplayNode(children?: ContentModel.Node[]): MessageGroupDisplayNode {
	return {
		id: "message-group-display",
		namespace: FORM_ELEMENTS_NAMESPACE,
		type: MESSAGE_GROUP_DISPLAY_TYPE,
		props: {},
		children
	};
}

function createNonFormElementNode(): ContentModel.Node {
	return {
		id: "non-form-element",
		namespace: "SomeOtherNamespace",
		type: "SomeType",
		props: {
			elementId: "someElementId"
		},
		children: []
	};
}

function createGenericContainerNode(id: string, children?: ContentModel.Node[]): ContentModel.Node {
	return {
		id,
		namespace: "SomeNamespace",
		type: "Container",
		props: {},
		children
	};
}

function getElementByPath(path: ModelPath): DocumentModel.Element {
	switch (true) {
		case ModelPath.equal(path, ModelPath.fromString("/root")): {
			return group();
		}
		case ModelPath.equal(path, ModelPath.fromString("/root/repeatable")):
		case ModelPath.equal(path, ModelPath.fromString("/root/repeatable/nestedRepeatable")): {
			return group(5);
		}
		case ModelPath.equal(path, ModelPath.fromString("/root/repeatable/multiSelect")): {
			return multiSelect();
		}
		default:
			return field();
	}
}

function field(): DocumentModel.Field {
	return {
		id: "field",
		name: "field",
		type: "Field",
		fieldType: { type: "StringType" }
	};
}

function group(repeatability?: number): DocumentModel.Group {
	return {
		id: "group",
		name: "group",
		type: "Group",
		repeatability: repeatability ?? 1,
		elements: []
	};
}

function multiSelect(): DocumentModel.Group {
	return {
		id: "multi-select",
		name: "multi-select",
		type: "Group",
		usageType: "multi-select",
		repeatability: 999,
		elements: []
	};
}
