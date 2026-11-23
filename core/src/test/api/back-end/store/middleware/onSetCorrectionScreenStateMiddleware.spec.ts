// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { Commands, Events } from "../../../../../back-end/store/index.js";
import { MiddlewareHelpers } from "../../../../utils/back-end-helpers.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../../../utils/setupFixture.js";
import { createValidationEntry } from "../../../../utils/validation.js";

const { createTestStore } = SetupHelpers;

describe("api.back-end.store.middleware", () => {
	describe("onSetCorrectionScreenStateTriggeredMiddleware", () => {
		describe("handles Events.CorrectionMode.CorrectionView.show", () => {
			const middlewareSpy = setupFixture(() => MiddlewareHelpers.createMiddlewareSpy());

			const models = setupModelsFixture("repeat", "inline");

			beforeEach(() => {
				middlewareSpy.spy.mock.resetCalls();
			});

			const showDetailsState = {
				message1: true,
				message2: false
			};

			describe("given 'show=true' in the payload", () => {
				it("dispatches a Commands.CorrectionMode.setCorrectionScreenState with 'visible=true'", () => {
					setupStore().dispatch(
						Events.CorrectionMode.CorrectionView.show({
							show: true
						})
					);

					const expectedCommands = [
						Commands.CorrectionMode.setCorrectionScreenState({
							correctionScreen: {
								visible: true,
								showDetailsState
							}
						})
					];

					MiddlewareHelpers.assertActions(middlewareSpy.spy, expectedCommands);
				});
			});

			describe("given 'show=false' in the payload", () => {
				it("dispatches a Commands.CorrectionMode.setCorrectionScreenState with 'visible=false' and an empty showDetailsState", () => {
					setupStore().dispatch(
						Events.CorrectionMode.CorrectionView.show({
							show: false
						})
					);

					const expectedCommands = Commands.CorrectionMode.setCorrectionScreenState({
						correctionScreen: {
							visible: false,
							showDetailsState: {}
						}
					});

					MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommands);
				});

				it(`dispatches a Commands.changeScreenState action with the focusedComponent containing the focusPart="validation-bar"`, () => {
					setupStore().dispatch(
						Events.CorrectionMode.CorrectionView.show({
							show: false
						})
					);

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

			function setupStore() {
				return createTestStore({
					storeConfig: {
						models,
						ui: {
							correctionScreen: {
								visible: false,
								showDetailsState
							},
							validationBar: { visible: true, expanded: false, currentMessageKey: undefined },
							messages: createValidationEntry({ path: [] })
						}
					},
					middlewares: [middlewareSpy.middleware]
				});
			}
		});
	});
});
