// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { Commands, Events } from "../../../../../back-end/store/index.js";
import { MiddlewareHelpers } from "../../../../utils/back-end-helpers.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../../../utils/setupFixture.js";

const { createTestStore } = SetupHelpers;

describe("api.back-end.store.middleware", () => {
	describe("onRevalidateMiddleware", () => {
		describe("handles Events.CorrectionMode.revalidate", () => {
			const middlewareSpy = setupFixture(() => MiddlewareHelpers.createMiddlewareSpy());

			const models = setupModelsFixture("computation-validation.correctionmode");

			it("dispatches a Commands.validateFull action", () => {
				setupStore().dispatch(Events.CorrectionMode.revalidate());
				MiddlewareHelpers.assertAction(middlewareSpy.spy, Commands.validateFull());

				middlewareSpy.spy.mock.resetCalls();
			});

			function setupStore() {
				return createTestStore({
					storeConfig: { models: models },
					middlewares: [middlewareSpy.middleware]
				});
			}
		});
	});
});
