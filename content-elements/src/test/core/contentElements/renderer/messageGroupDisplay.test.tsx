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

import { MessageGroupDisplayModule } from "../../../../main/core/contentElements/modules/messageGroupDisplay/messageGroupDisplayModule.js";
import {
	FormElementContext,
	MESSAGE_GROUP_DISPLAY_TYPE,
	MessageGroupContext,
	type MessageGroupDisplayNode
} from "../../../../main/core/index.js";
import { FORM_ELEMENTS_NAMESPACE } from "../../../../main/core/namespace.js";
import { renderWrapper } from "../../../rtl-utils/render-wrapper.js";

describe("core.contentElements", () => {
	describe("MessageGroupDisplay", () => {
		it("does not render anything if no MessageGroupContext is given", () => {
			renderWrapper(<MessageGroupDisplayModule.renderer node={getMockNode()} />);

			const text = screen.queryByText(/./);
			strictEqual(text, null);
		});

		it("renders a MessageList for the given MessageGroupContext", () => {
			const mockNode = getMockNode();
			const messageGroupId = "test-message-group-id";
			const uiIdPrefix = "test-ui-id-prefix";

			const { componentMap } = setup({ mockNode, messageGroupId, uiIdPrefix });

			query(componentMap.MessageList).assertRenderedTimes(1);

			const props = query(componentMap.MessageList).props();

			strictEqual(props.groupId, messageGroupId);
			strictEqual(props.uiIdPrefix, uiIdPrefix);
			strictEqual(props.prefixFormalErrors, mockNode.props.prefixFormalErrors);
		});
	});
});

function setup(options?: {
	uiIdPrefix?: string;
	messageGroupId?: string;
	mockNode?: MessageGroupDisplayNode;
}) {
	const { uiIdPrefix, messageGroupId, mockNode } = options ?? {};

	return renderWrapper(
		<FormElementContext.Provider
			value={{ contentModelName: "", config: { uiIdPrefix: uiIdPrefix ?? "", timeMode: "12h" } }}
		>
			<MessageGroupContext.Provider
				value={{
					id: messageGroupId ?? "",
					editableElements: [],
					getGroupedValidationMessages: () => [],
					getUngroupedValidationMessages: () => []
				}}
			>
				<MessageGroupDisplayModule.renderer node={mockNode ?? getMockNode()} />
			</MessageGroupContext.Provider>
		</FormElementContext.Provider>
	);
}

function getMockNode(): MessageGroupDisplayNode {
	return {
		id: "test-node-id",
		namespace: FORM_ELEMENTS_NAMESPACE,
		type: MESSAGE_GROUP_DISPLAY_TYPE,
		props: {
			prefixFormalErrors: true
		}
	};
}
