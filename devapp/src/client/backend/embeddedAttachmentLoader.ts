// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Attachment } from "@com.mgmtp.a12.dataservices/dataservices-access/lib/Attachment/attachment.js";
import type { AttachmentLoader, Events } from "@com.mgmtp.a12.formengine/formengine-core";
import { RESOURCE_KEYS } from "@com.mgmtp.a12.formengine/formengine-core";
import type { Localizable } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

const base64URIMatcher = /^data:([^;]+);base64,(.*)$/;

/**
 * An {@link AttachmentLoader} implementation that embeds attachments as base64-encoded strings in the document,
 * meaning there is no server involved.
 *
 * NOTE: Embedding attachments like this has a performance implication!
 */
export const embeddedAttachmentLoader: AttachmentLoader = {
	uploadFiles: base64Encoder,
	retrieveDownloadLink: base64Decoder
};

async function base64Decoder(attachment: Attachment): Promise<string> {
	if (!attachment.content) {
		throw new Error("Need attachment content!");
	}

	const match = attachment.content.match(base64URIMatcher);

	const [, contentType, b64Data] = match ?? [];
	if (contentType === undefined || b64Data === undefined) {
		throw new Error(`Downloading attachment not possible due to unsupported or corrupted data!`);
	}

	const byteCharacters = atob(b64Data);
	const byteNumbers = new Array(byteCharacters.length);
	for (let i = 0; i < byteCharacters.length; i++) {
		byteNumbers[i] = byteCharacters.charCodeAt(i);
	}

	const blob = new Blob([new Uint8Array(byteNumbers)], { type: contentType });

	return URL.createObjectURL(blob);
}

async function base64Encoder(
	files: Events.Attachments.UploadAttachmentsPayload["files"]
): Promise<(Attachment | Localizable)[]> {
	const results = files.map(({ file }) => {
		const reader = new FileReader();

		return new Promise<Attachment>((resolve, reject) => {
			reader.addEventListener("load", () => {
				if (typeof reader.result === "string" || reader.result === null) {
					resolve({
						internal_filename: file.name,
						original_filename: file.name,
						content: reader.result,
						size: file.size,
						mime_type: file.type
					});
				} else {
					reject(RESOURCE_KEYS.attachment.error.unknown);
				}
			});
			reader.addEventListener("error", () => {
				reject(RESOURCE_KEYS.attachment.error.unknown);
			});

			reader.readAsDataURL(file);
		});
	});

	const settled = await Promise.allSettled(results);

	return settled.map(s => (s.status === "fulfilled" ? s.value : { key: s.reason }));
}
