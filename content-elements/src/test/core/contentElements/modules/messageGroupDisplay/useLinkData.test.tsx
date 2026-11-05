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

import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { Provider } from "react-redux";

import { DocumentPath } from "@com.mgmtp.a12.client/client-data";
import type { DocumentContext as DocumentContextType } from "@com.mgmtp.a12.contentengine/contentengine-core";
import { DocumentContext } from "@com.mgmtp.a12.contentengine/contentengine-core";
import type { DocumentModel, Message } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import type { LocalizedModelText, Localizer } from "@com.mgmtp.a12.utils/utils-localization";
import type { LocalizerContextProps } from "@com.mgmtp.a12.utils/utils-localization-react";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";

import { FormElementContext } from "../../../../../main/core/configuration/formElementContext.js";
import type { FunctionMap } from "../../../../../main/core/contentElements/functionMap/functionMap.js";
import { FunctionMapContext } from "../../../../../main/core/contentElements/functionMap/functionMapContext.js";
import { UiId } from "../../../../../main/core/contentElements/generateUiId.js";
import { EditableElementsContext } from "../../../../../main/core/contentElements/modules/messageGroupContainer/editableElementsContext.js";
import type { EditableElement } from "../../../../../main/core/contentElements/modules/messageGroupContainer/useCollectEditableElements.js";
import { useLinkData } from "../../../../../main/core/contentElements/modules/messageGroupDisplay/useLinkData.js";
import { getMockLocalization } from "../../../../mocks/getMockLocalization.js";
import { mockDocumentContext } from "../../../../mocks/mockDocumentContext.js";
import { getMockMessage } from "../../../../mocks/mockError.js";
import { mockStore } from "../../../../mocks/mockStore.js";
import { getFunctionMocks } from "../../../../rtl-utils/getFunctionMocks.js";

