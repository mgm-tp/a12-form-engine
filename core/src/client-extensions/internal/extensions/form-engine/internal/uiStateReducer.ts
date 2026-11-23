// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Activity } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import type { ActivityReducers } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";

import { uiReducer } from "../../../../../back-end/store/internal/reducers/reducer-factory.js";

import { extractModelsFromPayload } from "../extractModelsFromPayload.js";

import { FormEngineActions } from "./actions.js";
import { resolveUiState } from "./resolveUiState.js";

/**
 * Adapter for the UI state reducers of the Form-Engine, that handles state
 * mutations of the Form-Engine state inside of activities.
 *
 * The reducer adapter listens to {@link FormEngineActions.command} actions
 *
 * It will select the Form-Engine UI state from the referenced activity.
 * It then calls the UI state reducer from the Form-Engine with the UI state
 * and the original command-action.
 *
 * The reducer of the Form-Engine returns the changed UI state.
 *
 * The reducer adapter writes the changed UI state back.
 *
 * Note: To limit a reducer to a single activity, the actions must have the
 * property `activityId`. See src/core/activity/internal/reducers/index.ts
 */
export const uiStateReducer: ActivityReducers.DataReducer = {
	reduce(dataholders, action, defaultDataHolder) {
		return FormEngineActions.command.match(action)
			? dataholders.map(dh => (dh === defaultDataHolder ? handleDefault(dh, action.payload) : dh))
			: dataholders;
	}
};

function handleDefault(
	dh: Activity.DataHolder,
	payload: FormEngineActions.FormEngineEventActions
): Activity.DataHolder {
	const models = extractModelsFromPayload(payload);
	const uiState = resolveUiState(dh.slices.uiState, models.formModel);

	return {
		...dh,
		slices: {
			...dh.slices,
			uiState: uiReducer(uiState, payload.engineEvent, models)
		}
	};
}
