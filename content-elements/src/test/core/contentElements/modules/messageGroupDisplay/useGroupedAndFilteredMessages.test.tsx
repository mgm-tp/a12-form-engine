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

import { deepStrictEqual } from "assert/strict";
import { mock } from "node:test";

import { renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";

import { DocumentPath, MessageTransformers } from "@com.mgmtp.a12.client/client-data";
import {
	ContentEngineContextProvider,
	DocumentContext,
	DocumentPathContextProvider
} from "@com.mgmtp.a12.contentengine/contentengine-core";
import type { Message } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { useGroupedAndFilteredMessages } from "../../../../../main/core/contentElements/modules/messageGroupDisplay/useGroupedAndFilteredMessages.js";
import { MessageGroupContext } from "../../../../../main/core/index.js";
import { mockDocumentContext } from "../../../../mocks/mockDocumentContext.js";
import { getMockMessage } from "../../../../mocks/mockError.js";
import { mockStore } from "../../../../mocks/mockStore.js";

describe("core.contentElements", () => {
	describe("useGroupedAndFilteredMessages", () => {
		it("returns messages filtered by data context", () => {
			const inContextMessage = getMockMessage({
				errorCode: "in-context",
				referencedFields: [DocumentPath.fromString("/group[2]/field[1]")]
			});
			const outOfContextMessage = getMockMessage({
				errorCode: "out-of-context",
				referencedFields: [DocumentPath.fromString("/group[5]/field[1]")]
			});

			const result = setup({
				allMessages: [inContextMessage, outOfContextMessage],
				severity: "ERROR",
				dataContextPath: "/group[2]"
			});

			deepStrictEqual(result, [inContextMessage]);
		});

		it("returns only grouped messages based on MessageGroupContext", () => {
			const groupedMessage = getMockMessage({
				errorCode: "grouped",
				referencedFields: [DocumentPath.fromString("/group[1]/field[1]")]
			});
			const ungroupedMessage = getMockMessage({
				errorCode: "ungrouped",
				referencedFields: [DocumentPath.fromString("/group[1]/field[1]")]
			});

			const result = setup({
				allMessages: [groupedMessage, ungroupedMessage],
				groupedMessages: [groupedMessage],
				severity: "ERROR"
			});

			deepStrictEqual(result, [groupedMessage]);
		});

		it("filters messages by severity", () => {
			const errorMessage = getMockMessage({
				errorCode: "error",
				severity: "ERROR",
				referencedFields: [DocumentPath.fromString("/group[1]/field[1]")]
			});
			const warningMessage = getMockMessage({
				errorCode: "warning",
				severity: "WARNING",
				referencedFields: [DocumentPath.fromString("/group[1]/field[1]")]
			});
			const infoMessage = getMockMessage({
				errorCode: "info",
				severity: "INFO",
				referencedFields: [DocumentPath.fromString("/group[1]/field[1]")]
			});

			const result = setup({
				allMessages: [errorMessage, warningMessage, infoMessage],
				severity: "WARNING"
			});

			deepStrictEqual(result, [warningMessage]);
		});

		it("applies message transformers", () => {
			const originalMessage = getMockMessage({
				errorCode: "original",
				severity: "ERROR",
				referencedFields: [DocumentPath.fromString("/group[1]/field[1]")]
			});
			const transformedMessage = { ...originalMessage, errorCode: "transformed" };

			mock.method(MessageTransformers, "transform", () => transformedMessage);

			const result = setup({
				allMessages: [originalMessage],
				severity: "ERROR"
			});

			deepStrictEqual(result, [transformedMessage]);
		});
	});
});

interface SetupOptions {
	allMessages: Message[];
	groupedMessages?: Message[];
	severity: Message.Severity;
	dataContextPath?: string;
}

function setup(options: SetupOptions) {
	const { severity } = options;

	const { result } = renderHook(() => useGroupedAndFilteredMessages(severity), {
		wrapper: createWrapper(options)
	});

	return result.current;
}

function createWrapper(options: SetupOptions) {
	const { allMessages, groupedMessages, dataContextPath = "" } = options;

	const documentContext = mockDocumentContext({
		getAllMessages: allMessages
	});

	const store = mockStore();

	return function Wrapper(props: PropsWithChildren) {
		return (
			<Provider store={store}>
				<ContentEngineContextProvider libraryId="" size="lg">
					<DocumentPathContextProvider groupPath={dataContextPath}>
						<DocumentContext.Provider value={documentContext}>
							<MessageGroupContext.Provider
								value={{
									id: "test-group",
									getGroupedValidationMessages: msgs => groupedMessages ?? msgs,
									getUngroupedValidationMessages: () => []
								}}
							>
								{props.children}
							</MessageGroupContext.Provider>
						</DocumentContext.Provider>
					</DocumentPathContextProvider>
				</ContentEngineContextProvider>
			</Provider>
		);
	};
}
