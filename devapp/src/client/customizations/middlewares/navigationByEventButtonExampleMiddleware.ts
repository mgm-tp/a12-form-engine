// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Middleware } from "redux";

import { Events, FormEngineActions } from "@com.mgmtp.a12.formengine/formengine-core";
/**
 * Middleware to dispatch an navigation events based on the name of an EventButton.
 */
export const navigationByEventButtonExampleMiddleware: Middleware = api => next => action => {
	if (
		FormEngineActions.event.match(action) &&
		Events.eventButton.match(action.payload.engineEvent)
	) {
		const name = action.payload.engineEvent.payload.name;

		const target = name === "next" ? "#next" : name === "previous" ? "#previous" : name;

		api.dispatch(
			FormEngineActions.event({
				activityId: action.payload.activityId,
				engineEvent: Events.navigationButton({
					target
				})
			})
		);
	}
	next(action);
};
