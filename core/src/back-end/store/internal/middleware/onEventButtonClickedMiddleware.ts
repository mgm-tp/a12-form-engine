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
