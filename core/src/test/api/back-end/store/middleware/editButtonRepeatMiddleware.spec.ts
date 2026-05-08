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

import { deepStrictEqual } from "node:assert/strict";

import type { AnyAction, Store } from "redux";
import type { Action } from "typescript-fsa";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { EngineState, EngineStore } from "../../../../../back-end/store/index.js";
import { Commands, Events } from "../../../../../back-end/store/index.js";
import type { Models } from "../../../../../back-end/store/internal/store.js";
import { MiddlewareHelpers } from "../../../../utils/back-end-helpers.js";
import { DocumentHelpers } from "../../../../utils/document-helpers.js";
import { ModelHelpers } from "../../../../utils/model-helpers.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../../../utils/setupFixture.js";
import { DR } from "../../../../utils/test-model-helpers/detached.repeat.js";
import { ER } from "../../../../utils/test-model-helpers/embedded.repeat.js";
import {
	REPEAT,
	createDocumentForRepeat,
	createNestedL1Entry,
	createNestedL6Entry
} from "../../../../utils/test-model-helpers/repeat.js";

const { createDocumentPath } = DocumentHelpers;
const { createModelPath } = ModelHelpers;
const { createTestStore } = SetupHelpers;

describe("api.back-end.store.middleware", () => {
	describe("editButtonRepeatMiddleware", () => {
		describe("handles Events.Repeat.enterRow", () => {
			const middlewareSpy = setupFixture(() => MiddlewareHelpers.createMiddlewareSpy());

			const repeatableEntries = [createNestedL6Entry({ L6_Number: 12 })];
			const documentBefore = createDocumentForRepeat({
				nestedL6: repeatableEntries
			});

			describe("if the payload contains a form-model path to a detached repeat", () => {
				const models = setupModelsFixture("repeat", "detached");
				before(() => {
					middlewareSpy.spy.mock.resetCalls();
					setupStore({ ...repeatPropertiesEntryOptions, models }).dispatch(action);
				});

				after(() => {
					middlewareSpy.spy.mock.resetCalls();
				});

				const action = Events.Repeat.enterRow({
					repeatFormModelPath: DR.SortingAndFiltering.repeatFormModelPathSec3,
					rowPath: createDocumentPath([REPEAT.rootGroup], [REPEAT.nestedL6, 1])
				});

				const repeatPropertiesEntryOptions: RepeatEntryOptions = {
					screenName: DR.SortingAndFiltering.screenName,
					repeatFormModelPath: DR.SortingAndFiltering.repeatFormModelPathSec3
				};

				const expectedCommands: { [key: string]: Action<{}> } = {
					changeRepeatInstanceStateEntry: createChangeRepeatInstanceStateEntryCommand({
						...repeatPropertiesEntryOptions
					}),
					changeScreenStateCurrentScreen: Commands.changeScreenState({
						index: 0,
						focusedComponent: {
							formModelPath: DR.SortingAndFiltering.repeatFormModelPathSec3,
							subElement: "repeat-edit",
							index: 0
						}
					}),
					pushBackup: Commands.pushBackup({ messages: {}, document: documentBefore }),
					changeScreenState: Commands.changeScreenState({
						index: 1,
						focusedComponent: { formModelPath: [], subElement: "current-screen" }
					}),
					pushScreen: Commands.pushScreen({
						locationPath: DR.SortingAndFiltering.drRepeatDetailScreen,
						path: createDocumentPath([REPEAT.rootGroup], [REPEAT.nestedL6, 1])
					})
				};

				it("dispatches Command.pushBackup with current document and messages", () => {
					MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommands.pushBackup);
				});

				it("dispatches Command.changeRepeatInstanceStateEntry with newRow undefined", () => {
					MiddlewareHelpers.assertAction(
						middlewareSpy.spy,
						expectedCommands.changeRepeatInstanceStateEntry
					);
				});

				it(
					"dispatches Command.pushScreen with the document path of the row to edit " +
						"and a location path referencing the detail-screen",
					() => {
						MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommands.pushScreen);
					}
				);

				it("dispatches Command.changeScreenState for the current screen with focused component set to the edit button", () => {
					MiddlewareHelpers.assertAction(
						middlewareSpy.spy,
						expectedCommands.changeScreenStateCurrentScreen
					);
				});

				it("dispatches Command.changeScreenState with focused component set to 'current-screen'", () => {
					const actualActions = middlewareSpy.spy.mock.calls.map(c => c.arguments[0]);
					const actualAction = actualActions.find(
						a => a.type === expectedCommands.changeScreenState.type && a.payload.index === 1
					);
					deepStrictEqual(actualAction, expectedCommands.changeScreenState);
				});

				it("dispatches only these action", () => {
					MiddlewareHelpers.assertNumberOfActions(
						middlewareSpy.spy,
						Object.keys(expectedCommands).map((key: string) => expectedCommands[key])
					);
				});

				describe("and a row in an embedded repeat is expanded", () => {
					it("dispatches Command.changeRepeatInstanceStateEntry for this repeat with expandedRowPath undefined", () => {
						middlewareSpy.spy.mock.resetCalls();

						const screenLocation: EngineStore.ScreenState = {
							path: [],
							locationPath: createModelPath(DR.SortingAndFiltering.screenName),
							repeatInstanceState: {
								[ModelPath.toString(DR.SortingAndFiltering.embeddedRepeatFormModelPath)]: {
									expandedRowPath: DocumentHelpers.createDocumentPath(["Root"], ["Nested_L1", 2]),
									page: 5
								}
							}
						};

						const store = createTestStore({
							storeConfig: {
								models,
								data: {
									document: {
										...documentBefore,
										Nested_L1: [createNestedL1Entry({}), createNestedL1Entry({})]
									}
								},
								ui: { screenLocation: [screenLocation] }
							},
							middlewares: [middlewareSpy.middleware]
						});

						store.dispatch(action);

						const expectedAction = Commands.changeRepeatInstanceStateEntry({
							locationPath: screenLocation.locationPath,
							repeatFormModelPath: DR.SortingAndFiltering.embeddedRepeatFormModelPath,
							entry: {
								expandedRowPath: undefined,
								page: 5
							}
						});

						const actualActions = middlewareSpy.spy.mock.calls.map(c => c.arguments[0]);
						const actualAction = actualActions.find(
							a =>
								a.payload.repeatFormModelPath &&
								ModelPath.equal(
									a.payload.repeatFormModelPath,
									DR.SortingAndFiltering.embeddedRepeatFormModelPath
								)
						);

						deepStrictEqual(actualAction, expectedAction);
					});
				});

				describe("and the trigger element was an edit button", () => {
					it("dispatches Commands.changeScreenState with the edit button of the repeat as focused component and the index of the touched row", () => {
						middlewareSpy.spy.mock.resetCalls();
						const store = setupStore({ ...repeatPropertiesEntryOptions, models });
						const enterRowAction = Events.Repeat.enterRow({
							repeatFormModelPath: DR.SortingAndFiltering.repeatFormModelPathSec3,
							rowPath: createDocumentPath([REPEAT.rootGroup], [REPEAT.nestedL6, 1]),
							triggerElement: "edit-button"
						});
						store.dispatch(enterRowAction);

						const expectedCommand = Commands.changeScreenState({
							index: 0,
							focusedComponent: {
								formModelPath: DR.SortingAndFiltering.repeatFormModelPathSec3,
								subElement: "repeat-edit",
								index: 0
							}
						});
						MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
					});
				});
			});

			describe("if the payload contains a form-model path to an embedded repeat", () => {
				const models = setupModelsFixture("repeat", "embedded");
				before(() => {
					middlewareSpy.spy.mock.resetCalls();
					setupStore({ ...repeatPropertiesEntryOptions, models }).dispatch(action);
				});

				const action = Events.Repeat.enterRow({
					repeatFormModelPath: ER.SortingAndFiltering.erRepeatPath,
					rowPath: createDocumentPath([REPEAT.rootGroup], [REPEAT.nestedL6, 1])
				});

				const repeatPropertiesEntryOptions: RepeatEntryOptions = {
					screenName: ER.SortingAndFiltering.screenSortingAndFiltering,
					repeatFormModelPath: ER.SortingAndFiltering.erRepeatPath,
					expandedRowPath: createDocumentPath([REPEAT.rootGroup], [REPEAT.nestedL6, 1]),
					tableInteractionDocument: documentBefore
				};

				const expectedCommands: { [key: string]: Action<{}> } = {
					changeRepeatInstanceStateEntry: createChangeRepeatInstanceStateEntryCommand(
						repeatPropertiesEntryOptions
					),
					changeScreenState: Commands.changeScreenState({
						index: 0,
						focusedComponent: {
							formModelPath: action.payload.repeatFormModelPath,
							index: 0,
							subElement: "expanded-row"
						}
					})
				};

				it("dispatches Command.changeRepeatInstanceStateEntry with newRow undefined and tableInteractionDocument", () => {
					MiddlewareHelpers.assertAction(
						middlewareSpy.spy,
						expectedCommands.changeRepeatInstanceStateEntry
					);
				});

				it("dispatches Command.changeScreenState with focused component set to the control-grid inside the expanded row", () => {
					MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommands.changeScreenState);
				});

				it("dispatches only these action", () => {
					MiddlewareHelpers.assertNumberOfActions(
						middlewareSpy.spy,
						Object.keys(expectedCommands).map((key: string) => expectedCommands[key])
					);
				});
			});

			interface RepeatEntryOptions extends Omit<EngineStore.Repeat.InstanceState, "newRow"> {
				rowIndex?: number;
				screenName: string;
				repeatFormModelPath: ModelPath;
			}

			interface StoreOptions {
				dirty?: boolean;
				document?: GroupInstance;
				data?: {};
				messages?: {};
				models: Models;
			}

			function setupStore(
				options: StoreOptions & RepeatEntryOptions
			): Store<EngineState, AnyAction> {
				const dirty = options.dirty !== undefined;
				const data = options.data;
				return createTestStore({
					storeConfig: {
						models: options.models,
						data: { dirty: dirty, document: data || documentBefore },
						ui: {
							screenLocation: [createRootScreenState(options)]
						}
					},
					middlewares: [middlewareSpy.middleware]
				});
			}

			function createRepeatEntry(options?: RepeatEntryOptions): EngineStore.Repeat.InstanceState {
				return {
					page: options?.page ?? 1,
					newRow: {
						rowPath: createDocumentPath(
							[REPEAT.rootGroup],
							[REPEAT.nestedL6, options?.rowIndex ?? 1]
						),
						rowState: "workingOn"
					},
					expandedRowPath: options?.expandedRowPath,
					tableInteractionDocument: options?.tableInteractionDocument
				};
			}

			function createRootScreenState(options: RepeatEntryOptions): EngineStore.ScreenState {
				return {
					path: [],
					locationPath: createModelPath(options.screenName),
					repeatInstanceState: {
						[ModelPath.toString(options.repeatFormModelPath)]: createRepeatEntry(options)
					}
				};
			}

			function createChangeRepeatInstanceStateEntryCommand(options: RepeatEntryOptions) {
				const repeatEntry = createRepeatEntry(options);

				return Commands.changeRepeatInstanceStateEntry({
					locationPath: createModelPath(options.screenName),
					repeatFormModelPath: options.repeatFormModelPath,
					entry: {
						...repeatEntry,
						newRow: undefined
					}
				});
			}
		});
	});
});
