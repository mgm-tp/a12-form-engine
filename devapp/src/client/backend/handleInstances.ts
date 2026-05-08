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
