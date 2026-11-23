// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Attachment } from "@com.mgmtp.a12.dataservices/dataservices-access/lib/Attachment/attachment.js";
import {
	AttachmentHeader,
	AttachmentUploadV2
} from "@com.mgmtp.a12.dataservices/dataservices-access/lib/Attachment/attachment.js";
import { AttachmentServerError } from "@com.mgmtp.a12.dataservices/dataservices-access/lib/Attachment/attachmentServerError.js";
import { ErrorResponse } from "@com.mgmtp.a12.dataservices/dataservices-access/lib/common/ErrorPayload.js";
import { Dispatcher } from "@com.mgmtp.a12.dataservices/dataservices-access/lib/dispatch/index.js";
import type { Localizable } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import { localizableFromLocalizationTreeMap } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

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
