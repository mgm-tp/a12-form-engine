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

import type { JSX } from "react";
import { useContext, useRef } from "react";

import type { Message } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { ComponentMapContext } from "../../componentMap/componentMapContext.js";
import { FunctionMapContext } from "../../functionMap/functionMapContext.js";
import { messageHtmlId } from "../../messageHtmlId.js";

import { useGroupedAndFilteredMessages } from "./useGroupedAndFilteredMessages.js";

/** @internal */
export interface MessageListProps {
	readonly groupId: string;
	readonly uiIdPrefix?: string;
	readonly prefixFormalErrors?: true;
}

/** @internal */
export function MessageList(props: MessageListProps): JSX.Element {
	const errors = useGroupedAndFilteredMessages("ERROR");
	const warnings = useGroupedAndFilteredMessages("WARNING");
	const infos = useGroupedAndFilteredMessages("INFO");

	return <MessageListView {...props} errors={errors} warnings={warnings} infos={infos} />;
}

/** @internal */
export interface MessageListViewProps extends MessageListProps {
	readonly errors: Message[];
	readonly warnings: Message[];
	readonly infos: Message[];
}

/** @internal */
export function MessageListView(props: MessageListViewProps): JSX.Element | null {
	const { groupId, uiIdPrefix, prefixFormalErrors, errors, warnings, infos } = props;

	const { useFocusFirstError } = useContext(FunctionMapContext);
	const { MessageListItem } = useContext(ComponentMapContext);

	const firstMessageRef = useRef<HTMLDivElement>(null);
	useFocusFirstError(errors.length > 0, firstMessageRef);

	const messageItems = [...errors, ...warnings, ...infos].map((m, idx) => {
		const isFirstError = idx === 0 && m.severity === "ERROR";

		return (
			<div
				id={messageHtmlId(groupId, m, uiIdPrefix)}
				key={idx}
				tabIndex={-1}
				ref={isFirstError ? firstMessageRef : null}
				data-role="message-list-item-wrapper"
			>
				<MessageListItem key={idx} message={m} prefixFormalErrors={prefixFormalErrors} />
			</div>
		);
	});

	// we do not render a list widget for A11Y reasons
	return messageItems.length > 0 ? <>{...messageItems}</> : null;
}
