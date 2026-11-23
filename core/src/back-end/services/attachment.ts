// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Attachment } from "@com.mgmtp.a12.dataservices/dataservices-access/lib/Attachment/attachment.js";

import type { FormModel } from "../../models/internal/form-model.js";

const mimeTypeMap: { [key: string]: FormModel.PlaceholderIconType } = {
	"application/msword": "text",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document": "text",
	"application/vnd.oasis.opendocument.text": "text",
	"application/rtf": "text",
	"text/rtf": "text",
	"text/plain": "text",
	"application/pdf": "pdf",
	"image/*": "image",
	"video/*": "video",
	"audio/*": "sound",
	"application/vnd.ms-excel": "spreadsheet",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "spreadsheet",
	"application/vnd.oasis.opendocument.spreadsheet": "spreadsheet"
};

/** @internal */
export function getPlaceholderIconForMimeType(
	mimeType?: string | null
): FormModel.PlaceholderIconType {
	const normalizedMimeType =
		mimeType &&
		(mimeType.startsWith("image") || mimeType.startsWith("video") || mimeType.startsWith("audio"))
			? mimeType.slice(0, mimeType.indexOf("/") + 1) + "*"
			: mimeType;

	return mimeTypeMap[normalizedMimeType ?? ""] ?? "default";
}

/** @internal */
export function getLinkIconForMimeType(mimeType?: string | null): string {
	const placeholderIcon = getPlaceholderIconForMimeType(mimeType);
	return `datatype_${placeholderIcon === "sound" ? "audio" : placeholderIcon}`;
}

/**@internal */
export const EMPTY_ATTACHMENT: Attachment = {
	attachment_id: null,
	category: null,
	content: null,
	description: null,
	internal_filename: null,
	mime_type: null,
	original_filename: null,
	size: null
};
