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

import { assertExists } from "../../../utils/internal/assertions.js";
import { isObjectEmpty, isRecord } from "../../../utils/internal/guards.js";

import { Commands } from "../actions.js";
import { messageStateIsEqual } from "../messageStateIsEqual.js";
import { ModelSelectors } from "../selectors/models.js";
import { UiStateSelectors } from "../selectors/ui-state.js";
import { fullValidation, updateValidationEntries } from "../validation.js";

import type { MiddlewareOptions } from "./middleware-options.js";

/** @internal */
export function validateFullMiddlewareFactory(middlewareOptions: MiddlewareOptions): Middleware {
	return api => next => action => {
		const result = next(action);

		if (Commands.validateFull.match(action)) {
			const state = api.getState();

			const validatorProvider = ModelSelectors.validationCode()(state);
			assertExists(validatorProvider, "full validation requires A12 Kernel validation code");
			const messages = UiStateSelectors.messages()(state);

			const newMessages = fullValidation(state, middlewareOptions);

			const messageState = updateValidationEntries(
				messages,
				newMessages,
				newMessages.map(m => m.element),
				validatorProvider,
				"full"
			);

			if (!messageStateIsEqual(messages, messageState)) {
				api.dispatch(Commands.setMessageState({ messages: messageState }));
			}

			const currentScreenLocationIndex = UiStateSelectors.screenLocationStack()(state).length - 1;
			const isMessageStateEmpty = isObjectEmpty(messageState);

			api.dispatch(
				Commands.CorrectionMode.setValidationBarState({
					validationBar: { visible: !isMessageStateEmpty }
				})
			);

			const enableFocusBehavior = !(
				isRecord(action.payload) && action.payload.disableFocusBehavior
			);

			if (enableFocusBehavior) {
				api.dispatch(
					Commands.changeScreenState({
						index: currentScreenLocationIndex,
						focusedComponent: {
							formModelPath: [],
							subElement: isMessageStateEmpty ? "current-screen" : "validation-bar"
						}
					})
				);
			}
		}

		return result;
	};
}
