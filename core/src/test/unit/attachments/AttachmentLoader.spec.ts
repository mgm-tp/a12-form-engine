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

import { deepStrictEqual, rejects, strictEqual } from "node:assert/strict";
import { mock } from "node:test";

import type { AttachmentHeader } from "@com.mgmtp.a12.dataservices/dataservices-access";
import { Dispatcher } from "@com.mgmtp.a12.dataservices/dataservices-access";
import { localizableFromLocalizationTreeMap } from "@com.mgmtp.a12.utils/utils-localization";

import { DEFAULT_TRANSLATIONS, RESOURCE_KEYS } from "../../../back-end/localization/index.js";
import { platformAttachmentLoader } from "../../../client-extensions/index.js";

describe("unit.attachments.AttachmentLoader", () => {
	describe("platformAttachmentLoader", () => {
		describe("#retrieveDownloadLink", () => {
			it("throws when attachment id is missing", () => {
				return rejects(
					platformAttachmentLoader.retrieveDownloadLink(
						{ content: "embedded" },
						{ documentModelName: "test", documentId: "doc/1" }
					),
					/Need attachment id!/
				);
			});

			it("returns result of rpc request", async () => {
				const expectedUrl = "url";
				mock.method(Dispatcher, "rpc", async () => [
					{ jsonrpc: "2.0", id: "test", result: { location: expectedUrl } }
				]);

				const actualUrl = await platformAttachmentLoader.retrieveDownloadLink(
					{ attachment_id: "1" },
					{ documentModelName: "test", documentId: "doc/1" }
				);

				strictEqual(actualUrl, expectedUrl);
			});
		});

		describe("#uploadFiles", () => {
			it("returns list of attachments in case of successful uploads", async () => {
				const files = [
					{ file: file("A"), attachmentPath: [] },
					{ file: file("B"), attachmentPath: [] }
				];

				const attachmentHeaders = files.map(f => ({
					attachmentId: f.file.name,
					filename: f.file.name,
					size: 1,
					mimeType: "",
					bigThumbnailUrl: ""
				}));

				const jsonMock = mock.method(Dispatcher, "rest", async () => attachmentHeaders[1]);
				jsonMock.mock.mockImplementationOnce(async () => attachmentHeaders[0]);

				const actual = await platformAttachmentLoader.uploadFiles(
					files,
					{ documentModelName: "test", documentId: "" },
					{} as AbortSignal
				);

				deepStrictEqual(actual, attachmentHeaders.map(attachment));
			});

			it("returns list of errors in case of failed uploads", async () => {
				const files = [
					{ file: file("A"), attachmentPath: [] },
					{ file: file("B"), attachmentPath: [] }
				];

				const expectedLocalizables = files.map((_, idx) =>
					localizableFromLocalizationTreeMap(
						RESOURCE_KEYS.attachment.error.unknown,
						DEFAULT_TRANSLATIONS,
						{
							ERROR: { type: "plain", value: ` ${JSON.stringify(`error${idx}`)}` }
						}
					)
				);

				const jsonMock = mock.method(Dispatcher, "rest", () => Promise.reject("error1"));
				jsonMock.mock.mockImplementationOnce(() => Promise.reject("error0"));

				const actual = await platformAttachmentLoader.uploadFiles(
					files,
					{ documentModelName: "test", documentId: "" },
					{} as AbortSignal
				);

				deepStrictEqual(actual, expectedLocalizables);
			});

			it("returns mixed list of attachments and errors in case of some failed uploads", async () => {
				const files = [
					{ file: file("A"), attachmentPath: [] },
					{ file: file("B"), attachmentPath: [] }
				];

				const results = files.map((f, idx) =>
					idx === 0
						? {
								attachmentId: f.file.name,
								filename: f.file.name,
								size: 1,
								mimeType: "",
								bigThumbnailUrl: ""
							}
						: localizableFromLocalizationTreeMap(
								RESOURCE_KEYS.attachment.error.unknown,
								DEFAULT_TRANSLATIONS,
								{
									ERROR: { type: "plain", value: ` ${JSON.stringify(`error${idx}`)}` }
								}
							)
				);

				const jsonMock = mock.method(
					Dispatcher,
					"rest",
					(): Promise<(typeof results)[number]> => Promise.reject("error1")
				);
				jsonMock.mock.mockImplementationOnce(async () => results[0]);

				const actual = await platformAttachmentLoader.uploadFiles(
					files,
					{ documentModelName: "test", documentId: "" },
					{} as AbortSignal
				);

				deepStrictEqual(actual, [attachment(results[0] as AttachmentHeader), results[1]]);
			});
		});
	});
});

function file(name: string) {
	return {
		name,
		size: 1,
		type: "txt",
		async arrayBuffer() {
			return new ArrayBuffer(0);
		}
	} as unknown as File;
}

function attachment(ah: AttachmentHeader) {
	return {
		attachment_id: ah.attachmentId,
		internal_filename: ah.filename,
		original_filename: ah.filename,
		size: ah.size,
		mime_type: ah.mimeType,
		thumbnail: ah.bigThumbnailUrl
	};
}
