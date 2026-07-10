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
import { mock } from "node:test";

import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { Provider } from "react-redux";

import type { ContentModel } from "@com.mgmtp.a12.contentengine/contentengine-core";
import { DocumentContext } from "@com.mgmtp.a12.contentengine/contentengine-core";
import type { DocumentContext as DocumentContextType } from "@com.mgmtp.a12.contentengine/contentengine-core";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { CHECKBOX_TYPE } from "../../../../../main/core/contentElements/modules/checkbox/checkboxNode.js";
import { MESSAGE_GROUP_CONTAINER_TYPE } from "../../../../../main/core/contentElements/modules/messageGroupContainer/messageGroupContainerNode.js";
import type { MessageGroupContainerNode } from "../../../../../main/core/contentElements/modules/messageGroupContainer/messageGroupContainerNode.js";
import { MESSAGE_GROUP_DISPLAY_TYPE } from "../../../../../main/core/contentElements/modules/messageGroupDisplay/messageGroupDisplayNode.js";
import type { MessageGroupDisplayNode } from "../../../../../main/core/contentElements/modules/messageGroupDisplay/messageGroupDisplayNode.js";
import { TEXT_LINE_TYPE } from "../../../../../main/core/contentElements/modules/textLine/textLineNode.js";
import { useCollectDocumentElementIds } from "../../../../../main/core/index.js";
import { FORM_ELEMENTS_NAMESPACE } from "../../../../../main/core/namespace.js";
import { mockDocumentContext } from "../../../../mocks/mockDocumentContext.js";
import { mockStore } from "../../../../mocks/mockStore.js";

describe("core.contentElements", () => {
	describe("useCollectDocumentElementIds", () => {
		it("should return empty results when node is undefined", () => {
			const Providers = createTestProviders();
			const { result } = renderHook(() => useCollectDocumentElementIds(undefined), {
				wrapper: Providers
			});

			deepStrictEqual(result.current, { fieldIds: [], groupIds: [] });
		});

		it("should return empty results when node is not a MessageGroupContainer", () => {
			const textLindeNode = createTextLineNode("field1");
			const Providers = createTestProviders();

			const { result } = renderHook(() => useCollectDocumentElementIds(textLindeNode), {
				wrapper: Providers
			});

			deepStrictEqual(result.current, { fieldIds: [], groupIds: [] });
		});

		it("should return empty results when MessageGroupContainer has autoCollectNodes disabled", () => {
			const node = createMessageGroupContainerNode(undefined, [createTextLineNode("field1")]);
			const Providers = createTestProviders();

			const { result } = renderHook(() => useCollectDocumentElementIds(node), {
				wrapper: Providers
			});

			deepStrictEqual(result.current, { fieldIds: [], groupIds: [] });
		});

		it("should return empty results when MessageGroupContainer has no children", () => {
			const node = createMessageGroupContainerNode(true);
			const Providers = createTestProviders();

			const { result } = renderHook(() => useCollectDocumentElementIds(node), {
				wrapper: Providers
			});

			deepStrictEqual(result.current, { fieldIds: [], groupIds: [] });
		});

		it("should collect field IDs from form element children", () => {
			const fieldElement1 = createFieldElement("field1");
			const fieldElement2 = createFieldElement("field2");

			const node = createMessageGroupContainerNode(true, [
				createTextLineNode(fieldElement1.id),
				createCheckboxNode(fieldElement2.id)
			]);

			const elementMap = {
				field1: fieldElement1,
				field2: fieldElement2
			};

			const TestProviders = createTestProviders(elementMap);
			const { result } = renderHook(() => useCollectDocumentElementIds(node), {
				wrapper: TestProviders
			});

			deepStrictEqual(result.current, {
				fieldIds: [fieldElement1.id, fieldElement2.id],
				groupIds: []
			});
		});

		it("should collect group IDs from form element children", () => {
			const groupElement1 = createGroupElement("group1");
			const groupElement2 = createGroupElement("group2");

			const node = createMessageGroupContainerNode(true, [
				createTextLineNode(groupElement1.id),
				createCheckboxNode(groupElement2.id)
			]);

			const elementMap = {
				group1: groupElement1,
				group2: groupElement2
			};

			const TestProviders = createTestProviders(elementMap);
			const { result } = renderHook(() => useCollectDocumentElementIds(node), {
				wrapper: TestProviders
			});

			deepStrictEqual(result.current, {
				fieldIds: [],
				groupIds: [groupElement1.id, groupElement2.id]
			});
		});

		it("should collect both field and group IDs from mixed children", () => {
			const fieldElement = createFieldElement("field1");
			const groupElement = createGroupElement("group1");

			const node = createMessageGroupContainerNode(true, [
				createTextLineNode(fieldElement.id),
				createCheckboxNode(groupElement.id)
			]);

			const elementMap = {
				field1: fieldElement,
				group1: groupElement
			};

			const TestProviders = createTestProviders(elementMap);
			const { result } = renderHook(() => useCollectDocumentElementIds(node), {
				wrapper: TestProviders
			});

			deepStrictEqual(result.current, { fieldIds: [fieldElement.id], groupIds: [groupElement.id] });
		});

		it("should skip nested MessageGroupContainer children", () => {
			const fieldElement = createFieldElement("field1");
			const nestedInAnotherContainerField = createFieldElement("nestedField");

			const nestedContainer = createMessageGroupContainerNode(true, [
				createTextLineNode(nestedInAnotherContainerField.id)
			]);

			const node = createMessageGroupContainerNode(true, [
				createTextLineNode(fieldElement.id),
				nestedContainer
			]);

			const elementMap = {
				[fieldElement.id]: fieldElement,
				[nestedInAnotherContainerField.id]: nestedInAnotherContainerField
			};

			const TestProviders = createTestProviders(elementMap);
			const { result } = renderHook(() => useCollectDocumentElementIds(node), {
				wrapper: TestProviders
			});

			deepStrictEqual(result.current, { fieldIds: [fieldElement.id], groupIds: [] });
		});

		it("should skip MessageGroupDisplay children", () => {
			const fieldElement = createFieldElement("field1");

			const node = createMessageGroupContainerNode(true, [
				createTextLineNode(fieldElement.id),
				createMessageGroupDisplayNode()
			]);

			const elementMap = {
				[fieldElement.id]: fieldElement
			};

			const TestProviders = createTestProviders(elementMap);
			const { result } = renderHook(() => useCollectDocumentElementIds(node), {
				wrapper: TestProviders
			});

			deepStrictEqual(result.current, { fieldIds: [fieldElement.id], groupIds: [] });
		});

		it("should skip non-form element children", () => {
			const fieldElement = createFieldElement("field1");

			const node = createMessageGroupContainerNode(true, [
				createTextLineNode(fieldElement.id),
				createNonFormElementNode()
			]);

			const elementMap = {
				[fieldElement.id]: fieldElement
			};

			const TestProviders = createTestProviders(elementMap);
			const { result } = renderHook(() => useCollectDocumentElementIds(node), {
				wrapper: TestProviders
			});

			deepStrictEqual(result.current, { fieldIds: [fieldElement.id], groupIds: [] });
		});

		it("should handle complex nested structure with multiple levels", () => {
			const fieldElement1 = createFieldElement("field1");
			const groupElement1 = createGroupElement("group1");
			const fieldElement2 = createFieldElement("field2");

			const deepContainer: ContentModel.Node = {
				id: "middle-container",
				namespace: "SomeNamespace",
				type: "MiddleContainer",
				props: {},
				children: [
					{
						id: "deep-container",
						namespace: "SomeNamespace",
						type: "DeepContainer",
						props: {},
						children: [createCheckboxNode(fieldElement2.id)]
					}
				]
			};

			const node = createMessageGroupContainerNode(true, [
				createTextLineNode(fieldElement1.id),
				{
					id: "outer-container",
					namespace: "SomeNamespace",
					type: "Container",
					props: {},
					children: [createTextLineNode(groupElement1.id), deepContainer]
				}
			]);

			const elementMap = {
				field1: fieldElement1,
				group1: groupElement1,
				field2: fieldElement2
			};

			const TestProviders = createTestProviders(elementMap);
			const { result } = renderHook(() => useCollectDocumentElementIds(node), {
				wrapper: TestProviders
			});

			deepStrictEqual(result.current, {
				fieldIds: [fieldElement1.id, fieldElement2.id],
				groupIds: [groupElement1.id]
			});
		});
	});
});

