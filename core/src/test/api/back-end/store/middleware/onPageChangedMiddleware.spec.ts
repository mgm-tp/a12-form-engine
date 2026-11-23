// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { Commands, Events } from "../../../../../back-end/store/index.js";
import { MiddlewareHelpers } from "../../../../utils/back-end-helpers.js";
import { ModelHelpers } from "../../../../utils/model-helpers.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../../../utils/setupFixture.js";
import { IR } from "../../../../utils/test-model-helpers/inline.repeat.js";

const { createTestStore } = SetupHelpers;

describe("api.back-end.store.middleware", () => {
	describe("onPageChangeMiddleware", () => {
		describe("handles Events.changePage", () => {
			const middlewareSpy = setupFixture(() => MiddlewareHelpers.createMiddlewareSpy());
			const models = setupModelsFixture("repeat", "inline");

			const repeatFormModelPath = ModelHelpers.createModelPath(
				IR.SortingAndFiltering.screen,
				"Repeat"
			);
			it("dispatches a Commands.changeRepeatInstanceStateEntry action with the page from the payload", () => {
				setupStore().dispatch(
					Events.Repeat.changePage({
						page: 5,
						repeatFormModelPath
					})
				);

				const expectedCommand = Commands.changeRepeatInstanceStateEntry({
					locationPath: ModelHelpers.createModelPath(IR.SortingAndFiltering.screen),
					entry: {
						page: 5,
						newRow: undefined,
						expandedRowPath: undefined
					},
					repeatFormModelPath
				});

				MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
			});

			it("dispatches a Commands.changeScreenState action with the focusedComponent containing the repeat path", () => {
				setupStore().dispatch(
					Events.Repeat.changePage({
						page: 5,
						repeatFormModelPath
					})
				);

				const expectedCommand = Commands.changeScreenState({
					index: 0,
					focusedComponent: {
						formModelPath: repeatFormModelPath
					}
				});

				MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
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
