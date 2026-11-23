// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { SagaGenerator } from "typed-redux-saga";
import { take } from "typed-redux-saga";
import type { AnyAction } from "typescript-fsa";

import { Events } from "../../../../../../../back-end/store/index.js";
import { FormEngineActions } from "../../actions.js";

/** @internal */
export function* cancelSaga(abortController: AbortController): SagaGenerator<void> {
	yield* take(
		(a: AnyAction) =>
			FormEngineActions.event.match(a) &&
			Events.Attachments.cancelUploadAttachments.match(a.payload.engineEvent)
	);

	abortController.abort();
}
