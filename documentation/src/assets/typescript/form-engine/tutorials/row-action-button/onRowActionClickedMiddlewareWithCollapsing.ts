// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
