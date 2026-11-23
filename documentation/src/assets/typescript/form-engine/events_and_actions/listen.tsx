// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

// tag::listenExample[]
import type { AnyAction, Middleware } from "redux";
import { takeLatest } from "typed-redux-saga";
import type { SagaGenerator } from "typed-redux-saga";
import type { Action } from "typescript-fsa";

import { Events, FormEngineActions } from "@com.mgmtp.a12.formengine/formengine-core";
import type { EngineState } from "@com.mgmtp.a12.formengine/formengine-core";
// convenience type helper
type EventButtonAction = Action<Events.EventButtonPayload>;

// your implementation
declare function handleOnEvent(name: string): void;
declare function handleAction(action: EventButtonAction): void;

// Middleware
export const onEventButtonClickedMiddleware: Middleware<{}, EngineState> = () => next => action => {
	if (
		FormEngineActions.event.match(action) &&
		Events.eventButton.match(action.payload.engineEvent)
	) {
		const event = action.payload.engineEvent;
		handleOnEvent(event.payload.name);
	}
	return next(action);
};

// Saga
export function* onEventButtonClickedSaga(): SagaGenerator<void> {
	yield* takeLatest<Action<FormEngineActions.FormEngineEventActions<EventButtonAction>>>(
		(action: AnyAction) => {
			return (
				FormEngineActions.event.match(action) &&
				Events.eventButton.match(action.payload.engineEvent)
			);
		},
		action => handleAction(action.payload.engineEvent)
	);
}
// end::listenExample[]
