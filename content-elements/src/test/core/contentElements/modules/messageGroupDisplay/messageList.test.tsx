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

import { strictEqual } from "assert/strict";

import { query, screen } from "@com.mgmtp.a12.devtools/react";
import type { Message } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { messageHtmlId } from "../../../../../main/core/contentElements/messageHtmlId.js";
import { MessageListView } from "../../../../../main/core/contentElements/modules/messageGroupDisplay/messageList.js";
import { assertCallCount, assertCalledWithArgument } from "../../../../assertions.js";
import { getMockMessage } from "../../../../mocks/mockError.js";
import { renderWrapper } from "../../../../rtl-utils/render-wrapper.js";

describe("core.contentElements", () => {
	describe("MessageListView", () => {
		describe("no messages given", () => {
			it("does not render anything", () => {
				setup();

				const text = screen.queryByText(/./);
				strictEqual(text, null);
			});

			it("calls useFocusFirstError with false", () => {
				const { functionMap } = setup();

				assertCallCount(functionMap.useFocusFirstError, 1);
				assertCalledWithArgument(functionMap.useFocusFirstError, 0, false);
			});
		});

		describe("at least one message given", () => {
			it("calls useFocusFirstError with true if there is an error", () => {
				const { functionMap } = setup({ errors: [getMockMessage({ severity: "ERROR" })] });

				assertCallCount(functionMap.useFocusFirstError, 1);
				assertCalledWithArgument(functionMap.useFocusFirstError, 0, true);
			});

			it("calls useFocusFirstError with false if there is no error", () => {
				const { functionMap } = setup({
					warnings: [getMockMessage({ severity: "WARNING" })],
					infos: [getMockMessage({ severity: "INFO" })]
				});

				assertCallCount(functionMap.useFocusFirstError, 1);
				assertCalledWithArgument(functionMap.useFocusFirstError, 0, false);
			});

			it("renders a wrapper div for each item", () => {
				const errors = [
					getMockMessage({ severity: "ERROR" }),
					getMockMessage({ severity: "ERROR" })
				];
				const warnings = [
					getMockMessage({ severity: "WARNING" }),
					getMockMessage({ severity: "WARNING" })
				];
				const infos = [getMockMessage({ severity: "INFO" }), getMockMessage({ severity: "INFO" })];

				const allMessages = [...errors, ...warnings, ...infos];

				const uiIdPrefix = "test-prefix";

				setup({
					errors,
					warnings,
					infos,
					uiIdPrefix
				});

				const wrapperDivs = screen.getAllByDataRole("message-list-item-wrapper");
				strictEqual(wrapperDivs.length, 6);

				for (const [idx, div] of wrapperDivs.entries()) {
					strictEqual(
						div.getAttribute("id"),
						messageHtmlId("test-group-id", allMessages[idx], uiIdPrefix)
					);
					strictEqual(div.getAttribute("tabIndex"), "-1");
				}
			});

			it("renders a list containing one message list item per given message", () => {
				const error = getMockMessage({ severity: "ERROR" });
				const warning = getMockMessage({ severity: "WARNING" });
				const info = getMockMessage({ severity: "INFO" });

				const { componentMap } = setup({
					errors: [error],
					warnings: [warning],
					infos: [info],
					prefixFormalErrors: true
				});

				query(componentMap.MessageListItem).assertRenderedTimes(3);

				const itemProps = query(componentMap.MessageListItem).propsHistory();

				for (const [idx, m] of [error, warning, info].entries()) {
					strictEqual(itemProps.at(idx)?.message, m);
					strictEqual(itemProps.at(idx)?.prefixFormalErrors, true);
				}
			});

			it("sorts the message list items by severity", () => {
				const { componentMap } = setup({
					errors: [getMockMessage({ severity: "ERROR" }), getMockMessage({ severity: "ERROR" })],
					warnings: [
						getMockMessage({ severity: "WARNING" }),
						getMockMessage({ severity: "WARNING" })
					],
					infos: [getMockMessage({ severity: "INFO" }), getMockMessage({ severity: "INFO" })]
				});

				query(componentMap.MessageListItem).assertRenderedTimes(6);

				const itemProps = query(componentMap.MessageListItem).propsHistory();

				const expectedOrder = ["ERROR", "ERROR", "WARNING", "WARNING", "INFO", "INFO"];

				for (const [idx, severity] of expectedOrder.entries()) {
					strictEqual(itemProps.at(idx)?.message.severity, severity);
				}
			});
		});
	});
});

function setup(options?: {
	errors?: Message[];
	warnings?: Message[];
	infos?: Message[];
	prefixFormalErrors?: true;
	uiIdPrefix?: string;
}) {
	return renderWrapper(
		<MessageListView
			groupId="test-group-id"
			prefixFormalErrors={options?.prefixFormalErrors}
			uiIdPrefix={options?.uiIdPrefix}
			errors={options?.errors ?? []}
			warnings={options?.warnings ?? []}
			infos={options?.infos ?? []}
		/>
	);
}
