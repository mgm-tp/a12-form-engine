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

import { deepStrictEqual, strictEqual } from "node:assert/strict";

import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { Provider } from "react-redux";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import { DocumentPath } from "@com.mgmtp.a12.client/client-data";
import {
	DocumentContext,
	type DocumentContext as DocumentContextType
} from "@com.mgmtp.a12.contentengine/contentengine-core";
import type {
	DocumentModel,
	Message
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type { LocalizedModelText, Localizer } from "@com.mgmtp.a12.utils/utils-localization";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";

import { FormElementContext } from "../../../../../main/core/configuration/formElementContext.js";
import type { FunctionMap } from "../../../../../main/core/contentElements/functionMap/functionMap.js";
import { FunctionMapContext } from "../../../../../main/core/contentElements/functionMap/functionMapContext.js";
import { UiId } from "../../../../../main/core/contentElements/generateUiId.js";
import { MessageGroupContext } from "../../../../../main/core/contentElements/modules/messageGroupContainer/messageGroupContext.js";
import type { EditableElement } from "../../../../../main/core/contentElements/modules/messageGroupContainer/useCollectEditableElements.js";
import { useLinkData } from "../../../../../main/core/contentElements/modules/messageGroupDisplay/useLinkData.js";
import { getMockLocalization } from "../../../../mocks/getMockLocalization.js";
import { mockDocumentContext } from "../../../../mocks/mockDocumentContext.js";
import { getMockMessage } from "../../../../mocks/mockError.js";
import { mockStore } from "../../../../mocks/mockStore.js";
import { getFunctionMocks } from "../../../../rtl-utils/getFunctionMocks.js";

describe("useLinkData", () => {
	it("should return empty array when there are no editable elements", () => {
		const message = createMessage(["/field1[1]"]);

		const { result } = renderHook(() => useLinkData(message), {
			wrapper: createWrapper({ editableElements: [] })
		});

		deepStrictEqual(result.current, []);
	});

	it("should return empty array when message has no referenced fields", () => {
		const editableElements: EditableElement[] = [{ nodeId: "node-field1", elementId: "field1" }];

		const message = getMockMessage({ referencedFields: [] });

		const { result } = renderHook(() => useLinkData(message), {
			wrapper: createWrapper({ editableElements })
		});

		deepStrictEqual(result.current, []);
	});

	it("should return empty array when no editable element matches the message field", () => {
		const editableElements: EditableElement[] = [{ nodeId: "node-field2", elementId: "field2" }];

		const message = createMessage(["/field1[1]"]);

		const { result } = renderHook(() => useLinkData(message), {
			wrapper: createWrapper({ editableElements })
		});

		deepStrictEqual(result.current, []);
	});

	it("should return links for all matching editable elements in the correct order", () => {
		const editableElements: EditableElement[] = [
			{ nodeId: "node-field1", elementId: "field1" },
			{ nodeId: "node-field2", elementId: "field2" },
			{
				nodeId: "another-node-field1",
				elementId: "field1"
			}
		];

		// no link for field3, because it doesn't match any editable element
		const message = createMessage(["/field2[1]", "/field3[1]", "/field1[1]"]);

		const { result } = renderHook(() => useLinkData(message), {
			wrapper: createWrapper({ editableElements })
		});

		const expectedLinks = editableElements.map(element =>
			UiId.generateForControl({
				controlId: element.nodeId,
				elementPath: ModelPath.fromString(`/${element.elementId}`)
			})
		);

		strictEqual(result.current.length, expectedLinks.length);

		for (const [idx, expectedNodeId] of expectedLinks.entries()) {
			strictEqual(result.current[idx].nodeId, expectedNodeId);
		}
	});

	it("should return links for multi-selects", () => {
		// input references the multi-select group
		const editableElement: EditableElement = { nodeId: "node-ms-group", elementId: "ms-group" };
		// message references the multi-select value field
		const message = createMessage(["/ms-group[0]/ms-value[1]"]);

		const contentModelName = "TestContentModel";

		const { result } = renderHook(() => useLinkData(message), {
			wrapper: createWrapper({
				editableElements: [editableElement],
				contentModelName,
				// model path of the dm element referenced by the input
				getModelPathById: () => ModelPath.fromString("/ms-group")
			})
		});

		deepStrictEqual(result.current, [
			{
				nodeId: UiId.generateForControl({
					controlId: editableElement.nodeId,
					elementPath: ModelPath.fromString(`/${editableElement.elementId}`)
				}),
				label: `${contentModelName}.${editableElement.nodeId}.label`
			}
		]);
	});

	it("should handle runtime node IDs correctly", () => {
		const idToPath: { [key: string]: string } = {
			["field1"]: "/group1/field1",
			["field2"]: "/group2/field2",
			["field3"]: "/group3/field3"
		};

		const editableElements: EditableElement[] = [
			{ nodeId: "node-field1", elementId: "field1" },
			{ nodeId: "node-field2", elementId: "field2" },
			{ nodeId: "node-field3", elementId: "field3" }
		];

		const message = createMessage([
			"/group2[2]/field2[1]",
			"/group3[3]/field3[1]",
			"/group1[1]/field1[1]"
		]);

		const computeVirtualNodeId = (dataContext: string, nodeId: string) =>
			`${dataContext}-${nodeId}`;
		const getModelPathById = (_state: object, id: string) =>
			idToPath[id] ? ModelPath.fromString(idToPath[id]) : [];

		const uiIdPrefix = "test-prefix";

		const { result } = renderHook(() => useLinkData(message), {
			wrapper: createWrapper({
				editableElements,
				uiIdPrefix,
				computeVirtualNodeId,
				getModelPathById,
				// only the first path segment should be considered as a repeatable group for data context resolution
				getElementByPath: (_, path) => (path.length === 1 ? createRepeatableGroup() : ({} as never))
			})
		});

		const expectedRuntimeIds = [1, 2, 3].map(n =>
			UiId.generateForControl({
				controlId: computeVirtualNodeId(`/group${n}[${n}]`, `node-field${n}`),
				elementPath: ModelPath.fromString(idToPath[`field${n}`]),
				uiIdPrefix
			})
		);

		strictEqual(result.current.length, expectedRuntimeIds.length);

		for (const [idx, expectedNodeId] of expectedRuntimeIds.entries()) {
			strictEqual(result.current[idx].nodeId, expectedNodeId);
		}
	});

	it("should handle label fallbacks correctly", () => {
		const nodeLabel = "label-from-cm";
		const editableElement: EditableElement = {
			nodeId: "node-field1",
			elementId: "field1",
			label: [{ locale: "en", text: nodeLabel }]
		};

		const message = createMessage(["/field1[1]"]);
		const cmName = "TestContentModel";
		const dmName = "TestDocumentModel";
		const dmElementLabel = "label-from-dm";

		const { result } = renderHook(() => useLinkData(message), {
			wrapper: createWrapper({
				contentModelName: cmName,
				editableElements: [editableElement],
				localizer: (...localizables) =>
					localizables.map(l => `${l.key}:${l.defaults?.["en"]}`).join("__"),
				getDocumentModelName: () => dmName,
				getElementByPath: () => createStringField([{ locale: "en", text: dmElementLabel }])
			})
		});

		strictEqual(result.current.length, 1);

		const cmL10nKey = `${cmName}.${editableElement.nodeId}.label`;
		const dmL10nKey = `documentModel.label.${dmName}.${editableElement.elementId}`;

		strictEqual(
			result.current[0].label,
			`${cmL10nKey}:${nodeLabel}__${dmL10nKey}:${dmElementLabel}`
		);
	});
});

interface TestSetupOptions {
	readonly editableElements?: EditableElement[];
	readonly contentModelName?: string;
	readonly uiIdPrefix?: string;
	readonly localizer?: Localizer;
	readonly getModelPathById?: DocumentContextType["model"]["getModelPathById"];
	readonly getElementByPath?: DocumentContextType["model"]["getElementByPath"];
	readonly getDocumentModelName?: DocumentContextType["model"]["getDocumentModelName"];
	readonly computeVirtualNodeId?: FunctionMap["computeVirtualNodeId"];
}

function createWrapper(options: TestSetupOptions = {}) {
	const {
		editableElements = [],
		contentModelName = "TestContentModel",
		uiIdPrefix,
		localizer,
		getModelPathById = (_state, id) => [{ elementName: id }],
		getElementByPath = () => ({}) as never,
		getDocumentModelName = () => "test-dm",
		computeVirtualNodeId = (_, nodeId) => nodeId
	} = options;

	return ({ children }: { children: ReactNode }) => {
		const baseContext = mockDocumentContext();

		const docContext: DocumentContextType = {
			...baseContext,
			model: {
				...baseContext.model,
				getModelPathById,
				getElementByPath,
				getDocumentModelName
			}
		};
		const mockFunctionContext: FunctionMap = {
			...getFunctionMocks(),
			computeVirtualNodeId
		};
		const baseLocalization = getMockLocalization();
		const mockLocalization: LocalizerContext.Type = {
			...baseLocalization,
			localizer: localizer ?? baseLocalization.localizer
		};

		return (
			<Provider store={mockStore()}>
				<DocumentContext.Provider value={docContext}>
					<LocalizerContext.Provider value={mockLocalization}>
						<FormElementContext.Provider
							value={{ contentModelName, config: { timeMode: "12h", uiIdPrefix } }}
						>
							<FunctionMapContext.Provider value={mockFunctionContext}>
								<MessageGroupContext.Provider
									value={{
										editableElements,
										getGroupedValidationMessages: () => [],
										getUngroupedValidationMessages: () => []
									}}
								>
									{children}
								</MessageGroupContext.Provider>
							</FunctionMapContext.Provider>
						</FormElementContext.Provider>
					</LocalizerContext.Provider>
				</DocumentContext.Provider>
			</Provider>
		);
	};
}

function createMessage(referencedFields: string[]): Message {
	return getMockMessage({
		referencedFields: referencedFields.map(f => DocumentPath.fromString(f))
	});
}

function createStringField(label?: LocalizedModelText): DocumentModel.Field {
	return {
		id: "field1",
		name: "field1",
		type: "Field",
		fieldType: { type: "StringType" },
		label
	};
}

function createRepeatableGroup(): DocumentModel.Group {
	return { id: "group-id", name: "group-name", type: "Group", repeatability: 5, elements: [] };
}
