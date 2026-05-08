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

import { deepStrictEqual } from "node:assert/strict";

import type { ContentModel } from "@com.mgmtp.a12.contentengine/contentengine-core";
import type { LocalizedModelText } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { CHECKBOX_TYPE } from "../../../../../main/core/contentElements/modules/checkbox/checkboxNode.js";
import {
	MESSAGE_GROUP_CONTAINER_TYPE,
	type MessageGroupContainerNode
} from "../../../../../main/core/contentElements/modules/messageGroupContainer/messageGroupContainerNode.js";
import { collectEditableElements } from "../../../../../main/core/contentElements/modules/messageGroupContainer/useCollectEditableElements.js";
import {
	MESSAGE_GROUP_DISPLAY_TYPE,
	type MessageGroupDisplayNode
} from "../../../../../main/core/contentElements/modules/messageGroupDisplay/messageGroupDisplayNode.js";
import { TEXT_LINE_TYPE } from "../../../../../main/core/contentElements/modules/textLine/textLineNode.js";
import type { BaseControlProps } from "../../../../../main/core/index.js";
import { FORM_ELEMENTS_NAMESPACE } from "../../../../../main/core/namespace.js";

describe("collectEditableElements", () => {
	it("should return empty results when MessageGroupContainer has no children", () => {
		const node = createMessageGroupContainerNode();
		deepStrictEqual(collectEditableElements(node), []);
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

		deepStrictEqual(collectEditableElements(node), expectedElements);
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

		deepStrictEqual(collectEditableElements(node), [
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

		deepStrictEqual(collectEditableElements(node), [
			{ nodeId: "textline-included-field", elementId: "included-field", label: undefined }
		]);
	});

	it("should skip non-form element nodes", () => {
		const node = createMessageGroupContainerNode([
			createTextLineNode("form-field"),
			createNonFormElementNode()
		]);

		deepStrictEqual(collectEditableElements(node), [
			{ nodeId: "textline-form-field", elementId: "form-field", label: undefined }
		]);
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
