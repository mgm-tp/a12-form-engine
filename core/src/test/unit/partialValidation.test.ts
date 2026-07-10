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

import { deepStrictEqual, strictEqual } from "node:assert/strict";
import { mock } from "node:test";

import type { Dispatch } from "redux";

import type { EntityInstancePath, GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import {
	Commands,
	createDefaultMiddlewareOptions,
	createEngineStore
} from "../../back-end/store/index.js";
import { collectRelevantFields } from "../../back-end/store/internal/collectRelevantFields.js";
import { validatePartlyWithFocusHandling } from "../../back-end/store/internal/partial-validation.js";
import type { EngineState, EngineStore, Models } from "../../back-end/store/internal/store.js";
import type { ReadonlyObjectMap } from "../../models/index.js";
import { DocumentPath, DocumentUtils } from "../../models/internal/utils/document-utils.js";

import { validateSetErrorMessageStateAction } from "../utils/assertions.js";
import { createDocumentPath } from "../utils/createDocumentPath.js";
import { US_LOCALE } from "../utils/localization.js";
import { MiddlewareHelpers } from "../utils/MiddlewareHelpers.js";
import { loadModels } from "../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../utils/setupFixture.js";
import {
	DOCUMENT_MODEL,
	REPEATABLE_GROUP_1,
	REQUIRED_STRING,
	ROOT_GROUP
} from "../utils/test-model-helpers/validation.partial.js";

describe("unit.back-end.store.partialValidation", () => {
	const defaultModels = setupModelsFixture("computation-validation.partial");

	function setupStoreWithScreen(options: {
		document: object;
		screenName: string;
		models?: Models;
		messages?: ReadonlyObjectMap<EngineStore.Validation.Entry>;
	}): EngineState {
		const { document, screenName, models, messages } = options;

		return createEngineStore({
			models: models || defaultModels,
			locale: US_LOCALE,
			data: { document },
			ui: {
				screenLocation: [
					{
						locationPath: [{ elementName: screenName }],
						path: []
					}
				],
				messages
			}
		});
	}
	describe("Validation", () => {
		it("returns true when the screen is valid", () => {
			let document = {};
			document = DocumentUtils.setValue(
				document,
				DOCUMENT_MODEL.pathToNumberField,
				42,
				defaultModels.documentModel
			);
			document = DocumentUtils.setValue(
				document,
				DOCUMENT_MODEL.pathToNumberField2,
				42,
				defaultModels.documentModel
			);

			const initialState = setupStoreWithScreen({ document, screenName: "screen3" });

			const dispatchSpy = mock.fn<Dispatch>();
			const middlewareOptions = createDefaultMiddlewareOptions();
			const relevantElements = collectRelevantFields(initialState);
			const result = validatePartlyWithFocusHandling({
				state: initialState,
				dispatch: dispatchSpy,
				middlewareOptions,
				relevantElements
			});
			strictEqual(result, true);
		});

		it("returns false when the screen is invalid", () => {
			// Rule numberField >= 42
			const document = DocumentUtils.setValue(
				{},
				DOCUMENT_MODEL.pathToNumberField,
				12,
				defaultModels.documentModel
			);

			const initialState = setupStoreWithScreen({ document, screenName: "Screen3" });
			const dispatchSpy = mock.fn<Dispatch>();
			const middlewareOptions = createDefaultMiddlewareOptions();
			const relevantElements = collectRelevantFields(initialState);
			const result = validatePartlyWithFocusHandling({
				state: initialState,
				dispatch: dispatchSpy,
				middlewareOptions,
				relevantElements
			});
			strictEqual(result, false);
		});

		it("sets the message state with the new messages", () => {
			const model = loadModels("buttons");
			const initialState = setupStoreWithScreen({
				document: {},
				screenName: "Screen2",
				models: model
			});

			const dispatchSpy = mock.fn(x => x);
			const middlewareOptions = createDefaultMiddlewareOptions();
			let relevantElements = collectRelevantFields(initialState);
			let result = validatePartlyWithFocusHandling({
				state: initialState,
				dispatch: dispatchSpy,
				middlewareOptions,
				relevantElements
			});
			strictEqual(result, false);

			const errorPath = createDocumentPath(["A12T_Buttons"], ["RequiredField"]);
			const booleanPath = createDocumentPath(["A12T_Buttons"], ["BooleanField"]);

			const messages: ReadonlyObjectMap<EngineStore.Validation.Entry> = {
				[DocumentPath.toString(errorPath)]: {
					validationMessages: [
						{
							element: errorPath,
							errorText: [
								{
									key: "documentModel.ruleErrorMessage.buttons-document.A12T_Buttons.RequiredRule",
									args: {},
									defaults: { en: "Required", de: "Notwendig" }
								}
							],
							errorCode: "4711",
							errorKey: "/A12T_Buttons/RequiredRule",
							severity: "ERROR",
							referencedFields: [booleanPath, errorPath]
						}
					]
				}
			};

			MiddlewareHelpers.assertActions(dispatchSpy, [Commands.setMessageState({ messages })], false);

			const newState: EngineState = {
				...initialState,
				data: {
					...initialState.data,
					document: { A12T_Buttons: { BooleanField: true } }
				},
				ui: { ...initialState.ui, messages }
			};
			dispatchSpy.mock.resetCalls();

			relevantElements = collectRelevantFields(newState);
			result = validatePartlyWithFocusHandling({
				state: newState,
				dispatch: dispatchSpy,
				middlewareOptions,
				relevantElements
			});
			strictEqual(result, true);
			MiddlewareHelpers.assertActions(
				dispatchSpy,
				[Commands.setMessageState({ messages: {} })],
				false
			);
		});

		describe("when a parseError is already present", () => {
			it("removes stale parse errors when the document value is no longer null", () => {
				const model = loadModels("computation-validation.errorValue");
				const documentPath = createDocumentPath(["Root"], ["aNumber"]);

				const initialMessages: ReadonlyObjectMap<EngineStore.Validation.Entry> = {
					[DocumentPath.toString(documentPath)]: {
						validationMessages: [],
						parseError: {
							value: "abc",
							message: {
								errorCode: "zahlHatUngueltigeZeichen",
								errorKey: "formalePruefung",
								errorText: [
									{
										key: "kernel.formalErrors.ZAHL_MIT_UNGUELTIGEN_ZEICHEN_ONK",
										args: {},
										defaults: { en: "The value must be integer." }
									}
								],
								severity: "ERROR",
								element: documentPath,
								referencedFields: [documentPath]
							}
						}
					}
				};

				// Document has a non-null value at the path → parse error is stale
				const document = DocumentUtils.setValue({}, documentPath, 42, model.documentModel);

				const state = setupStoreWithScreen({
					document,
					screenName: "Screen1",
					models: model,
					messages: initialMessages
				});

				const dispatch = mock.fn(x => x);
				const middlewareOptions = createDefaultMiddlewareOptions();
				const relevantElements = collectRelevantFields(state);
				validatePartlyWithFocusHandling({
					state,
					dispatch,
					middlewareOptions,
					relevantElements
				});

				// The stale parse error should be removed from the dispatched messages
				MiddlewareHelpers.assertActions(
					dispatch,
					[Commands.setMessageState({ messages: {} })],
					false
				);
			});

			it("must consider the error value and not return an error that would result from an empty field", () => {
				const model = loadModels("computation-validation.errorValue");

				const initialMessages: ReadonlyObjectMap<EngineStore.Validation.Entry> = {
					"/Root[1]/aNumber[1]": {
						validationMessages: [],
						parseError: {
							value: "abc",
							message: {
								errorCode: "zahlHatUngueltigeZeichen",
								errorKey: "formalePruefung",
								errorText: [
									{
										key: "kernel.formalErrors.ZAHL_MIT_UNGUELTIGEN_ZEICHEN_ONK",
										args: {},
										defaults: {
											de: "Es sind nur ganzzahlige Werte erlaubt.",
											fr: "La valeur doit être un nombre entier.",
											nl: "Gelieve een getal invullen.",
											en: "The value must be integer."
										}
									}
								],
								severity: "ERROR",
								element: [
									{
										elementName: "Root",
										index: 1
									},
									{
										elementName: "aNumber",
										index: 1
									}
								],
								referencedFields: [
									[
										{
											elementName: "Root",
											index: 1
										},
										{
											elementName: "aNumber",
											index: 1
										}
									]
								]
							}
						}
					}
				};

				const initialState = setupStoreWithScreen({
					document: {},
					screenName: "Screen1",
					models: model,
					messages: initialMessages
				});

				const dispatchSpy = mock.fn(x => x);
				const middlewareOptions = createDefaultMiddlewareOptions();
				const relevantElements = collectRelevantFields(initialState);
				const result = validatePartlyWithFocusHandling({
					state: initialState,
					dispatch: dispatchSpy,
					middlewareOptions,
					relevantElements
				});

				strictEqual(result, false);
				MiddlewareHelpers.assertNumberOfActions(dispatchSpy, [], false);
			});
		});
	});

	describe("Visibility", () => {
		describe("No field is hidden", () => {
			it("only validates fields on the screen", () => {
				// If the boolean value is true, the required field is visible and the validation should be fail
				const document = DocumentUtils.setValue(
					{},
					DOCUMENT_MODEL.pathToMasterBooleanField,
					true,
					defaultModels.documentModel
				);

				const initialState = createEngineStore({
					models: defaultModels,
					locale: US_LOCALE,
					data: { document }
				});

				const dispatchSpy = mock.fn<Dispatch>();
				const middlewareOptions = createDefaultMiddlewareOptions();
				const relevantElements = collectRelevantFields(initialState);
				const result = validatePartlyWithFocusHandling({
					state: initialState,
					dispatch: dispatchSpy,
					middlewareOptions,
					relevantElements
				});

				strictEqual(result, false);

				const action1 = dispatchSpy.mock.calls[0].arguments[0];
				validateSetErrorMessageStateAction(action1, DOCUMENT_MODEL.pathToRequiredString);
			});
		});

		describe("At least one field is hidden", () => {
			it("only validates fields on the screen which are visible", () => {
				// If the boolean value is false, the required field is hidden and the validation should be successful
				const document = DocumentUtils.setValue(
					{},
					DOCUMENT_MODEL.pathToMasterBooleanField,
					false,
					defaultModels.documentModel
				);

				const initialState = createEngineStore({
					models: defaultModels,
					locale: US_LOCALE,
					data: { document }
				});

				const dispatchSpy = mock.fn<Dispatch>();
				const middlewareOptions = createDefaultMiddlewareOptions();
				const relevantElements = collectRelevantFields(initialState);
				const result = validatePartlyWithFocusHandling({
					state: initialState,
					dispatch: dispatchSpy,
					middlewareOptions,
					relevantElements
				});

				strictEqual(result, true);
			});
		});
	});

	describe("Focus first error", () => {
		describe("Given the first error is on a Control", () => {
			const fixture = setupFixture(() => ({
				documentWithValidationError: DocumentUtils.setValue(
					{},
					DOCUMENT_MODEL.pathToNumberField,
					12,
					defaultModels.documentModel
				)
			}));

			const focusedComponent = {
				formModelPath: [
					{ elementName: "Screen3" },
					{ elementName: "cg1" },
					{ elementName: "row-51cc7" },
					{ elementName: "control-696c5" }
				]
			};

			const initialMessages = getMessageState(DOCUMENT_MODEL.pathToNumberField2);

			describe("and the first error is a validation error", () => {
				it("will focus the first error if set to true", () => {
					testFocusFirstError({
						focusFirstError: true,
						document: fixture.documentWithValidationError,
						pathToFirstErrorField: DOCUMENT_MODEL.pathToNumberField,
						focusedComponent
					});
				});

				it("will not focus the first error if set to false", () => {
					testFocusFirstError({
						focusFirstError: false,
						document: fixture.documentWithValidationError,
						pathToFirstErrorField: DOCUMENT_MODEL.pathToNumberField
					});
				});
			});

			describe("and the first error is a parsing error", () => {
				it("will focus the first error if set to true", () => {
					testFocusFirstError({
						focusFirstError: true,
						document: { validation: { visibleFields: { numberField: 1 } } },
						pathToFirstErrorField: DOCUMENT_MODEL.pathToMasterBooleanField,
						focusedComponent,
						initialMessages: getMessageState(DOCUMENT_MODEL.pathToMasterBooleanField)
					});
				});

				it("will not focus the first error if set to false", () => {
					testFocusFirstError({
						focusFirstError: false,
						document: { validation: { visibleFields: { numberField: 1 } } },
						pathToFirstErrorField: DOCUMENT_MODEL.pathToNumberField,
						initialMessages
					});
				});
			});
		});

		describe("Given the first error is on a FieldOverviewColumn", () => {
			const documentPath = createDocumentPath([ROOT_GROUP], [REPEATABLE_GROUP_1, 0]);

			function documentWithRequiredStringValues(values: (string | null)[]): GroupInstance {
				return DocumentUtils.setValue(
					{},
					documentPath,
					values.map(value => ({ requiredString: value })),
					defaultModels.documentModel
				);
			}

			const fixture = setupFixture(() => ({
				documentWithValidationError: documentWithRequiredStringValues(["a", ""]),
				documentWithParseAndValidationError: documentWithRequiredStringValues([null, ""]),
				documentWithoutValidationError: documentWithRequiredStringValues(["a", "b"])
			}));

			const pathToErrorField1 = createDocumentPath(
				[ROOT_GROUP],
				[REPEATABLE_GROUP_1, 1],
				[REQUIRED_STRING]
			);

			const pathToErrorField2 = createDocumentPath(
				[ROOT_GROUP],
				[REPEATABLE_GROUP_1, 2],
				[REQUIRED_STRING]
			);

			const focusedComponent = {
				formModelPath: [
					{ elementName: "Screen3" },
					{ elementName: "inline-repeat-repeatableGroup1" },
					{ elementName: "fieldbasedrepeatoverviewcolumn-aa144" }
				],
				index: 1
			};

			const initialMessages = getMessageState(pathToErrorField1);

			describe("and the first error is a validation error", () => {
				it("will focus the first error if set to true", () => {
					testFocusFirstError({
						focusFirstError: true,
						document: fixture.documentWithValidationError,
						pathToFirstErrorField: pathToErrorField2,
						focusedComponent
					});
				});

				it("will not focus the first error if set to false", () => {
					testFocusFirstError({
						focusFirstError: false,
						document: fixture.documentWithValidationError,
						pathToFirstErrorField: pathToErrorField2
					});
				});
			});

			describe("and the first error is a parsing error", () => {
				it("will focus the first error if set to true", () => {
					testFocusFirstError({
						focusFirstError: true,
						document: fixture.documentWithParseAndValidationError,
						pathToFirstErrorField: pathToErrorField1,
						focusedComponent: { ...focusedComponent, index: 0 },
						initialMessages
					});
				});

				it("will not focus the first error if set to false", () => {
					testFocusFirstError({
						focusFirstError: false,
						document: fixture.documentWithParseAndValidationError,
						pathToFirstErrorField: pathToErrorField1,
						initialMessages
					});
				});
			});
		});

		function testFocusFirstError(options: {
			focusFirstError: boolean;
			document: GroupInstance;
			pathToFirstErrorField: EntityInstancePath;
			focusedComponent?: { formModelPath: { elementName: string }[]; index?: number };
			initialMessages?: ReadonlyObjectMap<EngineStore.Validation.Entry>;
		}): void {
			const {
				focusFirstError,
				document,
				pathToFirstErrorField,
				focusedComponent,
				initialMessages
			} = options;

			const initialState = setupStoreWithScreen({
				document,
				screenName: "Screen3",
				messages: initialMessages
			});
			const dispatchSpy = mock.fn<Dispatch>();
			const middlewareOptions = createDefaultMiddlewareOptions();
			const relevantElements = collectRelevantFields(initialState);
			validatePartlyWithFocusHandling({
				state: initialState,
				dispatch: dispatchSpy,
				middlewareOptions,
				relevantElements,
				focusFirstError
			});

			if (focusFirstError) {
				const action1 = dispatchSpy.mock.calls[0].arguments[0];
				const action2 = dispatchSpy.mock.calls[1].arguments[0];
				validateSetErrorMessageStateAction(action1, pathToFirstErrorField);

				if (Commands.changeScreenState.match(action2)) {
					const expectedPayload = { focusedComponent, index: 0 };
					deepStrictEqual(action2.payload, expectedPayload);
				}
			} else {
				strictEqual(dispatchSpy.mock.callCount(), 1);

				const action1 = dispatchSpy.mock.calls[0].arguments[0];
				validateSetErrorMessageStateAction(action1, pathToFirstErrorField);
			}
		}

		function getMessageState(
			pathToFirstErrorField: EntityInstancePath
		): ReadonlyObjectMap<EngineStore.Validation.Entry> {
			return {
				[DocumentPath.toString(pathToFirstErrorField)]: {
					parseError: {
						message: {
							errorKey: "Test",
							errorCode: "Test",
							element: pathToFirstErrorField,
							referencedFields: [pathToFirstErrorField],
							severity: "ERROR",
							errorText: [{ key: "foo", defaults: { en: "Test" } }]
						},
						value: "12345678"
					},
					validationMessages: []
				}
			};
		}
	});
});
