// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
