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

import { deepStrictEqual, strictEqual } from "node:assert/strict";

import type { Attachment } from "@com.mgmtp.a12.dataservices/dataservices-access/lib/Attachment/attachment.js";
import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { AttachmentFile } from "../../../client-extensions/internal/extensions/form-engine/internal/attachments/attachmentLoader/AttachmentLoader.js";
import {
	handleAsCopy,
	handleReplace,
	handleSkip
} from "../../../client-extensions/internal/extensions/form-engine/internal/attachments/handleDuplicates.js";
import type { ExistingFile } from "../../../client-extensions/internal/extensions/form-engine/internal/attachments/utils.js";
import { DocumentPath } from "../../../models/index.js";

describe("unit.attachments.handleDuplicates", () => {
	describe("handleReplace", () => {
		it("returns all given attachments as unique when no files exist yet", () => {
			const attachments = [attachment("A.txt"), attachment("B.txt"), attachment("C.txt")];

			const actual = handleReplace(attachments, []);

			strictEqual(actual.length, 1);
			deepStrictEqual(actual[0], attachments);
		});

		it("returns all given attachments as unique when there are no duplicates", () => {
			const attachments = [attachment("A.txt"), attachment("B.txt")];
			const existingFiles = [existingFile("C.txt"), existingFile("D.txt")];

			const actual = handleReplace(attachments, existingFiles);

			strictEqual(actual.length, 1);
			deepStrictEqual(actual[0], attachments);
		});

		it("splits given attachments in uniques and replaced when there are duplicates", () => {
			const attachments = [attachment("A.txt"), attachment("B.txt"), attachment("C.txt")];
			const existingFiles = [existingFile("A.txt"), existingFile("C.txt")];

			const actual = handleReplace(attachments, existingFiles);

			strictEqual(actual.length, 2);
			deepStrictEqual(actual[0], [attachment("B.txt")]);
			deepStrictEqual(actual[1], [
				{ value: attachment("A.txt"), path: existingFile("A.txt").documentPath },
				{ value: attachment("C.txt"), path: existingFile("C.txt").documentPath }
			]);
		});
	});

	describe("handleAsCopy", () => {
		it("does not change filenames when no files exist yet", () => {
			const newFiles = [attachmentFile("A.txt"), attachmentFile("B.txt"), attachmentFile("C.txt")];

			const actual = handleAsCopy(newFiles, []);

			deepStrictEqual(actual, newFiles);
		});

		it("does not change filenames when given files are already unique", () => {
			const newFiles = [attachmentFile("A.txt"), attachmentFile("B.txt")];
			const existingFiles = [existingFile("C.txt"), existingFile("D.txt")];

			const actual = handleAsCopy(newFiles, existingFiles);

			deepStrictEqual(actual, newFiles);
		});

		it("changes filenames that already exist to a unique name while keeping the attachment path", () => {
			const newFiles = [attachmentFile("A.txt"), attachmentFile("B.txt"), attachmentFile("C.txt")];
			const existingFiles = [existingFile("A.txt"), existingFile("C.txt")];

			const actual = handleAsCopy(newFiles, existingFiles);

			const actualPaths = actual.map(a => a.attachmentPath);
			const actualNames = actual.map(a => a.file?.name);

			deepStrictEqual(actualNames, ["A_copy.txt", "B.txt", "C_copy.txt"]);

			deepStrictEqual(actualPaths, [
				attachmentFile("A.txt").attachmentPath,
				attachmentFile("B.txt").attachmentPath,
				attachmentFile("C.txt").attachmentPath
			]);
		});
	});

	describe("handleSkip", () => {
		it("returns all given files when no files exist yet", () => {
			const newFiles = [attachmentFile("A.txt"), attachmentFile("B.txt"), attachmentFile("C.txt")];

			const actual = handleSkip(newFiles, []);

			deepStrictEqual(actual, newFiles);
		});

		it("returns all given files when there are no duplicates", () => {
			const newFiles = [attachmentFile("A.txt"), attachmentFile("B.txt")];
			const existingFiles = [existingFile("C.txt"), existingFile("D")];

			const actual = handleSkip(newFiles, existingFiles);

			deepStrictEqual(actual, newFiles);
		});

		it("only returns non-duplicate files in case there are existing duplicates", () => {
			const unique = attachmentFile("B.txt");

			const newFiles = [attachmentFile("A.txt"), unique, attachmentFile("C.txt")];
			const existingFiles = [existingFile("A.txt"), existingFile("C.txt")];

			const actual = handleSkip(newFiles, existingFiles);

			deepStrictEqual(actual, [unique]);
		});
	});
});

function attachment(fileName: string): Attachment {
	return {
		attachment_id: `#${fileName}`,
		original_filename: fileName
	};
}

function attachmentFile(fileName: string, path?: EntityInstancePath): AttachmentFile {
	return {
		file: new File([], fileName),
		attachmentPath: path ?? DocumentPath.fromString(`/root[1]/${fileName}[1]`)
	};
}

function existingFile(fileName: string): ExistingFile {
	return { fileName, documentPath: DocumentPath.fromString(`/root[1]/${fileName}[1]`) };
}
