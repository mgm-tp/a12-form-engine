// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { AnyAction, Store } from "redux";

import type { EngineState } from "../../../../../../back-end/store/index.js";
import { Commands, Events } from "../../../../../../back-end/store/index.js";
import { MiddlewareHelpers } from "../../../../../utils/back-end-helpers.js";
import { SetupHelpers } from "../../../../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../../../../utils/setupFixture.js";

const { createTestStore } = SetupHelpers;

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

			function setupStore(): Store<EngineState, AnyAction> {
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
