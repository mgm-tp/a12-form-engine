// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { useContext } from "react";
import { useSelector } from "react-redux";

import { DocumentPath } from "@com.mgmtp.a12.client/client-data/lib/core/api/path/documentPath.js";
import { messagesForDataContext } from "@com.mgmtp.a12.client/client-data/lib/data-mutation/validation-computation/messagesForDataContext.js";
import { MessageTransformers } from "@com.mgmtp.a12.client/client-data/lib/data-mutation/validation-computation/messageTransformers.js";
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
