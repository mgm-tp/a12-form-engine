// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Action } from "redux";
import type { SagaGenerator } from "typed-redux-saga";
import { put, select, takeEvery } from "typed-redux-saga";

import {
	ActivityActions,
	ActivitySelectors
} from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import { ModelSelectors } from "@com.mgmtp.a12.client/client-core/lib/core/model/index.js";

import { Commands } from "../../../../../back-end/store/index.js";

import { FormEngineActions } from "./actions.js";
import { resetUnassigned } from "./attachments/actions.js";

/**
 * Saga to reset ui dirty state on save done.
 */
export function* resetUiDirtyStateOnSave(): SagaGenerator<void> {
	yield* takeEvery([ActivityActions.save.done], resetUiDirtyStateOnSaveInternal);
}

function* resetUiDirtyStateOnSaveInternal(action: Action): SagaGenerator<void> {
	if (ActivityActions.save.done.match(action)) {
		const activityId = action.payload.params.activityId;

		const activity = yield* select(ActivitySelectors.activityById(activityId));
		if (activity === undefined) {
			return;
		}

		const modelDescriptors = yield* select(ModelSelectors.modelDescriptorsByActivityId(activityId));

		const formModelDescriptor = modelDescriptors.find(
			md =>
				md.modelType === "form" &&
				(md.documentModel === undefined || md.documentModel === activity.descriptor.model)
		);

		if (formModelDescriptor === undefined) {
			return;
		}

		yield* put(
			FormEngineActions.command({
				activityId: action.payload.params.activityId,
				engineEvent: Commands.setUIDirty(false)
			})
		);
		yield* put(resetUnassigned({ activityId }));
	}
}
