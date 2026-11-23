// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { Commands, Events } from "../../../../../back-end/store/index.js";
import { MiddlewareHelpers } from "../../../../utils/back-end-helpers.js";
import { ModelHelpers } from "../../../../utils/model-helpers.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../../../utils/setupFixture.js";

const { createTestStore } = SetupHelpers;

describe("api.back-end.store.middleware", () => {
	describe("onColumnWidthChangeMiddleware", () => {
		describe("handles Events.Repeat.changeColumnWidth", () => {
			const middlewareSpy = setupFixture(() => MiddlewareHelpers.createMiddlewareSpy());
			const models = setupModelsFixture("repeat", "inline");

			it("dispatches a Commands.setColumnWidth with payload from the event action", () => {
				const columnPath = ModelHelpers.createModelPath("dummyRepeat", "dummyColumn");
				setupStore().dispatch(Events.Repeat.changeColumnWidth({ columnPath, width: 4 }));

				const expectedCommands = [Commands.setColumnWidth({ columnPath, width: 4 })];

				MiddlewareHelpers.assertActions(middlewareSpy.spy, expectedCommands);
			});

			function setupStore(dirty?: boolean, data?: {}, messages?: {}) {
				return createTestStore({
					storeConfig: {
						models: models,
						data: { dirty: dirty || false, document: data || {} },
						ui: { messages }
					},
					middlewares: [middlewareSpy.middleware]
				});
			}
		});
	});
});
