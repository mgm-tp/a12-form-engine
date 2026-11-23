// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { deepStrictEqual, strictEqual } from "node:assert/strict";

import { Commands, Events } from "../../../../../back-end/store/index.js";
import type { EngineStore } from "../../../../../back-end/store/internal/store.js";
import { MiddlewareHelpers } from "../../../../utils/back-end-helpers.js";
import { US_LOCALE } from "../../../../utils/localization.js";
import { ModelHelpers } from "../../../../utils/model-helpers.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { setupFixture } from "../../../../utils/setupFixture.js";
import { REPEAT_MODEL_PATH } from "../../../view/repeat/filter/filter.utils.js";

const { createTestStore } = SetupHelpers;
const { createModelPath } = ModelHelpers;

describe("api.back-end.store.middleware", () => {
	describe("onFilterButtonRepeatMiddleware", () => {
		const middlewareSpy = setupFixture(() => MiddlewareHelpers.createMiddlewareSpy());

		function setupStore() {
			return createTestStore({
				storeConfig: {
					locale: US_LOCALE,
					data: { dirty: false, document: {} },
					ui: {
						screenLocation: [
							{
								path: [],
								locationPath: [{ elementName: "SortingAndFiltering" }]
							}
						] as EngineStore.ScreenState[],
						repeatStaticState: {
							"/SortingAndFiltering/sec1/inline-repeat-Nested_L1": {
								filterRowOpen: false,
								filters: undefined
							}
						}
					}
				},
				middlewares: [middlewareSpy.middleware]
			});
		}

		describe("handles Events.Repeat.showFilter", () => {
			const expectedCallCount = 2;

			afterEach("", () => {
				middlewareSpy.spy.mock.resetCalls();
			});

			it("will dispatch a changeRepeatStaticStateEntry command with filterRowOpen: true if open = true was passed", () => {
				const expectedCommand = Commands.changeRepeatStaticStateEntry({
					repeatFormModelPath: createModelPath(...REPEAT_MODEL_PATH),
					entry: {
						filterRowOpen: true,
						filters: undefined
					}
				});

				setupStore().dispatch(
					Events.Repeat.showFilter({
						repeatFormModelPath: createModelPath(...REPEAT_MODEL_PATH),
						opened: true
					})
				);
				strictEqual(middlewareSpy.spy.mock.callCount(), expectedCallCount);
				deepStrictEqual(middlewareSpy.spy.mock.calls.at(-1)?.arguments[0], expectedCommand);
			});

			it("will dispatch a changeRepeatStaticStateEntry command with filterRowOpen: false if open = false was passed", () => {
				const expectedCommand = Commands.changeRepeatStaticStateEntry({
					repeatFormModelPath: createModelPath(...REPEAT_MODEL_PATH),
					entry: {
						filterRowOpen: false,
						filters: undefined
					}
				});

				setupStore().dispatch(
					Events.Repeat.showFilter({
						repeatFormModelPath: createModelPath(...REPEAT_MODEL_PATH),
						opened: false
					})
				);
				strictEqual(middlewareSpy.spy.mock.callCount(), expectedCallCount);
				deepStrictEqual(middlewareSpy.spy.mock.calls.at(-1)?.arguments[0], expectedCommand);
			});
		});
	});
});
