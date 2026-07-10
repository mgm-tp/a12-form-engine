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

import { deepStrictEqual } from "node:assert/strict";

import type { Action as ReduxAction, Store } from "redux";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type { Action } from "@com.mgmtp.a12.client/typescript-fsa-redux-5-compat";
import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import type { EngineState } from "../../../../../back-end/store/index.js";
import { Commands, Events } from "../../../../../back-end/store/index.js";
import type { EngineStore, Models } from "../../../../../back-end/store/internal/store.js";
import { createDocumentPath } from "../../../../utils/createDocumentPath.js";
import { createModelPath } from "../../../../utils/createModelPath.js";
import { MiddlewareHelpers } from "../../../../utils/MiddlewareHelpers.js";
import { createTestStore, loadData } from "../../../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../../../utils/setupFixture.js";
import { DOCUMENT_MODEL, FORM_MODEL } from "../../../../utils/test-model-helpers/repeat.add.js";
import { createValidationEntry } from "../../../../utils/validation.js";

describe("api.back-end.store.middleware", () => {
	describe("addButtonRepeatMiddleware", () => {
		describe("handles Events.Repeat.addRow", () => {
			const middlewareSpy = setupFixture(() => MiddlewareHelpers.createMiddlewareSpy());
			const models = setupModelsFixture("repeat.add");
			const dataFixture = setupFixture(() => ({
				data: loadData("repeat.add", "data", models.documentModel)
			}));

			describe("if the payload contains a form-model path to an inline repeat", () => {
				executeTestForDataNotDirty({
					repeatType: "inline",
					screenName: "InlineRepeat",
					repeatFormModelPath: FORM_MODEL.IR.withPageSize
				});
				executeTestForDataDirty({
					screenName: "InlineRepeat",
					repeatFormModelPath: FORM_MODEL.IR.withPageSize
				});
				executeTestForInitialValuesAndComputation({
					screenName: "InlineRepeat",
					repeatFormModelPath: FORM_MODEL.IR.withInitialValues
				});
				executeTestForPageSize({
					repeatType: "inline",
					screenName: "InlineRepeat",
					repeatFormModelPath: FORM_MODEL.IR.withPageSize
				});
				executeTestForValidationError({
					screenName: "InlineRepeat",
					repeatFormModelPath: FORM_MODEL.IR.withInitialValuesAndError
				});
			});

			describe("if the payload contains a form-model path to an detached repeat", () => {
				executeTestForDataNotDirty({
					repeatType: "detached",
					screenName: "DetachedRepeat",
					repeatFormModelPath: FORM_MODEL.DR.withPageSize
				});

				executeTestForDataDirty({
					screenName: "DetachedRepeat",
					repeatFormModelPath: FORM_MODEL.DR.withPageSize
				});
				executeTestForInitialValuesAndComputation({
					screenName: "DetachedRepeat",
					repeatFormModelPath: FORM_MODEL.DR.withInitialValues
				});
				executeTestForPageSize({
					repeatType: "detached",
					screenName: "DetachedRepeat",
					repeatFormModelPath: FORM_MODEL.DR.withPageSize
				});

				describe("if a row in an embedded repeat is expanded", () => {
					it("dispatches Commands.changeRepeatInstanceStateEntry for this repeat with expandedRowPath undefined", () => {
						middlewareSpy.spy.mock.resetCalls();

						const action = Events.Repeat.addRow({
							repeatFormModelPath: FORM_MODEL.DR.withPageSize,
							path: DOCUMENT_MODEL.repPageSize
						});

						const screenLocation: EngineStore.ScreenState = {
							path: [],
							locationPath: createModelPath("DetachedRepeat"),
							repeatInstanceState: {
								[ModelPath.toString(createModelPath("DetachedRepeat", "embedded-repeat"))]: {
									expandedRowPath: createDocumentPath(["repPageSize", 1]),
									page: 1
								}
							}
						};

						const store = createTestStore({
							storeConfig: {
								models,
								ui: { screenLocation: [screenLocation] }
							},
							middlewares: [middlewareSpy.middleware]
						});

						store.dispatch(action);

						const expectedAction = Commands.changeRepeatInstanceStateEntry({
							locationPath: screenLocation.locationPath,
							repeatFormModelPath: createModelPath("DetachedRepeat", "embedded-repeat"),
							entry: {
								expandedRowPath: undefined,
								page: 1
							}
						});

						const actualActions = middlewareSpy.spy.mock.calls.map(c => c.arguments[0]);
						const actualAction = actualActions.find(
							a =>
								Commands.changeRepeatInstanceStateEntry.match(a) &&
								ModelPath.equal(
									a.payload.repeatFormModelPath,
									createModelPath("DetachedRepeat", "embedded-repeat")
								)
						);

						deepStrictEqual(actualAction, expectedAction);
					});
				});

				describe("if the detached repeat contains a nested inline repeat with numberOfInitialRows defined for the group", () => {
					it("dispatches Commands.setDocument with the initial rows for the nested repeat", () => {
						const modelPath = FORM_MODEL.DR.withNestedRepeats;
						const store = setupStore({
							models,
							screenLocation: [{ locationPath: createModelPath("DetachedRepeat"), path: [] }],
							data: {}
						});

						middlewareSpy.spy.mock.resetCalls();

						const addAction = Events.Repeat.addRow({
							repeatFormModelPath: modelPath,
							path: DOCUMENT_MODEL.rep
						});

						store.dispatch(addAction);

						const expectedAction = Commands.setDocument({
							document: {
								rep: [
									{
										nestedRepInitialRows: [
											{
												stringField: "Test",
												numberField: 12,
												computedField: 22
											},
											{
												stringField: "Test",
												numberField: 12,
												computedField: 22
											}
										]
									}
								]
							},
							changes: [
								{ type: "GroupAdded", path: DOCUMENT_MODEL.rep },
								{
									type: "ValueChanged",
									path: createDocumentPath(["rep"], ["nestedRepInitialRows"], ["computedField"])
								},
								{
									type: "ValueChanged",
									path: createDocumentPath(["rep"], ["nestedRepInitialRows", 2], ["computedField"])
								}
							]
						});

						MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedAction);
					});
				});
			});

			describe("if the payload contains a form-model path to an embedded repeat", () => {
				executeTestForDataNotDirty({
					repeatType: "embedded",
					screenName: "EmbeddedRepeat",
					repeatFormModelPath: FORM_MODEL.ER.withPageSize
				});

				executeTestForDataDirty({
					screenName: "EmbeddedRepeat",
					repeatFormModelPath: FORM_MODEL.ER.withPageSize
				});
				executeTestForInitialValuesAndComputation({
					screenName: "EmbeddedRepeat",
					repeatFormModelPath: FORM_MODEL.ER.withInitialValues
				});
				executeTestForPageSize({
					repeatType: "embedded",
					screenName: "EmbeddedRepeat",
					repeatFormModelPath: FORM_MODEL.ER.withPageSize
				});
			});

			describe("if the payload contains a form-model path to a nested inline repeat", () => {
				before(() => {
					middlewareSpy.spy.mock.resetCalls();
				});
				it("dispatches a Commands.changeScreenState action with dirty === true in the payload", () => {
					const store = createTestStore({
						storeConfig: {
							models,
							data: { document: {} },
							ui: {
								screenLocation: [
									{ locationPath: [], path: [] },
									{
										locationPath: FORM_MODEL.DR.irInNestedDetachedRepeat,
										path: createDocumentPath(["rep"])
									}
								]
							}
						},
						middlewares: [middlewareSpy.middleware]
					});

					const addEvent = Events.Repeat.addRow({
						path: createDocumentPath(["rep"], ["nestedRepInitialRows", 0]),
						repeatFormModelPath: FORM_MODEL.DR.irInNestedDetachedRepeat
					});

					store.dispatch(addEvent);
					const changeScreenState = Commands.changeScreenState({
						index: 1,
						dirty: true
					});

					MiddlewareHelpers.assertAction(middlewareSpy.spy, changeScreenState);
				});
			});

			describe("if the payload contains a form-model path to a nested detached repeat", () => {
				before(() => {
					middlewareSpy.spy.mock.resetCalls();
				});
				it("dispatches only Commands.changeScreenState actions with dirty === undefined in the payload", () => {
					const store = createTestStore({
						storeConfig: {
							models,
							data: { document: {} },
							ui: {
								screenLocation: [
									{ locationPath: [], path: [] },
									{
										locationPath: FORM_MODEL.DR.drInNestedDetachedRepeat,
										path: createDocumentPath(["rep"])
									}
								]
							}
						},
						middlewares: [middlewareSpy.middleware]
					});

					const addEvent = Events.Repeat.addRow({
						path: createDocumentPath(["rep"], ["nestedRep", 0]),
						repeatFormModelPath: FORM_MODEL.DR.drInNestedDetachedRepeat
					});

					store.dispatch(addEvent);
					const changeScreenState = Commands.changeScreenState({
						index: 1,
						dirty: true
					});

					const actualActions = middlewareSpy.spy.mock.calls
						.map(c => c.arguments[0])
						.filter(action => action.type === changeScreenState.type)
						.map(action => action as Action<Commands.ChangeScreenStatePayload>);

					for (const action of actualActions) {
						deepStrictEqual(action.payload.dirty, undefined);
					}
				});
			});

			describe("if the payload contains a form-model path to a nested embedded repeat", () => {
				before(() => {
					middlewareSpy.spy.mock.resetCalls();
				});
				it("dispatches a Commands.changeScreenState action with dirty === true in the payload", () => {
					const store = createTestStore({
						storeConfig: {
							models,
							data: { document: {} },
							ui: {
								screenLocation: [
									{ locationPath: [], path: [] },
									{
										locationPath: FORM_MODEL.DR.erInNestedDetachedRepeat,
										path: createDocumentPath(["rep"])
									}
								]
							}
						},
						middlewares: [middlewareSpy.middleware]
					});

					const addEvent = Events.Repeat.addRow({
						path: createDocumentPath(["rep"], ["nestedRep", 0]),
						repeatFormModelPath: FORM_MODEL.DR.erInNestedDetachedRepeat
					});

					store.dispatch(addEvent);
					const changeScreenState = Commands.changeScreenState({
						index: 1,
						dirty: true
					});

					MiddlewareHelpers.assertAction(middlewareSpy.spy, changeScreenState);
				});
			});

			function executeTestForDataNotDirty(options: {
				repeatType: "detached" | "inline" | "embedded";
				screenName: string;
				repeatFormModelPath: ModelPath;
			}): void {
				const fixture = setupFixture(() => {
					const action = Events.Repeat.addRow({
						repeatFormModelPath: options.repeatFormModelPath,
						path: DOCUMENT_MODEL.repPageSize
					});

					const screenLocation = [{ locationPath: createModelPath(options.screenName), path: [] }];

					return {
						action,
						screenLocation
					};
				});

				describe("and if the data is not dirty", () => {
					before(() => {
						middlewareSpy.spy.mock.resetCalls();

						setupStore({
							models,
							data: dataFixture.data,
							screenLocation: fixture.screenLocation
						}).dispatch(fixture.action);
					});

					it("adds a row to the document and dispatches Commands.setDocument with the new document", () => {
						const expectedCommand = Commands.setDocument({
							document: {
								...dataFixture.data,
								repPageSize: [...(dataFixture.data as any).repPageSize, {}]
							},
							changes: [
								{
									type: "GroupAdded",
									path: DOCUMENT_MODEL.repPageSize
								}
							]
						});
						MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
					});

					it("dispatches Commands.changeRepeatInstanceStateEntry with a newRow entry and an expanded row path", () => {
						const expectedNewDocument = {
							...dataFixture.data,
							repPageSize: [...(dataFixture.data as any).repPageSize, {}]
						};

						const expectedCommand = Commands.changeRepeatInstanceStateEntry({
							locationPath: fixture.screenLocation[0].locationPath,
							repeatFormModelPath: options.repeatFormModelPath,
							entry: {
								page: 3,
								newRow: {
									rowPath: createDocumentPath(["repPageSize", 5]),
									rowState: "workingOn"
								},
								...((options.repeatType === "embedded"
									? {
											expandedRowPath: createDocumentPath(["repPageSize", 5]),
											tableInteractionDocument: expectedNewDocument
										}
									: {}) satisfies EngineStore.Repeat.InstanceState)
							}
						});
						MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
					});

					if (options.repeatType === "inline") {
						it("dispatches Commands.setDataDirty with dirty=true", () => {
							MiddlewareHelpers.assertAction(middlewareSpy.spy, Commands.setDataDirty(true));
						});

						it("dispatches Commands.changeScreenState with the path to the new row as focused component", () => {
							const expectedCommand = Commands.changeScreenState({
								index: 0,
								focusedComponent: {
									formModelPath: options.repeatFormModelPath,
									index: 4
								}
							});
							MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
						});
					} else if (options.repeatType === "detached") {
						it("does not dispatch Commands.setDataDirty", () => {
							MiddlewareHelpers.assertNoAction(middlewareSpy.spy, Commands.setDataDirty(true));
						});

						it("dispatches Commands.changeScreenState for the current screen with focused component set to 'add-button'", () => {
							const expectedCommand = Commands.changeScreenState({
								index: 0,
								focusedComponent: {
									formModelPath: createModelPath("DetachedRepeat", "detached-repeat-repPageSize"),
									subElement: "repeat-add"
								}
							});
							MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
						});

						it("dispatches Commands.changeScreenState for the new screen with focused component set to 'current-screen'", () => {
							const expectedCommand = Commands.changeScreenState({
								index: 1,
								focusedComponent: { formModelPath: [], subElement: "current-screen" }
							});
							const actualActions = middlewareSpy.spy.mock.calls.map(c => c.arguments[0]);
							const actualAction = actualActions.find(
								a => Commands.changeScreenState.match(a) && a.payload.index === 1
							);
							deepStrictEqual(actualAction, expectedCommand);
						});

						it(
							"dispatches Commands.pushScreen with the document path of the new row " +
								"and a location path referencing the detail-screen",
							() => {
								const expectedCommand = Commands.pushScreen({
									locationPath: createModelPath(
										"DetachedRepeat",
										"detached-repeat-repPageSize",
										"detached-repeat-repPageSize-detail-screen"
									),
									path: createDocumentPath(["repPageSize", 5])
								});
								MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
							}
						);
					} else {
						it("dispatches Commands.setDataDirty with dirty=true", () => {
							MiddlewareHelpers.assertAction(middlewareSpy.spy, Commands.setDataDirty(true));
						});

						it("dispatches Commands.changeScreenState with the new row as focused component", () => {
							const expectedCommand = Commands.changeScreenState({
								index: 0,
								focusedComponent: {
									formModelPath: options.repeatFormModelPath,
									index: 4,
									subElement: "expanded-row"
								}
							});

							MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
						});
					}
				});
			}

			function executeTestForDataDirty(options: {
				screenName: string;
				repeatFormModelPath: ModelPath;
			}): void {
				const fixture = setupFixture(() => {
					const action = Events.Repeat.addRow({
						repeatFormModelPath: options.repeatFormModelPath,
						path: DOCUMENT_MODEL.repPageSize
					});

					const screenLocation = [{ locationPath: createModelPath(options.screenName), path: [] }];

					return { screenLocation, action };
				});

				describe("and if the data is dirty", () => {
					before(() => {
						middlewareSpy.spy.mock.resetCalls();

						setupStore({
							models,
							screenLocation: fixture.screenLocation,
							dirty: true
						}).dispatch(fixture.action);
					});

					it("adds a row to the document and dispatches Commands.setDocument with the new document", () => {
						const expectedCommand = Commands.setDocument({
							document: { repPageSize: [{}] },
							changes: [
								{
									type: "GroupAdded",
									path: DOCUMENT_MODEL.repPageSize
								}
							]
						});
						MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
					});

					it("does not dispatch Commands.setDataDirty", () => {
						MiddlewareHelpers.assertNoAction(middlewareSpy.spy, Commands.setDataDirty(true));
					});
				});
			}

			function executeTestForInitialValuesAndComputation(options: {
				screenName: string;
				repeatFormModelPath: ModelPath;
			}): void {
				const fixture = setupFixture(() => {
					const action = Events.Repeat.addRow({
						repeatFormModelPath: options.repeatFormModelPath,
						path: DOCUMENT_MODEL.repInitialValues
					});

					const screenLocation = [{ locationPath: createModelPath(options.screenName), path: [] }];

					return { screenLocation, action };
				});
				describe("if there a initial values and computations given", () => {
					before(() => {
						middlewareSpy.spy.mock.resetCalls();

						setupStore({
							models,
							screenLocation: fixture.screenLocation
						}).dispatch(fixture.action);
					});

					it("dispatches setDocument where the initial and computed values are set", () => {
						const expectedCommand = Commands.setDocument({
							document: {
								repInitialValues: [
									{
										stringField: "Test",
										numberField: 42,
										enumerationField: "key_1",
										computedField: 52
									}
								]
							},
							changes: [
								{
									type: "GroupAdded",
									path: DOCUMENT_MODEL.repInitialValues
								},
								{
									type: "ValueChanged",
									path: createDocumentPath(["repInitialValues"], ["computedField"])
								}
							]
						});
						MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
					});
				});
			}

			function executeTestForPageSize(options: {
				repeatType: "embedded" | "inline" | "detached";
				screenName: string;
				repeatFormModelPath: ModelPath;
			}): void {
				const fixture = setupFixture(() => {
					const action = Events.Repeat.addRow({
						repeatFormModelPath: options.repeatFormModelPath,
						path: DOCUMENT_MODEL.repPageSize
					});
					const screenLocation = [
						{
							locationPath: createModelPath(options.screenName),
							path: []
						}
					];

					return { screenLocation, action };
				});
				describe("if a page size is given for the referenced repeat", () => {
					before(() => {
						middlewareSpy.spy.mock.resetCalls();
					});

					it("dispatches Commands.changeRepeatInstanceStateEntry with an updated page entry", () => {
						const expectedNewDocument = {
							...dataFixture.data,
							repPageSize: [...(dataFixture.data as any).repPageSize, {}]
						};

						setupStore({
							models,
							data: dataFixture.data,
							screenLocation: fixture.screenLocation
						}).dispatch(fixture.action);
						const expectedCommand = Commands.changeRepeatInstanceStateEntry({
							locationPath: fixture.screenLocation[0].locationPath,
							repeatFormModelPath: options.repeatFormModelPath,
							entry: {
								page: 3,
								newRow: {
									rowPath: createDocumentPath(["repPageSize", 5]),
									rowState: "workingOn"
								},
								...(options.repeatType === "embedded"
									? ({
											expandedRowPath: createDocumentPath(["repPageSize", 5]),
											tableInteractionDocument: expectedNewDocument
										} satisfies EngineStore.Repeat.InstanceState)
									: {})
							}
						});

						MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
					});
				});
			}

			function executeTestForValidationError(options: {
				screenName: string;
				repeatFormModelPath: ModelPath;
			}): void {
				const fixture = setupFixture(() => {
					const action = Events.Repeat.addRow({
						repeatFormModelPath: options.repeatFormModelPath,
						path: DOCUMENT_MODEL.repInitialValuesAndError
					});

					const screenLocation = [{ locationPath: createModelPath(options.screenName), path: [] }];

					return {
						screenLocation,
						action
					};
				});
				describe("if there is a validation error after adding a row", () => {
					before(() => {
						middlewareSpy.spy.mock.resetCalls();

						setupStore({
							models,
							screenLocation: fixture.screenLocation
						}).dispatch(fixture.action);
					});

					it("adds a row to the document and dispatches Commands.setDocument with the new document", () => {
						const expectedCommand = Commands.setDocument({
							document: {
								repInitialValuesAndError: [
									{
										stringField: "Test",
										numberField: 12,
										booleanField: true,
										enumerationField: "key_1",
										computedField: 22
									}
								]
							},
							changes: [
								{
									type: "GroupAdded",
									path: DOCUMENT_MODEL.repInitialValuesAndError
								},
								{
									type: "ValueChanged",
									path: createDocumentPath(["repInitialValuesAndError"], ["computedField"])
								}
							]
						});
						MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
					});

					it("dispatches Commands.setMessageState with the validation message", () => {
						const validationEntry = createValidationEntry({
							path: createDocumentPath(["repInitialValuesAndError"], ["computedField"]),
							errorText: [
								{
									key: "documentModel.ruleErrorMessage.repeat\\padd-document.repInitialValuesAndError.NewRule_1",
									args: {},
									defaults: { en: "Field should be bigger or equal to 42." }
								}
							],
							errorCode: "Error rule_ddf82",
							errorKey: "/repInitialValuesAndError/NewRule_1"
						});
						const expectedCommand = Commands.setMessageState({
							messages: validationEntry
						});
						MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
					});
				});
			}

			interface StoreOptions {
				dirty?: boolean;
				document?: GroupInstance;
				data?: {};
				messages?: {};
				models: Models;
				screenLocation: EngineStore.ScreenState[];
			}

			function setupStore(options: StoreOptions): Store<EngineState, ReduxAction> {
				const dirty = options.dirty !== undefined;
				const data = options.data;
				return createTestStore({
					storeConfig: {
						models: options.models,
						data: { dirty: dirty, document: data },
						ui: {
							screenLocation: options.screenLocation,
							messages: options.messages
						}
					},
					middlewares: [middlewareSpy.middleware]
				});
			}
		});
	});
});
