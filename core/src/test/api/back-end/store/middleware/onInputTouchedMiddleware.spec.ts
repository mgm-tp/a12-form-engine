// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { Commands, Events } from "../../../../../back-end/store/index.js";
import { MiddlewareHelpers } from "../../../../utils/back-end-helpers.js";
import { DocumentHelpers } from "../../../../utils/document-helpers.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../../../utils/setupFixture.js";
import { DR } from "../../../../utils/test-model-helpers/detached.repeat.js";

const { createTestStore } = SetupHelpers;

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
				const document = SetupHelpers.loadData("repeat", "data", models.documentModel);
				return createTestStore({
					storeConfig: {
						models,
						data: { document },
						ui: {
							screenLocation: [
								{ locationPath: [], path: [] },
								{
									locationPath: DR.NestedRepeat.nested_dr_dr_locationPath,
									path: DocumentHelpers.createDocumentPath(["Root"], ["Nested_L1"]),
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
