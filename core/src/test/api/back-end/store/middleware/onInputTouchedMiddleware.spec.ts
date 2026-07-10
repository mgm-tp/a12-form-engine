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

import { Commands, Events } from "../../../../../back-end/store/index.js";
import { createDocumentPath } from "../../../../utils/createDocumentPath.js";
import { MiddlewareHelpers } from "../../../../utils/MiddlewareHelpers.js";
import { createTestStore, loadData } from "../../../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../../../utils/setupFixture.js";
import { DR } from "../../../../utils/test-model-helpers/detached.repeat.js";

describe("api.back-end.store.middleware", () => {
	describe("onInputTouchedMiddleware", () => {
		describe("handles Events.inputTouched", () => {
			const middlewareSpy = setupFixture(() => MiddlewareHelpers.createMiddlewareSpy());

			const models = setupModelsFixture("repeat", "detached");

			beforeEach(() => {
				middlewareSpy.spy.mock.resetCalls();
			});

			describe("if the ui state is not dirty", () => {
				it("dispatches a Commands.setUIDirty with payload 'true'", () => {
					setupStore(false, false).dispatch(Events.inputTouched());
					MiddlewareHelpers.assertAction(middlewareSpy.spy, Commands.setUIDirty(true));
				});
			});

			describe("if the ui state is dirty", () => {
				it("does not dispatch a Commands.setUIDirty with payload 'true'", () => {
					setupStore(true, false).dispatch(Events.inputTouched());
					MiddlewareHelpers.assertNoAction(middlewareSpy.spy, Commands.setUIDirty(true));
				});
			});

			describe("if a detached repeat detail screen is opened", () => {
				describe("if the screen is not dirty", () => {
					it("dispatches a Commands.changeScreenState action with dirty=true", () => {
						setupStore(false, false).dispatch(Events.inputTouched());
						MiddlewareHelpers.assertAction(
							middlewareSpy.spy,
							Commands.changeScreenState({ index: 1, dirty: true })
						);
					});
				});

				describe("if the screen is dirty", () => {
					it("does not dispatch a Commands.changeScreenState action", () => {
						setupStore(true, true).dispatch(Events.inputTouched());
						MiddlewareHelpers.assertNoAction(
							middlewareSpy.spy,
							Commands.changeScreenState({ index: 1, dirty: true })
						);
					});
				});
			});

			function setupStore(uiDirty?: boolean, screenDirty?: boolean) {
				const document = loadData("repeat", "data", models.documentModel);
				return createTestStore({
					storeConfig: {
						models,
						data: { document },
						ui: {
							screenLocation: [
								{ locationPath: [], path: [] },
								{
									locationPath: DR.NestedRepeat.nested_dr_dr_locationPath,
									path: createDocumentPath(["Root"], ["Nested_L1"]),
									dirty: screenDirty
								}
							],
							dirty: uiDirty
						}
					},
					middlewares: [middlewareSpy.middleware]
				});
			}
		});
	});
});