describe("core.contentElements", () => {
	describe("useLinkData", () => {
		it("should return empty array when there are no editable elements", () => {
			const message = createMessage(["/field1[1]"]);

			const { result } = renderHook(() => useLinkData(message), {
				wrapper: createWrapper({ editableElements: [] })
			});

			deepStrictEqual(result.current, []);
		});

		it("should return empty array when message has no referenced fields", () => {
			const editableElements: EditableElement[] = [
				{ nodeId: "node-field1", documentPath: DocumentPath.fromString("/field1[1]") }
			];

			const message = getMockMessage({ referencedFields: [] });

			const { result } = renderHook(() => useLinkData(message), {
				wrapper: createWrapper({ editableElements })
			});

			deepStrictEqual(result.current, []);
		});

		it("should return empty array when no editable element matches the message field", () => {
			const editableElements: EditableElement[] = [
				{ nodeId: "node-field2", documentPath: DocumentPath.fromString("/field2[1]") }
			];

			const message = createMessage(["/field1[1]"]);

			const { result } = renderHook(() => useLinkData(message), {
				wrapper: createWrapper({ editableElements })
			});

			deepStrictEqual(result.current, []);
		});

		it("should return links for all matching editable elements in the correct order", () => {
			const editableElements: EditableElement[] = [
				{ nodeId: "node-field1", documentPath: DocumentPath.fromString("/group[1]/field1[1]") },
				{ nodeId: "node-field2", documentPath: DocumentPath.fromString("/group[1]/field2[1]") },
				{
					nodeId: "another-node-field1",
					documentPath: DocumentPath.fromString("/group[1]/field1[1]")
				},
				// editable, but not referenced in the message
				{
					nodeId: "node-in-different-context-field1",
					documentPath: DocumentPath.fromString("/group[3]/field1[1]")
				}
			];

			// no link for field3, because it doesn't match any editable element
			const message = createMessage([
				"/group[1]/field2[1]",
				"/group[1]/field3[1]",
				"/group[1]/field1[1]"
			]);

			const { result } = renderHook(() => useLinkData(message), {
				wrapper: createWrapper({ editableElements })
			});

			const expectedLinks = editableElements.slice(0, 3).map(element =>
				UiId.generateForControl({
					controlId: element.nodeId,
					elementPath: element.documentPath
				})
			);

			strictEqual(result.current.length, expectedLinks.length);

			for (const [idx, expectedNodeId] of expectedLinks.entries()) {
				strictEqual(result.current[idx].nodeId, expectedNodeId);
			}
		});

		it("should return links for multi-selects", () => {
			// input references the multi-select group
			const editableElement: EditableElement = {
				nodeId: "node-ms-group",
				documentPath: DocumentPath.fromString("/ms-group[0]")
			};
			// message references the multi-select value field
			const message = createMessage(["/ms-group[0]/ms-value[1]"]);

			const contentModelName = "TestContentModel";

			const { result } = renderHook(() => useLinkData(message), {
				wrapper: createWrapper({
					editableElements: [editableElement],
					contentModelName
				})
			});

			deepStrictEqual(result.current, [
				{
					nodeId: UiId.generateForControl({
						controlId: editableElement.nodeId,
						elementPath: editableElement.documentPath
					}),
					label: `${contentModelName}.${editableElement.nodeId}.label`
				}
			]);
		});

		it("addresses the node with the runtime node id it was rendered with", () => {
			// what the expanded tree reports for a control inside the second instance of a group
			const runtimeNodeId = "textline-street@/addresses[2]";

			const editableElement: EditableElement = {
				nodeId: runtimeNodeId,
				documentPath: DocumentPath.fromString("/addresses[2]/street[1]")
			};

			const message = createMessage(["/addresses[2]/street[1]"]);

			const { result } = renderHook(() => useLinkData(message), {
				wrapper: createWrapper({
					editableElements: [editableElement],
					getElementByPath: (_, path) =>
						path.length === 1 ? createRepeatableGroup() : ({} as never)
				})
			});

			strictEqual(
				result.current[0].nodeId,
				UiId.generateForControl({
					controlId: runtimeNodeId,
					elementPath: editableElement.documentPath
				})
			);
		});

		it("should handle label fallbacks correctly", () => {
			const nodeLabel = "label-from-cm";
			const elementId = "field1";
			const editableElement: EditableElement = {
				nodeId: "node-field1",
				documentPath: DocumentPath.fromString(`/${elementId}[1]`),
				label: [{ locale: "en", text: nodeLabel }]
			};

			const message = createMessage([`/${elementId}[1]`]);
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
			const dmL10nKey = `documentModel.label.${dmName}.${elementId}`;

			strictEqual(
				result.current[0].label,
				`${cmL10nKey}:${nodeLabel}__${dmL10nKey}:${dmElementLabel}`
			);
		});
	});
});

interface TestSetupOptions {
	readonly editableElements?: EditableElement[];
	readonly contentModelName?: string;
	readonly uiIdPrefix?: string;
	readonly localizer?: Localizer;
	readonly getElementByPath?: DocumentContextType["model"]["getElementByPath"];
	readonly getDocumentModelName?: DocumentContextType["model"]["getDocumentModelName"];
}

function createWrapper(options: TestSetupOptions = {}) {
	const {
		editableElements = [],
		contentModelName = "TestContentModel",
		uiIdPrefix,
		localizer,
		getElementByPath = () => ({}) as never,
		getDocumentModelName = () => "test-dm"
	} = options;

	return ({ children }: { children: ReactNode }) => {
		const baseContext = mockDocumentContext();

		const docContext: DocumentContextType = {
			...baseContext,
			model: {
				...baseContext.model,
				getElementByPath,
				getDocumentModelName
			}
		};
		const mockFunctionContext: FunctionMap = {
			...getFunctionMocks()
		};
		const baseLocalization = getMockLocalization();
		const mockLocalization: LocalizerContextProps = {
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
								<EditableElementsContext.Provider value={editableElements}>
									{children}
								</EditableElementsContext.Provider>
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
