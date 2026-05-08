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

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";

import type { EngineStore } from "../../../../../back-end/store/index.js";
import { Commands, Events } from "../../../../../back-end/store/index.js";
import type { Models } from "../../../../../back-end/store/internal/store.js";
import { MiddlewareHelpers } from "../../../../utils/back-end-helpers.js";
import { ModelHelpers } from "../../../../utils/model-helpers.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../../../utils/setupFixture.js";
import { IR } from "../../../../utils/test-model-helpers/inline.repeat.js";

const { createTestStore } = SetupHelpers;
describe("api.back-end.store.middleware", () => {
	describe("onSortingChangeMiddleware", () => {
		describe("handles Events.sortingChange", () => {
			const middlewareSpy = setupFixture(() => MiddlewareHelpers.createMiddlewareSpy());

			const models = setupModelsFixture("repeat", "inline");

			beforeEach(() => {
				middlewareSpy.spy.mock.resetCalls();
			});

			const repeatFormModelPath = ModelHelpers.createModelPath(
				IR.SortingAndFiltering.screen,
				"Repeat"
			);
			const orderPath = [...repeatFormModelPath, { elementName: "column1" }];

			describe("given a payload with 'sorting=asc'", () => {
				it("dispatches a Commands.changeRepeatStaticStateEntry action with the given sorting and orderPath in its payload", () => {
					setupStore().dispatch(
						Events.Repeat.sortingChange({
							orderPath,
							repeatFormModelPath,
							sorting: "asc"
						})
					);

					const expectedCommands = [
						Commands.changeRepeatStaticStateEntry({
							entry: {
								sortingState: {
									orderPath: ModelPath.fromString("/SortingAndFiltering/Repeat/column1"),
									sorting: "asc"
								}
							},
							repeatFormModelPath
						}),
						Commands.changeRepeatInstanceStateEntry({
							locationPath: ModelHelpers.createModelPath(IR.SortingAndFiltering.screen),
							entry: {
								newRow: undefined,
								page: 1,
								expandedRowPath: undefined
							},
							repeatFormModelPath
						})
					];

					MiddlewareHelpers.assertActions(middlewareSpy.spy, expectedCommands);
				});
			});

			describe("given a payload with 'sorting=desc'", () => {
				it("dispatches a Commands.changeRepeatStaticStateEntry action with the given sorting and orderPath in its payload", () => {
					setupStore().dispatch(
						Events.Repeat.sortingChange({
							orderPath,
							repeatFormModelPath,
							sorting: "desc"
						})
					);

					const expectedCommands = [
						Commands.changeRepeatStaticStateEntry({
							entry: {
								sortingState: {
									orderPath: ModelPath.fromString("/SortingAndFiltering/Repeat/column1"),
									sorting: "desc"
								}
							},
							repeatFormModelPath
						}),
						Commands.changeRepeatInstanceStateEntry({
							locationPath: ModelHelpers.createModelPath(IR.SortingAndFiltering.screen),
							entry: {
								newRow: undefined,
								page: 1,
								expandedRowPath: undefined
							},
							repeatFormModelPath
						})
					];

					MiddlewareHelpers.assertActions(middlewareSpy.spy, expectedCommands);
				});
			});

			describe("given a payload with no 'sorting' defined", () => {
				it("dispatches a Commands.changeRepeatStaticStateEntry action which sets the sortingState to undefined", () => {
					setupStore().dispatch(
						Events.Repeat.sortingChange({
							orderPath,
							repeatFormModelPath,
							sorting: undefined
						})
					);

					const expectedCommands = [
						Commands.changeRepeatStaticStateEntry({
							entry: {
								sortingState: undefined
							},
							repeatFormModelPath
						}),
						Commands.changeRepeatInstanceStateEntry({
							locationPath: ModelHelpers.createModelPath(IR.SortingAndFiltering.screen),
							entry: {
								newRow: undefined,
								page: 1
							},
							repeatFormModelPath
						})
					];

					MiddlewareHelpers.assertActions(middlewareSpy.spy, expectedCommands);
				});
			});

			describe("given a repeat with a page size and a current page > 1", () => {
				it("resets the page to 1", () => {
					const data = SetupHelpers.loadData("repeat", "data", models.documentModel);
					setupStore({
						data,
						ui: {
							screenLocation: [
								{
									locationPath: ModelHelpers.createModelPath(IR.SortingAndFiltering.screen),
									path: [],
									repeatInstanceState: {
										[ModelPath.toString(repeatFormModelPath)]: {
											page: 3
										}
									}
								}
							]
						}
					}).dispatch(
						Events.Repeat.sortingChange({
							orderPath,
							repeatFormModelPath,
							sorting: "asc"
						})
					);

					const expectedCommands = [
						Commands.changeRepeatStaticStateEntry({
							entry: {
								sortingState: {
									orderPath: ModelPath.fromString("/SortingAndFiltering/Repeat/column1"),
									sorting: "asc"
								}
							},
							repeatFormModelPath
						}),
						Commands.changeRepeatInstanceStateEntry({
							locationPath: ModelHelpers.createModelPath(IR.SortingAndFiltering.screen),
							entry: {
								newRow: undefined,
								page: 1,
								expandedRowPath: undefined
							},
							repeatFormModelPath
						})
					];

					MiddlewareHelpers.assertActions(middlewareSpy.spy, expectedCommands);
				});
			});

			function setupStore(options?: {
				models?: Models;
				data?: object;
				ui?: Partial<EngineStore.UIState>;
			}) {
				return createTestStore({
					storeConfig: {
						models: options?.models || models,
						data: { document: options?.data },
						ui: options?.ui
					},
					middlewares: [middlewareSpy.middleware]
				});
			}
		});
	});
});
