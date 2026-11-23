// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { useContext, useMemo } from "react";
import type { JSX } from "react";
import { actionCreatorFactory } from "typescript-fsa";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { KernelMessage } from "@com.mgmtp.a12.client/client-data/lib/data-mutation/validation-computation/message.js";
import type {
	ContentModel,
	NodeRendererProps
} from "@com.mgmtp.a12.contentengine/contentengine-core";
import { ElementModule } from "@com.mgmtp.a12.contentengine/contentengine-core";
import type {
	EntityInstancePath,
	Message
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

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
