// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { createContext } from "react";

import type { Message } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

export interface MessageGroupFilter {
	readonly id?: string;
	getGroupedValidationMessages(entries: Message[]): Message[];
	getUngroupedValidationMessages(entries: Message[]): Message[];
}

export const MessageGroupContext = createContext<MessageGroupFilter>({
	id: undefined,
	getGroupedValidationMessages: () => [],
	getUngroupedValidationMessages: () => []
});
