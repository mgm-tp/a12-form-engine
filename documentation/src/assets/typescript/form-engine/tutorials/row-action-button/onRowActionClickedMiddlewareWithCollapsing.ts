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

// tag::middleware[]
import type { Middleware } from "redux";
import { actionCreatorFactory } from "typescript-fsa";

import type { EngineState } from "@com.mgmtp.a12.formengine/formengine-core";
import { Commands, Events, UiStateSelectors } from "@com.mgmtp.a12.formengine/formengine-core";
import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

export const onRowActionClickedMiddleware: Middleware<{}, EngineState> = api => next => action => {
	if (Events.Repeat.customRowAction.match(action)) {
		const eventName = action.payload.eventName;
		const rowPath = action.payload.rowPath;
		const repeatFormModelPath = action.payload.repeatFormModelPath;

		const currentScreenLocation = UiStateSelectors.currentScreenLocation()(api.getState());
		const repeatStateEntry = UiStateSelectors.repeatInstanceStateEntry(repeatFormModelPath)(
			api.getState()
		);

		api.dispatch(
			Commands.changeRepeatInstanceStateEntry({
				locationPath: currentScreenLocation.locationPath,
				repeatFormModelPath: repeatFormModelPath,
				entry: {
					...repeatStateEntry,
					expandedRowPath: undefined
				}
			})
		);

		api.dispatch(myEvent({ eventName, rowPath }));
	}
	return next(action);
};
// end::middleware[]

// for completeness of the example
export const myCustomEventCreator = actionCreatorFactory("example/custom_events");
export const myEvent = myCustomEventCreator<MyEventPayload>("MY_EVENT");

/** Payload for the {@link myEvent} action */
export interface MyEventPayload {
	/** The parameter */
	readonly eventName: string;
	readonly rowPath: EntityInstancePath;
}
