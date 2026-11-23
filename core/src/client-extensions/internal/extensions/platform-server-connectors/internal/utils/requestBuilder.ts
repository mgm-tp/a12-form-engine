// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type {
	LoadAttachmentUrlJsonRpc2,
	LoadThumbnailUrlsJsonRpc2
} from "@com.mgmtp.a12.dataservices/dataservices-access/lib/Attachment/attachment.js";
import type { DocumentJsonRpc2Request } from "@com.mgmtp.a12.dataservices/dataservices-access/lib/Document/index.js";
import type {
	Query,
	QueryJsonRpc2Request
} from "@com.mgmtp.a12.dataservices/dataservices-access/lib/query/index.js";
import type { Locale } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

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

	/**
	 * Loads *all* thumbnail urls for all attachments that are referenced in
	 * the result set of the previous rpc operation.
	 *
	 */
	loadAllThumbnailURLs(): LoadThumbnailUrlsJsonRpc2.Request {
		return {
			jsonrpc: "2.0",
			id: `LOAD_THUMBNAIL_URLS_INTERNAL-${requestCounter++}`,
			method: "LOAD_THUMBNAIL_URLS_INTERNAL",
			params: {}
		};
	}
};
