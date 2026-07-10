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

// tag::listenExample[]
import type { Middleware, Action as ReduxAction } from "redux";
import { takeLatest } from "typed-redux-saga";
import type { SagaGenerator } from "typed-redux-saga";

import type { Action } from "@com.mgmtp.a12.client/typescript-fsa-redux-5-compat";
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
		(action: ReduxAction) => {
			return (
				FormEngineActions.event.match(action) &&
				Events.eventButton.match(action.payload.engineEvent)
			);
		},
		action => handleAction(action.payload.engineEvent)
	);
}
// end::listenExample[]
