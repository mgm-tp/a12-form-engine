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

import type {
	MarkdownEditorHandle,
	UploadedImage
} from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import { flushEditorAfterImageUpload } from "../../../view/internal/components/widgets/form-engine/attachments/flush-editor-after-image-upload.js";

describe("unit.attachments", () => {
	describe("flushEditorAfterImageUpload", () => {
		/** An editor handle whose `flush` is the returned mock - the only member the wrapper uses. */
		function createHandle() {
			const flush = mock.fn();
			return { handle: { flush } as unknown as MarkdownEditorHandle, flush };
		}

		function uploadArguments(): [File, { signal: AbortSignal }] {
			return [new File(["x"], "img.png"), { signal: new AbortController().signal }];
		}

		function nextMacrotask(): Promise<void> {
			return new Promise(resolve => setTimeout(resolve));
		}

		it("passes the uploaded image through unchanged", async () => {
			const image: UploadedImage = { src: "http://host/cs/download/1", altText: "img.png" };
			const onImageUpload = flushEditorAfterImageUpload(
				() => Promise.resolve(image),
				() => null
			);

			strictEqual(await onImageUpload(...uploadArguments()), image);
		});

		it("flushes the editor once the upload has resolved, not before", async () => {
			const { handle, flush } = createHandle();
			const onImageUpload = flushEditorAfterImageUpload(
				() => Promise.resolve({ src: "http://host/cs/download/1" }),
				() => handle
			);

			await onImageUpload(...uploadArguments());
			strictEqual(flush.mock.callCount(), 0);

			await nextMacrotask();
			strictEqual(flush.mock.callCount(), 1);
		});

		it("does not flush when the upload fails", async () => {
			const { handle, flush } = createHandle();
			const onImageUpload = flushEditorAfterImageUpload(
				() => Promise.reject(new Error("upload failed")),
				() => handle
			);

			await rejects(onImageUpload(...uploadArguments()), /upload failed/);
			await nextMacrotask();
			strictEqual(flush.mock.callCount(), 0);
		});

		it("reads the editor at flush time, skipping one unmounted meanwhile", async () => {
			const { handle, flush } = createHandle();
			const editorRef: { current: MarkdownEditorHandle | null } = { current: handle };
			const onImageUpload = flushEditorAfterImageUpload(
				() => Promise.resolve({ src: "http://host/cs/download/1" }),
				() => editorRef.current
			);

			await onImageUpload(...uploadArguments());
			editorRef.current = null;
			await nextMacrotask();

			strictEqual(flush.mock.callCount(), 0);
		});
	});
});
