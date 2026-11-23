// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Middleware } from "redux";

import {
	Events,
	FormEngineActions,
	FormEngineSelectors
} from "@com.mgmtp.a12.formengine/formengine-core";

export const alertInvalidAddRowMiddleware: Middleware = api => next => action => {
	if (
		FormEngineActions.event.match(action) &&
		Events.Repeat.addRow.match(action.payload.engineEvent)
	) {
		const state = api.getState();
		const messages = FormEngineSelectors.uiState(action.payload.activityId)(state)?.messages ?? [];

		const shouldApply = Object.keys(messages).length === 0;
		if (shouldApply) {
			next(action);
		} else {
			alert("Rows can only be added if there are no syntax or validation errors!");
		}
	} else {
		next(action);
	}
};
