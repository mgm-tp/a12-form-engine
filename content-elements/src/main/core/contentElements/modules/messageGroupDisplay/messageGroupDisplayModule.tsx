// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { useContext } from "react";
import type { JSX } from "react";
import { actionCreatorFactory } from "typescript-fsa";

import { ElementModule } from "@com.mgmtp.a12.contentengine/contentengine-core";
import type {
	ContentModel,
	NodeRendererProps
} from "@com.mgmtp.a12.contentengine/contentengine-core";

import { FormElementContext } from "../../../configuration/formElementContext.js";
import { FORM_ELEMENTS_NAMESPACE } from "../../../namespace.js";
import { ComponentMapContext } from "../../componentMap/componentMapContext.js";

import { MessageGroupContext } from "../messageGroupContainer/messageGroupContext.js";

import type { MessageGroupDisplayNode } from "./messageGroupDisplayNode.js";
import { MESSAGE_GROUP_DISPLAY_TYPE } from "./messageGroupDisplayNode.js";
import { messageGroupDisplayValidator } from "./messageGroupDisplayValidator.js";

const id = ElementModule.Identifier.create({
	namespace: FORM_ELEMENTS_NAMESPACE,
	type: MESSAGE_GROUP_DISPLAY_TYPE
});

/** @internal */
export const MessageGroupDisplayModule: ElementModule<MessageGroupDisplayNode> = {
	id,
	renderer: MessageGroupDisplayRenderer,
	validator: messageGroupDisplayValidator,
	isInstance: (module: ElementModule): module is ElementModule<MessageGroupDisplayNode> =>
		module.id === id,
	isNodeInstance: (node: ContentModel.Node): node is MessageGroupDisplayNode =>
		node.namespace === FORM_ELEMENTS_NAMESPACE && node.type === MESSAGE_GROUP_DISPLAY_TYPE,
	actionCreator: actionCreatorFactory(`${FORM_ELEMENTS_NAMESPACE}/${MESSAGE_GROUP_DISPLAY_TYPE}`)
};

function MessageGroupDisplayRenderer(
	props: NodeRendererProps<MessageGroupDisplayNode>
): JSX.Element | null {
	const {
		config: { uiIdPrefix }
	} = useContext(FormElementContext);
	const { id: groupId } = useContext(MessageGroupContext);
	const { MessageList } = useContext(ComponentMapContext);

	if (!groupId) {
		return null;
	}

	return (
		<MessageList
			groupId={groupId}
			uiIdPrefix={uiIdPrefix}
			prefixFormalErrors={props.node.props.prefixFormalErrors}
		/>
	);
}
