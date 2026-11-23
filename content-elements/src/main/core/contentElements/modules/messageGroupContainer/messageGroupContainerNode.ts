// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { PropsWithChildren } from "react";

import type { ContentModel } from "@com.mgmtp.a12.contentengine/contentengine-core";

import { FORM_ELEMENTS_NAMESPACE } from "../../../namespace.js";

export const MESSAGE_GROUP_CONTAINER_TYPE = "MessageGroupContainer";

export interface MessageGroupContainerNode extends ContentModel.Node<MessageGroupContainerNodeProps> {
	readonly namespace: typeof FORM_ELEMENTS_NAMESPACE;
	readonly type: typeof MESSAGE_GROUP_CONTAINER_TYPE;
}

// TODO: In contrast to all other dm element references we need to use
// rule paths instead of IDs, because the IDs are not accessible at runtime:
// Neither in the deserialized dm, nor in the validation code.
// Ideally, we should try to change this to make it more consistent with
// other references.

export interface MessageGroupContainerNodeProps extends PropsWithChildren {
	/** Field references as a list of element IDs */
	readonly fields?: string[];
	/** Group references as a list of element IDs */
	readonly groups?: string[];
	/**
	 * Rule references as a list of ModelPath strings
	 */
	readonly rules?: string[];

	readonly ignoreFormalErrors?: true;
	/**
	 * Collects referenced fields and groups of nested form elements in the MessageGroupContainer.
	 */
	readonly autoCollectNodes?: true;
}

/** @internal */
export function isMessageGroupContainerNode(
	node: ContentModel.Node
): node is MessageGroupContainerNode {
	return node.namespace === FORM_ELEMENTS_NAMESPACE && node.type === MESSAGE_GROUP_CONTAINER_TYPE;
}
