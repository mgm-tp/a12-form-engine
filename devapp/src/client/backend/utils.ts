// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Notification } from "@com.mgmtp.a12.client/client-core/lib/core/notification/index.js";

import { DEVAPP_MODE } from "../config/mode.js";

export function createServerConnectionFailedErrorMessage(error: unknown): Omit<Notification, "id"> {
	return {
		severity: "error",
		title: { key: "server.connection.failed.title" },
		message: {
			key: "server.connection.failed.message",
			args: { ERROR: { type: "plain", value: JSON.stringify(error, undefined, 2) } }
		}
	};
}

export function sanityCheck(mode: typeof DEVAPP_MODE): void {
	if (mode !== DEVAPP_MODE) {
		throw new Error(
			`A "${mode}" feature was used, but the current mode is "${DEVAPP_MODE}". Configuration error?`
		);
	}
}
