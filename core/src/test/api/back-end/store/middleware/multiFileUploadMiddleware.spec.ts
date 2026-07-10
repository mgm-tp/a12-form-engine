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

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import type { EngineState } from "../../../../../back-end/store/index.js";
import { Commands, Events } from "../../../../../back-end/store/index.js";
import type { EngineStore, Models } from "../../../../../back-end/store/internal/store.js";
import { DocumentPath } from "../../../../../models/index.js";
import { createModelPath } from "../../../../utils/createModelPath.js";
import { MiddlewareHelpers } from "../../../../utils/MiddlewareHelpers.js";
import { createTestStore } from "../../../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../../../utils/setupFixture.js";
import {
	DOCUMENT_MODEL,
	FORM_MODEL
} from "../../../../utils/test-model-helpers/repeat.multi-file-upload.js";
import { createValidationEntry } from "../../../../utils/validation.js";

describe("api.back-end.store.middleware", () => {
	describe("multiFileUploadMiddlewareFactory", () => {
		describe("handles Events.Repeat.multiFileUpload", () => {
			const middlewareSpy = setupFixture(() => MiddlewareHelpers.createMiddlewareSpy());
			const models = setupModelsFixture("repeat.multi-file-upload");
			const dataFixture = setupFixture(() => ({
				document: {
					Root: {
						AttachmentCollection: [
							{
								Attachment01: {
									attachment_id: "1",
									original_filename: "already_existing1.txt",
									internal_filename: "internal_filename",
									mime_type: "text/plain",
									size: 10
								},
								StringField: "a",
								NumberField: 10
							},
							{
								Attachment01: {
									attachment_id: "2",
									original_filename: "already_existing2.txt",
									internal_filename: "internal_filename",
									mime_type: "text/plain",
									size: 10
								},
								StringField: "b",
								NumberField: 17
							},
							{
								Attachment01: {
									attachment_id: "3",
									original_filename: "already_existing3.txt",
									internal_filename: "internal_filename",
									mime_type: "text/plain",
									size: 10
								},
								StringField: "c",
								NumberField: 42
							}
						]
					}
				}
			}));

			describe("if the payload contains a form-model path to an inline repeat", () => {
				describe("and the payload contains at least one attachment in 'toBeAdded'", () => {
					executeTestForDirty({
						screenName: FORM_MODEL.SCREENS.PAGING,
						repeatFormModelPath: FORM_MODEL.IR.repeatPagingFormModelPath,
						dirty: false
					});
					executeTestForDirty({
						screenName: FORM_MODEL.SCREENS.PAGING,
						repeatFormModelPath: FORM_MODEL.IR.repeatPagingFormModelPath,
						dirty: true
					});
					executeTestForInitialValuesAndComputation({
						screenName: FORM_MODEL.SCREENS.INITIAL_VALUES,
						repeatFormModelPath: FORM_MODEL.IR.repeatInitialValuesFormModelPath
					});
					executeTestForValidationError({
						screenName: FORM_MODEL.SCREENS.INITIAL_VALUES,
						repeatFormModelPath: FORM_MODEL.IR.repeatInitialValuesAndErrorFormModelPath
					});
				});

				describe(
					"and the payload contains no attachment in 'toBeAdded', " +
						"but at least one attachment in 'toBeReplaced'",
					() => {
						executeTestForNoRowsToBeAdded(FORM_MODEL.IR.repeatPagingFormModelPath);
					}
				);
			});

			describe("if the payload contains a form-model path to an embedded repeat", () => {
				describe("and the payload contains at least one attachment in 'toBeAdded'", () => {
					executeTestForDirty({
						screenName: FORM_MODEL.SCREENS.PAGING,
						repeatFormModelPath: FORM_MODEL.ER.repeatPagingFormModelPath,
						dirty: false
					});
					executeTestForDirty({
						screenName: FORM_MODEL.SCREENS.PAGING,
						repeatFormModelPath: FORM_MODEL.ER.repeatPagingFormModelPath,
						dirty: true
					});
					executeTestForInitialValuesAndComputation({
						screenName: FORM_MODEL.SCREENS.INITIAL_VALUES,
						repeatFormModelPath: FORM_MODEL.ER.repeatInitialValuesFormModelPath
					});
					executeTestForValidationError({
						screenName: FORM_MODEL.SCREENS.INITIAL_VALUES,
						repeatFormModelPath: FORM_MODEL.ER.repeatInitialValuesAndErrorFormModelPath
					});
				});

				describe(
					"and the payload contains no attachment in 'toBeAdded', " +
						"but at least one attachment in 'toBeReplaced'",
					() => {
						executeTestForNoRowsToBeAdded(FORM_MODEL.ER.repeatPagingFormModelPath);
					}
				);
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
										locationPath: FORM_MODEL.IR.nestedRepeatFormModelPath,
										path: DocumentPath.fromString("/Root[1]/Repeatable[1]")
									}
								]
							}
						},
						middlewares: [middlewareSpy.middleware]
					});

					const attachment = {
						attachment_id: "4",
						original_filename: "new.txt",
						internal_filename: "internal_filename",
						mime_type: "text/plain",
						size: 10
					};

					const action = Events.Repeat.multiFileUpload({
						path: DOCUMENT_MODEL.getNestedAttachmentCollectionDocPath(0),
						attachmentModelPath: DOCUMENT_MODEL.nestedAttachmentModelPath,
						repeatFormModelPath: FORM_MODEL.IR.nestedRepeatFormModelPath,
						toBeAdded: [attachment],
						toBeReplaced: undefined
					});

					store.dispatch(action);
					const changeScreenState = Commands.changeScreenState({
						index: 1,
						dirty: true
					});

					MiddlewareHelpers.assertAction(middlewareSpy.spy, changeScreenState);
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
										locationPath: FORM_MODEL.ER.nestedRepeatFormModelPath,
										path: DocumentPath.fromString("/Root[1]/Repeatable[1]")
									}
								]
							}
						},
						middlewares: [middlewareSpy.middleware]
					});

					const attachment = {
						attachment_id: "4",
						original_filename: "new.txt",
						internal_filename: "internal_filename",
						mime_type: "text/plain",
						size: 10
					};

					const action = Events.Repeat.multiFileUpload({
						path: DOCUMENT_MODEL.getNestedAttachmentCollectionDocPath(0),
						attachmentModelPath: DOCUMENT_MODEL.nestedAttachmentModelPath,
						repeatFormModelPath: FORM_MODEL.ER.nestedRepeatFormModelPath,
						toBeAdded: [attachment],
						toBeReplaced: undefined
					});

					store.dispatch(action);
					const changeScreenState = Commands.changeScreenState({
						index: 1,
						dirty: true
					});

					MiddlewareHelpers.assertAction(middlewareSpy.spy, changeScreenState);
				});
			});

			function executeTestForDirty(options: {
				screenName: string;
				repeatFormModelPath: ModelPath;
				dirty: boolean;
			}): void {
				const fixture = setupFixture(() => {
					const attachment1 = {
						attachment_id: "4",
						original_filename: "new1.txt",
						internal_filename: "internal_filename",
						mime_type: "text/plain",
						size: 10
					};
					const attachment2 = {
						attachment_id: "5",
						original_filename: "new2.txt",
						internal_filename: "internal_filename",
						mime_type: "text/plain",
						size: 10
					};
					const attachment3 = {
						attachment_id: "6",
						original_filename: "already_existing1.txt",
						internal_filename: "internal_filename",
						mime_type: "text/plain",
						size: 10
					};
					const action = Events.Repeat.multiFileUpload({
						path: DOCUMENT_MODEL.getAttachmentCollectionDocPath(0),
						attachmentModelPath: DOCUMENT_MODEL.attachmentModelPath,
						repeatFormModelPath: options.repeatFormModelPath,
						toBeAdded: [attachment1, attachment2],
						toBeReplaced: [{ path: DOCUMENT_MODEL.getAttachmentDocPath(1), value: attachment3 }]
					});

					const screenLocation = [{ locationPath: createModelPath(options.screenName), path: [] }];

					return {
						attachment1,
						attachment2,
						attachment3,
						action,
						screenLocation
					};
				});

				describe(`and if the data is ${options.dirty ? "" : "not "}dirty`, () => {
					before(() => {
						middlewareSpy.spy.mock.resetCalls();

						setupStore({
							models,
							data: dataFixture.document,
							screenLocation: fixture.screenLocation,
							dirty: options.dirty
						}).dispatch(fixture.action);
					});

					it(
						"adds one row for each attachment in `toBeAdded`, updates existing rows with attachments from `toBeReplaced` " +
							"and dispatches Commands.setDocument with the new document",
						() => {
							const expectedCommand = Commands.setDocument({
								document: {
									Root: {
										AttachmentCollection: [
											{
												...dataFixture.document.Root.AttachmentCollection[0],
												Attachment01: fixture.attachment3
											},
											{ ...dataFixture.document.Root.AttachmentCollection[1] },
											{ ...dataFixture.document.Root.AttachmentCollection[2] },
											{ Attachment01: fixture.attachment1 },
											{ Attachment01: fixture.attachment2 }
										]
									}
								},
								changes: [
									{
										type: "ValueChanged",
										path: [
											...DOCUMENT_MODEL.getAttachmentDocPath(1),
											{ elementName: "attachment_id", index: 1 }
										]
									},
									{
										type: "ValueChanged",
										path: [
											...DOCUMENT_MODEL.getAttachmentDocPath(1),
											{ elementName: "original_filename", index: 1 }
										]
									},
									{
										type: "ValueChanged",
										path: [
											...DOCUMENT_MODEL.getAttachmentDocPath(1),
											{ elementName: "internal_filename", index: 1 }
										]
									},
									{
										type: "ValueChanged",
										path: [
											...DOCUMENT_MODEL.getAttachmentDocPath(1),
											{ elementName: "mime_type", index: 1 }
										]
									},
									{
										type: "ValueChanged",
										path: [
											...DOCUMENT_MODEL.getAttachmentDocPath(1),
											{ elementName: "size", index: 1 }
										]
									},
									{
										type: "GroupAdded",
										path: DOCUMENT_MODEL.getAttachmentCollectionDocPath(0)
									},
									{
										type: "GroupAdded",
										path: DOCUMENT_MODEL.getAttachmentCollectionDocPath(0)
									}
								]
							});
							MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
						}
					);

					it("dispatches Commands.changeRepeatInstanceStateEntry with a newRow entry and an updated page number", () => {
						const expectedCommand = Commands.changeRepeatInstanceStateEntry({
							locationPath: fixture.screenLocation[0].locationPath,
							repeatFormModelPath: options.repeatFormModelPath,
							entry: {
								page: 2,
								newRow: {
									rowPath: DOCUMENT_MODEL.getAttachmentCollectionDocPath(4),
									rowState: "recentlyAdded"
								}
							}
						});
						MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
					});

					it(`${
						options.dirty ? "does not dispatch" : "dispatches"
					} Commands.setDataDirty with dirty=true`, () => {
						if (options.dirty) {
							MiddlewareHelpers.assertNoAction(middlewareSpy.spy, Commands.setDataDirty(true));
						} else {
							MiddlewareHelpers.assertAction(middlewareSpy.spy, Commands.setDataDirty(true));
						}
					});

					it("dispatches Commands.changeScreenState with the new row as focused component", () => {
						const expectedCommand = Commands.changeScreenState({
							index: 0,
							focusedComponent: {
								formModelPath: options.repeatFormModelPath,
								index: 3
							}
						});

						MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
					});
				});
			}

			function executeTestForInitialValuesAndComputation(options: {
				screenName: string;
				repeatFormModelPath: ModelPath;
			}): void {
				const fixture = setupFixture(() => {
					const attachment = {
						attachment_id: "1",
						original_filename: "new.txt",
						internal_filename: "internal_filename",
						mime_type: "text/plain",
						size: 10
					};

					const action = Events.Repeat.multiFileUpload({
						path: DOCUMENT_MODEL.getAttachmentCollectionInitialValuesDocPath(0),
						attachmentModelPath: DOCUMENT_MODEL.attachmentInitialValuesModelPath,
						repeatFormModelPath: options.repeatFormModelPath,
						toBeAdded: [attachment],
						toBeReplaced: []
					});

					const screenLocation = [{ locationPath: createModelPath(options.screenName), path: [] }];

					return { screenLocation, action, attachment };
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
								Root: {
									AttachmentCollection_InitialValues: [
										{
											Attachment01: fixture.attachment,
											NumberField: 42,
											ComputedField: 420
										}
									]
								}
							},
							changes: [
								{
									type: "GroupAdded",
									path: DOCUMENT_MODEL.getAttachmentCollectionInitialValuesDocPath(0)
								},
								{
									type: "ValueChanged",
									path: DocumentPath.fromString(
										"/Root[1]/AttachmentCollection_InitialValues[1]/ComputedField[1]"
									)
								}
							]
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
					const attachment = {
						attachment_id: "1",
						original_filename: "new.txt",
						internal_filename: "internal_filename",
						mime_type: "text/plain",
						size: 1024 * 1024 + 1
					};

					const action = Events.Repeat.multiFileUpload({
						path: DOCUMENT_MODEL.getAttachmentCollectionInitialValuesAndErrorDocPath(0),
						attachmentModelPath: DOCUMENT_MODEL.attachmentInitialValuesAndErrorModelPath,
						repeatFormModelPath: options.repeatFormModelPath,
						toBeAdded: [attachment],
						toBeReplaced: undefined
					});

					const screenLocation = [{ locationPath: createModelPath(options.screenName), path: [] }];

					return {
						attachment,
						screenLocation,
						action
					};
				});

				describe("if there is a validation error after adding the rows for the new attachments", () => {
					before(() => {
						middlewareSpy.spy.mock.resetCalls();

						setupStore({
							models,
							screenLocation: fixture.screenLocation
						}).dispatch(fixture.action);
					});

					it(
						"adds one row for each attachment in `toBeAdded`, updates existing rows with attachments from `toBeReplaced` " +
							"and dispatches Commands.setDocument with the new document",
						() => {
							const expectedCommand = Commands.setDocument({
								document: {
									Root: {
										AttachmentCollection_InitialValuesAndError: [
											{
												Attachment01: fixture.attachment,
												NumberField: 42,
												ComputedField: 420
											}
										]
									}
								},
								changes: [
									{
										type: "GroupAdded",
										path: DOCUMENT_MODEL.getAttachmentCollectionInitialValuesAndErrorDocPath(0)
									},
									{
										type: "ValueChanged",
										path: DocumentPath.fromString(
											"/Root[1]/AttachmentCollection_InitialValuesAndError[1]/ComputedField[1]"
										)
									}
								]
							});
							MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
						}
					);

					it("dispatches Commands.setMessageState with only the attachment validation message, not non-attachment field errors", () => {
						const validationEntrySizeField = createValidationEntry({
							path: DocumentPath.fromString(
								"/Root[1]/AttachmentCollection_InitialValuesAndError[1]/Attachment01[1]/size[1]"
							),
							errorText: [
								{
									key: "documentModel.ruleErrorMessage.repeat\\pmulti-file-upload-document.Root.AttachmentCollection_InitialValuesAndError.Max1MB",
									args: {},
									defaults: {
										de: "maximale Größe 1mb",
										en: "max size is 1mb"
									}
								}
							],
							errorCode: "Error rule_1834d",
							errorKey: "/Root/AttachmentCollection_InitialValuesAndError/Max1MB"
						});

						const expectedCommand = Commands.setMessageState({
							messages: { ...validationEntrySizeField }
						});
						MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
					});
				});
			}

			function executeTestForNoRowsToBeAdded(repeatFormModelPath: ModelPath): void {
				const fixture = setupFixture(() => {
					const attachment = {
						attachment_id: "4",
						original_filename: "already_existing3.txt",
						internal_filename: "internal_filename",
						mime_type: "text/plain",
						size: 10
					};
					const screenLocation = [
						{ locationPath: [{ elementName: FORM_MODEL.SCREENS.PAGING }], path: [] }
					];
					const action = Events.Repeat.multiFileUpload({
						path: DOCUMENT_MODEL.getAttachmentCollectionDocPath(0),
						attachmentModelPath: DOCUMENT_MODEL.attachmentModelPath,
						repeatFormModelPath,
						toBeAdded: [],
						toBeReplaced: [
							{
								path: DOCUMENT_MODEL.getAttachmentDocPath(3),
								value: attachment
							}
						]
					});

					return { attachment, screenLocation, action };
				});

				before(() => {
					middlewareSpy.spy.mock.resetCalls();

					const store = createTestStore({
						storeConfig: {
							models,
							data: { document: dataFixture.document },
							ui: { screenLocation: fixture.screenLocation }
						},
						middlewares: [middlewareSpy.middleware]
					});

					store.dispatch(fixture.action);
				});

				it(
					"updates the existing row with the attachment from `toBeReplaced` " +
						"and dispatches Commands.setDocument with the new document",
					() => {
						const expectedCommand = Commands.setDocument({
							document: {
								Root: {
									AttachmentCollection: [
										{ ...dataFixture.document.Root.AttachmentCollection[0] },
										{ ...dataFixture.document.Root.AttachmentCollection[1] },
										{
											...dataFixture.document.Root.AttachmentCollection[2],
											Attachment01: fixture.attachment
										}
									]
								}
							},
							changes: [
								{
									type: "ValueChanged",
									path: [
										...DOCUMENT_MODEL.getAttachmentDocPath(3),
										{ elementName: "attachment_id", index: 1 }
									]
								},
								{
									type: "ValueChanged",
									path: [
										...DOCUMENT_MODEL.getAttachmentDocPath(3),
										{ elementName: "original_filename", index: 1 }
									]
								},
								{
									type: "ValueChanged",
									path: [
										...DOCUMENT_MODEL.getAttachmentDocPath(3),
										{ elementName: "internal_filename", index: 1 }
									]
								},
								{
									type: "ValueChanged",
									path: [
										...DOCUMENT_MODEL.getAttachmentDocPath(3),
										{ elementName: "mime_type", index: 1 }
									]
								},
								{
									type: "ValueChanged",
									path: [
										...DOCUMENT_MODEL.getAttachmentDocPath(3),
										{ elementName: "size", index: 1 }
									]
								}
							]
						});
						MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
					}
				);

				it("dispatches Commands.setMessageState (the fast path still runs validation)", () => {
					const expectedCommand = Commands.setMessageState({ messages: {} });
					MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
				});

				it("dispatches Commands.changeRepeatInstanceStateEntry with a newRow entry and an updated page number", () => {
					const expectedCommand = Commands.changeRepeatInstanceStateEntry({
						locationPath: fixture.screenLocation[0].locationPath,
						repeatFormModelPath,
						entry: {
							page: 2,
							newRow: {
								rowPath: DOCUMENT_MODEL.getAttachmentCollectionDocPath(3),
								rowState: "recentlyAdded"
							}
						}
					});

					MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
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

			function setupStore(options: StoreOptions): Store<EngineState, Action> {
				const dirty = options.dirty ? true : false;
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
