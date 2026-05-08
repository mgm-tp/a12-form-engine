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

import type { SagaGenerator } from "typed-redux-saga";
import { call, cancel, fork, put, select, takeEvery } from "typed-redux-saga";
import type { Action, AnyAction } from "typescript-fsa";

import { Attachment } from "@com.mgmtp.a12.dataservices/dataservices-access/lib/Attachment/attachment.js";
import { LoggerFactory } from "@com.mgmtp.a12.utils/utils-logging/lib/factory.js";

import { Events } from "../../../../../../../back-end/store/index.js";
import { assertCondition } from "../../../../../../../back-end/utils/internal/assertions.js";
import { FormEngineActions } from "../../actions.js";
import type { FormEngineSagaOptions } from "../../sagaOptions.js";

import { uploadDone } from "../actions.js";
import type { AttachmentWithThumbnail } from "../attachmentLoader/AttachmentLoader.js";
import type { UploadResults } from "../attachmentState.js";
import { defaultDocumentDescriptorSelector } from "../documentDescriptor/defaultDocumentDescriptorSelector.js";
import { handleAsCopy, handleReplace, handleSkip } from "../handleDuplicates.js";
import type { ExistingFile } from "../utils.js";

import { cancelSaga } from "./cancelSaga.js";

const logger = LoggerFactory.getLogger("attachments");

/** Convenience typing */
type UploadActionPayload = FormEngineActions.FormEngineEventActions<
	Action<Events.Attachments.UploadAttachmentsPayload>
>;

/** @internal */
export function* uploadSaga(options?: FormEngineSagaOptions): SagaGenerator<void> {
	yield* takeEvery(
		(a: AnyAction): a is Action<UploadActionPayload> =>
			FormEngineActions.event.match(a) &&
			Events.Attachments.uploadAttachments.match(a.payload.engineEvent),
		function* ({ payload }) {
			return yield* uploadWorker(payload, options);
		}
	);
}

/**
 * Handles uploadAttachments actions:
 *
 * NOTE: Ideally, this saga just dispatches *a single action* after the upload is finished (with the semantic of "UPLOAD_DONE")
 * and lets a reducer handle everything else. When FE middlewares are turned into reducers, this saga should be simplified as well.
 */
function* uploadWorker(
	payload: UploadActionPayload,
	options?: FormEngineSagaOptions
): SagaGenerator<void> {
	const { attachmentLoader, documentDescriptorSelector } = options ?? {};
	if (!attachmentLoader) {
		logger.warn(
			`Uploading attachments requires an AttachmentLoader to be registered in the FormEngine sagas!`
		);
		return;
	}

	const {
		files,
		duplicateStrategy,
		pathToRepeatGroup,
		existingFiles = []
	} = payload.engineEvent.payload;

	const documentDescriptor = yield* select(
		documentDescriptorSelector ?? defaultDocumentDescriptorSelector,
		payload.activityId,
		files[0].attachmentPath
	);

	const filesForUpload =
		duplicateStrategy === "skip"
			? handleSkip(files, existingFiles)
			: duplicateStrategy === "as_copy"
				? handleAsCopy(files, existingFiles)
				: files;

	if (!filesForUpload.length) {
		// if all files were duplicates, we don't have to call the attachment loader
		// uploadDone must still be dispatched, as it reset the loading state
		yield* put(
			uploadDone({
				activityId: payload.activityId,
				attachments: [],
				errors: [],
				pathToRepeatGroup
			})
		);
		return;
	}

	const abortController = new AbortController();
	const abortTask = yield* fork(cancelSaga, abortController);

	const data = yield* call(
		[attachmentLoader, "uploadFiles"],
		filesForUpload,
		documentDescriptor,
		abortController.signal
	);

	assertCondition(
		data.length === filesForUpload.length,
		`Received ${data.length} results after uploading ${filesForUpload.length} files!`
	);

	yield* cancel(abortTask);

	// returning here means we don't need to handle cancellation errors below
	if (abortController.signal.aborted) {
		return;
	}

	const { successes, failures } = data.reduce<UploadResults>(
		(results, result, idx) => {
			return Attachment.isInstance(result)
				? { ...results, successes: results.successes.concat(result) }
				: {
						...results,
						failures: results.failures.concat({
							error: result,
							path: filesForUpload[idx].attachmentPath
						})
					};
		},
		{ successes: [], failures: [] }
	);

	if (successes.length > 0) {
		// dispatch the actual value change that will update the document
		yield* put(
			FormEngineActions.event({
				activityId: payload.activityId,
				engineEvent: createEngineEvent(payload, successes, existingFiles)
			})
		);
	}

	yield* put(
		uploadDone({
			activityId: payload.activityId,
			attachments: successes,
			errors: failures,
			pathToRepeatGroup
		})
	);
}

function createEngineEvent(
	payload: UploadActionPayload,
	successfulUploads: Attachment[],
	existingFiles: ExistingFile[]
) {
	const { files, formModelElementPath, pathToRepeatGroup, duplicateStrategy } =
		payload.engineEvent.payload;

	// thumbnail is not valid for the attachment group, so we remove it before the value change
	const actualAttachments = successfulUploads.map(removeThumbnail);

	//  a single attachment change from a MultiFileUpload should still be processed by the `multiFileUpload` action
	if (actualAttachments.length === 1 && pathToRepeatGroup === undefined) {
		return Events.attachmentValueChange({
			path: files[0].attachmentPath,
			value: actualAttachments[0],
			formModelElementPath
		});
	}

	assertCondition(
		pathToRepeatGroup !== undefined,
		"Repeat path must exist when uploading more then 1 file!"
	);

	const [toBeAdded, toBeReplaced] =
		duplicateStrategy === "replace"
			? handleReplace(actualAttachments, existingFiles)
			: [actualAttachments];

	return Events.Repeat.multiFileUpload({
		path: pathToRepeatGroup,
		repeatFormModelPath: formModelElementPath,
		attachmentModelPath: files[0].attachmentPath,
		toBeAdded,
		toBeReplaced
	});
}

function removeThumbnail(value: AttachmentWithThumbnail): Attachment {
	const { thumbnail, ...attachment } = value;

	return attachment;
}