function createTestProviders(elementMap?: Record<string, DocumentModel.Element>) {
	return ({ children }: { children: ReactNode | ReactNode[] }) => {
		const baseContext = mockDocumentContext();

		const context: DocumentContextType = {
			...baseContext,
			model: {
				...baseContext.model,
				getElementById: mock.fn((_state: unknown, id: string): DocumentModel.Element => {
					if (elementMap && elementMap[id]) {
						return elementMap[id];
					}

					return {} as DocumentModel.Element;
				})
			}
		};

		return (
			<Provider store={mockStore()}>
				<DocumentContext.Provider value={context}>{children}</DocumentContext.Provider>
			</Provider>
		);
	};
}

function createTextLineNode(elementId: string): ContentModel.Node {
	return {
		id: `textline-${elementId}`,
		namespace: FORM_ELEMENTS_NAMESPACE,
		type: TEXT_LINE_TYPE,
		props: { elementId }
	};
}

function createCheckboxNode(elementId: string): ContentModel.Node {
	return {
		id: `checkbox-${elementId}`,
		namespace: FORM_ELEMENTS_NAMESPACE,
		type: CHECKBOX_TYPE,
		props: { elementId }
	};
}

function createMessageGroupContainerNode(
	autoCollectNodes?: true,
	children?: ContentModel.Node[]
): MessageGroupContainerNode {
	return {
		id: "message-group-container",
		namespace: FORM_ELEMENTS_NAMESPACE,
		type: MESSAGE_GROUP_CONTAINER_TYPE,
		props: {
			autoCollectNodes
		},
		children
	};
}

function createMessageGroupDisplayNode(): MessageGroupDisplayNode {
	return {
		id: "message-group-display",
		namespace: FORM_ELEMENTS_NAMESPACE,
		type: MESSAGE_GROUP_DISPLAY_TYPE,
		props: {}
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

function createFieldElement(id: string): DocumentModel.Element {
	return {
		id,
		type: "Field",
		fieldType: { type: "StringType" },
		name: id
	};
}

function createGroupElement(id: string): DocumentModel.Element {
	return {
		id,
		type: "Group",
		repeatability: 5,
		elements: [],
		name: id
	};
}
