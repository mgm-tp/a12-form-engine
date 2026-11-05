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

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import { Attachment } from "@com.mgmtp.a12.dataservices/dataservices-access";
import type { EntityInstancePath, GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import type {
	ImageUploadContext,
	UploadedImage
} from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import type { EngineState } from "../../../../../../back-end/store/index.js";
import {
	AttachmentDataSelectors,
	DataSelectors
} from "../../../../../../back-end/store/internal/selectors/data.js";
import { ModelSelectors } from "../../../../../../back-end/store/internal/selectors/models.js";
import { UiStateSelectors } from "../../../../../../back-end/store/internal/selectors/ui-state.js";
import { getDocumentPath } from "../../../../../../back-end/utils/internal/path.js";
import { findElementByFormModelPath } from "../../../../../../models/internal/findElementByFormModelPath.js";
import { isFormModelRepeat } from "../../../../../../models/internal/FormModelGuards.js";
import { DocumentUtils } from "../../../../../../models/internal/utils/document-utils.js";
import type { DispatchConfiguration } from "../../../../configuration/dispatch-configuration.js";

import { isRepeatWithMultiFileUpload } from "./attachmentUtils.js";

/**
 * Builds an `onImageUpload` handler for the widgets `MarkdownEditor`'s image-upload extension,
 * backed by form-engine's existing attachment upload flow.
 *
 * `markdownAttachmentRepeatPath` must point to a `Repeat` configured with `multiFileUploadOptions`
 * (the same feature used for repeat-level multi-file attachment repeats) — that repeat is where
 * uploaded images are stored as attachments. It may be shared with other markdown fields, or
 * even a regular attachment control, without ambiguity: each upload is matched back by a
 * per-upload id embedded in its filename, not by which field or repeat it came from.
 *
 * The repeat must not be nested inside another repeat, nor an ancestor of one the markdown
 * field is itself nested in (SME enforces this when modeling `markdownAttachmentRepeat`). That's the
 * only combination verified safe here; any other nesting relationship between the two repeats
 * isn't currently supported - not because it's known to break, but because it hasn't been
 * checked.
 *
 * The uploaded image's `src` is the thumbnail the `AttachmentLoader` provides (keyed by
 * `attachment_id`). An attachment's embedded `content` is deliberately not used: embedding
 * attachments is not supported by form-engine out of the box. The attachment row can land before
 * its thumbnail (some loaders write the row and its thumbnail in separate steps), so a match
 * without one yet just keeps waiting rather than being treated as final.
 *
 * A full download link (as used elsewhere for viewing/downloading an attachment) is deliberately
 * not requested here even though it would give a better image than a thumbnail: it only resolves
 * for an attachment already persisted with a saved document, which one just uploaded into an
 * unsaved document - exactly this flow - never is. Requesting it here would be a
 * guaranteed-to-fail round trip on every single upload, not an occasional fallback.
 *
 * There is no reliable signal for "the upload failed": the saga that calls the
 * `AttachmentLoader` does not report a rejection back as an action, so nothing may ever
 * appear to match against, or a match may never get a thumbnail. `timeoutMs` bounds how
 * long an upload waits before rejecting on its own. If a match shows up (or gets its
 * thumbnail) after that, it is no longer referenced by anything - it is deleted instead
 * of left as an orphaned attachment.
 *
 * A widget-map-level component cannot reach into form-engine's own redux store directly - form
 * engine doesn't own a `<Provider>` of its own, and reads the host's store through props threaded
 * down from a connected ancestor instead (`RenderOptions.state`/`RenderOptions.eventHandlers`).
 * This is why `getState`/`subscribe`/`eventHandlers` below are plain callbacks rather than a
 * redux `Store`: the caller (normally form-engine's own `MarkdownInput`, which already has that
 * access) builds them from its own `props`/`RenderOptions`, then passes the finished upload
 * handler down to `MarkdownEditorField` (the internal `ComponentMap` entry composing
 * `WidgetMap.MarkdownEditor` and `WidgetMap.ImageUploadPlugin`), which wires it into the plugin.
 */
export function createMarkdownAttachmentImageUpload(options: {
	readonly eventHandlers: Pick<
		DispatchConfiguration,
		"onAttachmentUpload" | "onAttachmentDelete" | "onAttachmentValueChange"
	>;
	readonly getState: () => EngineState;
	readonly subscribe: (listener: () => void) => () => void;
	readonly markdownAttachmentRepeatPath: ModelPath;
	/** @default 30000 */
	readonly timeoutMs?: number;
}): (file: File, context: ImageUploadContext) => Promise<UploadedImage> {
	const {
		eventHandlers,
		getState,
		subscribe,
		markdownAttachmentRepeatPath,
		timeoutMs = 30_000
	} = options;

	return function onImageUpload(file: File, context: ImageUploadContext): Promise<UploadedImage> {
		return new Promise((resolve, reject) => {
			// Everything through the initial `dispatch` below is synchronous: a thrown error here
			// would otherwise just become a silently rejected promise, with nothing logged anywhere.
			try {
				setUpUpload();
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error("markdown-attachment-image-upload: failed to start upload", error);
				reject(error);
			}

			function setUpUpload(): void {
				const state = getState();
				const formModel = ModelSelectors.formModel()(state);
				const documentModel = ModelSelectors.documentModel()(state);
				const repeat = findElementByFormModelPath(formModel, markdownAttachmentRepeatPath);

				if (!isFormModelRepeat(repeat) || !isRepeatWithMultiFileUpload(repeat)) {
					reject(
						new Error(
							"markdownAttachmentRepeatPath must point to a Repeat configured with multiFileUploadOptions."
						)
					);
					return;
				}

				const attachmentModelPath = repeat.multiFileUploadOptions.elementPath;
				const dataContext = UiStateSelectors.currentScreenLocation()(state).path;
				const rowsPath = getDocumentPath(documentModel, repeat.groupPath, dataContext);

				const existingFilesNow = (): ReturnType<typeof AttachmentDataSelectors.currentFiles> =>
					AttachmentDataSelectors.currentFiles(getState(), rowsPath, attachmentModelPath);

				const existingFiles = existingFilesNow();
				const repeatGroupName = rowsPath.at(-1)?.elementName;
				if (!repeatGroupName) {
					reject(
						new Error("markdownAttachmentRepeatPath must point to a Repeat with a non-empty name.")
					);
					return;
				}
				const attachmentGroupName = attachmentModelPath.at(-1)?.elementName;

				if (!attachmentGroupName) {
					reject(
						new Error(
							"markdownAttachmentRepeatPath must point to a Repeat containing an Attachment with a non-empty name."
						)
					);
					return;
				}
				// The row index here is only a placeholder: form-engine assigns the real row when the
				// upload is committed, using the current row count at that moment - not this one.
				const attachmentPath: EntityInstancePath = [
					...rowsPath.slice(0, -1),
					{ elementName: repeatGroupName, index: existingFiles.length + 1 },
					{ elementName: attachmentGroupName, index: 1 }
				];

				// The filename carries the correlation id through the existing upload/attachment
				// pipeline unchanged, so the result can be matched back regardless of upload order.
				const uploadId = crypto.randomUUID();
				const taggedFile = new File([file], `${uploadId}__${file.name}`, { type: file.type });
				const prefix = `${uploadId}__`;

				let settled = false;
				// Set once we reject on our own (timeout/abort) without ever hearing back from the
				// upload: if a match still shows up afterwards, nothing references it anymore, so it
				// gets deleted instead of left behind as an orphaned attachment.
				let gaveUp = false;
				const timeoutHandle = setTimeout(() => {
					giveUp(new Error(`Uploading "${file.name}" timed out after ${timeoutMs}ms.`));
				}, timeoutMs);

				function settle(action: () => void): void {
					if (settled) {
						return;
					}
					settled = true;
					clearTimeout(timeoutHandle);
					action();
				}

				function giveUp(error: unknown): void {
					settle(() => reject(error));
					gaveUp = true;
				}

				function checkForResult(): boolean {
					const match = existingFilesNow().find(f => f.fileName.startsWith(prefix));
					if (!match) {
						return false;
					}

					const currentState = getState();
					const document = DataSelectors.document()(currentState) as GroupInstance;
					const attachment = DocumentUtils.getValue({ document, path: match.documentPath });

					if (!Attachment.isInstance(attachment)) {
						return false;
					}

					if (gaveUp) {
						eventHandlers.onAttachmentDelete(attachment, match.documentPath);
						return true;
					}

					const src = AttachmentDataSelectors.thumbnail(attachment)(currentState);
					if (!src) {
						// The row exists, but its thumbnail has not landed yet - some loaders write the
						// row and its thumbnail in separate steps. Keep waiting for a later update rather
						// than treating this as final; `timeoutMs` catches a thumbnail that never arrives.
						return false;
					}

					return settleWith(match.documentPath, attachment, src);
				}

				function settleWith(
					documentPath: EntityInstancePath,
					attachment: Attachment,
					resolvedSrc: string
				): true {
					settle(() => {
						// Only the widget-facing altText is untagged above; without this, the tagged
						// name would stay in the document (and in the AttachmentLoader's own records)
						// forever, since nothing else ever revisits it once the upload has resolved.
						eventHandlers.onAttachmentValueChange(
							documentPath,
							{ ...attachment, original_filename: file.name },
							markdownAttachmentRepeatPath
						);
						resolve({ src: resolvedSrc, altText: file.name });
					});
					return true;
				}

				if (context.signal.aborted) {
					giveUp(context.signal.reason);
					return;
				}

				eventHandlers.onAttachmentUpload(
					[{ file: taggedFile, attachmentPath }],
					markdownAttachmentRepeatPath,
					rowsPath,
					undefined,
					existingFiles
				);

				if (checkForResult()) {
					return;
				}

				const unsubscribe = subscribe(() => {
					if (checkForResult() && settled) {
						unsubscribe();
					}
				});

				context.signal.addEventListener("abort", () => giveUp(context.signal.reason));
			}
		});
	};
}
