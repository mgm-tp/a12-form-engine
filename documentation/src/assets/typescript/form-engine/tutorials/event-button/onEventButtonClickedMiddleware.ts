// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

// tag::annotated-button[]
import type { Middleware, MiddlewareAPI } from "redux";
import { actionCreatorFactory } from "typescript-fsa";

import type { EngineState, FormModel } from "@com.mgmtp.a12.formengine/formengine-core";
import {
	Events,
	ModelSelectors,
	findElementByFormModelPath
} from "@com.mgmtp.a12.formengine/formengine-core";

export const onEventButtonClickedMiddleware: Middleware<{}, EngineState> =
	api => next => action => {
		if (Events.eventButton.match(action)) {
			handleEvent(api, action.payload);
		}
		return next(action);
	};

function handleEvent(api: MiddlewareAPI, { name, buttonPath }: Events.EventButtonPayload): void {
	// 1. make sure that the event matches our expectation & that the button contains the desired annotation
	if ("my_event" === name && buttonPath !== undefined) {
		const formModelButton = findElementByFormModelPath(
			ModelSelectors.formModel()(api.getState()),
			buttonPath
		);
		if (formModelButton !== undefined) {
			const annotations = (formModelButton as FormModel.ButtonType).annotations;
			const parameterAnnotation = annotations?.find(
				annotation => "my_parameter" === annotation.name
			);
			if (parameterAnnotation !== undefined) {
				const parameter = parameterAnnotation.value;
				// 2. execute custom logic that is supposed to be executed in case my annotated button was clicked
				api.dispatch(myEvent({ parameter }));
				return;
			}
		}
	}
}
// end::annotated-button[]

// for completeness of the example
export const myCustomEventCreator = actionCreatorFactory("example/custom_events");
export const myEvent = myCustomEventCreator<MyEventPayload>("MY_EVENT");

/** Payload for the {@link myEvent} action */
export interface MyEventPayload {
	/** The parameter */
	readonly parameter?: string;
}
