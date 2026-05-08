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
import { notStrictEqual, strictEqual } from "assert/strict";
import { mock } from "node:test";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { DocumentPath } from "@com.mgmtp.a12.client/client-data";
import { DocumentContext } from "@com.mgmtp.a12.contentengine/contentengine-core";
import { query } from "@com.mgmtp.a12.devtools/react";
import type { Message } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";

import { MessageListItem } from "../../../../../main/core/contentElements/modules/messageGroupDisplay/messageListItem.js";
import type { LinkDataItem } from "../../../../../main/core/contentElements/modules/messageGroupDisplay/useLinkData.js";
import { assertCallCount, assertCalledWith } from "../../../../assertions.js";
import { getMockLocalization } from "../../../../mocks/getMockLocalization.js";
import { mockDocumentContext } from "../../../../mocks/mockDocumentContext.js";
import { getMockMessage } from "../../../../mocks/mockError.js";
import { getReactElementName, isReactElement } from "../../../../react-element-utils.js";
import { renderWrapper } from "../../../../rtl-utils/render-wrapper.js";

describe("core.contentElements", () => {
	describe("MessageListItem", () => {
		it("renders a message box for the given message", () => {
			const message = getMockMessage({
				severity: "WARNING",
				errorText: [{ key: "test.key" }]
			});

			const { widgetMap } = setup({ message });
			const messageBoxProps = query(widgetMap.MessageBox).props();

			strictEqual(messageBoxProps.label, "test.key");
			strictEqual(messageBoxProps.variant, "warning");
			strictEqual(messageBoxProps.focusOnMessage, false);
		});

		it("calls useLinkData with the given message", () => {
			const message = getMockMessage();
			const { functionMap } = setup({ message });

			assertCalledWith(functionMap.useLinkData, message);
		});

		it("renders jump links for referenced fields that are contained in the message group", () => {
			const field1Path = DocumentPath.fromString("/root[1]/field1[1]");

			const message = getMockMessage({
				entityInstance: field1Path,
				severity: "WARNING",
				errorText: [{ key: "test.key" }]
			});

			const mockLinkData = [
				{
					nodeId: "node1",
					label: "label1"
				},
				{
					nodeId: "node2",
					label: "label2"
				},
				{
					nodeId: "node3",
					label: "label3"
				}
			];

			const { widgetMap } = setup({
				message,
				linkData: mockLinkData
			});

			query(widgetMap.List).assertRendered();

			const itemProps = query(widgetMap.ListItem).propsHistory();

			strictEqual(itemProps.length, mockLinkData.length);

			for (const [idx, item] of mockLinkData.entries()) {
				const matchingItemProps = itemProps.at(idx);

				// last item should not have a divider
				strictEqual(matchingItemProps?.divider, idx !== mockLinkData.length - 1);
				strictEqual(matchingItemProps?.text, item.label);
				notStrictEqual(matchingItemProps?.onClick, undefined);

				// check nested icon
				const graphic = isReactElement(matchingItemProps?.graphic)
					? matchingItemProps?.graphic
					: undefined;

				notStrictEqual(graphic, undefined);

				if (graphic) {
					strictEqual(getReactElementName(graphic), "IconMock");
					strictEqual(graphic.props.variant, "info");
					strictEqual(graphic.props.children, "arrow_forward");
				}
			}
		});

		it("publishes a focus event for the correct input when a jump link is clicked", () => {
			const mockLinkDataItem = {
				nodeId: "node1",
				label: "label1"
			};

			const { functionMap, widgetMap } = setup({
				message: getMockMessage(),
				linkData: [mockLinkDataItem]
			});

			query(widgetMap.ListItem).props().onClick?.();

			assertCallCount(functionMap.publishFocusInputEvent, 1);
			assertCalledWith(functionMap.publishFocusInputEvent, mockLinkDataItem.nodeId);
		});
	});
});

function testLabel(path: ModelPath) {
	return `Label for ${ModelPath.toString(path)}`;
}

function setup(options: {
	message: Message;
	prefixFormalErrors?: true;
	linkData?: LinkDataItem[];
}) {
	const baseDocumentContext = mockDocumentContext({
		getDocumentModelName: "test-dm"
	});
	const mockDocContext = {
		...baseDocumentContext,
		model: {
			...baseDocumentContext.model,
			getFieldDisplayLabel: (_state: object, path: ModelPath) => testLabel(path)
		}
	};

	return renderWrapper(
		<LocalizerContext.Provider value={getMockLocalization()}>
			<DocumentContext.Provider value={mockDocContext}>
				<MessageListItem
					message={options.message}
					prefixFormalErrors={options.prefixFormalErrors}
				/>
			</DocumentContext.Provider>
		</LocalizerContext.Provider>,
		{ functionMap: { useLinkData: mock.fn(() => options.linkData || []) } }
	);
}
