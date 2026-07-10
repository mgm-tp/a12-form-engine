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

import type { Action, Store } from "redux";

import type { EngineState } from "../../../../../../back-end/store/index.js";
import { Commands, Events } from "../../../../../../back-end/store/index.js";
import { MiddlewareHelpers } from "../../../../../utils/MiddlewareHelpers.js";
import { createTestStore } from "../../../../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../../../../utils/setupFixture.js";

describe("api.back-end.store.middleware", () => {
	describe("onMessageChangeTriggeredMiddleware", () => {
		const middlewareSpy = setupFixture(() => MiddlewareHelpers.createMiddlewareSpy());

		const models = setupModelsFixture("computation-validation.errors_and_warnings_and_infos");

		beforeEach(() => {
			middlewareSpy.spy.mock.resetCalls();
		});

		describe("handles Events.CorrectionMode.ValidationBar.showMessage", () => {
			it(
				"dispatches Commands.CorrectionMode.setValidationBarState with " +
					"the message key from the payload and the other validation bar information from the state",
				() => {
					const action = Events.CorrectionMode.ValidationBar.showMessage({ messageKey: "My-Key" });

					setupStore().dispatch(action);
					const expectedCommands = [
						Commands.CorrectionMode.setValidationBarState({
							validationBar: {
								visible: true,
								expanded: true,
								currentMessageKey: "My-Key"
							}
						})
					];
					MiddlewareHelpers.assertActions(middlewareSpy.spy, expectedCommands);
				}
			);

			function setupStore(): Store<EngineState, Action> {
				return createTestStore({
					storeConfig: {
						models: models,
						ui: {
							validationBar: {
								visible: true,
								expanded: true,
								currentMessageKey: "Test-Key"
							}
						}
					},
					middlewares: [middlewareSpy.middleware]
				});
			}
		});
	});
});
