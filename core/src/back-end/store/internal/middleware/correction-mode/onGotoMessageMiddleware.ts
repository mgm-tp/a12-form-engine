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

import type { Middleware } from "redux";

import { provider as DeviceDetector } from "@com.mgmtp.a12.widgets/widgets-core";

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
