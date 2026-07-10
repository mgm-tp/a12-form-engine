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

import type { Action } from "@com.mgmtp.a12.client/typescript-fsa-redux-5-compat";

import { Events } from "../../../../../../../back-end/store/internal/actions.js";
import type { EngineStore } from "../../../../../../../back-end/store/internal/store.js";
import { DocumentPath } from "../../../../../../../models/internal/utils/document-utils.js";
import type { ReadonlyObjectMap } from "../../../../../../../models/internal/utils/json.js";
import { extractModelsFromPayload } from "../../../extractModelsFromPayload.js";
import { FormEngineActions } from "../../actions.js";
import { resolveUiState } from "../../resolveUiState.js";

import type { UploadDonePayload } from "../actions.js";
import { uploadDone } from "../actions.js";

/**
 * Arbitrary constant to distinguish attachment errors in the message state
 * @internal
 */
export const ATTACHMENT_ERROR_CODE = "ATTACHMENT_ERROR";

/**
 * Updates the form engine UI state on attachment-related actions
 * If no UI state exists yet, a default one will be created first
 *
 * - disabled state is set for upload actions and cleared otherwise
 * - message state is updated for uploadDone actions
 * 	- existing attachment errors are cleared
 * 	- potentially new errors are added
 *
 * @internal
 */
export function reduceUiState(
	action: Action<FormEngineActions.FormEngineEventActions | UploadDonePayload>,
	maybeUiState?: EngineStore.UIState
): EngineStore.UIState {
	const isUpload =
		FormEngineActions.event.match(action) &&
		Events.Attachments.uploadAttachments.match(action.payload.engineEvent);

	const { formModel } = extractModelsFromPayload(action.payload);
	const state = resolveUiState(maybeUiState, formModel);

	return {
		...state,
		disabled: isUpload,
		messages: uploadDone.match(action)
			? updateMessages(state.messages, action.payload)
			: state.messages
	};
}

function updateMessages(
	oldMessages: ReadonlyObjectMap<EngineStore.Validation.Entry>,
	payload: UploadDonePayload
) {
	const withoutAttachmentErrors = Object.fromEntries(
		Object.entries(oldMessages ?? {})
			.map(([key, entry]) => {
				const cleaned = entry?.validationMessages.filter(
					m => m.errorCode !== ATTACHMENT_ERROR_CODE
				);

				return [
					key,
					entry?.parseError || cleaned?.length
						? {
								...entry,
								validationMessages: cleaned ?? []
							}
						: undefined
				];
			})
			.filter(([, entry]) => entry !== undefined)
	);

	return payload.errors.length
		? addNewErrors(withoutAttachmentErrors, payload)
		: withoutAttachmentErrors;
}

function addNewErrors(
	messages: ReadonlyObjectMap<EngineStore.Validation.Entry>,
	{ errors, pathToRepeatGroup }: UploadDonePayload
): ReadonlyObjectMap<EngineStore.Validation.Entry> {
	const errorField = pathToRepeatGroup ?? errors[0].path;

	const entry = messages[DocumentPath.toString(errorField)];

	return {
		...messages,
		[DocumentPath.toString(errorField)]: {
			...entry,
			validationMessages: (entry?.validationMessages ?? []).concat({
				errorKey: errors[0].error.key,
				errorText: errors.map(err => err.error),
				errorCode: ATTACHMENT_ERROR_CODE,
				severity: "ERROR",
				element: errorField,
				referencedFields: errors.map(err => err.path)
			})
		}
	};
}

/**@internal */
export function findUploadError(
	errorMessages?: EngineStore.Validation.Message[]
): EngineStore.Validation.Message | undefined {
	return errorMessages?.find(m => m.errorCode === ATTACHMENT_ERROR_CODE);
}
