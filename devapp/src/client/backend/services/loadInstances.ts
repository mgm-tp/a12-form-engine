// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { Dispatcher } from "@com.mgmtp.a12.dataservices/dataservices-access/lib/dispatch/index.js";

import { sanityCheck } from "../utils.js";

import { RequestBuilder } from "./RequestBuilder.js";

export async function loadServicesInstances(
	targetDocumentModel: string,
	language: string
): Promise<string[]> {
	sanityCheck("services");

	const [{ result }] = await Dispatcher.rpc(language, [
		RequestBuilder.query({
			targetDocumentModel,
			projectionName: "document",
			fields: ["/__meta/docRef"],
			paging: {
				pageNumber: 0,
				pageSize: 100 // default services limit
			}
		})
	]);

	return result.entries.map(e => e.docRef);
}
