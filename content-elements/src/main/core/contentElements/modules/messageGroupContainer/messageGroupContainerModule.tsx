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

import { useContext, useMemo } from "react";
import type { JSX } from "react";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import { KernelMessage } from "@com.mgmtp.a12.client/client-data";
import { actionCreatorFactory } from "@com.mgmtp.a12.client/typescript-fsa-redux-5-compat";
import type {
	ContentModel,
	NodeRendererProps
} from "@com.mgmtp.a12.contentengine/contentengine-core";
import { ElementModule } from "@com.mgmtp.a12.contentengine/contentengine-core";
import type { EntityInstancePath, Message } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { FORM_ELEMENTS_NAMESPACE } from "../../../namespace.js";
import { FunctionMapContext } from "../../functionMap/functionMapContext.js";

import { EditableElementsContext } from "./editableElementsContext.js";
import type {
	MessageGroupContainerNode,
	MessageGroupContainerNodeProps
} from "./messageGroupContainerNode.js";
import { MESSAGE_GROUP_CONTAINER_TYPE } from "./messageGroupContainerNode.js";
import { messageGroupContainerValidator } from "./messageGroupContainerValidator.js";
import { MessageGroupContext } from "./messageGroupContext.js";
import { useMessageGroupPaths } from "./useMessageGroupPaths.js";

const id = ElementModule.Identifier.create({
	namespace: FORM_ELEMENTS_NAMESPACE,
	type: MESSAGE_GROUP_CONTAINER_TYPE
});

/** @internal */
export const MessageGroupContainerModule: ElementModule<MessageGroupContainerNode> = {
	id,
	renderer: MessageGroupContainerRenderer,
	validator: messageGroupContainerValidator,
	isInstance: (module: ElementModule): module is ElementModule<MessageGroupContainerNode> =>
		module.id === id,
	isNodeInstance: (node: ContentModel.Node): node is MessageGroupContainerNode =>
		node.namespace === FORM_ELEMENTS_NAMESPACE && node.type === MESSAGE_GROUP_CONTAINER_TYPE,
	actionCreator: actionCreatorFactory(`${FORM_ELEMENTS_NAMESPACE}/${MESSAGE_GROUP_CONTAINER_TYPE}`)
};

function MessageGroupContainerRenderer(
	props: NodeRendererProps<MessageGroupContainerNode>
): JSX.Element {
	const { useCollectEditableElements } = useContext(FunctionMapContext);

	const messageGroupPaths = useMessageGroupPaths(props.node);
	const editableElements = useCollectEditableElements(props.node);

	const contextValue = useMemo(() => {
		const resolvedProps = {
			...props.node.props,
			fields: messageGroupPaths.groupedFields,
			groups: messageGroupPaths.groupedGroups
		};

		return {
			id: props.node.id,
			getGroupedValidationMessages: (messages: Message[]) =>
				getGroupedValidationMessages(messages, resolvedProps),
			getUngroupedValidationMessages: (messages: Message[]) => {
				const groupedMessages = getGroupedValidationMessages(messages, resolvedProps);
				return messages.filter(msg => !groupedMessages.includes(msg));
			}
		};
	}, [props.node.props, props.node.id, messageGroupPaths]);

	return (
		<MessageGroupContext.Provider value={contextValue}>
			<EditableElementsContext.Provider value={editableElements}>
				{props.children}
			</EditableElementsContext.Provider>
		</MessageGroupContext.Provider>
	);
}

function getGroupedValidationMessages(
	messages: Message[],
	config: MessageGroupContainerNodeProps
): Message[] {
	return messages.filter(
		msg => isAcceptedIfFormalError(msg, config) && messageIsIncludedInConfig(msg, config)
	);
}

function messageIsIncludedInConfig(
	message: Message,
	config: MessageGroupContainerNodeProps
): boolean {
	return (
		config.rules?.includes(message.rulePath ?? "") ||
		message.referencedFields.some(refField => fieldIsIncludedInConfig(refField, config))
	);
}

function fieldIsIncludedInConfig(
	value: EntityInstancePath,
	config: MessageGroupContainerNodeProps
): boolean {
	const pathAsString = ModelPath.toString(value);

	return (
		matchesFieldConfig(pathAsString, config.fields) ||
		matchesGroupConfig(pathAsString, config.groups)
	);
}

function matchesFieldConfig(modelPathString: string, fields?: string[]): boolean {
	return !!fields?.some(field => field === modelPathString);
}

function matchesGroupConfig(modelPathString: string, groups?: string[]): boolean {
	const modelPathTest = ModelPath.fromString(modelPathString);

	return !!groups?.some(group => {
		const groupPath = ModelPath.fromString(group);
		return ModelPath.contains(modelPathTest, groupPath);
	});
}

function isAcceptedIfFormalError(msg: Message, config: MessageGroupContainerNodeProps): boolean {
	return KernelMessage.FORMAL_VALIDATION === msg.rulePath ? !config.ignoreFormalErrors : true;
}
