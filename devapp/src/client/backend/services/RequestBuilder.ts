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
 * 1. Open-Source License - EUPL v1.2
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

import type {
	DocumentJsonRpc2Request,
	LoadAttachmentUrlJsonRpc2,
	LoadThumbnailUrlsJsonRpc2,
	Query,
	QueryJsonRpc2Request
} from "@com.mgmtp.a12.dataservices/dataservices-access";
import type { Locale } from "@com.mgmtp.a12.utils/utils-localization";

let requestCounter = 0;

export const RequestBuilder = {
	query<QueryRoot extends Query.QueryRoot>(query: QueryRoot): QueryJsonRpc2Request<QueryRoot> {
		return { jsonrpc: "2.0", method: "QUERY", id: `QUERY-${requestCounter++}`, params: { query } };
	},

	addDocument(
		documentModelName: string,
		document: object,
		locale: Locale
	): DocumentJsonRpc2Request.AddJsonRpc2Request {
		return {
			jsonrpc: "2.0",
			method: "ADD_DOCUMENT",
			id: `ADD_DOCUMENT-${requestCounter++}`,
			params: {
				documentModelName,
				document,
				// Data Services requires only the language
				locale: locale.language
			}
		};
	},

	modifyDocument(
		docRef: string,
		document: object,
		locale: Locale
	): DocumentJsonRpc2Request.ModifyJsonRpc2Request {
		return {
			jsonrpc: "2.0",
			method: "MODIFY_DOCUMENT",
			id: `MODIFY_DOCUMENT-${requestCounter++}`,
			params: {
				docRef,
				document,
				// Data Services requires only the language
				locale: locale.language
			}
		};
	},

	deleteDocument(docRef: string, locale: Locale): DocumentJsonRpc2Request.DeleteJsonRpc2Request {
		return {
			jsonrpc: "2.0",
			method: "DELETE_DOCUMENT",
			id: `DELETE_DOCUMENT-${requestCounter++}`,
			params: {
				docRef,
				// Data Services requires only the language
				locale: locale.language
			}
		};
	},

	loadAttachmentURL(attachmentId: string, docRef: string): LoadAttachmentUrlJsonRpc2.Request {
		return {
			jsonrpc: "2.0",
			id: `LOAD_ATTACHMENT_URL-${requestCounter++}`,
			method: "LOAD_ATTACHMENT_URL",
			params: { attachmentId, docRef }
		};
	},

	loadAllThumbnailURLs(): LoadThumbnailUrlsJsonRpc2.Request {
		return {
			jsonrpc: "2.0",
			id: `LOAD_THUMBNAIL_URLS_INTERNAL-${requestCounter++}`,
			method: "LOAD_THUMBNAIL_URLS_INTERNAL",
			params: {}
		};
	}
};
