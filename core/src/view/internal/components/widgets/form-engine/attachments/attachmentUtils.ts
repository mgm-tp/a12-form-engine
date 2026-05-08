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

import type { CSSProperties } from "react";
import { useMemo } from "react";

import type { Attachment } from "@com.mgmtp.a12.dataservices/dataservices-access/lib/Attachment/attachment.js";

import { FormModel } from "../../../../../../models/internal/form-model.js";

/**@internal */
export function getFileExtension(attachment: Attachment): string | undefined {
	const fileName = attachment.original_filename;

	if (fileName) {
		const indexOfExtension = fileName.lastIndexOf(".");
		return indexOfExtension !== -1 ? fileName.substring(indexOfExtension + 1) : undefined;
	}

	return undefined;
}

/**@internal */
export function hasSupportedType(attachment: Attachment): boolean {
	return attachment.mime_type !== "image/tiff";
}

/**@internal */
export function isFilled(attachment: Attachment): boolean {
	return !!attachment.original_filename;
}

/**@internal */
export function useThumbnailStyle(rowHeight?: number): CSSProperties {
	const DEFAULT = 50;

	return useMemo(
		() => ({ maxWidth: rowHeight ?? DEFAULT, maxHeight: rowHeight ?? DEFAULT }),
		[rowHeight]
	);
}

/**
 * Convenience typing to prevent checking for the options multiple times when we know they exist
 * @internal
 */
export type RepeatWithMultiFileUpload = (FormModel.InlineRepeat | FormModel.EmbeddedRepeat) & {
	readonly multiFileUploadOptions: FormModel.MultiFileUploadOptions;
};

/**@internal */
export function isRepeatWithMultiFileUpload(
	repeat: FormModel.Repeat
): repeat is RepeatWithMultiFileUpload {
	return (
		(FormModel.InlineRepeat.isInstance(repeat) || FormModel.EmbeddedRepeat.isInstance(repeat)) &&
		repeat.multiFileUpload !== undefined &&
		repeat.multiFileUploadOptions !== undefined
	);
}
