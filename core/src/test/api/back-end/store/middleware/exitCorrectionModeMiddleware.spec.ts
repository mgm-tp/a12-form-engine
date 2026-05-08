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

import type { Action } from "typescript-fsa";

import type { EngineStore } from "../../../../../back-end/store/index.js";
import { Commands, Events } from "../../../../../back-end/store/index.js";
import { MiddlewareHelpers } from "../../../../utils/back-end-helpers.js";
import { DocumentHelpers } from "../../../../utils/document-helpers.js";
import { ModelHelpers } from "../../../../utils/model-helpers.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../../../utils/setupFixture.js";

const { createTestStore } = SetupHelpers;

describe("api.back-end.store.middleware", () => {
	describe("exitCorrectionModeTriggeredMiddleware", () => {
		describe("handles Events.CorrectionMode.exitCorrectionMode", () => {
			const middlewareSpy = setupFixture(() => MiddlewareHelpers.createMiddlewareSpy());

			const models = setupModelsFixture("repeat", "inline");
			before(() => {
				setupStore().dispatch(Events.CorrectionMode.exitCorrectionMode({}));
			});

			const screenLocation: ReadonlyArray<EngineStore.ScreenState> = [
				{
					locationPath: ModelHelpers.createModelPath("Screen1"),
					path: [],
					focusedComponent: {
						formModelPath: ModelHelpers.createModelPath("Screen1")
					},
					repeatInstanceState: {
						repeat1: {
							page: 7
						}
					}
				},
				{
					locationPath: ModelHelpers.createModelPath("Screen1", "Detail1"),
					path: DocumentHelpers.createDocumentPath(["group"], ["repeat1"]),
					focusedComponent: {
						formModelPath: ModelHelpers.createModelPath("Screen1", "Detail1", "control1")
					}
				}
			];

			const correctionModeBackup = {
				location: [screenLocation[1]],
				sections: {
					sec1: true,
					sec2: false
				}
			};

			const expectedCommands: { [key: string]: Action<{}> } = {
				restoreCorrectionModeBackup: Commands.CorrectionMode.restoreCorrectionModeBackup({
					backup: correctionModeBackup
				}),
				changeScreenState: Commands.changeScreenState({
					index: 0,
					focusedComponent: { formModelPath: [], subElement: "current-screen" }
				})
			};

			it("dispatches a Commands.CorrectionMode.restoreCorrectionModeBackup with with the correction mode backup from the store", () => {
				MiddlewareHelpers.assertAction(
					middlewareSpy.spy,
					expectedCommands.restoreCorrectionModeBackup
				);
			});

			it("dispatches a Commands.changeScreenState with focusedComponent set to the form", () => {
				MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommands.changeScreenState);
			});

			it("dispatches only these action", () => {
				MiddlewareHelpers.assertNumberOfActions(
					middlewareSpy.spy,
					Object.keys(expectedCommands).map((key: string) => expectedCommands[key])
				);
			});

			function setupStore() {
				return createTestStore({
					storeConfig: {
						models,
						ui: {
							screenLocation,
							correctionModeBackup
						}
					},
					middlewares: [middlewareSpy.middleware]
				});
			}
		});
	});
});
