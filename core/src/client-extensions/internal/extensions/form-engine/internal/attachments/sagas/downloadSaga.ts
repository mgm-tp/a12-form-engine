// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { SagaGenerator } from "typed-redux-saga";
import { call, select, takeEvery } from "typed-redux-saga";
import type { Action, AnyAction } from "typescript-fsa";

import { LoggerFactory } from "@com.mgmtp.a12.utils/utils-logging";

import { Events } from "../../../../../../../back-end/store/index.js";
import { FormEngineActions } from "../../actions.js";
import type { FormEngineSagaOptions } from "../../sagaOptions.js";

import { defaultDocumentDescriptorSelector } from "../documentDescriptor/defaultDocumentDescriptorSelector.js";

const logger = LoggerFactory.getLogger("attachments");

/**
 * Anchor element thats not part of the DOM which allows
 * "clicking" links programmatically
 */
const downloadAnchor = document.createElement("a");

type DownloadActionPayload = FormEngineActions.FormEngineEventActions<
	Action<Events.Attachments.DownloadAttachmentPayload>
>;

/** @internal */
export function* downloadSaga(options?: FormEngineSagaOptions): SagaGenerator<void> {
	yield* takeEvery(
		(a: AnyAction): a is Action<DownloadActionPayload> =>
			FormEngineActions.event.match(a) &&
			Events.Attachments.downloadAttachment.match(a.payload.engineEvent),
		function* ({ payload }) {
			if (!options?.attachmentLoader) {
				logger.warn(
					`Downloading attachments requires an AttachmentLoader to be registered in the FormEngine sagas!`
				);
				return;
			}

			const actualPayload = payload.engineEvent.payload;

			const documentDescriptor = yield* select(
				options.documentDescriptorSelector ?? defaultDocumentDescriptorSelector,
				payload.activityId,
				actualPayload.attachmentPath
			);

			const url = yield* call(
				[options.attachmentLoader, "retrieveDownloadLink"],
				actualPayload.attachment,
				documentDescriptor
			);

			downloadAnchor.href = url;
			downloadAnchor.download = actualPayload.attachment.original_filename ?? "";

			downloadAnchor.click();
		}
	);
}
