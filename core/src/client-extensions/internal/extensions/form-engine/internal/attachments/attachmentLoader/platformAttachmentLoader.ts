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

import type { Attachment } from "@com.mgmtp.a12.dataservices/dataservices-access";
import {
	AttachmentHeader,
	AttachmentServerError,
	AttachmentUploadV2,
	Dispatcher,
	ErrorResponse
} from "@com.mgmtp.a12.dataservices/dataservices-access";
import type { Localizable } from "@com.mgmtp.a12.utils/utils-localization";
import { localizableFromLocalizationTreeMap } from "@com.mgmtp.a12.utils/utils-localization";

import {
	DEFAULT_TRANSLATIONS,
	RESOURCE_KEYS
} from "../../../../../../../back-end/localization/index.js";
import { DocumentPath } from "../../../../../../../models/internal/utils/document-utils.js";
import { isRecord } from "../../../../../core/utils.js";
import { RequestBuilder } from "../../../../platform-server-connectors/internal/utils/requestBuilder.js";

import type { DocumentDescriptor } from "../documentDescriptor/DocumentDescriptor.js";

import type { AttachmentFile, AttachmentLoader } from "./AttachmentLoader.js";

/**
 * An {@link AttachmentLoader} implementation that loads attachments to and from a dataservices backend
 * by making JSON RPC requests.
 */
export const platformAttachmentLoader: AttachmentLoader = {
	uploadFiles,
	retrieveDownloadLink
};

async function retrieveDownloadLink(
	attachment: Attachment,
	{ documentId }: DocumentDescriptor
): Promise<string> {
	if (!attachment.attachment_id) {
		throw new Error("Need attachment id!");
	}

	const downloadRequest = RequestBuilder.loadAttachmentURL(attachment.attachment_id, documentId);

	// not used for attachment requests
	const language = "en";
	const [{ result }] = await Dispatcher.rpc(language, [downloadRequest]);

	return result.location;
}

async function uploadFiles(
	payloadFiles: AttachmentFile[],
	{ documentModelName }: DocumentDescriptor,
	signal: AbortSignal
): Promise<(Attachment | Localizable)[]> {
	const requests = payloadFiles.map(async ({ file, attachmentPath }) => {
		const request = {
			...AttachmentUploadV2.Request.build({
				fileName: file.name,
				documentModelName,
				content: await file.arrayBuffer(),
				pathToField: DocumentPath.toString(attachmentPath)
			}),
			signal
		};

		const { attachmentId, filename, size, mimeType, bigThumbnailUrl } = await Dispatcher.rest(
			request,
			AttachmentHeader.isInstance
		);

		return {
			attachment_id: attachmentId,
			internal_filename: filename,
			original_filename: filename,
			size,
			mime_type: mimeType,
			thumbnail: bigThumbnailUrl
		};
	});

	const settled = await Promise.allSettled(requests);

	return settled.map(s => (s.status === "fulfilled" ? s.value : createErrorLocalizable(s.reason)));
}

/**
 * Extract the original {@link ErrorResponse} from the server, which is wrapped
 * in another object by the DefaultErrorResponseFilter from Utils.
 */
function extractErrorResponse(response: unknown): ErrorResponse | undefined {
	return isRecord(response) &&
		isRecord(response.content) &&
		ErrorResponse.isInstance(response.content)
		? response.content
		: undefined;
}

function createErrorLocalizable(reason: unknown): Localizable {
	const errorResponse = extractErrorResponse(reason);

	return errorResponse?.longMessage?.key
		? AttachmentServerError.createLocalizable(errorResponse.longMessage.key)
		: localizableFromLocalizationTreeMap(
				RESOURCE_KEYS.attachment.error.unknown,
				DEFAULT_TRANSLATIONS,
				{
					ERROR: { type: "plain", value: ` ${JSON.stringify(reason)}` }
				}
			);
}
