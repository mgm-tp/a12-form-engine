// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ContentModel } from "@com.mgmtp.a12.contentengine/contentengine-core";

import { FORM_ELEMENTS_NAMESPACE } from "../../../namespace.js";

export const MESSAGE_GROUP_DISPLAY_TYPE = "MessageGroupDisplay";

export interface MessageGroupDisplayNode extends ContentModel.Node<MessageGroupDisplayNodeProps> {
	readonly namespace: typeof FORM_ELEMENTS_NAMESPACE;
	readonly type: typeof MESSAGE_GROUP_DISPLAY_TYPE;
}

export interface MessageGroupDisplayNodeProps {
	readonly prefixFormalErrors?: true;
}

/** @internal */
export function isMessageGroupDisplayNode(
	node: ContentModel.Node
): node is MessageGroupDisplayNode {
	return node.namespace === FORM_ELEMENTS_NAMESPACE && node.type === MESSAGE_GROUP_DISPLAY_TYPE;
}
