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

import type { AnyAction, Store } from "redux";
import type { Action } from "typescript-fsa";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { EngineState, EngineStore } from "../../../../../back-end/store/index.js";
import { Commands, Events } from "../../../../../back-end/store/index.js";
import { DocumentPath } from "../../../../../models/index.js";
import { MiddlewareHelpers } from "../../../../utils/back-end-helpers.js";
import { DocumentHelpers } from "../../../../utils/document-helpers.js";
import { ModelHelpers } from "../../../../utils/model-helpers.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../../../utils/setupFixture.js";
import { ER } from "../../../../utils/test-model-helpers/embedded.repeat.js";
import {
	REPEAT,
	createDocumentForRepeat,
	createNestedL6Entry
} from "../../../../utils/test-model-helpers/repeat.js";
import { createValidationMessage } from "../../../../utils/validation.js";

const { createDocumentPath } = DocumentHelpers;
const { createModelPath } = ModelHelpers;
const { createTestStore, createRepeatInstanceStateEntry, createRepeatStaticStateEntry } =
	SetupHelpers;

describe("api.back-end.store.middleware", () => {
	describe("closeEmbeddedRepeatRowMiddleware", () => {
		describe("handles Events.Repeat.closeEmbeddedRepeatRow", () => {
			const middlewareSpy = setupFixture(() => MiddlewareHelpers.createMiddlewareSpy());
			const models = setupModelsFixture("repeat", "embedded");
			const action = Events.Repeat.closeEmbeddedRepeatRow({
				repeatFormModelPath: ER.SortingAndFiltering.erRepeatPath
			});

			const expandedRowPath = createDocumentPath([REPEAT.rootGroup], [REPEAT.nestedL6, 2]);
			const repeatPropertiesEntryOptions: RepeatEntryOptions = {
				screenName: ER.SortingAndFiltering.screenSortingAndFiltering,
				repeatFormModelPath: ER.SortingAndFiltering.erRepeatPath,
				expandedRowPath
			};

			describe("if the closed row is a new row", () => {
				let expectedCommands: { [key: string]: Action<{}> };

				describe("if disableRepeatValidationOnLeaving is set to false", () => {
					before(() => {
						expectedCommands = createExpectedActions(true);
						middlewareSpy.spy.mock.resetCalls();
						setupStore({
							...repeatPropertiesEntryOptions,
							newRowPath: expandedRowPath,
							storeConfig: { models }
						}).dispatch(action);
					});

					it("dispatches Command.changeRepeatInstanceStateEntry with expandedRowPath undefined", () => {
						MiddlewareHelpers.assertAction(
							middlewareSpy.spy,
							expectedCommands.changeRepeatInstanceStateEntry
						);
					});

					it("dispatches Commands.changeScreenState with the new row as focused component", () => {
						MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommands.changeScreenState);
					});

					it("validates the visible fields of the closed row dispatches Commands.setMessageState with the validation messages", () => {
						MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommands.setMessageState);
					});

					it("dispatches only these action", () => {
						MiddlewareHelpers.assertNumberOfActions(
							middlewareSpy.spy,
							Object.keys(expectedCommands).map((key: string) => expectedCommands[key])
						);
					});
				});

				describe("if disableRepeatValidationOnLeaving is set to true", () => {
					before(() => {
						middlewareSpy.spy.mock.resetCalls();
					});
					it("does not dispatch Commands.setMessageState", () => {
						setupStore({
							...repeatPropertiesEntryOptions,
							newRowPath: expandedRowPath,
							storeConfig: { models },
							middlewareOptions: { disableRepeatValidationOnLeaving: true }
						}).dispatch(action);

						MiddlewareHelpers.assertNoAction(middlewareSpy.spy, expectedCommands.setMessageState);
					});
				});

				describe("if the new row is not on the current page", () => {
					before(() => {
						middlewareSpy.spy.mock.resetCalls();
					});
					it("dispatches Commands.changeRepeatInstanceStateEntry for the parent screen with an entry for the new row with the correct page", () => {
						// page size 2
						// 6 entries -> pageCount = 3
						// new row with L6_Number = 3 --> page should be 2
						const doc = createDocumentForRepeat({
							nestedL6: [
								createNestedL6Entry({ L6_Number: 1 }), // first page
								createNestedL6Entry({ L6_Number: 2 }), // first page
								createNestedL6Entry({ L6_Number: 3 }), // second page
								createNestedL6Entry({ L6_Number: 4 }), // second page
								createNestedL6Entry({ L6_Number: 5 }), // third page
								createNestedL6Entry({ L6_Number: 6 }), // third page
								createNestedL6Entry({ L6_Number: 3 }) // new row
							]
						});

						const newRowPath = createDocumentPath([REPEAT.rootGroup], [REPEAT.nestedL6, 7]);
						const orderPath = [
							...ER.SortingAndFiltering.erRepeatPath,
							...createModelPath("fieldbasedrepeatoverviewcolumn-a87d8")
						];
						setupStore({
							...repeatPropertiesEntryOptions,
							storeConfig: {
								data: { document: doc },
								models
							},
							newRowPath: newRowPath,
							sorting: "asc",
							orderPath,
							expandedRowPath: newRowPath
						}).dispatch(action);

						const expectedCommand = createChangeRepeatInstanceStateEntryCommand({
							...repeatPropertiesEntryOptions,
							orderPath,
							page: 2,
							newRowPath,
							newRowState: "recentlyAdded",
							expandedRowPath: undefined
						});
						MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
					});
				});
			});

			describe("if the closed row is no new row", () => {
				let expectedCommands: { [key: string]: Action<{}> };
				describe("if disableRepeatValidationOnLeaving is set to false", () => {
					before(() => {
						expectedCommands = createExpectedActions(false);
						middlewareSpy.spy.mock.resetCalls();
						setupStore({
							...repeatPropertiesEntryOptions,
							newRowPath: undefined,
							storeConfig: { models }
						}).dispatch(action);
					});

					it("dispatches Command.changeRepeatInstanceStateEntry with expandedRowPath undefined", () => {
						MiddlewareHelpers.assertAction(
							middlewareSpy.spy,
							expectedCommands.changeRepeatInstanceStateEntry
						);
					});

					it("dispatches Commands.changeScreenState with the closed row as focused component", () => {
						MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommands.changeScreenState);
					});

					it("validates the visible fields of the closed row dispatches Commands.setMessageState with the validation messages", () => {
						MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommands.setMessageState);
					});

					it("dispatches only these action", () => {
						MiddlewareHelpers.assertNumberOfActions(
							middlewareSpy.spy,
							Object.keys(expectedCommands).map((key: string) => expectedCommands[key])
						);
					});
				});

				describe("if disableRepeatValidationOnLeaving is set to true", () => {
					before(() => {
						middlewareSpy.spy.mock.resetCalls();
					});
					it("does not dispatch Commands.setMessageState", () => {
						setupStore({
							...repeatPropertiesEntryOptions,
							newRowPath: undefined,
							storeConfig: { models },
							middlewareOptions: { disableRepeatValidationOnLeaving: true }
						}).dispatch(action);

						MiddlewareHelpers.assertNoAction(middlewareSpy.spy, expectedCommands.setMessageState);
					});
				});
			});

			interface RepeatEntryOptions {
				readonly page?: number;
				readonly screenName: string;
				readonly repeatFormModelPath: ModelPath;
				readonly expandedRowPath?: EntityInstancePath;
				readonly newRowPath?: EntityInstancePath;
				readonly newRowState?: "recentlyAdded";
				readonly sorting?: "asc" | "desc";
				readonly orderPath?: ModelPath;
			}

			function setupStore(
				options: SetupHelpers.SetupParams & RepeatEntryOptions
			): Store<EngineState, AnyAction> {
				const repeatableEntries = [
					createNestedL6Entry({ L6_Number: 12 }),
					createNestedL6Entry({ L6_Number: 13 })
				];
				const data = createDocumentForRepeat({
					nestedL6: repeatableEntries
				});
				const disableRepeatValidationOnLeaving =
					options.middlewareOptions?.disableRepeatValidationOnLeaving;

				return createTestStore({
					storeConfig: {
						models: options.storeConfig.models,
						data: options.storeConfig.data || { document: data },
						ui: {
							screenLocation: [
								{
									path: [],
									locationPath: createModelPath(options.screenName),
									repeatInstanceState: {
										[ModelPath.toString(options.repeatFormModelPath)]:
											createInstanceRepeatEntry(options)
									}
								}
							],
							repeatStaticState: {
								[ModelPath.toString(options.repeatFormModelPath)]: createStaticRepeatEntry(options)
							}
						}
					},
					middlewares: [middlewareSpy.middleware],
					middlewareOptions: {
						disableRepeatValidationOnLeaving:
							disableRepeatValidationOnLeaving !== undefined
								? disableRepeatValidationOnLeaving
								: false
					}
				});
			}

			function createStaticRepeatEntry(
				options: RepeatEntryOptions
			): EngineStore.Repeat.StaticState {
				return createRepeatStaticStateEntry({
					sortingState: options.orderPath ? { orderPath: options.orderPath } : undefined
				});
			}

			function createInstanceRepeatEntry(
				options: RepeatEntryOptions
			): EngineStore.Repeat.InstanceState {
				return createRepeatInstanceStateEntry({
					page: options && options.page,
					newRow: options?.newRowPath
						? {
								rowPath: options.newRowPath,
								rowState: "workingOn"
							}
						: undefined,
					expandedRowPath: options.expandedRowPath
				});
			}

			function createChangeRepeatInstanceStateEntryCommand(options: RepeatEntryOptions) {
				const repeatEntry = createInstanceRepeatEntry(options);

				return Commands.changeRepeatInstanceStateEntry({
					locationPath: createModelPath(options.screenName),
					repeatFormModelPath: options.repeatFormModelPath,
					entry: {
						...repeatEntry,
						newRow: options.newRowPath
							? {
									rowPath: options.newRowPath,
									rowState: options.newRowState || "recentlyAdded"
								}
							: undefined
					}
				});
			}

			function createExpectedActions(newRow?: boolean): { [key: string]: Action<{}> } {
				const errorField = [
					...expandedRowPath,
					...createDocumentPath([REPEAT.nestedGroup], [REPEAT.L6_Number])
				];

				return {
					changeRepeatInstanceStateEntry: createChangeRepeatInstanceStateEntryCommand({
						...repeatPropertiesEntryOptions,
						expandedRowPath: undefined,
						newRowPath: newRow ? expandedRowPath : undefined
					}),
					changeScreenState: Commands.changeScreenState({
						index: 0,
						focusedComponent: {
							formModelPath: action.payload.repeatFormModelPath,
							index: 1
						}
					}),
					setMessageState: Commands.setMessageState({
						messages: {
							[DocumentPath.toString(errorField)]: {
								validationMessages: [
									createValidationMessage({
										path: errorField,
										errorCode: "Error rule_4b82f",
										errorKey: "/Root/Nested_L6/nestedGroup/L6_Rule",
										errorText: [
											{
												key: "documentModel.ruleErrorMessage.repeat-document.Root.Nested_L6.nestedGroup.L6_Rule",
												args: {
													"L6_Number.value": {
														properties: {
															formattingConfig: {
																leadingZerosAllowed: false,
																minFractionalDigits: 0,
																modelPath: [
																	{
																		elementName: "Root"
																	},
																	{
																		elementName: "Nested_L6"
																	},
																	{
																		elementName: "nestedGroup"
																	},
																	{
																		elementName: "L6_Number"
																	}
																],
																modelId: "repeat-document",
																type: "NumberType"
															}
														},
														type: "formattable",
														value: 13
													}
												},
												defaults: { en: "$L6_Number.value$ < 42", de: "$L6_Number.value$ < 42" }
											}
										],
										referencedFields: [errorField]
									})
								]
							}
						}
					})
				};
			}
		});
	});
});
