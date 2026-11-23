// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { Dispatcher } from "@com.mgmtp.a12.dataservices/dataservices-access/lib/dispatch/index.js";
import type { Locale } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { DEVAPP_MODE } from "../config/mode.js";

import { loadMockInstances } from "./mock/loadInstances.js";
import { loadServicesInstances } from "./services/loadInstances.js";
import { RequestBuilder } from "./services/RequestBuilder.js";

export function loadInstances(dmName: string, locale: Locale): Promise<string[]> {
	switch (DEVAPP_MODE) {
		case "mock":
			return loadMockInstances(dmName);
		case "services":
			return loadServicesInstances(dmName, locale.language);
	}
}

export async function deleteInstance(instance: string, locale: Locale): Promise<void> {
	switch (DEVAPP_MODE) {
		case "mock":
			throw new Error("Cannot delete without a backend!");
		case "services":
			await Dispatcher.rpc(locale.language, [RequestBuilder.deleteDocument(instance, locale)]);
			break;
	}
}
