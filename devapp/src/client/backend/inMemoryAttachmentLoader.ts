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
import type {
	AttachmentLoader,
	AttachmentWithThumbnail,
	Events
} from "@com.mgmtp.a12.formengine/formengine-core";
import { RESOURCE_KEYS } from "@com.mgmtp.a12.formengine/formengine-core";
import type { Localizable } from "@com.mgmtp.a12.utils/utils-localization";

const base64URIMatcher = /^data:([^;]+);base64,(.*)$/;

const uploadedContents = new Map<string, string>();

/**
 * Devapp-only mock customization of the {@link AttachmentLoader}, not a pattern for applications:
 * there is no server, so uploaded files are kept as base64 data URIs in memory, referenced by an
 * `attachment_id`, with the data URI as thumbnail. Like with a real server, an uploaded attachment can
 * only be downloaded once the document is saved, and images uploaded in a markdown editor (which only
 * shows thumbnails) work. Attachments embedding their `content` in the document, e.g. in example data,
 * can still be downloaded.
 *
 * NOTE: Uploaded files only live in memory; a page reload discards them together with the document.
 * Use {@link embedUploadedAttachments} before persisting a document outside the store.
 */
export const inMemoryAttachmentLoader: AttachmentLoader = {
	uploadFiles: base64Encoder,
	retrieveDownloadLink: base64Decoder
};

async function base64Decoder(attachment: Attachment): Promise<string> {
	const content = attachment.content ?? uploadedContents.get(attachment.attachment_id ?? "");
	if (!content) {
		throw new Error("Need attachment content!");
	}

	const match = content.match(base64URIMatcher);

	const [, contentType, b64Data] = match ?? ([] as string | undefined[]);
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
): Promise<(AttachmentWithThumbnail | Localizable)[]> {
	const results = files.map(({ file }) => {
		const reader = new FileReader();

		return new Promise<AttachmentWithThumbnail>((resolve, reject) => {
			reader.addEventListener("load", () => {
				if (typeof reader.result === "string") {
					resolve(storeUpload(file, reader.result));
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

/** Keeps the uploaded data URI in memory - an attachment may have `content` or an `attachment_id`, not both. */
function storeUpload(file: File, dataUri: string): AttachmentWithThumbnail {
	const attachmentId = crypto.randomUUID();
	uploadedContents.set(attachmentId, dataUri);

	return {
		attachment_id: attachmentId,
		internal_filename: file.name,
		original_filename: file.name,
		size: file.size,
		mime_type: file.type,
		thumbnail: dataUri
	};
}

/**
 * Devapp-only, discouraged for applications (embedding attachments in documents makes them slow):
 * replaces every attachment uploaded with the {@link inMemoryAttachmentLoader} in `data` by one
 * embedding its `content`, so the data stays downloadable after a reload or in another tab.
 */
export function embedUploadedAttachments<T>(data: T): T {
	return embedInValue(data) as T;
}

function embedInValue(value: unknown): unknown {
	return Array.isArray(value)
		? value.map(embedInValue)
		: isUploadedAttachment(value)
			? embedAttachment(value)
			: isPlainObject(value)
				? Object.fromEntries(Object.entries(value).map(embedInEntry))
				: value;
}

function embedInEntry([key, value]: [string, unknown]): [string, unknown] {
	return [key, embedInValue(value)];
}

/** Only plain objects are walked into - document values like dates are kept as they are. */
function isPlainObject(value: unknown): value is Record<string, unknown> {
	return (
		typeof value === "object" && value !== null && Object.getPrototypeOf(value) === Object.prototype
	);
}

function isUploadedAttachment(value: unknown): value is Attachment & { attachment_id: string } {
	return (
		isPlainObject(value) &&
		typeof value.attachment_id === "string" &&
		uploadedContents.has(value.attachment_id)
	);
}

function embedAttachment({
	attachment_id,
	...attachment
}: Attachment & { attachment_id: string }): Attachment {
	return { ...attachment, content: uploadedContents.get(attachment_id) };
}
