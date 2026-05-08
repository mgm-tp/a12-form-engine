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

import type { Action, Store } from "redux";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";

import { Commands, Events } from "../../../../../back-end/store/index.js";
import type { EngineState, EngineStore } from "../../../../../back-end/store/internal/store.js";
import { significantSeverity } from "../../../../../back-end/store/internal/validation.js";
import type { FormModel, ReadonlyObjectMap } from "../../../../../models/index.js";
import { DocumentPath } from "../../../../../models/internal/utils/document-utils.js";
import { MiddlewareHelpers } from "../../../../utils/back-end-helpers.js";
import { DocumentHelpers } from "../../../../utils/document-helpers.js";
import { US_LOCALE } from "../../../../utils/localization.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";
import { createValidationEntryWithParsingError } from "../../../../utils/validation.js";

const { createTestStore } = SetupHelpers;

describe("api.back-end.store.middleware", () => {
	describe("onEventButtonClickedMiddleware", () => {
		const validDocument = { A12T_Buttons: { RequiredField: "A" } };
		const documentWithInfo = { A12T_Buttons: { RequiredField: "AB" } };
		const documentWithWarning = { A12T_Buttons: { RequiredField: "b" } };
		const documentWithError = {};

		const testButtonPath = ModelPath.fromString("/test/path");

		const { spy, middleware } = MiddlewareHelpers.createMiddlewareSpy([
			Commands.changeScreenState,
			Commands.CorrectionMode.setValidationBarState
		]);

		const models = setupModelsFixture("buttons");

		describe("given an Events.eventButtonTriggered action", () => {
			describe("without validation", () => {
				const params = { buttonPath: testButtonPath };

				it("dispatches an Events.eventButton action if message state contains no errors", () => {
					testEventWithoutIssues(params);
				});

				it("dispatches an Events.eventButton action if message state contains infos", () => {
					testEventWithValidationInfo(params);
				});

				it("dispatches an Events.eventButton action if message state contains warnings", () => {
					testEventWithValidationWarning(params);
				});

				it("dispatches an Events.eventButton action if message state contains a parsing error", () => {
					testEventWithParseError({
						...params,
						errorOnCurrentScreen: true,
						eventActionExpected: true
					});
					testEventWithParseError({
						...params,
						errorOnCurrentScreen: false,
						eventActionExpected: true
					});
				});

				it("dispatches an Events.eventButton action if message state contains errors", () => {
					testEventWithValidationError({ ...params, eventActionExpected: true });
				});
			});

			describe("with partial validation", () => {
				const params = {
					validation: "partial" as const,
					buttonPath: testButtonPath
				};

				it("dispatches an Events.eventButton action if the current screen is valid", () => {
					testEventWithoutIssues(params);
				});

				describe("if the current screen only has infos", () => {
					it("dispatches confirmation action by default", () => {
						testEventWithValidationInfo(params);
					});

					it("dispatches an Events.eventButton action if disableConfirmation is set to 'INFO'", () => {
						testEventWithValidationInfo({ ...params, disableRuleConfirmation: "INFO" });
					});

					it("dispatches an Events.eventButton action if disableConfirmation is set to 'WARNING'", () => {
						testEventWithValidationInfo({ ...params, disableRuleConfirmation: "WARNING" });
					});
				});

				describe("if the current screen only has warnings", () => {
					it("dispatches confirmation action by default", () => {
						testEventWithValidationWarning(params);
					});

					it("dispatches confirmation action if disableConfirmation is set to 'INFO'", () => {
						testEventWithValidationWarning({ ...params, disableRuleConfirmation: "INFO" });
					});

					it("dispatches an Events.eventButton action if disableConfirmation is set to 'WARNING'", () => {
						testEventWithValidationWarning({ ...params, disableRuleConfirmation: "WARNING" });
					});
				});

				it("dispatches an Events.eventButton action if another screen contains a parsing error", () => {
					testEventWithParseError({
						...params,
						errorOnCurrentScreen: false,
						eventActionExpected: true
					});
				});

				it("does not dispatch an Events.eventButton action if the current screen contains a parsing error", () => {
					testEventWithParseError({
						...params,
						errorOnCurrentScreen: true,
						eventActionExpected: false
					});
				});

				it("does not dispatch an Events.eventButton action if the current screen is invalid", () => {
					testEventWithValidationError({ ...params, eventActionExpected: false });
				});
			});

			describe("with full validation", () => {
				const params = {
					validation: "full" as const,
					buttonPath: testButtonPath
				};

				it("dispatches an Events.eventButton action if the validation result contains no errors", () => {
					testEventWithoutIssues(params);
				});

				describe("if the validation result contains infos", () => {
					it("dispatches confirmation action by default", () => {
						testEventWithValidationInfo(params);
					});

					it("dispatches an Events.eventButton action if disableConfirmation is set to 'INFO'", () => {
						testEventWithValidationInfo({ ...params, disableRuleConfirmation: "INFO" });
					});

					it("dispatches an Events.eventButton action if disableConfirmation is set to 'WARNING'", () => {
						testEventWithValidationInfo({ ...params, disableRuleConfirmation: "WARNING" });
					});
				});

				describe("if the validation result contains warnings", () => {
					it("dispatches confirmation action by default", () => {
						testEventWithValidationWarning(params);
					});

					it("dispatches confirmation action if disableConfirmation is set to 'INFO'", () => {
						testEventWithValidationWarning({ ...params, disableRuleConfirmation: "INFO" });
					});

					it("dispatches an Events.eventButton action if disableConfirmation is set to 'WARNING'", () => {
						testEventWithValidationWarning({ ...params, disableRuleConfirmation: "WARNING" });
					});
				});

				it("does not dispatch an Events.eventButton action if the validation result contains a parsing error", () => {
					testEventWithParseError({
						...params,
						errorOnCurrentScreen: true,
						eventActionExpected: false
					});
					testEventWithParseError({
						...params,
						errorOnCurrentScreen: false,
						eventActionExpected: false
					});
				});

				it("does not dispatch an Events.eventButton action if the validation result contains errors", () => {
					testEventWithValidationError({ ...params, eventActionExpected: false });
				});
			});
		});

		interface GetExpectedActionsParams {
			readonly eventActionExpected: boolean;
			readonly validation?: FormModel.ButtonValidationEnum;
			readonly disableConfirmation?: boolean;
			readonly messages?: Messages;
			readonly buttonPath: ModelPath;
		}

		function getExpectedActions({
			eventActionExpected,
			validation,
			disableConfirmation,
			messages,
			buttonPath
		}: GetExpectedActionsParams): (Action | undefined)[] {
			const eventAction = Events.eventButton({ name: "any", buttonPath });
			return [
				eventActionExpected || disableConfirmation ? eventAction : undefined,
				validation === "full" ? Commands.validateFull() : undefined,
				validation === "partial" ? Commands.validatePart({ focusFirstError: true }) : undefined,
				validation && messages ? Commands.setMessageState({ messages }) : undefined,
				validation &&
				messages &&
				!disableConfirmation &&
				(significantSeverity(messages) === "WARNING" || significantSeverity(messages) === "INFO")
					? Commands.userConfirmationRequested({
							actionsToDispatch: [eventAction],
							validation
						})
					: undefined
			];
		}

		interface WithoutIssuesParams {
			readonly validation?: FormModel.ButtonValidationEnum;
			readonly buttonPath: ModelPath;
		}

		function testEventWithoutIssues({ validation, buttonPath }: WithoutIssuesParams): void {
			spy.mock.resetCalls();

			const store = createApp({ document: validDocument });
			store.dispatch(Events.eventButtonTriggered({ name: "any", validation, buttonPath }));

			MiddlewareHelpers.assertActions(
				spy,
				getExpectedActions({ eventActionExpected: true, validation, buttonPath })
			);
		}

		interface WithParseErrorParams {
			readonly errorOnCurrentScreen: boolean;
			readonly eventActionExpected: boolean;
			readonly validation?: FormModel.ButtonValidationEnum;
			readonly buttonPath: ModelPath;
		}

		function testEventWithParseError({
			errorOnCurrentScreen,
			eventActionExpected,
			validation,
			buttonPath
		}: WithParseErrorParams): void {
			spy.mock.resetCalls();

			const numberFieldPath = DocumentHelpers.createDocumentPath(["A12T_Buttons"], ["NumberField"]);
			const messages = createValidationEntryWithParsingError(
				numberFieldPath,
				"A",
				"numberContainsIllegalSymbols"
			);

			const store = createApp({
				document: validDocument,
				messages,
				screen: errorOnCurrentScreen ? "Screen1" : "Screen2"
			});
			store.dispatch(Events.eventButtonTriggered({ name: "any", validation, buttonPath }));

			if (eventActionExpected) {
				MiddlewareHelpers.assertActions(
					spy,
					getExpectedActions({ eventActionExpected, validation, buttonPath })
				);
			} else {
				MiddlewareHelpers.assertNoAction(spy, Events.eventButton({ name: "any", buttonPath }));
			}
		}

		interface WithValidationWarningOrInfoParams {
			readonly validation?: FormModel.ButtonValidationEnum;
			readonly buttonPath: ModelPath;
			readonly disableRuleConfirmation?: FormModel.DisableRuleConfirmation;
		}

		function testEventWithValidationInfo({
			validation,
			buttonPath,
			disableRuleConfirmation
		}: WithValidationWarningOrInfoParams): void {
			spy.mock.resetCalls();

			const errorPath = DocumentHelpers.createDocumentPath(["A12T_Buttons"], ["RequiredField"]);

			const store = createApp({ document: documentWithInfo, disableRuleConfirmation });
			store.dispatch(Events.eventButtonTriggered({ name: "any", validation, buttonPath }));

			const messages: Messages = {
				[DocumentPath.toString(errorPath)]: {
					validationMessages: [
						{
							element: errorPath,
							errorText: [
								{
									args: {
										RequiredField: {
											properties: [
												{
													defaults: {},
													key: "documentModel.label.buttons-document.A12T_Buttons.RequiredField"
												}
											],
											type: "localizable",
											value: undefined
										}
									},
									defaults: {
										en: '$RequiredField$ starts with the letters "AB".',
										de: '$RequiredField$ fängt mit den Buchstaben "AB" an.'
									},
									key: "documentModel.ruleErrorMessage.buttons-document.A12T_Buttons.InfoRuleForString"
								}
							],
							errorCode: "Error rule_452f3",
							errorKey: "/A12T_Buttons/InfoRuleForString",
							severity: "INFO",
							referencedFields: [errorPath]
						}
					]
				}
			};

			MiddlewareHelpers.assertActions(
				spy,
				getExpectedActions({
					eventActionExpected: validation === undefined,
					validation,
					disableConfirmation: disableRuleConfirmation !== undefined,
					messages,
					buttonPath
				})
			);
		}

		function testEventWithValidationWarning({
			validation,
			buttonPath,
			disableRuleConfirmation
		}: WithValidationWarningOrInfoParams): void {
			spy.mock.resetCalls();

			const errorPath = DocumentHelpers.createDocumentPath(["A12T_Buttons"], ["RequiredField"]);

			const store = createApp({ document: documentWithWarning, disableRuleConfirmation });
			store.dispatch(Events.eventButtonTriggered({ name: "any", validation, buttonPath }));

			const messages: Messages = {
				[DocumentPath.toString(errorPath)]: {
					validationMessages: [
						{
							element: errorPath,
							errorText: [
								{
									args: {
										RequiredField: {
											properties: [
												{
													defaults: {},
													key: "documentModel.label.buttons-document.A12T_Buttons.RequiredField"
												}
											],
											type: "localizable",
											value: undefined
										}
									},
									defaults: {
										en: '$RequiredField$ should start with the letter "A"',
										de: '$RequiredField$ sollte mit dem Buchstaben "A" beginnen.'
									},
									key: "documentModel.ruleErrorMessage.buttons-document.A12T_Buttons.WarningRuleForString"
								}
							],
							errorCode: "Error rule_452f2",
							errorKey: "/A12T_Buttons/WarningRuleForString",
							severity: "WARNING",
							referencedFields: [errorPath]
						}
					]
				}
			};

			MiddlewareHelpers.assertActions(
				spy,
				getExpectedActions({
					eventActionExpected: validation === undefined,
					validation,
					disableConfirmation: disableRuleConfirmation === "WARNING",
					messages,
					buttonPath
				})
			);
		}

		interface WithValidationErrorParams {
			readonly eventActionExpected: boolean;
			readonly validation?: FormModel.ButtonValidationEnum;
			readonly buttonPath: ModelPath;
		}

		function testEventWithValidationError({
			eventActionExpected,
			validation,
			buttonPath
		}: WithValidationErrorParams): void {
			spy.mock.resetCalls();

			const errorPath = DocumentHelpers.createDocumentPath(["A12T_Buttons"], ["RequiredField"]);
			const booleanPath = DocumentHelpers.createDocumentPath(["A12T_Buttons"], ["BooleanField"]);

			const messages: Messages = {
				[DocumentPath.toString(errorPath)]: {
					validationMessages: [
						{
							element: errorPath,
							errorText: [
								{
									key: "documentModel.ruleErrorMessage.buttons-document.A12T_Buttons.RequiredRule",
									defaults: { en: "Required", de: "Notwendig" },
									args: {}
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

			const store = createApp({ document: documentWithError });
			store.dispatch(Events.eventButtonTriggered({ name: "any", validation, buttonPath }));

			MiddlewareHelpers.assertActions(
				spy,
				getExpectedActions({ eventActionExpected, validation, messages, buttonPath })
			);
		}

		type Screen = "Screen1" | "Screen2";
		type Messages = ReadonlyObjectMap<EngineStore.Validation.Entry>;

		interface CreateAppProps {
			readonly document: object;
			readonly messages?: Messages;
			readonly screen?: Screen;
			readonly disableRuleConfirmation?: FormModel.DisableRuleConfirmation;
		}

		function createApp({
			document,
			messages,
			screen,
			disableRuleConfirmation
		}: CreateAppProps): Store<EngineState, Action> {
			return createTestStore({
				middlewares: [middleware],
				storeConfig: {
					models: {
						...models,
						formModel: {
							...models.formModel,
							content: {
								...models.formModel.content,
								disableRuleConfirmation
							}
						}
					},
					locale: US_LOCALE,
					data: { document },
					ui: {
						screenLocation: [{ locationPath: [{ elementName: screen ?? "Screen2" }], path: [] }],
						messages
					}
				}
			});
		}
	});
});
