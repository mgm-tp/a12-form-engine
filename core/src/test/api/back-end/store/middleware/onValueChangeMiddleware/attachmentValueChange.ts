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

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type {
	EntityInstancePath,
	GroupInstance
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { Commands, Events } from "../../../../../../back-end/store/index.js";
import type { Change } from "../../../../../../back-end/store/internal/documentChange.js";
import type { EngineStore } from "../../../../../../back-end/store/internal/store.js";
import { DocumentPath } from "../../../../../../models/internal/utils/document-utils.js";
import { MiddlewareHelpers } from "../../../../../utils/back-end-helpers.js";
import { DocumentHelpers } from "../../../../../utils/document-helpers.js";
import { SetupHelpers } from "../../../../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../../../../utils/setupFixture.js";
import { CONTROLS_INDEX } from "../../../../../utils/test-model-helpers/controls.index.js";
import { createDocumentPath } from "../../../../../utils/test-model-helpers/dependent-enumeration.js";
import { DR } from "../../../../../utils/test-model-helpers/detached.repeat.js";

const { createTestStore } = SetupHelpers;

export function executeTestsForAttachmentValueChange(): void {
	const middlewareSpy = setupFixture(() => MiddlewareHelpers.createMiddlewareSpy());

	function setupStore(dirty?: boolean, data?: {}, ui?: Partial<EngineStore.UIState>) {
		return createTestStore({
			storeConfig: {
				models: models,
				data: { dirty: dirty ?? false, document: data ?? {} },
				ui: ui
			},
			middlewares: [middlewareSpy.middleware]
		});
	}

	const models = setupModelsFixture("controls.attachmentUpload");

	beforeEach(() => {
		middlewareSpy.spy.mock.resetCalls();
	});

	const pathToAttachment = DocumentHelpers.createDocumentPath(["root"], ["attachment"]);
	const attachmentValue = {
		attachment_id: "1",
		category: null,
		description: null,
		size: 100,
		content: "",
		mime_type: "image/jpeg"
	};

	const VALID_FILE_NAME = "validFilename.jpg";
	const INVALID_FILE_NAME = "invalidFilename.jpg";

	function createEventAction(file_name: string, path: EntityInstancePath = pathToAttachment) {
		return Events.attachmentValueChange({
			value: {
				...attachmentValue,
				internal_filename: file_name,
				original_filename: file_name
			},
			path,
			formModelElementPath: []
		});
	}

	describe("Document changed", () => {
		it("dispatches a Command.setDocument with the updated document, the changes and a Command.setDataDirty(true) action", () => {
			setupStore().dispatch(createEventAction(VALID_FILE_NAME));

			const expectedDocument = {
				root: {
					attachment: {
						...attachmentValue,
						internal_filename: VALID_FILE_NAME,
						original_filename: VALID_FILE_NAME
					}
				}
			};
			const expectedCommands = [
				Commands.setDocument({
					document: expectedDocument,
					changes: createChangesForAttachment(pathToAttachment)
				}),
				Commands.setDataDirty(true)
			];

			MiddlewareHelpers.assertActions(middlewareSpy.spy, expectedCommands);
		});

		it("does not dispatch a Command.setDataDirty(true) action if the document is already dirty", () => {
			setupStore(true).dispatch(createEventAction(VALID_FILE_NAME));
			const expectedDocument = {
				root: {
					attachment: {
						...attachmentValue,
						internal_filename: VALID_FILE_NAME,
						original_filename: VALID_FILE_NAME
					}
				}
			};
			const expectedCommands = [
				Commands.setDocument({
					document: expectedDocument,
					changes: createChangesForAttachment(pathToAttachment)
				})
			];

			MiddlewareHelpers.assertActions(middlewareSpy.spy, expectedCommands);
		});

		describe("and a detached repeat detail screen is opened", () => {
			it("dispatches Commands.changeScreenState with dirty=true", () => {
				const models = SetupHelpers.loadModels("repeat", "detached");
				const store = createTestStore({
					storeConfig: {
						models,
						data: { document: {} },
						ui: {
							screenLocation: [
								{ locationPath: [], path: [] },
								{
									locationPath: DR.NestedRepeat.nested_dr_dr_locationPath,
									path: DocumentHelpers.createDocumentPath(["Root"], ["Nested_L1"])
								}
							]
						}
					},
					middlewares: [middlewareSpy.middleware]
				});

				const valueChangeEvent = Events.attachmentValueChange({
					path: DocumentHelpers.createDocumentPath(["Root"], ["Nested_L1"], ["L1_Attachment"]),
					value: attachmentValue,
					formModelElementPath: []
				});

				store.dispatch(valueChangeEvent);
				const changeScreenState = Commands.changeScreenState({
					index: 1,
					dirty: true
				});

				MiddlewareHelpers.assertAction(middlewareSpy.spy, changeScreenState);
			});
		});

		describe("and a control with index exists", () => {
			const models = setupModelsFixture("controls.index");

			const value = {
				...attachmentValue,
				internal_filename: VALID_FILE_NAME,
				original_filename: VALID_FILE_NAME
			};

			function createConcreteDocumentPath(index: number): EntityInstancePath {
				return createDocumentPath(
					["root", 1],
					["contacts_with_all_field_types", index],
					["details", 1],
					["photo", 1]
				);
			}

			function testFunction(options: {
				documentPath: EntityInstancePath;
				formModelElementPath: ModelPath;
				expectedResult: GroupInstance;
				initialDocument?: GroupInstance;
			}) {
				const document = options.initialDocument || {};
				const path = options.documentPath;
				const formModelElementPath = options.formModelElementPath;

				createTestStore({
					storeConfig: { models: models, data: { dirty: false, document } },
					middlewares: [middlewareSpy.middleware]
				}).dispatch(Events.attachmentValueChange({ value, path, formModelElementPath }));

				MiddlewareHelpers.assertAction(
					middlewareSpy.spy,
					Commands.setDocument({
						document: options.expectedResult,
						changes: createChangesForAttachment(path)
					})
				);
			}

			const documentPath = createConcreteDocumentPath(2);

			it(
				"dispatches a Commands.setDocument action with a document with a new row for the attachment " +
					"and a preceding row if they did not exist yet",
				() => {
					testFunction({
						documentPath,
						formModelElementPath: CONTROLS_INDEX.SECOND_CONTACT_PHOTO_CONTROL,
						initialDocument: {},
						expectedResult: {
							root: {
								contacts_with_all_field_types: [
									{ details: { photo: {} } },
									{ details: { photo: value } }
								]
							}
						}
					});
				}
			);

			it("dispatches a Commands.setDocument action with a document with a updated row if it exists", () => {
				testFunction({
					documentPath,
					formModelElementPath: CONTROLS_INDEX.SECOND_CONTACT_PHOTO_CONTROL,
					initialDocument: {
						root: {
							contacts_with_all_field_types: [
								{ details: { photo: {} } },
								{ details: { photo: {} } }
							]
						}
					},
					expectedResult: {
						root: {
							contacts_with_all_field_types: [
								{ details: { photo: {} } },
								{ details: { photo: value } }
							]
						}
					}
				});
			});
		});
	});

	describe("Validation messages changed", () => {
		describe("Control", () => {
			const pathToFileName = [
				...pathToAttachment,
				...DocumentHelpers.createDocumentPath(["original_filename"])
			];
			const fileNameError: EngineStore.Validation.Message = {
				element: pathToFileName,
				errorCode: "Error rule_205f5",
				errorKey: "/root/RuleFileName",
				errorText: [
					{
						key: "documentModel.ruleErrorMessage.controls\\pattachmentUpload-document.root.RuleFileName",
						args: {},
						defaults: {
							en: "Filename should not be invalidFilename.jpg!",
							de: "Filename should not be invalidFilename.jpg!"
						}
					}
				],
				severity: "ERROR",
				referencedFields: [pathToFileName]
			};

			const pathToInternaFileName = [
				...pathToAttachment,
				...DocumentHelpers.createDocumentPath(["internal_filename"])
			];
			const internalFileNameError: EngineStore.Validation.Message = {
				element: pathToInternaFileName,
				errorCode: "Error rule_205f5",
				errorKey: "/root/RuleInternalFilename",
				errorText: [
					{
						key: "documentModel.ruleErrorMessage.controls\\pattachmentUpload-document.root.RuleInternalFilename",
						args: {},
						defaults: {
							en: "Internal Filename should not be invalidFilename.jpg!",
							de: "Internal  Filename should not be invalidFilename.jpg!"
						}
					}
				],
				severity: "ERROR",
				referencedFields: [pathToInternaFileName]
			};

			it("dispatches a Command.setMessageState action with the new message state", () => {
				setupStore(true).dispatch(createEventAction(INVALID_FILE_NAME));

				const expectedDocument = {
					root: {
						attachment: {
							...attachmentValue,
							internal_filename: INVALID_FILE_NAME,
							original_filename: INVALID_FILE_NAME
						}
					}
				};
				const expectedCommands = [
					Commands.setDocument({
						document: expectedDocument,
						changes: createChangesForAttachment(pathToAttachment)
					}),
					Commands.setMessageState({
						messages: {
							[DocumentPath.toString(pathToFileName)]: {
								validationMessages: [fileNameError]
							},
							[DocumentPath.toString(pathToInternaFileName)]: {
								validationMessages: [internalFileNameError]
							}
						}
					})
				];

				MiddlewareHelpers.assertActions(middlewareSpy.spy, expectedCommands);
			});

			it("dispatches a Command.setMessage action with an updated message state if validation errors get resolved", () => {
				const store = setupStore(
					true,
					{},
					{
						messages: {
							[DocumentPath.toString(pathToFileName)]: {
								validationMessages: [fileNameError]
							},
							[DocumentPath.toString(pathToInternaFileName)]: {
								validationMessages: [internalFileNameError]
							},
							["anyErrorPath"]: { validationMessages: [fileNameError] }
						}
					}
				);

				store.dispatch(createEventAction(VALID_FILE_NAME));

				const expectedDocument = {
					root: {
						attachment: {
							...attachmentValue,
							internal_filename: VALID_FILE_NAME,
							original_filename: VALID_FILE_NAME
						}
					}
				};
				const expectedCommands = [
					Commands.setDocument({
						document: expectedDocument,
						changes: createChangesForAttachment(pathToAttachment)
					}),
					Commands.setMessageState({
						messages: {
							["anyErrorPath"]: { validationMessages: [fileNameError] }
						}
					})
				];

				MiddlewareHelpers.assertActions(middlewareSpy.spy, expectedCommands);
			});
		});

		describe("FieldOverviewColumn", () => {
			const pathToAttachmentInRepeat = DocumentHelpers.createDocumentPath(
				["root"],
				["repeat"],
				["attachment"]
			);

			const pathToFileName = [
				...pathToAttachmentInRepeat,
				...DocumentHelpers.createDocumentPath(["original_filename"])
			];
			const fileNameError: EngineStore.Validation.Message = {
				element: pathToFileName,
				errorCode: "Error rule_205f5",
				errorKey: "/root/repeat/RuleFileName",
				errorText: [
					{
						key: "documentModel.ruleErrorMessage.controls\\pattachmentUpload-document.root.repeat.RuleFileName",
						args: {},
						defaults: {
							en: "Filename should not be invalidFilename.jpg!",
							de: "Filename should not be invalidFilename.jpg!"
						}
					}
				],
				severity: "ERROR",
				referencedFields: [pathToFileName]
			};

			const pathToInternaFileName = [
				...pathToAttachmentInRepeat,
				...DocumentHelpers.createDocumentPath(["internal_filename"])
			];
			const internalFileNameError: EngineStore.Validation.Message = {
				element: pathToInternaFileName,
				errorCode: "Error rule_205f5",
				errorKey: "/root/repeat/RuleInternalFilename",
				errorText: [
					{
						key: "documentModel.ruleErrorMessage.controls\\pattachmentUpload-document.root.repeat.RuleInternalFilename",
						args: {},
						defaults: {
							en: "Internal Filename should not be invalidFilename.jpg!",
							de: "Internal  Filename should not be invalidFilename.jpg!"
						}
					}
				],
				severity: "ERROR",
				referencedFields: [pathToInternaFileName]
			};

			it("dispatches a Command.setMessageState action with the new message state", () => {
				const store = setupStore(true, { root: { repeat: [{ attachment: {} }] } });

				store.dispatch(createEventAction(INVALID_FILE_NAME, pathToAttachmentInRepeat));

				const expectedDocument = {
					root: {
						repeat: [
							{
								attachment: {
									...attachmentValue,
									internal_filename: INVALID_FILE_NAME,
									original_filename: INVALID_FILE_NAME
								}
							}
						]
					}
				};
				const expectedCommands = [
					Commands.setDocument({
						document: expectedDocument,
						changes: createChangesForAttachment(pathToAttachmentInRepeat)
					}),
					Commands.setMessageState({
						messages: {
							[DocumentPath.toString(pathToFileName)]: {
								validationMessages: [fileNameError]
							},
							[DocumentPath.toString(pathToInternaFileName)]: {
								validationMessages: [internalFileNameError]
							}
						}
					})
				];

				MiddlewareHelpers.assertActions(middlewareSpy.spy, expectedCommands);
			});

			it("dispatches a Command.setMessage action with an empty message state if all validation errors are resolved", () => {
				const store = setupStore(
					true,
					{ root: { repeat: [{ attachment: {} }] } },
					{
						messages: {
							[DocumentPath.toString(pathToFileName)]: {
								validationMessages: [fileNameError]
							},
							[DocumentPath.toString(pathToInternaFileName)]: {
								validationMessages: [internalFileNameError]
							},
							["anyErrorPath"]: {
								validationMessages: [fileNameError]
							}
						}
					}
				);

				store.dispatch(createEventAction(VALID_FILE_NAME, pathToAttachmentInRepeat));

				const expectedDocument = {
					root: {
						repeat: [
							{
								attachment: {
									...attachmentValue,
									internal_filename: VALID_FILE_NAME,
									original_filename: VALID_FILE_NAME
								}
							}
						]
					}
				};

				const expectedCommands = [
					Commands.setDocument({
						document: expectedDocument,
						changes: createChangesForAttachment(pathToAttachmentInRepeat)
					}),
					Commands.setMessageState({
						messages: {
							["anyErrorPath"]: {
								validationMessages: [fileNameError]
							}
						}
					})
				];

				MiddlewareHelpers.assertActions(middlewareSpy.spy, expectedCommands);
			});
		});
	});

	function createChangesForAttachment(path: EntityInstancePath): Change[] {
		return [
			{ type: "ValueChanged", path: [...path, { elementName: "attachment_id", index: 1 }] },
			{ type: "ValueChanged", path: [...path, { elementName: "category", index: 1 }] },
			{ type: "ValueChanged", path: [...path, { elementName: "description", index: 1 }] },
			{ type: "ValueChanged", path: [...path, { elementName: "size", index: 1 }] },
			{ type: "ValueChanged", path: [...path, { elementName: "content", index: 1 }] },
			{ type: "ValueChanged", path: [...path, { elementName: "mime_type", index: 1 }] },
			{ type: "ValueChanged", path: [...path, { elementName: "internal_filename", index: 1 }] },
			{ type: "ValueChanged", path: [...path, { elementName: "original_filename", index: 1 }] }
		];
	}
}
