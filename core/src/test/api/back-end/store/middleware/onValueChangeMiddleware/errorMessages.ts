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

import { deepStrictEqual, strictEqual, notStrictEqual } from "node:assert/strict";

import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { EngineStore } from "../../../../../../back-end/store/index.js";
import { Events, UiStateSelectors } from "../../../../../../back-end/store/index.js";
import { DocumentPath } from "../../../../../../models/index.js";
import { SetupHelpers } from "../../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../../utils/setupFixture.js";
import { createDocumentPath } from "../../../../../utils/test-model-helpers/dependent-enumeration.js";
import { createValidationEntry } from "../../../../../utils/validation.js";

export function executeTestsForErrorMessages(): void {
	const models = setupModelsFixture("dependencies.element");

	function setupStore({
		data,
		ui
	}: {
		data?: Partial<EngineStore.DataState>;
		ui?: Partial<EngineStore.UIState>;
	} = {}) {
		return SetupHelpers.createTestStore({
			storeConfig: { models, data: data ?? {}, ui: ui ?? {} }
		});
	}

	const MASTER_FIELD_PATH = createDocumentPath(["ErrorMessages"], ["masterField"]);
	const DEPENDENT_FIELD_VALUE = createDocumentPath(["ErrorMessages"], ["DependentFieldValue"]);
	const DEPENDENT_VALUE = createDocumentPath(["ErrorMessages"], ["DependentValue"]);
	const DEPENDENT_FIELD_CLEAR = createDocumentPath(["ErrorMessages"], ["DependentFieldClear"]);

	const DEPENDENT_FIELD_VALUE_OTHER = createDocumentPath(["OtherScreen"], ["DependentFieldValue"]);
	const DEPENDENT_VALUE_OTHER = createDocumentPath(["OtherScreen"], ["DependentValue"]);
	const DEPENDENT_FIELD_CLEAR_OTHER = createDocumentPath(["OtherScreen"], ["DependentFieldClear"]);

	const ATTACHMENT_TRIGGER_FIELD_PATH = createDocumentPath(
		["ErrorMessages"],
		["triggerAttachment"]
	);
	const DEPENDENT_VALUE_TRIGGERED_BY_ATTACHMENT_COMPUTATION = createDocumentPath(
		["ErrorMessages"],
		["DependentValueTriggeredByComputationOnAttachment"]
	);

	const MULTI_SELECT_TRIGGER_FIELD_PATH = createDocumentPath(
		["ErrorMessages"],
		["triggerMultiSelect"]
	);
	const DEPENDENT_VALUE_TRIGGERED_BY_MULTI_SELECT_COMPUTATION = createDocumentPath(
		["ErrorMessages"],
		["DependentValueTriggeredByComputationOnMultiSelect"]
	);

	const DEPENDENT_VALUE_TRIGGERED_BY_ATTACHMENT_COMPUTATION_OTHER = createDocumentPath(
		["OtherScreen"],
		["DependentValueTriggeredByComputationOnAttachment"]
	);
	const DEPENDENT_VALUE_TRIGGERED_BY_MULTI_SELECT_COMPUTATION_OTHER = createDocumentPath(
		["OtherScreen"],
		["DependentValueTriggeredByComputationOnMultiSelect"]
	);

	const ATTACHMENT_FILENAME_TRIGGER_ERRORS = "trigger.jpg";
	const ATTACHMENT_FILENAME_RESOLVE_ERRORS = "resolve.jpg";
	const ATTACHMENT_FILENAME_TRIGGER_ERRORS_BOTH = "triggerBoth.jpg";
	const ATTACHMENT_FILENAME_RESOLVE_ERRORS_BOTH = "resolveBoth.jpg";
	const ATTACHMENT_FILENAME_TRIGGER_ERRORS_OTHER = "triggerOther.jpg";
	const ATTACHMENT_FILENAME_RESOLVE_ERRORS_OTHER = "resolveOther.jpg";

	const TRIGGER_ERRORS = "key_1";
	const RESOLVE_ERRORS = "key_2";
	const TRIGGER_ERRORS_BOTH = "key_3";
	const RESOLVE_ERRORS_BOTH = "key_4";
	const TRIGGER_ERRORS_OTHER = "key_5";
	const RESOLVE_ERRORS_OTHER = "key_6";

	const ERROR_COUNT = 3;
	const ERROR_COUNT_OTHER = 3;

	const errorPathMasterField = DocumentPath.toString(MASTER_FIELD_PATH);
	const errorPathDependentValue = DocumentPath.toString(DEPENDENT_VALUE);
	const errorPathDependentFieldValue = DocumentPath.toString(DEPENDENT_FIELD_VALUE);
	const errorPathFieldClear = DocumentPath.toString(DEPENDENT_FIELD_CLEAR);

	const errorPathDependentValueOtherScreen = DocumentPath.toString(DEPENDENT_VALUE_OTHER);
	const errorPathDependentFieldValueOtherScreen = DocumentPath.toString(
		DEPENDENT_FIELD_VALUE_OTHER
	);
	const errorPathFieldClearOtherScreen = DocumentPath.toString(DEPENDENT_FIELD_CLEAR_OTHER);

	const errorPathDependentValueTriggeredByComputationOnAttachment = DocumentPath.toString(
		DEPENDENT_VALUE_TRIGGERED_BY_ATTACHMENT_COMPUTATION
	);
	const errorPathDependentValueTriggeredByComputationOnMultiSelect = DocumentPath.toString(
		DEPENDENT_VALUE_TRIGGERED_BY_MULTI_SELECT_COMPUTATION
	);

	const errorPathDependentValueTriggeredByComputationOnAttachmentOtherScreen =
		DocumentPath.toString(DEPENDENT_VALUE_TRIGGERED_BY_ATTACHMENT_COMPUTATION_OTHER);
	const errorPathDependentValueTriggeredByComputationOnMultiSelectOtherScreen =
		DocumentPath.toString(DEPENDENT_VALUE_TRIGGERED_BY_MULTI_SELECT_COMPUTATION_OTHER);

	const ui: Partial<EngineStore.UIState> = {
		screenLocation: [
			{
				locationPath: [
					{
						elementName: "Error Messages"
					}
				],
				path: []
			}
		]
	};

	describe("Changing the master value to a wrong input", () => {
		describe("which also triggers value changes only on the same screen, which result in errors", () => {
			it("keeps all validation errors and stores them", () => {
				const store = setupStore({
					data: {
						document: { ErrorMessages: { dummyField: "World", DependentFieldClear: "xxx" } }
					},
					ui
				});
				store.dispatch(
					Events.valueChange({
						path: MASTER_FIELD_PATH,
						value: TRIGGER_ERRORS,
						formModelElementPath: []
					})
				);
				const messages = UiStateSelectors.messages()(store.getState());
				strictEqual(Object.keys(messages).length, ERROR_COUNT);
			});

			it("sets the correct error message for the `MasterField`", () => {
				const store = setupStore({ ui });
				store.dispatch(
					Events.valueChange({
						path: MASTER_FIELD_PATH,
						value: TRIGGER_ERRORS,
						formModelElementPath: []
					})
				);
				// Error in MasterField
				const messages = UiStateSelectors.messages()(store.getState());
				const errorMasterField = messages[errorPathMasterField];
				notStrictEqual(
					errorMasterField,
					undefined,
					"Expected to find an error for the `MasterField`!"
				);
				deepStrictEqual(errorMasterField?.validationMessages[0].errorText, [
					{
						key: "documentModel.ruleErrorMessage.dependencies\\pelement-document.ErrorMessages.neverTrue",
						args: {},
						defaults: {
							en: "Wrong choice!"
						}
					}
				]);
			});

			it("sets the correct error message for the `DependentValue`", () => {
				const store = setupStore({ ui });
				store.dispatch(
					Events.valueChange({
						path: MASTER_FIELD_PATH,
						value: TRIGGER_ERRORS,
						formModelElementPath: []
					})
				);

				// Error in DependentValue
				const messages = UiStateSelectors.messages()(store.getState());
				const errorDependentValue = messages[errorPathDependentValue];
				notStrictEqual(
					errorDependentValue,
					undefined,
					"Expected to find an error for the `DependentValue`!"
				);
				deepStrictEqual(errorDependentValue?.validationMessages[0].errorText, [
					{
						key: "documentModel.ruleErrorMessage.dependencies\\pelement-document.ErrorMessages.notHello",
						args: {},
						defaults: {
							en: 'Content should not be "Hello"!'
						}
					}
				]);
			});

			it("sets the correct error message for the `DependentFieldValue`", () => {
				const store = setupStore({ ui });
				store.dispatch(
					Events.valueChange({
						path: MASTER_FIELD_PATH,
						value: TRIGGER_ERRORS,
						formModelElementPath: []
					})
				);

				// Error in DependentFieldValue
				const messages = UiStateSelectors.messages()(store.getState());
				const errorDependentFieldValue = messages[errorPathDependentFieldValue];
				notStrictEqual(
					errorDependentFieldValue,
					undefined,
					"Expected to find an error for the `DependentFieldValue`!"
				);
				deepStrictEqual(errorDependentFieldValue?.validationMessages[0].errorText, [
					{
						key: "documentModel.ruleErrorMessage.dependencies\\pelement-document.ErrorMessages.notWorld",
						args: {},
						defaults: {
							en: 'Content should not be "World"!'
						}
					}
				]);
			});

			it("sets the correct error message for the `DependentFieldClear`", () => {
				const store = setupStore({
					data: {
						document: { ErrorMessages: { dummyField: "World", DependentFieldClear: "xxx" } }
					},
					ui
				});
				store.dispatch(
					Events.valueChange({
						path: MASTER_FIELD_PATH,
						value: TRIGGER_ERRORS,
						formModelElementPath: []
					})
				);

				// there should be no error in DependentClearValue since clear does not happen immediately
				const messages = UiStateSelectors.messages()(store.getState());
				const errorDependentFieldClear = messages[errorPathFieldClear];
				strictEqual(
					errorDependentFieldClear,
					undefined,
					"Expected to find no error for the `DependentClearValue`!"
				);
			});
		});

		describe("which also triggers value changes on the same and another screen, which result in errors", () => {
			it("keeps all validation errors on the same screen, but none on the other", () => {
				const store = setupStore({
					data: {
						document: {
							ErrorMessages: { dummyField: "World", DependentFieldClear: "xxx" },
							OtherScreen: { dummyField: "World", DependentFieldClear: "xxx" }
						}
					},
					ui
				});
				store.dispatch(Events.valueChange({ path: MASTER_FIELD_PATH, value: TRIGGER_ERRORS_BOTH }));
				const messages = UiStateSelectors.messages()(store.getState());
				strictEqual(Object.keys(messages).length, ERROR_COUNT);
			});

			it("sets the correct error message for the `MasterField`", () => {
				const store = setupStore({ ui });
				store.dispatch(Events.valueChange({ path: MASTER_FIELD_PATH, value: TRIGGER_ERRORS_BOTH }));
				// Error in MasterField
				const messages = UiStateSelectors.messages()(store.getState());
				const errorMasterField = messages[errorPathMasterField];
				notStrictEqual(
					errorMasterField,
					undefined,
					"Expected to find an error for the `MasterField`!"
				);
				deepStrictEqual(errorMasterField?.validationMessages[0].errorText, [
					{
						key: "documentModel.ruleErrorMessage.dependencies\\pelement-document.ErrorMessages.neverTrue",
						args: {},
						defaults: {
							en: "Wrong choice!"
						}
					}
				]);
			});

			it("sets the correct error message for the `DependentValue` on the same screen", () => {
				const store = setupStore({ ui });
				store.dispatch(Events.valueChange({ path: MASTER_FIELD_PATH, value: TRIGGER_ERRORS_BOTH }));

				// Error in DependentValue
				const messages = UiStateSelectors.messages()(store.getState());
				const errorDependentValue = messages[errorPathDependentValue];
				notStrictEqual(
					errorDependentValue,
					undefined,
					"Expected to find an error for the `DependentValue`!"
				);
				deepStrictEqual(
					errorDependentValue?.validationMessages[0].errorText,
					[
						{
							key: "documentModel.ruleErrorMessage.dependencies\\pelement-document.ErrorMessages.notHello",
							args: {},
							defaults: {
								en: 'Content should not be "Hello"!'
							}
						}
					],
					"Wrong error message for `DependentValue`"
				);
			});

			it("sets the correct error message for the `DependentFieldValue` on the same screen", () => {
				const store = setupStore({ ui });
				store.dispatch(Events.valueChange({ path: MASTER_FIELD_PATH, value: TRIGGER_ERRORS_BOTH }));

				// Error in DependentFieldValue
				const messages = UiStateSelectors.messages()(store.getState());
				const errorDependentFieldValue = messages[errorPathDependentFieldValue];
				notStrictEqual(
					errorDependentFieldValue,
					undefined,
					"Expected to find an error for the `DependentFieldValue`!"
				);
				deepStrictEqual(
					errorDependentFieldValue?.validationMessages[0].errorText,
					[
						{
							key: "documentModel.ruleErrorMessage.dependencies\\pelement-document.ErrorMessages.notWorld",
							args: {},
							defaults: {
								en: 'Content should not be "World"!'
							}
						}
					],
					"Wrong error message for `DependentFieldValue`"
				);
			});

			it("sets the correct error message for the `DependentFieldClear` on the same screen", () => {
				const store = setupStore({
					data: {
						document: { ErrorMessages: { dummyField: "World", DependentFieldClear: "xxx" } }
					},
					ui
				});
				store.dispatch(Events.valueChange({ path: MASTER_FIELD_PATH, value: TRIGGER_ERRORS_BOTH }));

				// there should be no error in DependentClearValue since clear does not happen immediately
				const messages = UiStateSelectors.messages()(store.getState());
				const errorDependentFieldClear = messages[errorPathFieldClear];
				strictEqual(
					errorDependentFieldClear,
					undefined,
					"Expected to find no error for the `DependentClearValue`!"
				);
			});

			it("does not set an error message for the `DependentValue` on the other screen", () => {
				const store = setupStore({ ui });
				store.dispatch(Events.valueChange({ path: MASTER_FIELD_PATH, value: TRIGGER_ERRORS_BOTH }));

				// No error in DependentValue
				const messages = UiStateSelectors.messages()(store.getState());
				const errorDependentValue = messages[errorPathDependentValueOtherScreen];
				strictEqual(
					errorDependentValue,
					undefined,
					"Expected to find no error for the `DependentValue` on the other screen!"
				);
			});

			it("does not set an error message for the `DependentFieldValue` on the other screen", () => {
				const store = setupStore({ ui });
				store.dispatch(Events.valueChange({ path: MASTER_FIELD_PATH, value: TRIGGER_ERRORS_BOTH }));

				// No error in DependentFieldValue
				const messages = UiStateSelectors.messages()(store.getState());
				const errorDependentFieldValue = messages[errorPathDependentFieldValueOtherScreen];
				strictEqual(
					errorDependentFieldValue,
					undefined,
					"Expected to find no error for the `DependentFieldValue` on the other screen!"
				);
			});

			it("does not set an error message for the `DependentFieldClear` on the other screen", () => {
				const store = setupStore({
					data: {
						document: { OtherScreen: { dummyField: "World", DependentFieldClear: "xxx" } }
					},
					ui
				});
				store.dispatch(Events.valueChange({ path: MASTER_FIELD_PATH, value: TRIGGER_ERRORS_BOTH }));

				// No error in DependentClearValue
				const messages = UiStateSelectors.messages()(store.getState());
				const errorDependentFieldClear = messages[errorPathFieldClearOtherScreen];
				strictEqual(
					errorDependentFieldClear,
					undefined,
					"Expected to find no error for the `DependentClearValue` on the other screen!"
				);
			});
		});

		describe("which also triggers value changes only on another screen, which result in errors", () => {
			it("does not create validation errors on the other screen", () => {
				const store = setupStore({
					data: {
						document: { OtherScreen: { dummyField: "World", DependentFieldClear: "xxx" } }
					},
					ui
				});
				store.dispatch(
					Events.valueChange({ path: MASTER_FIELD_PATH, value: TRIGGER_ERRORS_OTHER })
				);
				const messages = UiStateSelectors.messages()(store.getState());
				strictEqual(Object.keys(messages).length, 0);
			});

			it("does not set an error message for the `DependentValue` on the other screen", () => {
				const store = setupStore({ ui });
				store.dispatch(
					Events.valueChange({ path: MASTER_FIELD_PATH, value: TRIGGER_ERRORS_OTHER })
				);

				// No error in DependentValue
				const messages = UiStateSelectors.messages()(store.getState());
				const errorDependentValue = messages[errorPathDependentValueOtherScreen];
				strictEqual(
					errorDependentValue,
					undefined,
					"Expected to find no error for the `DependentValue` on the other screen!"
				);
			});

			it("does not set an error message for the `DependentFieldValue` on the other screen", () => {
				const store = setupStore({ ui });
				store.dispatch(
					Events.valueChange({ path: MASTER_FIELD_PATH, value: TRIGGER_ERRORS_OTHER })
				);

				// No error in DependentFieldValue
				const messages = UiStateSelectors.messages()(store.getState());
				const errorDependentFieldValue = messages[errorPathDependentFieldValueOtherScreen];
				strictEqual(
					errorDependentFieldValue,
					undefined,
					"Expected to find no error for the `DependentFieldValue` on the other screen!"
				);
			});

			it("does not set an error message for the `DependentFieldClear` on the other screen", () => {
				const store = setupStore({
					data: {
						document: { OtherScreen: { dummyField: "World", DependentFieldClear: "xxx" } }
					},
					ui
				});
				store.dispatch(
					Events.valueChange({ path: MASTER_FIELD_PATH, value: TRIGGER_ERRORS_OTHER })
				);

				// No error in DependentClearValue
				const messages = UiStateSelectors.messages()(store.getState());
				const errorDependentFieldClear = messages[errorPathFieldClearOtherScreen];
				strictEqual(
					errorDependentFieldClear,
					undefined,
					"Expected to find no error for the `DependentClearValue` on the other screen!"
				);
			});
		});

		describe("via computation", () => {
			describe("on an attachment", () => {
				describe("which also triggers value changes only on the same screen, which result in errors", () => {
					it("creates all validation errors and stores them", () => {
						const store = setupStore({
							ui
						});
						store.dispatch(
							attachmentValueChange(
								ATTACHMENT_FILENAME_TRIGGER_ERRORS,
								ATTACHMENT_TRIGGER_FIELD_PATH
							)
						);
						const messages = UiStateSelectors.messages()(store.getState());
						strictEqual(Object.keys(messages).length, 1);
					});

					it("sets the correct error message for the `DependentValueTriggeredByComputationOnAttachment`", () => {
						const store = setupStore({ ui });
						store.dispatch(
							attachmentValueChange(
								ATTACHMENT_FILENAME_TRIGGER_ERRORS,
								ATTACHMENT_TRIGGER_FIELD_PATH
							)
						);

						// Error in DependentValueTriggeredByComputationOnAttachment
						const messages = UiStateSelectors.messages()(store.getState());
						const errorDependentValueTriggeredByComputationOnAttachment =
							messages[errorPathDependentValueTriggeredByComputationOnAttachment];
						notStrictEqual(
							errorDependentValueTriggeredByComputationOnAttachment,
							undefined,
							"Expected to find an error for the `DependentValueTriggeredByComputationOnAttachment`!"
						);
						deepStrictEqual(
							errorDependentValueTriggeredByComputationOnAttachment?.validationMessages[0]
								.errorText,
							[
								{
									args: {},
									defaults: {
										en: 'Content should not be "Hello"!'
									},
									key: "documentModel.ruleErrorMessage.dependencies\\pelement-document.ErrorMessages.notHelloTriggeredByComputationOnAttachment"
								}
							],
							"Wrong error message for `DependentValueTriggeredByComputationOnAttachment`"
						);
					});
				});

				describe("which also triggers value changes on the same and another screen, which result in errors", () => {
					it("creates the validation error on the same screen, but not on the other", () => {
						const store = setupStore({
							ui
						});
						store.dispatch(
							attachmentValueChange(
								ATTACHMENT_FILENAME_TRIGGER_ERRORS_BOTH,
								ATTACHMENT_TRIGGER_FIELD_PATH
							)
						);
						const messages = UiStateSelectors.messages()(store.getState());
						strictEqual(Object.keys(messages).length, 1);
					});

					it("sets the correct error message for the `DependentValueTriggeredByComputationOnAttachment` on the same screen", () => {
						const store = setupStore({ ui });
						store.dispatch(
							attachmentValueChange(
								ATTACHMENT_FILENAME_TRIGGER_ERRORS_BOTH,
								ATTACHMENT_TRIGGER_FIELD_PATH
							)
						);

						// Error in DependentValueTriggeredByComputationOnAttachment
						const messages = UiStateSelectors.messages()(store.getState());
						const errorDependentValueTriggeredByComputationOnAttachment =
							messages[errorPathDependentValueTriggeredByComputationOnAttachment];
						notStrictEqual(
							errorDependentValueTriggeredByComputationOnAttachment,
							undefined,
							"Expected to find an error for the `DependentValueTriggeredByComputationOnAttachment`!"
						);
						deepStrictEqual(
							errorDependentValueTriggeredByComputationOnAttachment?.validationMessages[0]
								.errorText,
							[
								{
									args: {},
									defaults: {
										en: 'Content should not be "Hello"!'
									},
									key: "documentModel.ruleErrorMessage.dependencies\\pelement-document.ErrorMessages.notHelloTriggeredByComputationOnAttachment"
								}
							],
							"Wrong error message for `DependentValueTriggeredByComputationOnAttachment`"
						);
					});

					it("does not set an error message for the `DependentValueTriggeredByComputationOnAttachment` on the other screen", () => {
						const store = setupStore({ ui });
						store.dispatch(
							attachmentValueChange(
								ATTACHMENT_FILENAME_TRIGGER_ERRORS_BOTH,
								ATTACHMENT_TRIGGER_FIELD_PATH
							)
						);

						// No error in DependentValueTriggeredByComputationOnAttachment
						const messages = UiStateSelectors.messages()(store.getState());
						const errorDependentValueTriggeredByComputationOnAttachment =
							messages[errorPathDependentValueTriggeredByComputationOnAttachmentOtherScreen];
						strictEqual(
							errorDependentValueTriggeredByComputationOnAttachment,
							undefined,
							"Expected to find no error for the `DependentValueTriggeredByComputationOnAttachment` on the other screen!"
						);
					});
				});

				describe("which also triggers value changes only on another screen, which result in errors", () => {
					it("does not create validation errors", () => {
						const store = setupStore({
							ui
						});
						store.dispatch(
							attachmentValueChange(
								ATTACHMENT_FILENAME_TRIGGER_ERRORS_OTHER,
								ATTACHMENT_TRIGGER_FIELD_PATH
							)
						);
						const messages = UiStateSelectors.messages()(store.getState());
						strictEqual(Object.keys(messages).length, 0);
					});

					it("does not set an error message for the `DependentValueTriggeredByComputationOnAttachment` on the other screen", () => {
						const store = setupStore({ ui });
						store.dispatch(
							attachmentValueChange(
								ATTACHMENT_FILENAME_TRIGGER_ERRORS_OTHER,
								ATTACHMENT_TRIGGER_FIELD_PATH
							)
						);

						// No error in DependentValueTriggeredByComputationOnAttachment
						const messages = UiStateSelectors.messages()(store.getState());
						const errorDependentValueTriggeredByComputationOnAttachment =
							messages[errorPathDependentValueTriggeredByComputationOnAttachmentOtherScreen];
						strictEqual(
							errorDependentValueTriggeredByComputationOnAttachment,
							undefined,
							"Expected to find no error for the `DependentValueTriggeredByComputationOnAttachment` on the other screen!"
						);
					});
				});
			});

			describe("on a multi-select", () => {
				describe("which also triggers value changes only on the same screen, which result in errors", () => {
					it("keeps all validation errors and stores them", () => {
						const store = setupStore({
							ui
						});
						store.dispatch(
							Events.multiSelectValueChange({
								path: MULTI_SELECT_TRIGGER_FIELD_PATH,
								value: [{ value: TRIGGER_ERRORS }]
							})
						);
						const messages = UiStateSelectors.messages()(store.getState());
						strictEqual(Object.keys(messages).length, 1);
					});

					it("sets the correct error message for the `DependentValueTriggeredByComputationOnMultiSelect`", () => {
						const store = setupStore({ ui });
						store.dispatch(
							Events.multiSelectValueChange({
								path: MULTI_SELECT_TRIGGER_FIELD_PATH,
								value: [{ value: TRIGGER_ERRORS }]
							})
						);

						// Error in DependentValueTriggeredByComputationOnMultiSelect
						const messages = UiStateSelectors.messages()(store.getState());
						const errorDependentValueTriggeredByComputationOnMultiSelect =
							messages[errorPathDependentValueTriggeredByComputationOnMultiSelect];
						notStrictEqual(
							errorDependentValueTriggeredByComputationOnMultiSelect,
							undefined,
							"Expected to find an error for the `DependentValueTriggeredByComputationOnMultiSelect`!"
						);
						deepStrictEqual(
							errorDependentValueTriggeredByComputationOnMultiSelect?.validationMessages[0]
								.errorText,
							[
								{
									args: {},
									defaults: {
										en: 'Content should not be "Hello"!'
									},
									key: "documentModel.ruleErrorMessage.dependencies\\pelement-document.ErrorMessages.notHelloTriggeredByComputationOnMultiSelect"
								}
							],
							"Wrong error message for `DependentValueTriggeredByComputationOnMultiSelect`"
						);
					});
				});

				describe("which also triggers value changes on the same and another screen, which result in errors", () => {
					it("creates the validation error on the same screen, but not on the other", () => {
						const store = setupStore({
							ui
						});
						store.dispatch(
							Events.multiSelectValueChange({
								path: MULTI_SELECT_TRIGGER_FIELD_PATH,
								value: [{ value: TRIGGER_ERRORS_BOTH }]
							})
						);
						const messages = UiStateSelectors.messages()(store.getState());
						strictEqual(Object.keys(messages).length, 1);
					});

					it("sets the correct error message for the `DependentValueTriggeredByComputationOnMultiSelect` on the same screen", () => {
						const store = setupStore({ ui });
						store.dispatch(
							Events.multiSelectValueChange({
								path: MULTI_SELECT_TRIGGER_FIELD_PATH,
								value: [{ value: TRIGGER_ERRORS_BOTH }]
							})
						);

						// Error in DependentValueTriggeredByComputationOnMultiSelect
						const messages = UiStateSelectors.messages()(store.getState());
						const errorDependentValueTriggeredByComputationOnMultiSelect =
							messages[errorPathDependentValueTriggeredByComputationOnMultiSelect];
						notStrictEqual(
							errorDependentValueTriggeredByComputationOnMultiSelect,
							undefined,
							"Expected to find an error for the `DependentValueTriggeredByComputationOnMultiSelect`!"
						);
						deepStrictEqual(
							errorDependentValueTriggeredByComputationOnMultiSelect?.validationMessages[0]
								.errorText,
							[
								{
									args: {},
									defaults: {
										en: 'Content should not be "Hello"!'
									},
									key: "documentModel.ruleErrorMessage.dependencies\\pelement-document.ErrorMessages.notHelloTriggeredByComputationOnMultiSelect"
								}
							],
							"Wrong error message for `DependentValueTriggeredByComputationOnMultiSelect`"
						);
					});

					it("does not set an error message for the `DependentValueTriggeredByComputationOnMultiSelect` on the other screen", () => {
						const store = setupStore({ ui });
						store.dispatch(
							Events.multiSelectValueChange({
								path: MULTI_SELECT_TRIGGER_FIELD_PATH,
								value: [{ value: TRIGGER_ERRORS_BOTH }]
							})
						);

						// No error in DependentValueTriggeredByComputationOnMultiSelect
						const messages = UiStateSelectors.messages()(store.getState());
						const errorDependentValueTriggeredByComputationOnMultiSelect =
							messages[errorPathDependentValueTriggeredByComputationOnMultiSelectOtherScreen];
						strictEqual(
							errorDependentValueTriggeredByComputationOnMultiSelect,
							undefined,
							"Expected to find no error for the `DependentValueTriggeredByComputationOnMultiSelect` on the other screen!"
						);
					});
				});

				describe("which also triggers value changes only on another screen, which result in errors", () => {
					it("does not create validation errors", () => {
						const store = setupStore({
							ui
						});
						store.dispatch(
							Events.multiSelectValueChange({
								path: MULTI_SELECT_TRIGGER_FIELD_PATH,
								value: [{ value: TRIGGER_ERRORS_OTHER }]
							})
						);
						const messages = UiStateSelectors.messages()(store.getState());
						strictEqual(Object.keys(messages).length, 0);
					});

					it("does not set an error message for the `DependentValueTriggeredByComputationOnMultiSelect` on the other screen", () => {
						const store = setupStore({ ui });
						store.dispatch(
							Events.multiSelectValueChange({
								path: MULTI_SELECT_TRIGGER_FIELD_PATH,
								value: [{ value: TRIGGER_ERRORS_OTHER }]
							})
						);

						// No error in DependentValueTriggeredByComputationOnMultiSelect
						const messages = UiStateSelectors.messages()(store.getState());
						const errorDependentValue =
							messages[errorPathDependentValueTriggeredByComputationOnMultiSelectOtherScreen];
						strictEqual(
							errorDependentValue,
							undefined,
							"Expected to find no error for the `DependentValueTriggeredByComputationOnMultiSelect` on the other screen!"
						);
					});
				});
			});
		});
	});

	describe("Changing the master value to a valid input", () => {
		describe("which also triggers value changes only on the same screen, which resolve errors", () => {
			it("deletes all errors", () => {
				const store = setupStore({
					data: {
						document: {
							ErrorMessages: {
								masterField: "key_1",
								DependentValue: "Hello",
								DependentFieldValue: "World",
								DependentFieldClear: null
							}
						}
					},
					ui: {
						...ui,
						messages: {
							...createValidationEntry({ path: MASTER_FIELD_PATH }),
							...createValidationEntry({ path: DEPENDENT_VALUE }),
							...createValidationEntry({ path: DEPENDENT_FIELD_VALUE })
						}
					}
				});

				const messagesBefore = UiStateSelectors.messages()(store.getState());
				strictEqual(Object.keys(messagesBefore).length, ERROR_COUNT);

				store.dispatch(
					Events.valueChange({
						path: MASTER_FIELD_PATH,
						value: RESOLVE_ERRORS,
						formModelElementPath: []
					})
				);
				const messagesAfter = UiStateSelectors.messages()(store.getState());
				strictEqual(Object.keys(messagesAfter).length, 0);
			});
		});

		describe("which also triggers value changes on the same and another screen, which resolve errors", () => {
			it("deletes all errors on both screens", () => {
				const store = setupStore({
					data: {
						document: {
							ErrorMessages: {
								masterField: "key_1",
								DependentValue: "Hello",
								DependentFieldValue: "World",
								DependentFieldClear: null
							},
							OtherScreen: {
								DependentValue: "Hello",
								DependentFieldValue: "World",
								DependentFieldClear: null
							}
						}
					},
					ui: {
						...ui,
						messages: {
							...createValidationEntry({ path: MASTER_FIELD_PATH }),
							...createValidationEntry({ path: DEPENDENT_VALUE }),
							...createValidationEntry({ path: DEPENDENT_FIELD_VALUE }),
							...createValidationEntry({ path: DEPENDENT_VALUE_OTHER }),
							...createValidationEntry({ path: DEPENDENT_FIELD_VALUE_OTHER })
						}
					}
				});

				const messagesBefore = UiStateSelectors.messages()(store.getState());
				strictEqual(Object.keys(messagesBefore).length, 5);

				store.dispatch(Events.valueChange({ path: MASTER_FIELD_PATH, value: RESOLVE_ERRORS_BOTH }));
				const messagesAfter = UiStateSelectors.messages()(store.getState());
				strictEqual(Object.keys(messagesAfter).length, 0);
			});
		});

		describe("which also triggers value changes only on another screen, which resolve errors", () => {
			it("deletes all errors on the other screen", () => {
				const store = setupStore({
					data: {
						document: {
							OtherScreen: {
								DependentValue: "Hello",
								DependentFieldValue: "World",
								DependentFieldClear: null
							}
						}
					},
					ui: {
						...ui,
						messages: {
							...createValidationEntry({ path: DEPENDENT_VALUE_OTHER }),
							...createValidationEntry({ path: DEPENDENT_FIELD_VALUE_OTHER })
						}
					}
				});

				const messagesBefore = UiStateSelectors.messages()(store.getState());
				strictEqual(Object.keys(messagesBefore).length, 2);

				store.dispatch(
					Events.valueChange({ path: MASTER_FIELD_PATH, value: RESOLVE_ERRORS_OTHER })
				);
				const messagesAfter = UiStateSelectors.messages()(store.getState());
				strictEqual(Object.keys(messagesAfter).length, 0);
			});

			it("does not delete any errors on the same screen", () => {
				const store = setupStore({
					data: {
						document: {
							ErrorMessages: {
								DependentValue: "Hello"
							},
							OtherScreen: {
								DependentValue: "Hello",
								DependentFieldValue: "World",
								DependentFieldClear: null
							}
						}
					},
					ui: {
						...ui,
						messages: {
							...createValidationEntry({ path: DEPENDENT_VALUE }),
							...createValidationEntry({ path: DEPENDENT_VALUE_OTHER }),
							...createValidationEntry({ path: DEPENDENT_FIELD_VALUE_OTHER }),
							...createValidationEntry({ path: DEPENDENT_FIELD_CLEAR_OTHER })
						}
					}
				});

				const messagesBefore = UiStateSelectors.messages()(store.getState());
				strictEqual(Object.keys(messagesBefore).length, 1 + ERROR_COUNT_OTHER);

				store.dispatch(
					Events.valueChange({ path: MASTER_FIELD_PATH, value: RESOLVE_ERRORS_OTHER })
				);
				const messagesAfter = UiStateSelectors.messages()(store.getState());
				strictEqual(Object.keys(messagesAfter).length, 1);
			});
		});

		describe("via computation", () => {
			describe("on an attachment", () => {
				describe("which also triggers value changes only on the same screen, which resolve errors", () => {
					it("deletes all errors", () => {
						const store = setupStore({
							ui: {
								...ui,
								messages: {
									...createValidationEntry({
										path: DEPENDENT_VALUE_TRIGGERED_BY_ATTACHMENT_COMPUTATION
									})
								}
							}
						});

						const messagesBefore = UiStateSelectors.messages()(store.getState());
						strictEqual(Object.keys(messagesBefore).length, 1);

						store.dispatch(
							attachmentValueChange(
								ATTACHMENT_FILENAME_RESOLVE_ERRORS,
								ATTACHMENT_TRIGGER_FIELD_PATH
							)
						);
						const messagesAfter = UiStateSelectors.messages()(store.getState());
						strictEqual(Object.keys(messagesAfter).length, 0);
					});
				});

				describe("which also triggers value changes on the same and another screen, which resolve errors", () => {
					it("deletes all errors on both screens", () => {
						const store = setupStore({
							ui: {
								...ui,
								messages: {
									...createValidationEntry({
										path: DEPENDENT_VALUE_TRIGGERED_BY_ATTACHMENT_COMPUTATION
									}),
									...createValidationEntry({
										path: DEPENDENT_VALUE_TRIGGERED_BY_ATTACHMENT_COMPUTATION_OTHER
									})
								}
							}
						});

						const messagesBefore = UiStateSelectors.messages()(store.getState());
						strictEqual(Object.keys(messagesBefore).length, 2);

						store.dispatch(
							attachmentValueChange(
								ATTACHMENT_FILENAME_RESOLVE_ERRORS_BOTH,
								ATTACHMENT_TRIGGER_FIELD_PATH
							)
						);
						const messagesAfter = UiStateSelectors.messages()(store.getState());
						strictEqual(Object.keys(messagesAfter).length, 0);
					});
				});

				describe("which also triggers value changes only on another screen, which resolve errors", () => {
					it("deletes all errors on the other screen", () => {
						const store = setupStore({
							ui: {
								...ui,
								messages: {
									...createValidationEntry({
										path: DEPENDENT_VALUE_TRIGGERED_BY_ATTACHMENT_COMPUTATION_OTHER
									})
								}
							}
						});

						const messagesBefore = UiStateSelectors.messages()(store.getState());
						strictEqual(Object.keys(messagesBefore).length, 1);

						store.dispatch(
							attachmentValueChange(
								ATTACHMENT_FILENAME_RESOLVE_ERRORS_OTHER,
								ATTACHMENT_TRIGGER_FIELD_PATH
							)
						);
						const messagesAfter = UiStateSelectors.messages()(store.getState());
						strictEqual(Object.keys(messagesAfter).length, 0);
					});

					it("does not delete any errors on the same screen", () => {
						const store = setupStore({
							ui: {
								...ui,
								messages: {
									...createValidationEntry({
										path: DEPENDENT_VALUE_TRIGGERED_BY_ATTACHMENT_COMPUTATION
									}),
									...createValidationEntry({
										path: DEPENDENT_VALUE_TRIGGERED_BY_ATTACHMENT_COMPUTATION_OTHER
									})
								}
							}
						});

						const messagesBefore = UiStateSelectors.messages()(store.getState());
						strictEqual(Object.keys(messagesBefore).length, 2);

						store.dispatch(
							attachmentValueChange(
								ATTACHMENT_FILENAME_RESOLVE_ERRORS_OTHER,
								ATTACHMENT_TRIGGER_FIELD_PATH
							)
						);
						const messagesAfter = UiStateSelectors.messages()(store.getState());
						strictEqual(Object.keys(messagesAfter).length, 1);
					});
				});
			});

			describe("on a multi-select", () => {
				describe("which also triggers value changes only on the same screen, which resolve errors", () => {
					it("deletes all errors", () => {
						const store = setupStore({
							ui: {
								...ui,
								messages: {
									...createValidationEntry({
										path: DEPENDENT_VALUE_TRIGGERED_BY_MULTI_SELECT_COMPUTATION
									})
								}
							}
						});

						const messagesBefore = UiStateSelectors.messages()(store.getState());
						strictEqual(Object.keys(messagesBefore).length, 1);

						store.dispatch(
							Events.multiSelectValueChange({
								path: MULTI_SELECT_TRIGGER_FIELD_PATH,
								value: [{ value: RESOLVE_ERRORS }]
							})
						);
						const messagesAfter = UiStateSelectors.messages()(store.getState());
						strictEqual(Object.keys(messagesAfter).length, 0);
					});
				});

				describe("which also triggers value changes on the same and another screen, which resolve errors", () => {
					it("deletes all errors on both screens", () => {
						const store = setupStore({
							ui: {
								...ui,
								messages: {
									...createValidationEntry({
										path: DEPENDENT_VALUE_TRIGGERED_BY_MULTI_SELECT_COMPUTATION
									}),
									...createValidationEntry({
										path: DEPENDENT_VALUE_TRIGGERED_BY_MULTI_SELECT_COMPUTATION_OTHER
									})
								}
							}
						});

						const messagesBefore = UiStateSelectors.messages()(store.getState());
						strictEqual(Object.keys(messagesBefore).length, 2);

						store.dispatch(
							Events.multiSelectValueChange({
								path: MULTI_SELECT_TRIGGER_FIELD_PATH,
								value: [{ value: RESOLVE_ERRORS_BOTH }]
							})
						);
						const messagesAfter = UiStateSelectors.messages()(store.getState());
						strictEqual(Object.keys(messagesAfter).length, 0);
					});
				});

				describe("which also triggers value changes only on another screen, which resolve errors", () => {
					it("deletes all errors on the other screen", () => {
						const store = setupStore({
							ui: {
								...ui,
								messages: {
									...createValidationEntry({
										path: DEPENDENT_VALUE_TRIGGERED_BY_MULTI_SELECT_COMPUTATION_OTHER
									})
								}
							}
						});

						const messagesBefore = UiStateSelectors.messages()(store.getState());
						strictEqual(Object.keys(messagesBefore).length, 1);

						store.dispatch(
							Events.multiSelectValueChange({
								path: MULTI_SELECT_TRIGGER_FIELD_PATH,
								value: [{ value: RESOLVE_ERRORS_OTHER }]
							})
						);
						const messagesAfter = UiStateSelectors.messages()(store.getState());
						strictEqual(Object.keys(messagesAfter).length, 0);
					});

					it("does not delete any errors on the same screen", () => {
						const store = setupStore({
							ui: {
								...ui,
								messages: {
									...createValidationEntry({
										path: DEPENDENT_VALUE_TRIGGERED_BY_MULTI_SELECT_COMPUTATION
									}),
									...createValidationEntry({
										path: DEPENDENT_VALUE_TRIGGERED_BY_MULTI_SELECT_COMPUTATION_OTHER
									})
								}
							}
						});

						const messagesBefore = UiStateSelectors.messages()(store.getState());
						strictEqual(Object.keys(messagesBefore).length, 2);

						store.dispatch(
							Events.multiSelectValueChange({
								path: MULTI_SELECT_TRIGGER_FIELD_PATH,
								value: [{ value: RESOLVE_ERRORS_OTHER }]
							})
						);
						const messagesAfter = UiStateSelectors.messages()(store.getState());
						strictEqual(Object.keys(messagesAfter).length, 1);
					});
				});
			});
		});
	});
}

function attachmentValueChange(fileName: string, path: EntityInstancePath) {
	const attachmentValue = {
		attachment_id: "1",
		category: null,
		description: null,
		size: 100,
		content: "",
		mime_type: "image/jpeg"
	};

	return Events.attachmentValueChange({
		value: {
			...attachmentValue,
			internal_filename: fileName,
			original_filename: fileName
		},
		path
	});
}
