// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { Commands, Events } from "../../../../../back-end/store/index.js";
import { MiddlewareHelpers } from "../../../../utils/back-end-helpers.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../../../utils/setupFixture.js";

const { createTestStore } = SetupHelpers;

describe("api.back-end.store.middleware", () => {
	describe("onShowDetailsTriggeredTriggeredMiddleware", () => {
		describe("handles Events.CorrectionMode.CorrectionView.showDetails", () => {
			const middlewareSpy = setupFixture(() => MiddlewareHelpers.createMiddlewareSpy());

			const models = setupModelsFixture("repeat", "inline");

			beforeEach(() => {
				middlewareSpy.spy.mock.resetCalls();
			});

			const showDetailsState = {
				message1: true,
				message2: false,
				message3: true
			};

			describe("if 'showDetail=true' in the payload", () => {
				it("dispatches a Commands.CorrectionMode.setCorrectionScreenState with with the new showDetailsState", () => {
					setupStore().dispatch(
						Events.CorrectionMode.CorrectionView.showDetails({
							element: "message2",
							showDetails: true
						})
					);

					const expectedCommands = [
						Commands.CorrectionMode.setCorrectionScreenState({
							correctionScreen: {
								visible: false,
								showDetailsState: {
									message1: true,
									message2: true,
									message3: true
								}
							}
						})
					];

					MiddlewareHelpers.assertActions(middlewareSpy.spy, expectedCommands);
				});
			});

			describe("if 'showDetail=false' in the payload", () => {
				it("dispatches a Commands.CorrectionMode.setCorrectionScreenState with with the new showDetailsState", () => {
					setupStore().dispatch(
						Events.CorrectionMode.CorrectionView.showDetails({
							element: "message1",
							showDetails: false
						})
					);

					const expectedCommands = [
						Commands.CorrectionMode.setCorrectionScreenState({
							correctionScreen: {
								visible: false,
								showDetailsState: {
									message1: false,
									message2: false,
									message3: true
								}
							}
						})
					];

					MiddlewareHelpers.assertActions(middlewareSpy.spy, expectedCommands);
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
							}
						}
					},
					middlewares: [middlewareSpy.middleware]
				});
			}
		});
	});
});
