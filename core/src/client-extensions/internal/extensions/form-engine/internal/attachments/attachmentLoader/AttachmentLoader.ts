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
import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type { Localizable } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type { DocumentDescriptor } from "../documentDescriptor/DocumentDescriptor.js";

/**
 * Specifies how duplicate filenames are handled. Options:
 *
 * #### "skip"
 * Duplicate files are discarded **before uploading**.
 *
 * ##### Example:
 * - Existing filenames in a repeat: [A,B]
 * - Uploading new files: [A,C,B,D]
 * - Result: [A,B,C,D] -> A,B are untouched
 *
 * #### "as_copy"
 * Duplicate files are renamed to ensure unique names.
 *
 * ##### Example:
 * - Existing filenames in a repeat: [A,B]
 * - Uploading new files: [A,B]
 * - Result: [A,B,A_copy,B_copy]
 *
 * Note that the newly uploaded files are renamed **before uploading**,
 * meaning the server only "knows" them under their new names!
 *
 * #### "replace"
 * Duplicate files will overwrite existing files.
 *
 * ##### Example:
 * - Existing filenames in a repeat: [A,B]
 * - Uploading new files: [A,B]
 * - Result: [A,B] -> A,B are changed!
 *
 * Note that in contrast to the other strategies, this will
 * be evaluated **after** files were uploaded!
 */
export type DuplicateStrategy = "skip" | "as_copy" | "replace";

/**
 * An object describing a file that should be uploaded as an attachment.
 */
export interface AttachmentFile {
	/**
	 * The actual file as a JS blob, usually created by the file picker.
	 */
	readonly file: File;

	/**
	 * The path to the attachment in the document model
	 */
	readonly attachmentPath: EntityInstancePath;
}

/**
 * Same as `Attachment`, but additionally allows to provide a thumbnail
 */
export interface AttachmentWithThumbnail extends Attachment {
	readonly thumbnail?: string;
}

/**
 * A loader responsible for handling attachments
 *
 * When using attachments in the form, an implementation of this has to be passed in the form engine sagas.
 */
export interface AttachmentLoader {
	/**
	 * Uploads one or more files.
	 *
	 * Will be called by the form engine saga on every upload action.
	 *
	 * @param files List of {@link AttachmentFile}s containing the actual file to upload and its path in the document
	 * @param documentDescriptor An object containing the id and name of the current document
	 * @param abortSignal Can be passed to any `fetch` call to support canceling the request
	 *
	 * @returns A list with elements being either an attachment (if successful) or a localizable that describes an error
	 *
	 * NOTE: Returned attachments can also include a `thumbnail` property, in case the upload logic generated it with the request.
	 * Thumbnails will then be put in the redux state and removed from the attachment object that will be put in the document.
	 */
	uploadFiles(
		files: AttachmentFile[],
		documentDescriptor: DocumentDescriptor,
		abortSignal: AbortSignal
	): Promise<(AttachmentWithThumbnail | Localizable)[]>;

	/**
	 * Deletes an attachment
	 *
	 * Will be called by the form engine saga on every delete action.
	 *
	 * @param attachment The attachment that should be deleted
	 * @param documentDescriptor An object containing the id and name of the current document
	 */
	deleteFile?(attachment: Attachment, documentDescriptor: DocumentDescriptor): Promise<void>;

	/**
	 * Retrieves the download link for a given attachment
	 *
	 * Will be called by the form engine saga on every download action.
	 *
	 * @param attachment The attachment for which the download link needs to be retrieved
	 * @param documentDescriptor An object containing the id and name of the current document
	 *
	 * @returns The download link for the given attachment
	 */
	retrieveDownloadLink(
		attachment: Attachment,
		documentDescriptor: DocumentDescriptor
	): Promise<string>;
}
