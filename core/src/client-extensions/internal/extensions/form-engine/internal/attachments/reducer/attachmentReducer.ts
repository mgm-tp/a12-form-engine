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

import type { Action as ReduxAction } from "redux";

import type { Activity, ActivityReducers } from "@com.mgmtp.a12.client/client-core";
import { THUMBNAIL_SLICE } from "@com.mgmtp.a12.client/client-core/a12internal";
import type { Action } from "@com.mgmtp.a12.client/typescript-fsa-redux-5-compat";

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
	action: ReduxAction
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
