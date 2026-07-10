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

import type { Action, Store } from "redux";

import { Commands, Events } from "../../../../../back-end/store/index.js";
import type { EngineState, EngineStore } from "../../../../../back-end/store/internal/store.js";
import { MiddlewareHelpers } from "../../../../utils/MiddlewareHelpers.js";
import { createDocumentPath } from "../../../../utils/createDocumentPath.js";
import { createModelPath } from "../../../../utils/createModelPath.js";
import { US_LOCALE } from "../../../../utils/localization.js";
import { createTestStore, loadData } from "../../../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../../../utils/setupFixture.js";
import { DR } from "../../../../utils/test-model-helpers/detached.repeat.js";
import { IR } from "../../../../utils/test-model-helpers/inline.repeat.js";
import { REPEAT, createDocumentForRepeat } from "../../../../utils/test-model-helpers/repeat.js";

describe("api.back-end.store.middleware", () => {
	describe("cloneButtonRepeatMiddleware", () => {
		describe("handles Events.cloneRowTriggered", () => {
			const middlewareSpy = setupFixture(() => MiddlewareHelpers.createMiddlewareSpy());
			const repeatModelPath = IR.SortingAndFiltering.repeatFormModelPathSec4;
			const NESTED_L6_PATH = createDocumentPath([REPEAT.rootGroup], [REPEAT.nestedL6]);

			function createRows(numberOfInitialRows: number): object[] {
				const initialRows = [];
				for (let i = 0; i < numberOfInitialRows; i++) {
					initialRows.push({ nestedGroup: { L6_String: `row ${i}` } });
				}
				return initialRows;
			}

			function createData(
				numberOfInitialRows: number,
				dirty = true
			): Partial<EngineStore.DataState> {
				return {
					document: {
						Root: {
							Nested_L6: createRows(numberOfInitialRows)
						}
					},
					dirty
				};
			}

			function setupApp(data: Partial<EngineStore.DataState> = createData(1)): Store<
				EngineState,
				Action
			> & {
				readonly dispatch: unknown;
			} {
				return createTestStore({
					storeConfig: {
						models,
						locale: US_LOCALE,
						data,
						ui: {
							screenLocation: [
								{
									path: [],
									locationPath: createModelPath(IR.SortingAndFiltering.screen)
								}
							]
						}
					},
					middlewares: [middlewareSpy.middleware]
				});
			}

			const models = setupModelsFixture("repeat", "inline");

			beforeEach(() => {
				middlewareSpy.spy.mock.resetCalls();
			});

			describe("given an inline repeat", () => {
				it("dispatches Commands.setDocument which contains the cloned row", () => {
					const store = setupApp(createData(2));

					store.dispatch(
						Events.Repeat.cloneRowTriggered({
							repeatFormModelPath: repeatModelPath,
							rowPath: NESTED_L6_PATH
						})
					);

					const expectedDocument: object = createDocumentForRepeat({
						nestedL6: [{ L6_String: "row 0" }, { L6_String: "row 1" }, { L6_String: "row 0" }]
					});

					const setDocumentPayload: Commands.SetDocumentPayload = {
						document: expectedDocument,
						changes: [
							{
								type: "GroupAdded",
								path: createDocumentPath(["Root"], ["Nested_L6"])
							},
							{
								type: "ValueChanged",
								path: createDocumentPath(["Root"], ["L6_Number_Sum"])
							}
						]
					};

					MiddlewareHelpers.assertAction(
						middlewareSpy.spy,
						Commands.setDocument(setDocumentPayload)
					);
				});

				it("also dispatches Commands.setDirty if the data was not dirty before", () => {
					const store = setupApp(createData(2, false));

					store.dispatch(
						Events.Repeat.cloneRowTriggered({
							repeatFormModelPath: repeatModelPath,
							rowPath: NESTED_L6_PATH
						})
					);

					MiddlewareHelpers.assertAction(middlewareSpy.spy, Commands.setDataDirty(true));
				});

				it("dispatches Commands.setDocument which contains the cloned row and recomputed field instances", () => {
					const store = setupApp({
						document: createDocumentForRepeat({
							nestedL6: [{ L6_String: "row 0", L6_Number: 42 }]
						}),
						dirty: true
					});

					store.dispatch(
						Events.Repeat.cloneRowTriggered({
							repeatFormModelPath: repeatModelPath,
							rowPath: NESTED_L6_PATH
						})
					);

					const expectedDocument: object = createDocumentForRepeat({
						nestedL6: [
							{ L6_String: "row 0", L6_Number: 42 },
							{ L6_String: "row 0", L6_Number: 42 }
						]
					});

					const setDocumentPayload: Commands.SetDocumentPayload = {
						document: expectedDocument,
						changes: [
							{
								type: "GroupAdded",
								path: createDocumentPath(["Root"], ["Nested_L6"])
							},
							{
								type: "ValueChanged",
								path: createDocumentPath(["Root"], ["L6_Number_Sum"])
							}
						]
					};

					MiddlewareHelpers.assertAction(
						middlewareSpy.spy,
						Commands.setDocument(setDocumentPayload)
					);
				});

				it("does not dispatch Commands.setMessageState if the revalidation after cloning the row did not result in new messages", () => {
					const store = setupApp(createData(2));

					store.dispatch(
						Events.Repeat.cloneRowTriggered({
							repeatFormModelPath: repeatModelPath,
							rowPath: NESTED_L6_PATH
						})
					);

					MiddlewareHelpers.assertNoAction(
						middlewareSpy.spy,
						Commands.setMessageState({ messages: {} })
					);
				});

				describe("dispatches Commands.changeRepeatInstanceStateEntry that", () => {
					it("sets the new repeat state with page equal to 1 if the new row count is smaller or equal than the max row count of repeat", () => {
						const store = setupApp({
							document: {
								Root: {
									Nested_L6: [
										{
											nestedGroup: {
												L6_String: "row 1",
												L6_Number: 12
											}
										}
									]
								}
							}
						});

						store.dispatch(
							Events.Repeat.cloneRowTriggered({
								repeatFormModelPath: repeatModelPath,
								rowPath: NESTED_L6_PATH
							})
						);

						MiddlewareHelpers.assertAction(
							middlewareSpy.spy,
							Commands.changeRepeatInstanceStateEntry({
								locationPath: createModelPath(IR.SortingAndFiltering.screen),
								repeatFormModelPath: repeatModelPath,
								entry: {
									newRow: {
										rowPath: createDocumentPath([REPEAT.rootGroup], [REPEAT.nestedL6, 2]),
										rowState: "recentlyAdded"
									},
									page: 1,
									expandedRowPath: undefined
								}
							})
						);
					});

					it("sets the new repeat state with page equal to the index of the last page if new row count is bigger than page size of repeat", () => {
						const store = setupApp(createData(5));

						store.dispatch(
							Events.Repeat.cloneRowTriggered({
								repeatFormModelPath: repeatModelPath,
								rowPath: NESTED_L6_PATH
							})
						);

						MiddlewareHelpers.assertAction(
							middlewareSpy.spy,
							Commands.changeRepeatInstanceStateEntry({
								locationPath: createModelPath(IR.SortingAndFiltering.screen),
								repeatFormModelPath: repeatModelPath,
								entry: {
									newRow: {
										rowPath: createDocumentPath([REPEAT.rootGroup], [REPEAT.nestedL6, 6]),
										rowState: "recentlyAdded"
									},
									page: 3,
									expandedRowPath: undefined
								}
							})
						);
					});
				});

				it("dispatches Commands.changeScreenState with the path to the new row as focused component", () => {
					const store = setupApp(createData(2));
					store.dispatch(
						Events.Repeat.cloneRowTriggered({
							repeatFormModelPath: repeatModelPath,
							rowPath: NESTED_L6_PATH
						})
					);
					const expectedCommand = Commands.changeScreenState({
						index: 0,
						focusedComponent: {
							formModelPath: repeatModelPath,
							index: 2
						}
					});
					MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
				});
			});

			describe("given a repeat in a detached repeat detail screen", () => {
				const models = setupModelsFixture("repeat", "detached");

				it("dispatches a Commands.changeScreenState action to set the dirty state of the screen", () => {
					const document = loadData("repeat", "data", models.documentModel);
					const store = createTestStore({
						storeConfig: {
							models,
							data: { document },
							ui: {
								screenLocation: [
									{ locationPath: [], path: [] },
									{
										locationPath: DR.NestedRepeat.nested_dr_dr_locationPath,
										path: createDocumentPath(["Root"], ["Nested_L1"])
									}
								]
							}
						},
						middlewares: [middlewareSpy.middleware]
					});

					const cloneRowEvent = Events.Repeat.cloneRowTriggered({
						rowPath: createDocumentPath(["Root"], ["Nested_L1"], ["Nested_L2"]),
						repeatFormModelPath: [
							...DR.NestedRepeat.nested_dr_dr_locationPath,
							{ elementName: "inline-repeat-Nested_L2" }
						]
					});

					store.dispatch(cloneRowEvent);
					const changeScreenState = Commands.changeScreenState({
						index: 1,
						dirty: true
					});

					MiddlewareHelpers.assertAction(middlewareSpy.spy, changeScreenState);
				});
			});
		});
	});
});
