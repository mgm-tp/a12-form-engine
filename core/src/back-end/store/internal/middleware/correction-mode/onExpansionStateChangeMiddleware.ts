// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Middleware } from "redux";

import { provider as DeviceDetector } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/device-detector.js";

import { Commands, Events } from "../../actions.js";
import { UiStateSelectors } from "../../selectors/ui-state.js";
import type { EngineState } from "../../store.js";

/**
 * @internal
 *
 * Listens to Events.Repeat.sortingTriggered
 *
 * Dispatches Commands.changeScreenRepeatState with the new state of the repeat.
 */
export const onExpansionChangeTriggeredMiddleware: Middleware<{}, EngineState> =
	api => next => action => {
		const result = next(action);
		if (Events.CorrectionMode.ValidationBar.expand.match(action)) {
			const state = api.getState();
			const validationBarState = UiStateSelectors.validationBarState()(state);
			api.dispatch(
				Commands.CorrectionMode.setValidationBarState({
					validationBar: {
						...validationBarState,
						expanded: action.payload.expanded,
						currentMessageKey: action.payload.resetCurrentMessage
							? undefined
							: validationBarState.currentMessageKey
					}
				})
			);

			const currentScreenLocationIndex = UiStateSelectors.screenLocationStack()(state).length - 1;
			if (DeviceDetector.get() === "phone") {
				api.dispatch(
					Commands.changeScreenState({
						index: currentScreenLocationIndex,
						focusedComponent: { formModelPath: [], subElement: "validation-bar" }
					})
				);
			}
		}
		return result;
	};
