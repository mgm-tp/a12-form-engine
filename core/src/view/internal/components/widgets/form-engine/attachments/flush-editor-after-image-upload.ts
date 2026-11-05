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
	ImageUploadContext,
	MarkdownEditorHandle,
	UploadedImage
} from "@com.mgmtp.a12.widgets/widgets-core/experimental";

type ImageUploadHandler = (file: File, context: ImageUploadContext) => Promise<UploadedImage>;

/**
 * Wraps an `onImageUpload` handler so the editor reports its value right after an image finishes
 * uploading, instead of waiting for the next blur.
 *
 * The editor only reports on blur (`emitMode="blur"`, see `MarkdownEditorField`), but an upload
 * resolves whenever the server answers - often after the editor has already lost focus, e.g. to
 * a loading mask. The finished image would then sit in the editor unreported, and saving would
 * store the markdown without it.
 *
 * The flush is deferred by a macrotask: the widget swaps the placeholder for the uploaded image
 * in its own continuation of the returned promise, through an editor update that commits
 * asynchronously as well - only after that does the editor have the image to report.
 * `getEditorHandle` is read at that point, so an editor unmounted meanwhile is skipped.
 * A failed upload changes nothing in the markdown, so it flushes nothing either.
 *
 * Obsolete once the widget reports changes made while it is not focused despite `emitMode="blur"`
 * (A12W-11738).
 */
export function flushEditorAfterImageUpload(
	upload: ImageUploadHandler,
	getEditorHandle: () => MarkdownEditorHandle | null
): ImageUploadHandler {
	function flushEditor(): void {
		getEditorHandle()?.flush();
	}

	function scheduleFlush(image: UploadedImage): UploadedImage {
		setTimeout(flushEditor);
		return image;
	}

	return function onImageUpload(file: File, context: ImageUploadContext): Promise<UploadedImage> {
		return upload(file, context).then(scheduleFlush);
	};
}
