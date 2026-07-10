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

import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { Commands, Events } from "../../../../../../back-end/store/index.js";
import { DocumentPath } from "../../../../../../models/internal/utils/document-utils.js";
import { MiddlewareHelpers } from "../../../../../utils/MiddlewareHelpers.js";
import { createTestStore } from "../../../../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../../../../utils/setupFixture.js";
import { DOCUMENT_MODEL } from "../../../../../utils/test-model-helpers/validation.fields.js";

export function executeTestsForValidation(): void {
	describe("validation", () => {
		const models = setupModelsFixture("computation-validation.validate-fields");

		const middlewareSpy = setupFixture(() => MiddlewareHelpers.createMiddlewareSpy());

		function setupStore() {
			return createTestStore({
				storeConfig: {
					models: models,
					data: {
						document: {
							base: {
								multiSelectValueChange: {
									computedFieldMultiSelect: "empty"
								},
								attachmentValueChange: {
									computedFieldAttachment: "empty"
								},
								multiFileUpload: {
									computedFieldMultiFileUpload: "empty"
								}
							}
						}
					},
					ui: {}
				},
				middlewares: [middlewareSpy.middleware]
			});
		}

		function createValueChange(value: any, path: EntityInstancePath = DOCUMENT_MODEL.MASTER_PATH) {
			return Events.valueChange({ value, path, formModelElementPath: [] });
		}

		describe("field validation after value change", () => {
			beforeEach(() => {
				middlewareSpy.spy.mock.resetCalls();
			});

			describe("Field Value Change", () => {
				it("does not dispatch a new message state when the changed field value is valid", () => {
					setupStore().dispatch(createValueChange("a"));

					// note: the order of changes seems to be important in the assertion logic below
					const expectedCommands = [
						Commands.setDocument({
							document: DOCUMENT_MODEL.getDocument({
								fieldValueChange: {
									bool: true,
									depGroup: { stringField: "abc" },
									master: "a",
									numField: 666,
									slave: "d"
								}
							}),
							changes: [
								{ type: "ValueChanged", path: DOCUMENT_MODEL.MASTER_PATH },
								{ type: "ValueChanged", path: DOCUMENT_MODEL.DEP_GROUP_STRING_FIELD_PATH },
								{ type: "ValueChanged", path: DOCUMENT_MODEL.NUM_FIELD_PATH },
								{ type: "ValueChanged", path: DOCUMENT_MODEL.SLAVE_PATH },
								{ type: "ValueChanged", path: DOCUMENT_MODEL.BOOL_FIELD_PATH }
							]
						}),
						Commands.setDataDirty(true)
					];

					MiddlewareHelpers.assertActions(middlewareSpy.spy, expectedCommands);
				});

				it("dispatches a new message state with a validation error for the change field when the changed field value is invalid", () => {
					setupStore().dispatch(createValueChange(69, DOCUMENT_MODEL.NUM_FIELD_PATH));

					const expectedCommands = [
						Commands.setDocument({
							document: DOCUMENT_MODEL.getDocument({ fieldValueChange: { numField: 69 } }),
							changes: [{ type: "ValueChanged", path: DOCUMENT_MODEL.NUM_FIELD_PATH }]
						}),
						Commands.setMessageState({
							messages: {
								[DocumentPath.toString(DOCUMENT_MODEL.NUM_FIELD_PATH)]: {
									validationMessages: [
										{
											element: [
												{
													elementName: "base",
													index: 1
												},
												{
													elementName: "fieldValueChange",
													index: 1
												},
												{
													elementName: "numField",
													index: 1
												}
											],
											errorCode: "Error rule_59deb",
											errorKey: "/base/fieldValueChange/numFieldConstraint",
											errorText: [
												{
													key: "documentModel.ruleErrorMessage.computation-validation\\pvalidate-fields-document.base.fieldValueChange.numFieldConstraint",
													args: {},
													defaults: {
														en: "NumField may not be smaller than 100"
													}
												}
											],
											referencedFields: [
												[
													{
														elementName: "base",
														index: 1
													},
													{
														elementName: "fieldValueChange",
														index: 1
													},
													{
														elementName: "numField",
														index: 1
													}
												]
											],
											severity: "ERROR"
										}
									]
								}
							}
						}),
						Commands.setDataDirty(true)
					];

					MiddlewareHelpers.assertActions(middlewareSpy.spy, expectedCommands);
				});

				it("dispatches a new message state with multiple validation errors when the changed field value triggered more field changes that were invalid", () => {
					setupStore().dispatch(createValueChange("b"));

					const expectedCommands = [
						Commands.setDocument({
							document: DOCUMENT_MODEL.getDocument({
								fieldValueChange: {
									master: "b",
									slave: "e",
									notRelevantString: "Error"
								}
							}),
							changes: [
								{ type: "ValueChanged", path: DOCUMENT_MODEL.MASTER_PATH },
								{ type: "ValueChanged", path: DOCUMENT_MODEL.NOT_RELEVANT_STRING_FIELD_PATH },
								{ type: "ValueChanged", path: DOCUMENT_MODEL.SLAVE_PATH }
							]
						}),
						Commands.setMessageState({
							messages: {
								[DocumentPath.toString(DOCUMENT_MODEL.SLAVE_PATH)]: {
									validationMessages: [
										{
											element: DOCUMENT_MODEL.SLAVE_PATH,
											errorText: [
												{
													key: "documentModel.ruleErrorMessage.computation-validation\\pvalidate-fields-document.base.fieldValueChange.masterSlaveConstraints",
													args: {},
													defaults: { en: 'a combination "b" and "e" is not allowed' }
												}
											],
											errorCode: "Error rule_4655e",
											errorKey: "/base/fieldValueChange/masterSlaveConstraints",
											severity: "ERROR",
											referencedFields: [DOCUMENT_MODEL.SLAVE_PATH, DOCUMENT_MODEL.MASTER_PATH]
										}
									]
								},
								[DocumentPath.toString(DOCUMENT_MODEL.NOT_RELEVANT_STRING_FIELD_PATH)]: {
									validationMessages: [
										{
											element: DOCUMENT_MODEL.NOT_RELEVANT_STRING_FIELD_PATH,
											errorCode: "Error rule_e319d",
											errorKey: "/base/fieldValueChange/masterStringConstraints",
											errorText: [
												{
													key: "documentModel.ruleErrorMessage.computation-validation\\pvalidate-fields-document.base.fieldValueChange.masterStringConstraints",
													args: {},
													defaults: {
														en: 'Value "Error" is not allowed while master is "b"'
													}
												}
											],
											referencedFields: [
												DOCUMENT_MODEL.NOT_RELEVANT_STRING_FIELD_PATH,
												DOCUMENT_MODEL.MASTER_PATH
											],
											severity: "ERROR"
										}
									]
								}
							}
						}),
						Commands.setDataDirty(true)
					];

					MiddlewareHelpers.assertActions(middlewareSpy.spy, expectedCommands);
				});
			});

			describe("Multi Select Value Change", () => {
				it("dispatches a new message state with a validation error for the change field when the changed field value is invalid", () => {
					setupStore().dispatch(
						Events.multiSelectValueChange({
							value: [{ value: "key1" }],
							path: DOCUMENT_MODEL.MULTISELECT_PATH
						})
					);

					const expectedCommands = [
						Commands.setDocument({
							document: DOCUMENT_MODEL.getDocument({
								multiSelectValueChange: {
									multiSelect: [{ value: "key1" }],
									computedFieldMultiSelect: "filled",
									errorFieldMultiSelect: "Error"
								}
							}),
							changes: [
								{ type: "ValueChanged", path: DOCUMENT_MODEL.MULTISELECT_VALUE_PATH },
								{ type: "ValueChanged", path: DOCUMENT_MODEL.COMPUTED_FIELD_MULTISELECT_PATH },
								{ type: "ValueChanged", path: DOCUMENT_MODEL.ERROR_FIELD_MULTISELECT_PATH }
							]
						}),
						Commands.setMessageState({
							messages: {
								[DocumentPath.toString(DOCUMENT_MODEL.ERROR_FIELD_MULTISELECT_PATH)]: {
									validationMessages: [
										{
											element: DOCUMENT_MODEL.ERROR_FIELD_MULTISELECT_PATH,
											errorCode: "Error rule_ee55f",
											errorKey: "/base/multiSelectValueChange/ruleMultiSelect",
											errorText: [
												{
													key: "documentModel.ruleErrorMessage.computation-validation\\pvalidate-fields-document.base.multiSelectValueChange.ruleMultiSelect",
													args: {},
													defaults: {
														en: 'Value "Error" is not allowed while Multi Select is filled'
													}
												}
											],
											referencedFields: [
												DOCUMENT_MODEL.COMPUTED_FIELD_MULTISELECT_PATH,
												DOCUMENT_MODEL.ERROR_FIELD_MULTISELECT_PATH
											],
											severity: "ERROR"
										}
									]
								}
							}
						}),
						Commands.setDataDirty(true)
					];

					MiddlewareHelpers.assertActions(middlewareSpy.spy, expectedCommands);
				});
			});

			describe("Attachment Value Change", () => {
				it("dispatches a new message state with a validation error for the change field when the changed field value is invalid", () => {
					setupStore().dispatch(
						Events.attachmentValueChange({
							value: { attachment_id: "test" },
							path: DOCUMENT_MODEL.ATTACHMENT_PATH
						})
					);

					const expectedCommands = [
						Commands.setDocument({
							document: DOCUMENT_MODEL.getDocument({
								attachmentValueChange: {
									attachment: { attachment_id: "test" },
									computedFieldAttachment: "filled",
									errorFieldAttachment: "Error"
								}
							}),
							changes: [
								{ type: "ValueChanged", path: DOCUMENT_MODEL.ATTACHMENT_ID_PATH },
								{ type: "ValueChanged", path: DOCUMENT_MODEL.ERROR_FIELD_ATTACHMENT_PATH },
								{ type: "ValueChanged", path: DOCUMENT_MODEL.COMPUTED_FIELD_ATTACHMENT_PATH }
							]
						}),
						Commands.setMessageState({
							messages: {
								[DocumentPath.toString(DOCUMENT_MODEL.ERROR_FIELD_ATTACHMENT_PATH)]: {
									validationMessages: [
										{
											element: DOCUMENT_MODEL.ERROR_FIELD_ATTACHMENT_PATH,
											errorCode: "Error rule_c300d",
											errorKey: "/base/attachmentValueChange/ruleAttachment",
											errorText: [
												{
													key: "documentModel.ruleErrorMessage.computation-validation\\pvalidate-fields-document.base.attachmentValueChange.ruleAttachment",
													args: {},
													defaults: {
														en: 'Value "Error" is not allowed while Attachment is filled'
													}
												}
											],
											referencedFields: [
												DOCUMENT_MODEL.ERROR_FIELD_ATTACHMENT_PATH,
												DOCUMENT_MODEL.COMPUTED_FIELD_ATTACHMENT_PATH
											],
											severity: "ERROR"
										}
									]
								}
							}
						}),
						Commands.setDataDirty(true)
					];

					MiddlewareHelpers.assertActions(middlewareSpy.spy, expectedCommands);
				});
			});

			describe("Multi File Upload", () => {
				it(
					"dispatches an empty message state after multi file upload when computed or dependent fields have " +
						"changed due to non-attachment field value changes, even if they are now invalid",
					() => {
						setupStore().dispatch(
							Events.Repeat.multiFileUpload({
								toBeAdded: [
									{
										attachment_id: "test",
										internal_filename: "test",
										mime_type: "text/plain"
									}
								],
								path: DOCUMENT_MODEL.ATTACHMENT_COLLECTION_PATH,
								attachmentModelPath: DOCUMENT_MODEL.ATTACHMENT_IN_COLLECTION_PATH
							})
						);

						const expectedCommands = [
							Commands.setDocument({
								document: DOCUMENT_MODEL.getDocument({
									multiFileUpload: {
										attachmentCollection: [
											{
												attachment: {
													attachment_id: "test",
													internal_filename: "test",
													mime_type: "text/plain"
												}
											}
										],
										computedFieldMultiFileUpload: "one",
										errorFieldMultiFileUpload: "Error"
									}
								}),
								changes: [
									{ type: "GroupAdded", path: DOCUMENT_MODEL.ATTACHMENT_COLLECTION_PATH },
									{
										type: "ValueChanged",
										path: DOCUMENT_MODEL.ERROR_FIELD_MULTI_FILE_UPLOAD_PATH
									},
									{
										type: "ValueChanged",
										path: DOCUMENT_MODEL.COMPUTED_FIELD_MULTI_FILE_UPLOAD_PATH
									}
								]
							}),
							Commands.setMessageState({
								messages: {}
							}),
							Commands.setDataDirty(true)
						];

						MiddlewareHelpers.assertActions(middlewareSpy.spy, expectedCommands);
					}
				);

				it("dispatches a new message state with errors immediately for invalid attachment fields after multi file upload", () => {
					setupStore().dispatch(
						Events.Repeat.multiFileUpload({
							toBeAdded: [
								{
									attachment_id: "test",
									internal_filename: "test",
									mime_type: "text/plain",
									size: 100
								}
							],
							path: DOCUMENT_MODEL.ATTACHMENT_COLLECTION_WITH_ERROR_PATH,
							attachmentModelPath: DOCUMENT_MODEL.ATTACHMENT_WITH_ERROR_IN_COLLECTION_PATH
						})
					);

					const expectedCommands = [
						Commands.setDocument({
							document: DOCUMENT_MODEL.getDocument({
								multiFileUploadAttachmentError: {
									attachmentCollection: [
										{
											attachment: {
												attachment_id: "test",
												internal_filename: "test",
												mime_type: "text/plain",
												size: 100
											}
										}
									]
								}
							}),
							changes: [
								{ type: "GroupAdded", path: DOCUMENT_MODEL.ATTACHMENT_COLLECTION_WITH_ERROR_PATH }
							]
						}),
						Commands.setMessageState({
							messages: {
								"/base[1]/multiFileUploadAttachmentError[1]/attachmentCollection[1]/attachment[1]/size[1]":
									{
										validationMessages: [
											{
												element: DOCUMENT_MODEL.ERROR_FIELD_ATTACHMENT_MULTI_FILE_UPLOAD_PATH,
												errorCode: "Error rule_1a4f1",
												errorKey:
													"/base/multiFileUploadAttachmentError/attachmentCollection/ruleAttachmentSizeNonZero",
												errorText: [
													{
														key: "documentModel.ruleErrorMessage.computation-validation\\pvalidate-fields-document.base.multiFileUploadAttachmentError.attachmentCollection.ruleAttachmentSizeNonZero",
														args: {},
														defaults: {
															en: "Attachment size must be 0"
														}
													}
												],
												referencedFields: [
													DOCUMENT_MODEL.ERROR_FIELD_ATTACHMENT_MULTI_FILE_UPLOAD_PATH
												],
												severity: "ERROR"
											}
										]
									}
							}
						}),
						Commands.setDataDirty(true)
					];

					MiddlewareHelpers.assertActions(middlewareSpy.spy, expectedCommands);
				});

				it("dispatches a validation error immediately for a field with an initial value whose validation rule references an attachment field", () => {
					setupStore().dispatch(
						Events.Repeat.multiFileUpload({
							toBeAdded: [
								{
									size: 100,
									internal_filename: "test",
									mime_type: "text/plain"
								}
							],
							path: DOCUMENT_MODEL.ATTACHMENT_COLLECTION_WITH_INITIAL_VALUE_PATH,
							attachmentModelPath: DOCUMENT_MODEL.ATTACHMENT_WITH_INITIAL_VALUE_IN_COLLECTION_PATH
						})
					);

					const expectedCommands = [
						Commands.setDocument({
							document: DOCUMENT_MODEL.getDocument({
								multiFileUploadWithInitialValue: {
									attachmentCollection: [
										{
											attachment: {
												size: 100,
												internal_filename: "test",
												mime_type: "text/plain"
											},
											noteField: "initialized"
										}
									]
								}
							}),
							changes: [
								{
									type: "GroupAdded",
									path: DOCUMENT_MODEL.ATTACHMENT_COLLECTION_WITH_INITIAL_VALUE_PATH
								}
							]
						}),
						Commands.setMessageState({
							messages: {
								"/base[1]/multiFileUploadWithInitialValue[1]/attachmentCollection[1]/noteField[1]":
									{
										validationMessages: [
											{
												element: DOCUMENT_MODEL.NOTE_FIELD_IN_INITIAL_VALUE_COLLECTION_PATH,
												errorCode: "Error rule_5e6f7",
												errorKey:
													"/base/multiFileUploadWithInitialValue/attachmentCollection/ruleNoteFieldWithAttachment",
												errorText: [
													{
														key: "documentModel.ruleErrorMessage.computation-validation\\pvalidate-fields-document.base.multiFileUploadWithInitialValue.attachmentCollection.ruleNoteFieldWithAttachment",
														args: {},
														defaults: {
															en: "Note field must not have its initial value when an attachment is uploaded"
														}
													}
												],
												referencedFields: [
													DOCUMENT_MODEL.NOTE_FIELD_IN_INITIAL_VALUE_COLLECTION_PATH,
													DOCUMENT_MODEL.ATTACHMENT_SIZE_IN_INITIAL_VALUE_COLLECTION_PATH
												],
												severity: "ERROR"
											}
										]
									}
							}
						}),
						Commands.setDataDirty(true)
					];

					MiddlewareHelpers.assertActions(middlewareSpy.spy, expectedCommands);
				});
			});
		});
	});
}
