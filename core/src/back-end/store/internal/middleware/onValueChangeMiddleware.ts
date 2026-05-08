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

import { Events } from "../actions.js";
import type { EngineStore } from "../store.js";

import type { MiddlewareOptions } from "./middleware-options.js";
import { handleAttachmentValueChange } from "./value-change/handleAttachmentValueChange.js";
import { handleFieldValueChange } from "./value-change/handleFieldValueChange.js";
import { handleMultiSelectValueChange } from "./value-change/handleMultiSelectValueChange.js";
import { handleTypeIncompatibleFieldValueChange } from "./value-change/handleTypeIncompatibleFieldValueChange.js";

/**
 * @internal
 *
 * Listens to the various Events.*valueChanged and also Events.parseError and then delegates to
 * the respective functions.
 *
 * TODO: Profile the whole cascade. Would it help to recycle IData during the DepField changes loop?
 */
export function onValueChangeMiddlewareFactory(middlewareOptions: MiddlewareOptions): Middleware {
	return api => next => action => {
		const result = next(action);
		if (Events.parseError.match(action)) {
			const validationParseError: EngineStore.Validation.ParseError = {
				value: action.payload.uiValue,
				message: {
					...action.payload.error,
					// we need to wrap here to map a Localizable to Localizable[]
					errorText: [action.payload.error.errorText],
					element: action.payload.path,
					referencedFields: [action.payload.path]
				}
			};

			handleTypeIncompatibleFieldValueChange({
				path: action.payload.path,
				state: api.getState(),
				dispatch: api.dispatch,
				middlewareOptions,
				validationParseError
			});
		} else if (Events.valueChange.match(action)) {
			handleFieldValueChange({
				...action.payload,
				state: api.getState(),
				dispatch: api.dispatch,
				middlewareOptions
			});
		} else if (Events.multiSelectValueChange.match(action)) {
			handleMultiSelectValueChange(
				action.payload.path,
				action.payload.value,
				api.getState(),
				api.dispatch,
				middlewareOptions,
				action.payload.formModelElementPath
			);
		} else if (Events.attachmentValueChange.match(action)) {
			handleAttachmentValueChange(
				action.payload.path,
				action.payload.value,
				api.getState(),
				api.dispatch,
				middlewareOptions,
				action.payload.formModelElementPath
			);
		}

		return result;
	};
}
