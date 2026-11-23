// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
