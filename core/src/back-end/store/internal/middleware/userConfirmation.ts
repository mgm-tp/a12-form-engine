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
