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
 * Events.CorrectionMode.goToElement
 */
export const onGotoToElementMiddleware: Middleware<{}, EngineState> = api => next => action => {
	const result = next(action);
	if (Events.CorrectionMode.goToElement.match(action)) {
		const state = api.getState();
		const validationBarState = UiStateSelectors.validationBarState()(state);

		if (DeviceDetector.get() === "phone") {
			api.dispatch(
				Commands.CorrectionMode.setValidationBarState({
					validationBar: {
						...validationBarState,
						expanded: false,
						currentMessageKey: undefined
					}
				})
			);
		} else if (action.payload.messageKey) {
			api.dispatch(
				Commands.CorrectionMode.setValidationBarState({
					validationBar: {
						...validationBarState,
						currentMessageKey: action.payload.messageKey
					}
				})
			);
		}

		if (UiStateSelectors.correctionModeBackup()(state) === undefined) {
			api.dispatch(
				Commands.CorrectionMode.setCorrectionModeBackup({
					backup: {
						location: UiStateSelectors.screenLocationStack()(state),
						sections: UiStateSelectors.sectionState()(state),
						backups: UiStateSelectors.backupStack()(state),
						repeatStaticState: UiStateSelectors.repeatStaticState()(state)
					}
				})
			);
		}

		api.dispatch(
			Commands.CorrectionMode.setCorrectionScreenState({
				correctionScreen: { visible: false, showDetailsState: {} }
			})
		);
		api.dispatch(Commands.setSectionsCollapsed({ sections: action.payload.item.sectionsCollapse }));
		api.dispatch(Commands.setLocationStack({ locationStack: action.payload.item.locationStack }));
		api.dispatch(
			Commands.setRepeatStaticState({ repeatStaticState: action.payload.item.repeatStaticState })
		);
	}
	return result;
};
