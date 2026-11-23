// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Middleware } from "redux";

import { Commands } from "../actions.js";
import { collectRelevantFields } from "../collectRelevantFields.js";
import { validatePartlyWithFocusHandling } from "../partial-validation.js";

import type { Conversion, Localization } from "./middleware-options.js";

/** @internal */
export function validatePartMiddlewareFactory(
	middlewareOptions: Conversion & Localization
): Middleware {
	return api => next => action => {
		const result = next(action);

		if (Commands.validatePart.match(action)) {
			const state = api.getState();

			const relevantElements = collectRelevantFields(state);
			validatePartlyWithFocusHandling({
				state,
				dispatch: api.dispatch,
				middlewareOptions,
				relevantElements,
				focusFirstError: action.payload.focusFirstError
			});
		}

		return result;
	};
}
