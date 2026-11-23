// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { DataProvider } from "@com.mgmtp.a12.client/client-core/lib/core/data/index.js";
import type { Selector } from "@com.mgmtp.a12.client/client-core/lib/core/store/index.js";
import type { DocumentJsonRpc2Request } from "@com.mgmtp.a12.dataservices/dataservices-access/lib/Document/index.js";
import type { Query } from "@com.mgmtp.a12.dataservices/dataservices-access/lib/query/Query.js";
import type { QueryJsonRpc2Request } from "@com.mgmtp.a12.dataservices/dataservices-access/lib/query/Request.js";

/**
 * @experimental
 *
 * Map of request selector factories that can be customized.
 * When customizing, always spread the default factories.
 */
export interface RequestSelectorMap {
	/**
	 * Selects the request that will be made when loading a document
	 */
	load: (
		config: DataProvider.LoadConfig
	) => Selector<QueryJsonRpc2Request<Query.DocRefExactMatchQueryRoot>>;
	/**
	 * Selects the request that will be made when saving a document.
	 * Note the document can either be new or existing
	 */
	save: (
		config: DataProvider.SaveConfig
	) => Selector<
		DocumentJsonRpc2Request.AddJsonRpc2Request | DocumentJsonRpc2Request.ModifyJsonRpc2Request
	>;
	/**
	 * Selects the request that will be made when deleting a document
	 */
	delete: (
		config: DataProvider.DeleteConfig
	) => Selector<DocumentJsonRpc2Request.DeleteJsonRpc2Request>;
}
