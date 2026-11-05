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

import { rejects, strictEqual } from "node:assert/strict";
import { mock } from "node:test";

import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import type { EngineState } from "../../../back-end/store/index.js";
import { createEngineStore } from "../../../back-end/store/index.js";
import { createMarkdownAttachmentImageUpload } from "../../../view/internal/components/widgets/form-engine/attachments/markdown-attachment-image-upload.js";
import { US_LOCALE } from "../../utils/localization.js";
import { loadModels } from "../../utils/setup.js";
import { FORM_MODEL } from "../../utils/test-model-helpers/repeat.multi-file-upload.js";

describe("unit.attachments", () => {
	describe("createMarkdownAttachmentImageUpload", () => {
		const models = loadModels("repeat.multi-file-upload");

		function createInitialState(): EngineState {
			return createEngineStore({
				models,
				locale: US_LOCALE,
				data: { document: { Root: { AttachmentCollection: [] } } }
			});
		}

		/**
		 * A fake `getState`/`subscribe`/`eventHandlers` triple whose `onAttachmentUpload` records
		 * its call instead of running the real saga/middleware pipeline - `resolveUpload` simulates
		 * that pipeline having finished, by appending the given attachment (with its thumbnail) to
		 * state and notifying subscribers.
		 */
		function createFakeEngine(initialState: EngineState) {
			let state = initialState;
			const subscribers = new Set<() => void>();

			return {
				getState: () => state,
				subscribe: (fn: () => void) => {
					subscribers.add(fn);
					return () => subscribers.delete(fn);
				},
				eventHandlers: {
					onAttachmentUpload: mock.fn(),
					onAttachmentDelete: mock.fn(),
					onAttachmentValueChange: mock.fn()
				},
				resolveUpload(taggedFileName: string, attachmentId: string, thumbnail?: string) {
					const document = state.data.document as GroupInstance & {
						Root: { AttachmentCollection?: GroupInstance[] };
					};
					const rows = document.Root.AttachmentCollection ?? [];
					state = {
						...state,
						data: {
							...state.data,
							document: {
								...document,
								Root: {
									...document.Root,
									AttachmentCollection: [
										...rows,
										{
											Attachment01: {
												attachment_id: attachmentId,
												original_filename: taggedFileName,
												internal_filename: taggedFileName,
												mime_type: "image/png",
												size: 1
											}
										}
									]
								}
							},
							attachmentState: {
								...state.data.attachmentState,
								thumbnails: {
									...state.data.attachmentState?.thumbnails,
									...(thumbnail ? { [attachmentId]: thumbnail } : {})
								}
							}
						}
					};
					subscribers.forEach(fn => fn());
				},
				/**
				 * Simulates a thumbnail landing on an attachment already resolved by `resolveUpload`,
				 * as a separate step - without touching the document row itself.
				 */
				attachThumbnailLater(attachmentId: string, thumbnail: string) {
					state = {
						...state,
						data: {
							...state.data,
							attachmentState: {
								...state.data.attachmentState,
								thumbnails: { ...state.data.attachmentState?.thumbnails, [attachmentId]: thumbnail }
							}
						}
					};
					subscribers.forEach(fn => fn());
				},
				/**
				 * Simulates an `AttachmentLoader` that embeds the image directly on the attachment
				 * (via `content`) instead of assigning an `attachment_id` and a separate thumbnail.
				 */
				resolveUploadWithContent(taggedFileName: string, content: string) {
					const document = state.data.document as GroupInstance & {
						Root: { AttachmentCollection?: GroupInstance[] };
					};
					const rows = document.Root.AttachmentCollection ?? [];
					state = {
						...state,
						data: {
							...state.data,
							document: {
								...document,
								Root: {
									...document.Root,
									AttachmentCollection: [
										...rows,
										{
											Attachment01: {
												original_filename: taggedFileName,
												internal_filename: taggedFileName,
												mime_type: "image/png",
												size: 1,
												content
											}
										}
									]
								}
							}
						}
					};
					subscribers.forEach(fn => fn());
				}
			};
		}

		function taggedFileNameOf(
			onAttachmentUpload: ReturnType<typeof mock.fn>,
			call: number
		): string {
			const [files] = onAttachmentUpload.mock.calls[call].arguments as [{ file: File }[]];
			return files[0].file.name;
		}

		it("rejects when markdownAttachmentRepeatPath does not point to a multi-file-upload repeat", async () => {
			const fake = createFakeEngine(createInitialState());
			const uploadImage = createMarkdownAttachmentImageUpload({
				eventHandlers: fake.eventHandlers,
				getState: fake.getState,
				subscribe: fake.subscribe,
				markdownAttachmentRepeatPath: [{ elementName: "Screen1" }]
			});

			await rejects(
				uploadImage(new File(["x"], "x.png"), { signal: new AbortController().signal }),
				/multiFileUploadOptions/
			);
		});

		it("resolves with the attachment's thumbnail as src once the upload completes", async () => {
			const fake = createFakeEngine(createInitialState());
			const uploadImage = createMarkdownAttachmentImageUpload({
				eventHandlers: fake.eventHandlers,
				getState: fake.getState,
				subscribe: fake.subscribe,
				markdownAttachmentRepeatPath: FORM_MODEL.IR.repeatFormModelPath
			});

			const pending = uploadImage(new File(["x"], "photo.png"), {
				signal: new AbortController().signal
			});

			await Promise.resolve();
			const taggedFileName = taggedFileNameOf(fake.eventHandlers.onAttachmentUpload, 0);
			fake.resolveUpload(taggedFileName, "attach-1", "thumb://photo.png");

			const result = await pending;
			strictEqual(result.src, "thumb://photo.png");
			strictEqual(result.altText, "photo.png");
		});

		it("keeps waiting when the attachment row appears before its thumbnail does", async () => {
			const fake = createFakeEngine(createInitialState());
			const uploadImage = createMarkdownAttachmentImageUpload({
				eventHandlers: fake.eventHandlers,
				getState: fake.getState,
				subscribe: fake.subscribe,
				markdownAttachmentRepeatPath: FORM_MODEL.IR.repeatFormModelPath
			});

			const pending = uploadImage(new File(["x"], "photo.png"), {
				signal: new AbortController().signal
			});

			await Promise.resolve();
			// The row lands first, without a thumbnail yet - it is attached separately afterwards.
			fake.resolveUpload(taggedFileNameOf(fake.eventHandlers.onAttachmentUpload, 0), "attach-1");

			// Give the promise a chance to (incorrectly) settle here, if it was going to.
			await Promise.resolve();

			fake.attachThumbnailLater("attach-1", "thumb://photo.png");

			const result = await pending;
			strictEqual(result.src, "thumb://photo.png");
		});

		it("does not use the attachment's own content as src, and rejects once timeoutMs elapses without a thumbnail", async () => {
			const fake = createFakeEngine(createInitialState());
			const uploadImage = createMarkdownAttachmentImageUpload({
				eventHandlers: fake.eventHandlers,
				getState: fake.getState,
				subscribe: fake.subscribe,
				markdownAttachmentRepeatPath: FORM_MODEL.IR.repeatFormModelPath,
				timeoutMs: 10
			});

			const pending = uploadImage(new File(["x"], "photo.png"), {
				signal: new AbortController().signal
			});

			await Promise.resolve();
			const taggedFileName = taggedFileNameOf(fake.eventHandlers.onAttachmentUpload, 0);
			fake.resolveUploadWithContent(taggedFileName, "data:image/png;base64,xxx");

			await rejects(pending, /timed out/);
		});

		it("rejects once timeoutMs elapses if the attachment never gets a thumbnail", async () => {
			const fake = createFakeEngine(createInitialState());
			const uploadImage = createMarkdownAttachmentImageUpload({
				eventHandlers: fake.eventHandlers,
				getState: fake.getState,
				subscribe: fake.subscribe,
				markdownAttachmentRepeatPath: FORM_MODEL.IR.repeatFormModelPath,
				timeoutMs: 10
			});

			const pending = uploadImage(new File(["x"], "photo.png"), {
				signal: new AbortController().signal
			});

			await Promise.resolve();
			fake.resolveUpload(taggedFileNameOf(fake.eventHandlers.onAttachmentUpload, 0), "attach-1");

			await rejects(pending, /timed out/);
		});

		it("matches each concurrent upload to its own result, even if they complete out of order", async () => {
			const fake = createFakeEngine(createInitialState());
			const uploadImage = createMarkdownAttachmentImageUpload({
				eventHandlers: fake.eventHandlers,
				getState: fake.getState,
				subscribe: fake.subscribe,
				markdownAttachmentRepeatPath: FORM_MODEL.IR.repeatFormModelPath
			});

			const first = uploadImage(new File(["x"], "a.png"), {
				signal: new AbortController().signal
			});
			const second = uploadImage(new File(["x"], "b.png"), {
				signal: new AbortController().signal
			});

			await Promise.resolve();
			const firstTaggedName = taggedFileNameOf(fake.eventHandlers.onAttachmentUpload, 0);
			const secondTaggedName = taggedFileNameOf(fake.eventHandlers.onAttachmentUpload, 1);

			// The second upload's result lands first.
			fake.resolveUpload(secondTaggedName, "attach-2", "thumb://b.png");
			fake.resolveUpload(firstTaggedName, "attach-1", "thumb://a.png");

			const [firstResult, secondResult] = await Promise.all([first, second]);
			strictEqual(firstResult.src, "thumb://a.png");
			strictEqual(secondResult.src, "thumb://b.png");
		});

		it("rejects once timeoutMs elapses, and deletes the attachment if it lands afterwards", async () => {
			const fake = createFakeEngine(createInitialState());
			const uploadImage = createMarkdownAttachmentImageUpload({
				eventHandlers: fake.eventHandlers,
				getState: fake.getState,
				subscribe: fake.subscribe,
				markdownAttachmentRepeatPath: FORM_MODEL.IR.repeatFormModelPath,
				timeoutMs: 10
			});

			const pending = uploadImage(new File(["x"], "slow.png"), {
				signal: new AbortController().signal
			});

			await rejects(pending, /timed out/);

			const taggedFileName = taggedFileNameOf(fake.eventHandlers.onAttachmentUpload, 0);
			fake.resolveUpload(taggedFileName, "attach-1", "thumb://slow.png");
			strictEqual(fake.eventHandlers.onAttachmentDelete.mock.calls.length, 1);
			const [deletedAttachment] = fake.eventHandlers.onAttachmentDelete.mock.calls[0].arguments;
			strictEqual(deletedAttachment.original_filename, taggedFileName);
		});

		it("rejects when aborted, and deletes the attachment if it lands afterwards", async () => {
			const fake = createFakeEngine(createInitialState());
			const controller = new AbortController();
			const uploadImage = createMarkdownAttachmentImageUpload({
				eventHandlers: fake.eventHandlers,
				getState: fake.getState,
				subscribe: fake.subscribe,
				markdownAttachmentRepeatPath: FORM_MODEL.IR.repeatFormModelPath
			});

			const pending = uploadImage(new File(["x"], "cancelled.png"), { signal: controller.signal });

			await Promise.resolve();
			controller.abort(new Error("cancelled"));
			await rejects(pending);

			const taggedFileName = taggedFileNameOf(fake.eventHandlers.onAttachmentUpload, 0);
			fake.resolveUpload(taggedFileName, "attach-1", "thumb://cancelled.png");
			strictEqual(fake.eventHandlers.onAttachmentDelete.mock.calls.length, 1);
			const [deletedAttachment] = fake.eventHandlers.onAttachmentDelete.mock.calls[0].arguments;
			strictEqual(deletedAttachment.original_filename, taggedFileName);
		});
	});
});
