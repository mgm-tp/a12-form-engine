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
