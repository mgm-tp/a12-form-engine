// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { strictEqual } from "node:assert/strict";

import { query, screen } from "@com.mgmtp.a12.devtools/react";

import { MessageGroupDisplayModule } from "../../../../main/core/contentElements/modules/messageGroupDisplay/messageGroupDisplayModule.js";
import {
	FormElementContext,
	MESSAGE_GROUP_DISPLAY_TYPE,
	MessageGroupContext
} from "../../../../main/core/index.js";
import type { MessageGroupDisplayNode } from "../../../../main/core/index.js";
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
