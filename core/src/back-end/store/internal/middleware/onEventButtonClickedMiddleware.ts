// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Middleware } from "redux";

import { Events } from "../actions.js";

import { dispatchActionsDependingOnValidationOutcome } from "./userConfirmation.js";

/**
 * @internal
 *
 * Listens to Events.eventButtonTriggered.
 *
 * Dispatches actions depending on the button validation configuration:
 *
 * no validation: dispatch Events.eventButton
 *
 * partial or full validation: run configured validation and depending on the
 * outcome:
 * - error: do nothing
 * - warning/info: dispatch Commands.userConfirmationRequested (can be configured via form model)
 * - valid: dispatch eventButton
 */
export const onEventButtonClickedMiddleware: Middleware = api => next => action => {
	const result = next(action);
	if (Events.eventButtonTriggered.match(action)) {
		const buttonEffectAction = Events.eventButton({
			name: action.payload.name,
			buttonPath: action.payload.buttonPath
		});

		dispatchActionsDependingOnValidationOutcome(
			action.payload.validation,
			[buttonEffectAction],
			api
		);
	}

	return result;
};
