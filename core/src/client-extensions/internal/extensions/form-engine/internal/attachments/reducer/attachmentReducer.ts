// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Action, AnyAction } from "typescript-fsa";

import { THUMBNAIL_SLICE } from "@com.mgmtp.a12.client/client-core/lib/core/activity/a12-internal/thumbnails/slice.js";
import type {
	Activity,
	ActivityReducers
} from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";

import type { EngineStore } from "../../../../../../../back-end/store/index.js";
import { Events } from "../../../../../../../back-end/store/internal/actions.js";
import { FormEngineActions } from "../../actions.js";

import type { UploadDonePayload } from "../actions.js";
import { resetUnassigned, uploadDone } from "../actions.js";
import { ATTACHMENT_STATE_SLICE } from "../attachmentState.js";

import { reduceAttachmentState } from "./reduceAttachmentState.js";
import { reduceThumbnails } from "./reduceThumbnails.js";
import { reduceUiState } from "./reduceUiState.js";

interface DefaultDataHolder extends Activity.DataHolder {
	readonly slices: {
		readonly uiState?: EngineStore.UIState;
		readonly [ATTACHMENT_STATE_SLICE]?: Omit<EngineStore.AttachmentState, "thumbnails">;
		readonly [THUMBNAIL_SLICE]?: Record<string, string>;
	};
}

/** @internal */
export const attachmentReducer: ActivityReducers.DataReducer = {
	reduce(dhs, action, defaultDh) {
		return isAttachmentRelatedAction(action)
			? dhs.map(dh => (dh === defaultDh ? reduceDefaultDh(dh as DefaultDataHolder, action) : dh))
			: dhs;
	}
};

function reduceDefaultDh(
	dh: DefaultDataHolder,
	action: Action<FormEngineActions.FormEngineEventActions | UploadDonePayload>
): DefaultDataHolder {
	const {
		uiState,
		[ATTACHMENT_STATE_SLICE]: attachmentState,
		[THUMBNAIL_SLICE]: thumbnails
	} = dh.slices;

	const newThumbnails = reduceThumbnails(thumbnails, action);
	const newEngineUIState = reduceUiState(action, uiState);
	const newAttachmentState = reduceAttachmentState(attachmentState, action);

	return {
		...dh,
		slices: {
			...dh.slices,
			uiState: newEngineUIState,
			...(newAttachmentState && { [ATTACHMENT_STATE_SLICE]: newAttachmentState }),
			...(newThumbnails && { [THUMBNAIL_SLICE]: newThumbnails })
		}
	};
}

function isAttachmentRelatedAction(
	action: AnyAction
): action is Action<FormEngineActions.FormEngineEventActions | UploadDonePayload> {
	return (
		uploadDone.match(action) ||
		resetUnassigned.match(action) ||
		(FormEngineActions.event.match(action) &&
			(Events.Attachments.uploadAttachments.match(action.payload.engineEvent) ||
				Events.Attachments.cancelUploadAttachments.match(action.payload.engineEvent) ||
				Events.attachmentValueChange.match(action.payload.engineEvent) ||
				Events.Repeat.multiFileUpload.match(action.payload.engineEvent)))
	);
}
