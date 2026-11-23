// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
