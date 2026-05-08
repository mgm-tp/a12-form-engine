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
import { call, put, select, takeEvery } from "typed-redux-saga";
import type { Action, AnyAction } from "typescript-fsa";

import { EMPTY_ATTACHMENT } from "../../../../../../../back-end/services/attachment.js";
import { Events } from "../../../../../../../back-end/store/index.js";
import { FormEngineActions } from "../../actions.js";
import type { FormEngineSagaOptions } from "../../sagaOptions.js";

import type { AttachmentLoader } from "../attachmentLoader/AttachmentLoader.js";
import { defaultDocumentDescriptorSelector } from "../documentDescriptor/defaultDocumentDescriptorSelector.js";

type DeleteActionPayload = FormEngineActions.FormEngineEventActions<
	Action<Events.Attachments.DeleteAttachmentPayload>
>;

/** @internal */
export function* deleteSaga(options?: FormEngineSagaOptions): SagaGenerator<void> {
	yield* takeEvery(
		(a: AnyAction): a is Action<DeleteActionPayload> => {
			return (
				FormEngineActions.event.match(a) &&
				Events.Attachments.deleteAttachment.match(a.payload.engineEvent)
			);
		},
		function* ({ payload }) {
			const actualPayload = payload.engineEvent.payload;

			const documentDescriptor = yield* select(
				options?.documentDescriptorSelector ?? defaultDocumentDescriptorSelector,
				payload.activityId,
				actualPayload.attachmentPath
			);

			if (options?.attachmentLoader?.deleteFile) {
				yield* call(
					[options.attachmentLoader as Required<AttachmentLoader>, "deleteFile"],
					actualPayload.attachment,
					documentDescriptor
				);
			}

			yield* put(
				FormEngineActions.event({
					activityId: payload.activityId,
					engineEvent: Events.attachmentValueChange({
						path: actualPayload.attachmentPath,
						value: EMPTY_ATTACHMENT
					})
				})
			);
		}
	);
}
