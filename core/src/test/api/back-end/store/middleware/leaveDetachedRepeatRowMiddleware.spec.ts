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

import { Commands, Events } from "../../../../../back-end/store/index.js";
import { Middlewares } from "../../../../../back-end/store/internal/middleware/index.js";
import type { EngineState, EngineStore } from "../../../../../back-end/store/internal/store.js";
import type { ReadonlyObjectMap } from "../../../../../models/index.js";
import { MiddlewareHelpers } from "../../../../utils/back-end-helpers.js";
import { DocumentHelpers } from "../../../../utils/document-helpers.js";
import { ModelHelpers } from "../../../../utils/model-helpers.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../../../utils/setupFixture.js";
import {
	DR,
	createDocumentForDetachedRepeat
} from "../../../../utils/test-model-helpers/detached.repeat.js";
import { REPEAT } from "../../../../utils/test-model-helpers/repeat.js";
import {
	createValidationEntry,
	createValidationEntryWithParsingError
} from "../../../../utils/validation.js";

const { createDocumentPath } = DocumentHelpers;
const { createModelPath } = ModelHelpers;
const { createTestStore, createRepeatInstanceStateEntry, createRepeatStaticStateEntry } =
	SetupHelpers;

describe("api.back-end.store.middleware", () => {
	describe("leaveDetachedRepeatRowMiddlewareFactory", () => {
		describe("handles Events.Repeat.leaveDetachedRepeatRow", () => {
			executeTest({
				form: "detached",
				detailScreenStateLocationPath: DR.SortingAndFiltering.dr_locationPath,
				repeatFormModelPath: DR.SortingAndFiltering.repeatFormModelPath,
				actionExecutor: (payload: { cancel: boolean }) =>
					Events.Repeat.leaveDetachedRepeatRow(payload)
			});
		});

		function executeTest(configuration: {
			form: string;
			detailScreenStateLocationPath: ModelPath;
			repeatFormModelPath: ModelPath;
			actionExecutor(payload: {
				cancel: boolean;
			}): Action<Events.Repeat.LeaveDetachedRepeatRowPayload>;
		}) {
			const middlewareSpy = setupFixture(() => MiddlewareHelpers.createMiddlewareSpy());

			// stub validate part middleware since it fires other actions
			MiddlewareHelpers.stubMiddleware(Middlewares, "validatePartMiddlewareFactory");

			const nestedL1DocumentPath = createDocumentPath([REPEAT.rootGroup], [REPEAT.nestedL1, 2]);
			const l1NumberDocumentPath = createDocumentPath(
				[REPEAT.rootGroup],
				[REPEAT.nestedL1, 2],
				[REPEAT.L1_Number]
			);
			const l0NumberDocumentPath = createDocumentPath([REPEAT.rootGroup], [REPEAT.L0_Number, 2]);

			const backupEntry: EngineStore.BackupEntry = {
				document: createDocumentForDetachedRepeat([{ L1_Number: 1 }]),
				messages: {}
			};

			const newDocument = createDocumentForDetachedRepeat([{ L1_Number: 1 }]);

			const detailScreenState: EngineStore.ScreenState = {
				path: nestedL1DocumentPath,
				locationPath: configuration.detailScreenStateLocationPath
			};
			const dropScreenCommand = Commands.dropScreen();

			beforeEach(() => {
				middlewareSpy.spy.mock.resetCalls();
			});

			const models = setupModelsFixture("repeat", configuration.form);

			describe("if the payload contains cancel=true", () => {
				const action = configuration.actionExecutor({ cancel: true });
				const dropBackupCommand = Commands.dropBackup({ trigger: "cancel" });
				const changeRepeatCommand = Commands.changeRepeatInstanceStateEntry({
					locationPath: configuration.detailScreenStateLocationPath,
					repeatFormModelPath: configuration.repeatFormModelPath,
					entry: {
						...createRepeatInstanceEntry(),
						newRow: undefined
					}
				});

				it("dispatches Commands.dropScreen", () => {
					setupStore().dispatch(action);
					MiddlewareHelpers.assertAction(middlewareSpy.spy, dropScreenCommand);
				});

				it("dispatches Commands.dropBackup", () => {
					setupStore().dispatch(action);
					MiddlewareHelpers.assertAction(middlewareSpy.spy, dropBackupCommand);
				});

				it("dispatches Commands.changeRepeatInstanceStateEntry which sets the newRow entry to undefined", () => {
					setupStore().dispatch(action);
					MiddlewareHelpers.assertAction(middlewareSpy.spy, changeRepeatCommand);
				});

				describe("if the backup document is not equal to the document", () => {
					it("dispatches Command.setDocument with the backup document", () => {
						setupStore({ data: newDocument }).dispatch(action);
						const expectedCommand = Commands.setDocument({
							document: backupEntry.document,
							changes: [{ type: "Revert" }]
						});
						MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
					});
				});

				describe("if the backup document is equal to the document", () => {
					it("doesn't dispatch Command.setDocument", () => {
						setupStore().dispatch(action);
						MiddlewareHelpers.assertNoAction(
							middlewareSpy.spy,
							Commands.setDocument({ document: backupEntry.document, changes: [] })
						);
					});
				});

				describe("if the backup messages are not equal to the messages", () => {
					it("dispatches Commands.setMessageState with the backup messages", () => {
						const newMessages = createValidationEntry({
							path: l1NumberDocumentPath,
							errorText: [{ key: "foo", defaults: { en: "New error text" } }]
						});

						setupStore({ messages: newMessages }).dispatch(action);
						const expectedCommand = Commands.setMessageState({
							messages: backupEntry.messages
						});

						MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
					});
				});

				describe("if the backup messages are equal to the messages", () => {
					it("doesn't dispatch Commands.setMessageState", () => {
						setupStore().dispatch(action);
						MiddlewareHelpers.assertNoAction(
							middlewareSpy.spy,
							Commands.setMessageState({ messages: backupEntry.messages })
						);
					});
				});

				describe("if the adding of a new row was cancelled", () => {
					it("does not dispatch Commands.changeScreenState", () => {
						setupStore({
							newRow: { rowPath: l1NumberDocumentPath, rowState: "recentlyAdded" }
						}).dispatch(action);

						const command = Commands.changeScreenState({
							index: 0,
							focusedComponent: { formModelPath: configuration.repeatFormModelPath, index: 2 }
						});
						MiddlewareHelpers.assertNoAction(middlewareSpy.spy, command);
					});

					it("does not dispatch Commands.setDataDirty", () => {
						setupStore({
							newRow: { rowPath: l1NumberDocumentPath, rowState: "recentlyAdded" }
						}).dispatch(action);

						const command = Commands.setDataDirty(true);
						MiddlewareHelpers.assertNoAction(middlewareSpy.spy, command);
					});
				});

				describe("if the editing of an existing row was cancelled", () => {
					it("does not dispatch Commands.changeScreenState", () => {
						setupStore().dispatch(action);

						const command = Commands.changeScreenState({
							index: 0,
							focusedComponent: { formModelPath: configuration.repeatFormModelPath, index: 2 }
						});
						MiddlewareHelpers.assertNoAction(middlewareSpy.spy, command);
					});

					it("does not dispatch Commands.setDataDirty", () => {
						setupStore().dispatch(action);

						const command = Commands.setDataDirty(true);
						MiddlewareHelpers.assertNoAction(middlewareSpy.spy, command);
					});
				});
			});

			describe("if the payload contains cancel=false", () => {
				const action = configuration.actionExecutor({ cancel: false });
				const dropBackupCommand = Commands.dropBackup({ trigger: "apply" });
				const validatePartCommand = Commands.validatePart({ focusFirstError: true });
				const changeScreenStateCommand = Commands.changeScreenState({
					index: 0,
					focusedComponent: { formModelPath: configuration.repeatFormModelPath, index: 1 }
				});
				const setDataDirtyCommand = Commands.setDataDirty(true);

				it("dispatches Commands.validatePart", () => {
					setupStore().dispatch(action);
					MiddlewareHelpers.assertAction(middlewareSpy.spy, validatePartCommand);
				});

				function testValidCase(options: { messages: {} }) {
					it("dispatches Commands.dropScreen", () => {
						setupStore({ messages: options.messages }).dispatch(action);
						MiddlewareHelpers.assertAction(middlewareSpy.spy, dropScreenCommand);
					});

					it("dispatches Commands.dropBackup", () => {
						setupStore({ messages: options.messages }).dispatch(action);
						MiddlewareHelpers.assertAction(middlewareSpy.spy, dropBackupCommand);
					});

					describe("if the detached repeat screen shows a new repeat row", () => {
						it("dispatches Commands.changeRepeatInstanceStateEntry for the parent screen with an entry for the new row", () => {
							setupStore({
								messages: options.messages,
								newRow: { rowPath: l1NumberDocumentPath, rowState: "workingOn" }
							}).dispatch(action);
							const expectedCommands = [
								validatePartCommand,
								dropBackupCommand,
								dropScreenCommand,
								changeScreenStateCommand,
								setDataDirtyCommand,
								createChangeRepeatInstanceStateCommand({
									newRow: { rowPath: l1NumberDocumentPath, rowState: "recentlyAdded" }
								})
							];
							MiddlewareHelpers.assertActions(middlewareSpy.spy, expectedCommands);
						});

						describe("if the new row is not on the current page", () => {
							it("dispatches Commands.changeRepeatInstanceStateEntry for the parent screen with an entry for the new row with the correct page", () => {
								// page size 2
								// 6 entries -> pageCount = 3
								// new row with L1_Number = 3 --> page should be 2
								const doc = createDocumentForDetachedRepeat([
									{ L1_Number: 1 }, // first page
									{ L1_Number: 2 }, // first page
									{ L1_Number: 3 }, // second page
									{ L1_Number: 4 }, // second page
									{ L1_Number: 5 }, // third page
									{ L1_Number: 6 }, // third page
									{ L1_Number: 3 } // new row
								]);

								const newRowPath = createDocumentPath([REPEAT.rootGroup], [REPEAT.nestedL1, 7]);
								const orderPath = [
									...configuration.repeatFormModelPath,
									...createModelPath("fieldbasedrepeatoverviewcolumn-adcda")
								];
								setupStore({
									messages: options.messages,
									data: doc,
									newRow: {
										rowPath: newRowPath,
										rowState: "workingOn"
									},
									sortingState: {
										sorting: "asc",
										orderPath
									}
								}).dispatch(action);

								const expectedCommands = [
									validatePartCommand,
									dropBackupCommand,
									dropScreenCommand,
									changeScreenStateCommand,
									setDataDirtyCommand,
									createChangeRepeatInstanceStateCommand({
										newRow: { rowPath: newRowPath, rowState: "recentlyAdded" },
										page: 2
									})
								];
								MiddlewareHelpers.assertActions(middlewareSpy.spy, expectedCommands);
							});
						});

						it("does dispatch Commands.changeScreenState with the row as focused component", () => {
							setupStore({
								newRow: { rowPath: l1NumberDocumentPath, rowState: "recentlyAdded" }
							}).dispatch(action);
							MiddlewareHelpers.assertAction(middlewareSpy.spy, changeScreenStateCommand);
						});
					});

					describe("if the detached repeat screen shows an existing repeat row", () => {
						it(
							"dispatches Commands.changeRepeatInstanceStateEntry for the parent screen with newRow=undefined " +
								"and the page from before opening the row detail",
							() => {
								setupStore({ messages: options.messages, page: 2 }).dispatch(action);
								const expectedCommand = createChangeRepeatInstanceStateCommand({
									page: 2,
									newRow: undefined
								});
								MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
							}
						);

						it("dispatches Commands.changeScreenState with a focus component pointing to the edited row", () => {
							setupStore({}).dispatch(action);

							const expectedCommand = Commands.changeScreenState({
								index: 0,
								focusedComponent: {
									formModelPath: configuration.repeatFormModelPath,
									index: 1
								}
							});
							MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
						});

						it("dispatches Commands.setDataDirty with dirty=true", () => {
							setupStore({}).dispatch(action);

							MiddlewareHelpers.assertAction(middlewareSpy.spy, setDataDirtyCommand);
						});
					});
				}

				function testInvalidCase(options: { messages: {} }) {
					it("does not dispatch Commands.dropScreen", () => {
						setupStore({ messages: options.messages }).dispatch(action);
						MiddlewareHelpers.assertNoAction(middlewareSpy.spy, dropScreenCommand);
					});

					it("does not dispatch Commands.dropBackup", () => {
						setupStore({ messages: options.messages }).dispatch(action);
						MiddlewareHelpers.assertNoAction(middlewareSpy.spy, dropBackupCommand);
					});

					it("does not dispatch Commands.setDataDirty", () => {
						setupStore({ messages: options.messages }).dispatch(action);

						MiddlewareHelpers.assertNoAction(middlewareSpy.spy, setDataDirtyCommand);
					});

					it("does not dispatch Commands.changeScreenState with the row as focused component", () => {
						setupStore({ messages: options.messages }).dispatch(action);

						MiddlewareHelpers.assertNoAction(middlewareSpy.spy, changeScreenStateCommand);
					});
				}

				describe("if there are no validation errors on the screen", () => {
					testValidCase({ messages: {} });
				});

				describe("if there are validation warnings on the screen", () => {
					const warning = createValidationEntry({
						path: l1NumberDocumentPath,
						errorText: [{ key: "foo", defaults: { en: "New warning text" } }],
						type: "WARNING"
					});
					testValidCase({ messages: warning });
				});

				describe("if there are validation errors on another screen", () => {
					const otherScreenError = createValidationEntry({
						path: l0NumberDocumentPath,
						errorText: [{ key: "foo", defaults: { en: "L0_Number must be 42, if filled." } }],
						type: "ERROR"
					});
					testValidCase({ messages: otherScreenError });
				});

				describe("if there are validation errors on the screen", () => {
					const error = createValidationEntry({
						path: l1NumberDocumentPath,
						errorText: [{ key: "foo", defaults: { en: "New error text" } }],
						type: "ERROR"
					});
					testInvalidCase({ messages: error });
				});

				describe("if there are parsing errors on the screen", () => {
					const parsingError = createValidationEntryWithParsingError(
						l1NumberDocumentPath,
						"abc",
						"numberContainsIllegalSymbols"
					);
					testInvalidCase({ messages: parsingError });
				});
			});

			interface StoreOptions {
				data?: {};
				messages?: {};
			}

			function setupStore(
				options?: StoreOptions & Partial<EngineStore.Repeat.Entry>
			): Store<EngineState, AnyAction> {
				const data = (options && options.data) || backupEntry.document;
				const messages = (options && options.messages) || backupEntry.messages;

				return createTestStore({
					storeConfig: {
						models: models,
						data: { dirty: false, document: data || {} },
						ui: {
							messages: messages,
							backup: [backupEntry],
							screenLocation: [createRootScreenState(options), detailScreenState],
							repeatStaticState: createStaticRepeatState(options)
						}
					},
					middlewares: [middlewareSpy.middleware]
				});
			}

			function createRepeatInstanceEntry(
				options?: Partial<EngineStore.Repeat.InstanceState>
			): EngineStore.Repeat.InstanceState {
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

			function createRootScreenState(
				options?: Partial<EngineStore.Repeat.InstanceState>
			): EngineStore.ScreenState {
				return {
					path: [],
					locationPath: createModelPath(DR.SortingAndFiltering.screenName),
					repeatInstanceState: {
						[ModelPath.toString(configuration.repeatFormModelPath)]:
							createRepeatInstanceEntry(options)
					}
				};
			}
			function createStaticRepeatState(
				options?: Partial<EngineStore.Repeat.StaticState>
			): ReadonlyObjectMap<EngineStore.Repeat.StaticState> | undefined {
				return options
					? {
							[ModelPath.toString(configuration.repeatFormModelPath)]:
								createRepeatStaticStateEntry(options)
						}
					: undefined;
			}

			function createChangeRepeatInstanceStateCommand(
				options?: Partial<EngineStore.Repeat.InstanceState>
			) {
				const repeatEntry = createRepeatInstanceEntry(options);

				return Commands.changeRepeatInstanceStateEntry({
					locationPath: configuration.detailScreenStateLocationPath,
					repeatFormModelPath: configuration.repeatFormModelPath,
					entry: {
						...repeatEntry,
						newRow: repeatEntry.newRow
							? {
									...repeatEntry.newRow,
									rowState: repeatEntry.newRow.rowState
								}
							: undefined
					}
				});
			}
		}
	});
});
