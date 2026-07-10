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

import type { Store } from "redux";

import type { Action } from "@com.mgmtp.a12.client/typescript-fsa-redux-5-compat";
import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";

import type { MiddlewareOptions } from "../../../../../back-end/store/index.js";
import { Commands, Events } from "../../../../../back-end/store/index.js";
import type {
	EngineState,
	EngineStore,
	Models
} from "../../../../../back-end/store/internal/store.js";
import type { ReadonlyObjectMap } from "../../../../../models/index.js";
import { MiddlewareHelpers } from "../../../../utils/MiddlewareHelpers.js";
import { createDocumentPath } from "../../../../utils/createDocumentPath.js";
import { createModelPath } from "../../../../utils/createModelPath.js";
import {
	createRepeatInstanceStateEntry,
	createRepeatStaticStateEntry,
	createTestStore
} from "../../../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../../../utils/setupFixture.js";
import {
	DOCUMENT_MODEL,
	FORM_MODEL,
	IDS,
	createDocumentForRepeatValidation,
	message
} from "../../../../utils/test-model-helpers/repeat.validation.js";

describe("api.back-end.store.middleware", () => {
	describe("onLeaveTableMiddleware", () => {
		const middlewareSpy = setupFixture(() => MiddlewareHelpers.createMiddlewareSpy());

		beforeEach(() => {
			middlewareSpy.spy.mock.resetCalls();
		});

		const l1NumberDocumentPath = createDocumentPath(
			[DOCUMENT_MODEL.rootGroup],
			[DOCUMENT_MODEL.repeatGroup, 1],
			[DOCUMENT_MODEL.numberField1]
		);

		describe("handles Events.Repeat.leaveRepeatTable", () => {
			describe("given a form model path to an inline repeat in the payload", () => {
				const repeatFormModelPath = FORM_MODEL.inlineRepeatModelPath;
				executeTest({ modelName: "inline", repeatFormModelPath, orderPath: IDS.IR_SORTING_COLUMN });
			});

			describe("given a form model path to an embedded repeat in the payload", () => {
				const repeatFormModelPath = FORM_MODEL.embeddedRepeatModelPath;
				executeTest({
					modelName: "embedded",
					repeatFormModelPath,
					orderPath: IDS.ER_SORTING_COLUMN
				});
			});

			describe("given a form model path to a detached repeat in the payload", () => {
				const repeatFormModelPath = FORM_MODEL.detachedRepeatModelPath;
				executeTest({
					modelName: "detached",
					repeatFormModelPath,
					orderPath: IDS.DR_SORTING_COLUMN
				});
			});

			function executeTest(options: {
				modelName: "inline" | "embedded" | "detached";
				repeatFormModelPath: ModelPath;
				orderPath: string;
			}): void {
				const models = setupModelsFixture("repeat.validation");

				describe("if a new row is left", () => {
					it("dispatches Commands.changeRepeatInstanceStateEntry for the parent repeat", () => {
						const { repeatFormModelPath } = options;
						const action = Events.Repeat.leaveRepeatTable({ repeatFormModelPath });

						const setupOptions = {
							models,
							repeatFormModelPath,
							newRow: {
								rowPath: l1NumberDocumentPath,
								rowState: "workingOn"
							}
						} as const;
						setupStore(setupOptions).dispatch(action);
						const expectedCommands = [createChangeRepeatInstanceStateCommand(setupOptions)];
						MiddlewareHelpers.assertActions(middlewareSpy.spy, expectedCommands);
					});

					if (options.modelName !== "detached") {
						describe("if the new row is not on the current page", () => {
							it("dispatches Commands.changeRepeatInstanceStateEntry for the parent screen with an entry for the new row with the correct page", () => {
								const { repeatFormModelPath } = options;
								const newRowPath = createDocumentPath(
									[DOCUMENT_MODEL.rootGroup],
									[DOCUMENT_MODEL.repeatGroup, 7]
								);
								const action = Events.Repeat.leaveRepeatTable({ repeatFormModelPath });

								/**
								 * page size 2
								 * 6 entries -> pageCount = 3
								 * new row with indexField = 'c' --> page should be 2
								 */
								const doc = createDocumentForRepeatValidation([
									{ indexField: "a" }, // first page
									{ indexField: "b" }, // first page
									{ indexField: "c" }, // second page
									{ indexField: "d" }, // second page
									{ indexField: "e" }, // third page
									{ indexField: "f" }, // third page
									{ indexField: "c" } // new row
								]);

								const orderPath = [...repeatFormModelPath, ...createModelPath(options.orderPath)];
								const setupOptions = {
									models,
									repeatFormModelPath,
									data: doc,
									newRow: {
										rowPath: newRowPath,
										rowState: "workingOn"
									},
									sortingState: {
										sorting: "asc",
										orderPath
									}
								} as const;
								setupStore(setupOptions).dispatch(action);
								const expectedCommand = createChangeRepeatInstanceStateCommand({
									...setupOptions,
									page: 2
								});
								MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
							});

							if (options.modelName === "embedded") {
								it("dispatches Commands.changeRepeatInstanceStateEntry for the parent screen with an entry where expandedRow is removed", () => {
									const { repeatFormModelPath } = options;
									const newRowPath = createDocumentPath(
										[DOCUMENT_MODEL.rootGroup],
										[DOCUMENT_MODEL.repeatGroup, 4]
									);
									const action = Events.Repeat.leaveRepeatTable({ repeatFormModelPath });

									const doc = createDocumentForRepeatValidation([
										{ indexField: "a" }, // first page
										{ indexField: "b" }, // first page
										{ indexField: "c" }, // second page
										{ indexField: "a" } // new row, will be sorted to first page
									]);

									const orderPath = [...repeatFormModelPath, ...createModelPath(options.orderPath)];

									// currently on page2, working on the 4th row
									const setupOptions = {
										models,
										repeatFormModelPath,
										data: doc,
										newRow: {
											rowPath: newRowPath,
											rowState: "workingOn"
										},
										page: 2,
										expandedRowPath: newRowPath,
										sortingState: {
											sorting: "asc",
											orderPath
										}
									} as const;
									setupStore(setupOptions).dispatch(action);
									const expectedCommand = createChangeRepeatInstanceStateCommand({
										...setupOptions,
										// page changed, expandedRow should be "closed"
										page: 1,
										expandedRowPath: undefined
									});
									MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
								});
							}
						});

						describe("if 'disableRepeatValidationOnLeaving' is set to false in the middleware options", () => {
							it("executes a partial validation of the visible fields inside the table", () => {
								const expectedCommand = executePartialValidationTest(true, false);
								MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
							});
						});

						describe("if 'disableRepeatValidationOnLeaving' is set to true in the middleware options", () => {
							it("does not execute a partial validation of the visible fields inside the table", () => {
								const expectedCommand = executePartialValidationTest(true, true);
								MiddlewareHelpers.assertNoAction(middlewareSpy.spy, expectedCommand);
							});
						});
					}
				});

				describe("if no new row is left", () => {
					if (options.modelName !== "detached") {
						describe("if 'disableRepeatValidationOnLeaving' is set to false in the middleware options", () => {
							it("executes a partial validation of the visible fields inside the table", () => {
								const expectedCommand = executePartialValidationTest(false, false);
								MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
							});
						});

						describe("if 'disableRepeatValidationOnLeaving' is set to true in the middleware options", () => {
							it("does not execute a partial validation of the visible fields inside the table", () => {
								const expectedCommand = executePartialValidationTest(false, true);
								MiddlewareHelpers.assertNoAction(middlewareSpy.spy, expectedCommand);
							});
						});
					}
				});

				function executePartialValidationTest(
					newRow?: boolean,
					disablePartialValidation?: boolean
				): Action<Commands.SetMessageStatePayload> {
					const { repeatFormModelPath } = options;
					const action = Events.Repeat.leaveRepeatTable({ repeatFormModelPath });
					const doc = createDocumentForRepeatValidation([
						{ indexField: "row-1" },
						{ indexField: "row-2" }
					]);
					const store = setupStore({
						models,
						repeatFormModelPath,
						newRow: newRow
							? {
									rowPath: l1NumberDocumentPath,
									rowState: "workingOn"
								}
							: undefined,
						data: doc,
						mwo: disablePartialValidation ? { disableRepeatValidationOnLeaving: true } : undefined
					});

					store.dispatch(action);

					// Expected messages
					const messages: ReadonlyObjectMap<EngineStore.Validation.Entry> = {
						...message(1),
						...message(2)
					};

					return Commands.setMessageState({ messages });
				}
			}

			interface StoreOptions {
				models: Models;
				data?: {};
				messages?: {};
				repeatFormModelPath: ModelPath;
			}

			function setupStore(
				options: StoreOptions &
					Partial<EngineStore.Repeat.Entry> & { mwo?: Partial<MiddlewareOptions> }
			): Store<EngineState> {
				const data = (options && options.data) || {};
				const messages = (options && options.messages) || {};

				return createTestStore({
					storeConfig: {
						models: options.models,
						data: { dirty: false, document: data || {} },
						ui: {
							messages: messages,
							screenLocation: [createRootScreenState(options)],
							repeatStaticState: createStaticRepeatState(options)
						}
					},
					middlewareOptions: options.mwo,
					middlewares: [middlewareSpy.middleware]
				});
			}

			function createRootScreenState(
				options: Partial<EngineStore.Repeat.InstanceState> & { repeatFormModelPath: ModelPath }
			): EngineStore.ScreenState {
				return {
					path: [],
					locationPath: createModelPath("Screen1"),
					repeatInstanceState: {
						[ModelPath.toString(options.repeatFormModelPath)]: createRepeatEntry(options)
					}
				};
			}
			function createStaticRepeatState(
				options: Partial<EngineStore.Repeat.StaticState> & { repeatFormModelPath: ModelPath }
			): ReadonlyObjectMap<EngineStore.Repeat.StaticState> {
				return {
					[ModelPath.toString(options.repeatFormModelPath)]: createRepeatStaticStateEntry(options)
				};
			}

			function createChangeRepeatInstanceStateCommand(
				options: Partial<EngineStore.Repeat.InstanceState> & { repeatFormModelPath: ModelPath }
			) {
				const repeatEntry = createRepeatEntry(options);

				return Commands.changeRepeatInstanceStateEntry({
					locationPath: createModelPath("Screen1"),
					repeatFormModelPath: options.repeatFormModelPath,
					entry: {
						...repeatEntry,
						newRow: repeatEntry.newRow
							? {
									rowPath: repeatEntry.newRow.rowPath,
									rowState: "recentlyAdded"
								}
							: undefined
					}
				});
			}

			function createRepeatEntry(
				options?: Partial<EngineStore.Repeat.InstanceState>
			): EngineStore.Repeat.Entry {
				return createRepeatInstanceStateEntry({
					...options,
					newRow: options?.newRow?.rowPath
						? {
								rowPath: options.newRow.rowPath,
								rowState: options.newRow.rowState
							}
						: undefined
				});
			}
		});
	});
});
