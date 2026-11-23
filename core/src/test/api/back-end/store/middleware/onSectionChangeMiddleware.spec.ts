// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { AnyAction, Store } from "redux";

import { Commands, Events } from "../../../../../back-end/store/index.js";
import { Middlewares } from "../../../../../back-end/store/internal/middleware/index.js";
import type { EngineState } from "../../../../../back-end/store/internal/store.js";
import { MiddlewareHelpers } from "../../../../utils/back-end-helpers.js";
import { ModelHelpers } from "../../../../utils/model-helpers.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../../../utils/setupFixture.js";

const { createModelPath } = ModelHelpers;
const { createTestStore } = SetupHelpers;

describe("api.back-end.store.middleware", () => {
	describe("onSectionChangeMiddleware", () => {
		const middlewareSpy = setupFixture(() => MiddlewareHelpers.createMiddlewareSpy());

		// stub validate part middleware since it fires other actions
		MiddlewareHelpers.stubMiddleware(Middlewares, "validatePartMiddlewareFactory");

		const models = setupModelsFixture("container", "collapsible-section");

		beforeEach(() => {
			middlewareSpy.spy.mock.resetCalls();
		});

		describe("handles Events.collapseSection", () => {
			it("dispatches Commands.setSectionsCollapsed with the given payload", () => {
				const payload = {
					collapse: true,
					path: createModelPath("My", "special", "path")
				};

				const action = Events.collapseSection(payload);

				setupStore().dispatch(action);
				const expectedCommands = [
					Commands.setSectionsCollapsed({
						sections: [payload]
					})
				];
				MiddlewareHelpers.assertActions(middlewareSpy.spy, expectedCommands);
			});

			function setupStore(): Store<EngineState, AnyAction> {
				return createTestStore({
					storeConfig: {
						models: models
					},
					middlewares: [middlewareSpy.middleware]
				});
			}
		});
	});
});
