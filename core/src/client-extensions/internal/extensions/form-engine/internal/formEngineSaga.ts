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
