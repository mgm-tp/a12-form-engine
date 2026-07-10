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

import type { Activity, ActivityReducers } from "@com.mgmtp.a12.client/client-core";

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
