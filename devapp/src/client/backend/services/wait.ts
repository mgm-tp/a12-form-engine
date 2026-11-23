// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Store } from "redux";

import {
	NotificationActions,
	NotificationSelectors
} from "@com.mgmtp.a12.client/client-core/lib/core/notification/index.js";

import { sleep } from "../../config/mode.js";

const CHECK_INTERVAL = 5000;

/**
 * Bundler proxy that points to "<server>/actuator/health/initializationFinished", which is the recommended endpoint
 * by services to query for "readiness"
 */
const STATUS_ENDPOINT = "/status";

export async function waitForServer(store: Store) {
	if (!(await isReady())) {
		store.dispatch(
			NotificationActions.add({
				severity: "info",
				title: { key: "server.connection.waiting.title" },
				message: {
					key: "server.connection.waiting.message"
				}
			})
		);

		do {
			await sleep(CHECK_INTERVAL);
		} while (!(await isReady()));

		store.dispatch(
			NotificationActions.remove(
				NotificationSelectors.notifications()(store.getState()).map(n => n.id)
			)
		);
	}
}

async function isReady(): Promise<boolean> {
	try {
		const response = await fetch(STATUS_ENDPOINT);

		const data = await response.json();

		return typeof data === "object" && data.status === "UP";
	} catch {
		return false;
	}
}
