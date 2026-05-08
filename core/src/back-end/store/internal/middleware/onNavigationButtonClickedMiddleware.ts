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

import type { Middleware } from "redux";

import { calcTargetScreenName } from "../../../../models/internal/utils/targetScreenName.js";

import { Commands, Events } from "../actions.js";
import { ModelSelectors } from "../selectors/models.js";
import { UiStateSelectors } from "../selectors/ui-state.js";
import type { EngineState } from "../store.js";

import { collapseAllExpandedRowsActions } from "./repeat/collapseAllExpandedRows.js";
import { dispatchActionsDependingOnValidationOutcome } from "./userConfirmation.js";

/**
 * @internal
 *
 * Listens to Events.navigationButton.
 *
 * Dispatches actions depending on the button validation configuration.
 *
 * no validation: dispatch success actions, i.e.
 * - Commands.changeScreen
 * - Commands.changeScreenState
 *
 * partial or full validation: run configured validation and depending on the
 * outcome:
 * - error: do nothing
 * - warning/info: dispatch Commands.userConfirmationRequested (can be configured via form model)
 * - valid: dispatch success actions
 */
export const onNavigationButtonClickedMiddleware: Middleware<object, EngineState> =
	api => next => action => {
		const result = next(action);
		if (Events.navigationButton.match(action)) {
			const buttonEffectActions = collapseAllExpandedRowsActions(api.getState());

			const target = action.payload.target;
			const formModel = ModelSelectors.formModel()(api.getState());
			const currentScreenLocation = UiStateSelectors.currentScreenLocation()(api.getState());

			const currentScreenPath = currentScreenLocation.locationPath;
			const targetId = calcTargetScreenName(
				currentScreenPath[currentScreenPath.length - 1].elementName,
				target,
				formModel
			);

			if (targetId) {
				buttonEffectActions.push(Commands.changeScreen({ screenName: targetId }));
				buttonEffectActions.push(
					Commands.changeScreenState({
						index: 0,
						focusedComponent: {
							formModelPath: [{ elementName: targetId }],
							subElement: "current-screen"
						}
					})
				);
			}

			dispatchActionsDependingOnValidationOutcome(
				action.payload.validation,
				buttonEffectActions,
				api
			);
		}
		return result;
	};
