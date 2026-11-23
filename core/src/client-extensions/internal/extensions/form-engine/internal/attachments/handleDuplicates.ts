// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Attachment } from "@com.mgmtp.a12.dataservices/dataservices-access/lib/Attachment/attachment.js";

import type { Events } from "../../../../../../back-end/store/internal/actions.js";
import { partitionList } from "../../../../core/utils.js";

import type { AttachmentFile } from "./attachmentLoader/AttachmentLoader.js";
import type { ExistingFile } from "./utils.js";
import { renameFile } from "./utils.js";

type ReplacedAttachments = Events.Repeat.MultiFileUploadPayload["toBeReplaced"];

/**
 * Splits given list of {@link Attachment}s into uniques and duplicates.
 *
 * For each duplicate the document path of the existing attachment is used, effectively
 * "replacing" the existing attachment with the new one.
 *
 * @internal
 */
export function handleReplace(
	uploadedAttachments: Attachment[],
	existingFiles: ExistingFile[]
): [Attachment[], ReplacedAttachments?] {
	const [unique, duplicates] = partitionList(
		uploadedAttachments,
		attachment => !existingFiles.some(f => f.fileName === attachment.original_filename)
	);

	return duplicates.length
		? [
				unique,
				duplicates.map(attachment => ({
					value: attachment,
					path: existingFiles.find(d => d.fileName === attachment.original_filename)!.documentPath
				}))
			]
		: [unique];
}

/**
 * For a given list of {@link AttachmentFile}s, renames the ones which filename
 * already exist in the given list of {@link ExistingFile}s and returns a new list
 * where all filenames are unique.
 *
 * @internal
 */
export function handleAsCopy(
	newFiles: AttachmentFile[],
	existingFiles: ExistingFile[]
): AttachmentFile[] {
	const existingNames = existingFiles.map(f => f.fileName);

	return newFiles.map(f => {
		const isDuplicate = existingNames.some(n => n === f.file?.name);

		return {
			file: f.file && isDuplicate ? renameFile(f.file, existingNames) : f.file,
			attachmentPath: f.attachmentPath
		};
	});
}

/**
 * For a given list of {@link AttachmentFile}s, only returns the ones which filename
 * does not already exist in the given list of {@link ExistingFile}s, effectively "skipping" duplicates.
 *
 * @internal
 */
export function handleSkip(
	newFiles: AttachmentFile[],
	existingFiles: ExistingFile[]
): AttachmentFile[] {
	const existingNames = existingFiles.map(f => f.fileName);

	return newFiles.filter(f => !existingNames.some(n => n === f.file?.name));
}
