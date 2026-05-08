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
