// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { MiddlewareAPI } from "redux";
import type { Action } from "typescript-fsa";

import type { FormModel } from "../../../../models/index.js";

import { Commands } from "../actions.js";
import { ModelSelectors } from "../selectors/models.js";
import type { EngineStore } from "../store.js";
import { significantMessageSeveritySelector } from "../validation.js";

/**
 * @internal
 *
 * Run the validation, if given. Otherwise, assume "valid"
 *
 * Then, depending on the outcome, dispatch the given actions:
 * - errors: don't dispatch anything
 * - warning/info: dispatch user confirmation
 * 	- (by default, can be configured via form model property)
 * - valid: dispatch given actions
 *
 * Note: This function changes the state as a side-effect because it dispatches
 * actions.
 */
export function dispatchActionsDependingOnValidationOutcome(
	validation: FormModel.ButtonValidationEnum | undefined,
	actions: Action<object>[],
	api: MiddlewareAPI
): void {
	if (validation === "full") {
		api.dispatch(Commands.validateFull());
	} else if (validation === "partial") {
		api.dispatch(Commands.validatePart({ focusFirstError: true }));
	}

	const significantMessageSeverity = validation
		? significantMessageSeveritySelector(validation)(api.getState())
		: undefined;

	const actionsToDispatch =
		significantMessageSeverity === "ERROR"
			? []
			: shouldConfirm(api, significantMessageSeverity)
				? [Commands.userConfirmationRequested({ actionsToDispatch: actions, validation })]
				: actions;

	actionsToDispatch.forEach(api.dispatch);
}

function shouldConfirm(
	api: MiddlewareAPI,
	severity?: EngineStore.Validation.MessageSeverity
): boolean {
	const disableConfirmation = ModelSelectors.formModel()(api.getState()).content
		.disableRuleConfirmation;

	return severity === "WARNING"
		? disableConfirmation !== "WARNING"
		: severity === "INFO"
			? disableConfirmation === undefined
			: false;
}
