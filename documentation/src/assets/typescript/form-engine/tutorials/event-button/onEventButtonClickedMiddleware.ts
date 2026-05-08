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
