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
import { useContext } from "react";
import { useSelector } from "react-redux";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type { DocumentContext } from "@com.mgmtp.a12.contentengine/contentengine-core";
import { useDocumentContext } from "@com.mgmtp.a12.contentengine/contentengine-core";

import { FunctionMapContext } from "../../functionMap/functionMapContext.js";

import type {
	MessageGroupContainerNode,
	MessageGroupContainerNodeProps
} from "./messageGroupContainerNode.js";
import type { CollectedDocumentElementIds } from "./useCollectDocumentElementIds.js";

/** @internal */
export interface MessageGroupPaths {
	/** Field paths for grouping messages */
	readonly groupedFields: string[];
	/** Group paths for grouping messages */
	readonly groupedGroups: string[];
}

/**
 * @internal
 *
 * Determines paths of dm elements that are used by a Message Group to group messages
 * and to display links to related inputs.
 *
 * Paths for grouping messages: These contain all explicitly modeled elements
 * as well as automatically collected elements from the container if autoCollectNodes
 * is true. Elements from nested MessageGroupContainers are not considered to
 * prevent messages from being displayed on multiple containers.
 *
 * Paths for generating links: These do consider nested MessageGroupContainers, because
 * messages on an outer container may also reference fields from inner containers.
 */
export function useMessageGroupPaths(node: MessageGroupContainerNode): MessageGroupPaths {
	const { useCollectDocumentElementIds } = useContext(FunctionMapContext);
	const { getModelPathById } = useDocumentContext(c => c.model);

	const autoCollectedIds = useCollectDocumentElementIds(node);

	return useSelector(
		state => selectPaths(state, getModelPathById, node.props, autoCollectedIds),
		(left, right) =>
			areListsEqual(left.groupedFields, right.groupedFields) &&
			areListsEqual(left.groupedGroups, right.groupedGroups)
	);
}

function selectPaths(
	state: object,
	getModelPathById: DocumentContext["model"]["getModelPathById"],
	nodeProps: MessageGroupContainerNodeProps,
	autoCollectedIds: CollectedDocumentElementIds
): MessageGroupPaths {
	const toPath = (id: string) => ModelPath.toString(getModelPathById(state, id));
	return {
		groupedFields: [
			...(nodeProps.fields ?? []),
			...(nodeProps.autoCollectNodes ? autoCollectedIds.fieldIds : [])
		].map(toPath),
		groupedGroups: [
			...(nodeProps.groups ?? []),
			...(nodeProps.autoCollectNodes ? autoCollectedIds.groupIds : [])
		].map(toPath)
	};
}

function areListsEqual(left: string[], right: string[]): boolean {
	return left.length === right.length && left.every((item, index) => item === right[index]);
}
