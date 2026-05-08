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

import { mock } from "node:test";

import type { AnyAction, Store } from "redux";

import { provider } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/device-detector.js";

import type { EngineState } from "../../../../../../back-end/store/index.js";
import { Commands, Events } from "../../../../../../back-end/store/index.js";
import { MiddlewareHelpers } from "../../../../../utils/back-end-helpers.js";
import { SetupHelpers } from "../../../../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../../../../utils/setupFixture.js";

const { createTestStore } = SetupHelpers;

describe("api.back-end.store.middleware", () => {
	describe("onExpansionChangeTriggeredMiddleware", () => {
		const middlewareSpy = setupFixture(() => MiddlewareHelpers.createMiddlewareSpy());

		// Model does not matter
		const models = setupModelsFixture("computation-validation.errors_and_warnings_and_infos");

		beforeEach(() => {
			middlewareSpy.spy.mock.resetCalls();
		});

		describe("handles Events.CorrectionMode.ValidationBar.expand", () => {
			it("dispatches Commands.CorrectionMode.setValidationBarState with the expanded information from the payload", () => {
				const action = Events.CorrectionMode.ValidationBar.expand({
					expanded: true,
					resetCurrentMessage: true
				});

				setupStore().dispatch(action);
				const expectedCommand = Commands.CorrectionMode.setValidationBarState({
					validationBar: {
						visible: true,
						currentMessageKey: undefined,
						expanded: true
					}
				});
				MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
			});

			it("dispatches Commands.CorrectionMode.setValidationBarState with `currentMessageKey=undefined` if `resetCurrentMessage=true` ", () => {
				const action = Events.CorrectionMode.ValidationBar.expand({
					expanded: true,
					resetCurrentMessage: true
				});

				setupStore().dispatch(action);
				const expectedCommand = Commands.CorrectionMode.setValidationBarState({
					validationBar: {
						visible: true,
						currentMessageKey: undefined,
						expanded: true
					}
				});
				MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
			});

			it("dispatches Commands.CorrectionMode.setValidationBarState with message key from the store if `resetCurrentMessage=false` ", () => {
				const action = Events.CorrectionMode.ValidationBar.expand({
					expanded: true,
					resetCurrentMessage: false
				});

				setupStore().dispatch(action);
				const expectedCommand = Commands.CorrectionMode.setValidationBarState({
					validationBar: {
						visible: true,
						currentMessageKey: "Test-Key",
						expanded: true
					}
				});
				MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
			});

			describe("given expanded=false and the current device is a phone", () => {
				it("dispatches Commands.changeScreenState with `validation-bar` as focusPart", () => {
					mock.method(provider, "get", () => "phone");

					const action = Events.CorrectionMode.ValidationBar.expand({
						expanded: false,
						resetCurrentMessage: false
					});

					setupStore().dispatch(action);
					const expectedCommand = Commands.changeScreenState({
						index: 0,
						focusedComponent: {
							formModelPath: [],
							subElement: "validation-bar"
						}
					});
					MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
				});
			});

			function setupStore(): Store<EngineState, AnyAction> {
				return createTestStore({
					storeConfig: {
						models: models,
						ui: {
							validationBar: {
								visible: true,
								expanded: false,
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
