// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { DocumentPath, KernelMessage } from "@com.mgmtp.a12.client/client-data";
import type { Message } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

export function messageHtmlId(groupId: string, message: Message, uiIdPrefix?: string): string {
	const errorField = DocumentPath.toString(message.entityInstance);
	const errorTypeIdentifier =
		KernelMessage.FORMAL_VALIDATION === message.rulePath ? message.errorCode : message.rulePath;

	return `${uiIdPrefix ? uiIdPrefix + "-" : ""}${groupId}-${errorField}-${errorTypeIdentifier}`;
}
