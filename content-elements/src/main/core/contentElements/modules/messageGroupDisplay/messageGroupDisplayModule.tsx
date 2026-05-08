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

import { useContext, type JSX } from "react";
import { actionCreatorFactory } from "typescript-fsa";

import {
	ElementModule,
	type ContentModel,
	type NodeRendererProps
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
