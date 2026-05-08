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
