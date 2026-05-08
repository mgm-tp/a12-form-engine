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

import { useContext } from "react";
import { useSelector } from "react-redux";

import { DocumentPath } from "@com.mgmtp.a12.client/client-data/lib/core/api/path/documentPath.js";
import { MessageTransformers } from "@com.mgmtp.a12.client/client-data/lib/data-mutation/validation-computation/messageTransformers.js";
import { messagesForDataContext } from "@com.mgmtp.a12.client/client-data/lib/data-mutation/validation-computation/messagesForDataContext.js";
import {
	useDocumentContext,
	useDocumentPathContext
} from "@com.mgmtp.a12.contentengine/contentengine-core";
import type { Message } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { arraysDeepEqual } from "../../arraysDeepEqual.js";

import { MessageGroupContext } from "../messageGroupContainer/messageGroupContext.js";

/** @internal */
export function useGroupedAndFilteredMessages(severity: Message.Severity): Message[] {
	const { getAllMessages } = useDocumentContext(c => c.document);
	const { getGroupedValidationMessages } = useContext(MessageGroupContext);

	const dataContextString = useDocumentPathContext(c => c.groupPath);
	const dataContext = DocumentPath.fromString(dataContextString);

	function selectGroupedAndFilteredMessages(state: object): Message[] {
		const validationMessages = getAllMessages(state);
		const messagesInDataContext = messagesForDataContext(validationMessages, dataContext);
		const groupedMessages = getGroupedValidationMessages(messagesInDataContext).map(
			MessageTransformers.transform
		);

		return groupedMessages.filter(e => e.severity === severity);
	}

	return useSelector(selectGroupedAndFilteredMessages, arraysDeepEqual);
}
