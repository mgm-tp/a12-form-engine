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

import type { Action } from "redux";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { Events } from "../../../../../../../back-end/store/internal/actions.js";
import type { EngineStore } from "../../../../../../../back-end/store/internal/store.js";
import { FormEngineActions } from "../../actions.js";

import { resetUnassigned, uploadDone } from "../actions.js";

/**
 * Updates the attachment state on attachment-related actions
 *
 * - loading state is set for upload actions and cleared otherwise
 * - unassigned state is
 * 	- cleared on reset (form was saved)
 * 	- appended when new attachmentIds exist
 *
 * @internal
 */
export function reduceAttachmentState(
	state: Omit<EngineStore.AttachmentState, "thumbnails"> | undefined,
	action: Action
): Omit<EngineStore.AttachmentState, "thumbnails"> | undefined {
	const newIds = getAttachmentIds(action);

	// set loading when upload
	const startLoading =
		FormEngineActions.event.match(action) &&
		Events.Attachments.uploadAttachments.match(action.payload.engineEvent);

	// reset loading when uploadDone or canceled
	const stopLoading =
		uploadDone.match(action) ||
		(FormEngineActions.event.match(action) &&
			Events.Attachments.cancelUploadAttachments.match(action.payload.engineEvent));

	const nextLoading =
		startLoading && Events.Attachments.uploadAttachments.match(action.payload.engineEvent)
			? toModelPath(action.payload.engineEvent.payload.files.at(0)?.attachmentPath ?? [])
			: stopLoading
				? undefined
				: state?.loading;

	const nextUnassigned = resetUnassigned.match(action)
		? undefined
		: newIds.length
			? (state?.unassigned ?? []).concat(newIds)
			: state?.unassigned;

	return state?.loading !== nextLoading || state?.unassigned !== nextUnassigned
		? { ...state, loading: nextLoading, unassigned: nextUnassigned }
		: state;
}

function getAttachmentIds(action: Action): string[] {
	if (!FormEngineActions.event.match(action)) {
		return [];
	}

	const engineAction = action.payload.engineEvent;

	if (
		Events.attachmentValueChange.match(engineAction) &&
		engineAction.payload.value.attachment_id
	) {
		return [engineAction.payload.value.attachment_id];
	} else if (Events.Repeat.multiFileUpload.match(engineAction)) {
		return [
			...engineAction.payload.toBeAdded.flatMap(a => a.attachment_id ?? []),
			...(engineAction.payload.toBeReplaced?.flatMap(a => a.value.attachment_id ?? []) ?? [])
		];
	} else {
		return [];
	}
}

function toModelPath(documentPath: EntityInstancePath): ModelPath {
	return ModelPath.fromString(ModelPath.toString(documentPath));
}
