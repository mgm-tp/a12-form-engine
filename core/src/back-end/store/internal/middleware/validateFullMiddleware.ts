// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
