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

import type { Mock } from "node:test";

import type { Action, AnyAction, Middleware, Store } from "redux";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";

import { Commands, Events } from "../../../../../back-end/store/index.js";
import type { EngineState, EngineStore } from "../../../../../back-end/store/internal/store.js";
import type { FormModel, ReadonlyObjectMap } from "../../../../../models/index.js";
import { DocumentPath } from "../../../../../models/internal/utils/document-utils.js";
import { MiddlewareHelpers } from "../../../../utils/back-end-helpers.js";
import { DocumentHelpers } from "../../../../utils/document-helpers.js";
import { ModelHelpers } from "../../../../utils/model-helpers.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";
import { createValidationEntryWithParsingError } from "../../../../utils/validation.js";

const { createTestStore } = SetupHelpers;

describe("api.back-end.store.middleware", () => {
	describe("onNavigationButtonClickedMiddleware", () => {
		const validDocument = { A12T_Buttons: { RequiredField: "A" } };
		const documentWithInfo = { A12T_Buttons: { RequiredField: "AB" } };
		const documentWithWarning = { A12T_Buttons: { RequiredField: "b" } };
		const documentWithError = {};

		const models = setupModelsFixture("buttons");

		describe("given an Events.navigationButton action", () => {
			describe("with #next as target", () => {
				it("dispatches a Commands.changeScreen action with the name of the next screen as payload", () => {
					testNavigationTargetScreen({
						initialScreen: "Screen1",
						target: "#next",
						expectedTargetScreen: "Screen2"
					});
				});

				describe("if a row in an embedded repeat is expanded", () => {
					it("dispatches Commands.changeRepeatInstanceStateEntry", () => {
						const repeatFormModelPath = ModelHelpers.createModelPath("Screen1", "Embedded-Repeat");
						const { spy, middleware } = MiddlewareHelpers.createMiddlewareSpy([]);
						const store = createApp({
							document: {
								...validDocument,
								Group: [{}, {}]
							},
							middleware,
							screen: "Screen1",
							repeatInstanceState: {
								[ModelPath.toString(repeatFormModelPath)]: {
									expandedRowPath: DocumentHelpers.createDocumentPath(
										["A12T_Buttons"],
										["Group", 2]
									)
								}
							}
						});
						store.dispatch(Events.navigationButton({ target: "#next" }));

						const expectedCommand = Commands.changeRepeatInstanceStateEntry({
							locationPath: ModelHelpers.createModelPath("Screen1"),
							entry: {
								expandedRowPath: undefined
							},
							repeatFormModelPath: ModelHelpers.createModelPath("Screen1", "Embedded-Repeat")
						});

						MiddlewareHelpers.assertAction(spy, expectedCommand);
					});
				});
			});

			describe("with #previous as target", () => {
				it("dispatches a Commands.changeScreen action with the name of the previous screen in the payload", () => {
					testNavigationTargetScreen({
						initialScreen: "Screen2",
						target: "#previous",
						expectedTargetScreen: "Screen1"
					});
				});
			});

			describe("with the ID of a screen as target", () => {
				it("dispatches a Commands.changeScreen action with the name of the given screen in the payload", () => {
					testNavigationTargetScreen({
						initialScreen: "Screen1",
						target: "screen-2",
						expectedTargetScreen: "Screen2"
					});
					testNavigationTargetScreen({
						initialScreen: "Screen2",
						target: "screen-1",
						expectedTargetScreen: "Screen1"
					});
				});

				it("dispatches a Commands.changeScreenState action with a focused component st to 'current-screen'", () => {
					testNavigationFocusedComponent({
						initialScreen: "Screen1",
						target: "screen-2",
						expectedTargetScreen: "Screen2"
					});
				});
			});

			describe("without validation", () => {
				it("dispatches a Commands.changeScreen action if message state contains no errors", () => {
					testNavigationWithoutIssues({});
				});

				it("dispatches a Commands.changeScreen action if message state contains infos", () => {
					testNavigationWithValidationInfo({});
				});

				it("dispatches a Commands.changeScreen action if message state contains warnings", () => {
					testNavigationWithValidationWarning({});
				});

				it("dispatches a Commands.changeScreen action if message state contains a parsing error", () => {
					testNavigationWithParseError({
						errorOnCurrentScreen: true,
						screenChangeActionExpected: true
					});
					testNavigationWithParseError({
						errorOnCurrentScreen: false,
						screenChangeActionExpected: true
					});
				});

				it("dispatches a Commands.changeScreen action if message state contains errors", () => {
					testNavigationWithValidationError({ screenChangeActionExpected: true });
				});
			});

			describe("with partial validation", () => {
				const params = { validation: "partial" as const };

				it("dispatches a Commands.changeScreen action if the current screen is valid", () => {
					testNavigationWithoutIssues(params);
				});

				describe("if the validation result contains infos", () => {
					it("dispatches confirmation action by default", () => {
						testNavigationWithValidationInfo(params);
					});

					it("dispatches a Commands.changeScreen action if disableConfirmation is set to 'INFO'", () => {
						testNavigationWithValidationInfo({ ...params, disableRuleConfirmation: "INFO" });
					});

					it("dispatches a Commands.changeScreen action if disableConfirmation is set to 'WARNING'", () => {
						testNavigationWithValidationInfo({ ...params, disableRuleConfirmation: "WARNING" });
					});
				});

				describe("if the validation result contains warnings", () => {
					it("dispatches confirmation action by default", () => {
						testNavigationWithValidationWarning(params);
					});

					it("dispatches confirmation action if disableConfirmation is set to 'INFO'", () => {
						testNavigationWithValidationWarning({ ...params, disableRuleConfirmation: "INFO" });
					});

					it("dispatches a Commands.changeScreen action if disableConfirmation is set to 'WARNING'", () => {
						testNavigationWithValidationWarning({ ...params, disableRuleConfirmation: "WARNING" });
					});
				});

				it("dispatches a Commands.changeScreen action if another screen contains a parsing error", () => {
					testNavigationWithParseError({
						...params,
						errorOnCurrentScreen: false,
						screenChangeActionExpected: true
					});
				});

				it("does not dispatch a Commands.changeScreen action if the current screen contains a parsing error", () => {
					testNavigationWithParseError({
						...params,
						errorOnCurrentScreen: true,
						screenChangeActionExpected: false
					});
				});

				it("does not dispatch a Commands.changeScreen action if the current screen is invalid", () => {
					testNavigationWithValidationError({ ...params, screenChangeActionExpected: false });
				});
			});

			describe("with full validation", () => {
				const params = { validation: "full" as const };

				it("dispatches a Commands.changeScreen action if the validation result contains no errors", () => {
					testNavigationWithoutIssues(params);
				});

				describe("if the validation result contains infos", () => {
					it("dispatches confirmation action by default", () => {
						testNavigationWithValidationInfo(params);
					});

					it("dispatches a Commands.changeScreen action if disableConfirmation is set to 'INFO'", () => {
						testNavigationWithValidationInfo({ ...params, disableRuleConfirmation: "INFO" });
					});

					it("dispatches a Commands.changeScreen action if disableConfirmation is set to 'WARNING'", () => {
						testNavigationWithValidationInfo({ ...params, disableRuleConfirmation: "WARNING" });
					});
				});

				describe("if the validation result contains warnings", () => {
					it("dispatches confirmation action by default", () => {
						testNavigationWithValidationWarning(params);
					});

					it("dispatches confirmation action if disableConfirmation is set to 'INFO'", () => {
						testNavigationWithValidationWarning({ ...params, disableRuleConfirmation: "INFO" });
					});

					it("dispatches a Commands.changeScreen action if disableConfirmation is set to 'WARNING'", () => {
						testNavigationWithValidationWarning({ ...params, disableRuleConfirmation: "WARNING" });
					});
				});

				it("does not dispatch a Commands.changeScreen action if the validation result contains a parsing error", () => {
					testNavigationWithParseError({
						...params,
						errorOnCurrentScreen: true,
						screenChangeActionExpected: false
					});
					testNavigationWithParseError({
						...params,
						errorOnCurrentScreen: false,
						screenChangeActionExpected: false
					});
				});

				it("does not dispatch a Commands.changeScreen action if the validation result contains errors", () => {
					testNavigationWithValidationError({ ...params, screenChangeActionExpected: false });
				});
			});
		});

		interface GetExpectedActionsParams {
			readonly expectedTargetScreen: string | undefined;
			readonly validation?: FormModel.ButtonValidationEnum;
			readonly options?: { readonly validation?: "full" | "partial" };
			readonly messages?: Messages;
		}

		function getExpectedActions({
			expectedTargetScreen,
			validation,
			messages
		}: GetExpectedActionsParams): (Action | undefined)[] {
			return [
				expectedTargetScreen !== undefined
					? Commands.changeScreen({ screenName: expectedTargetScreen })
					: undefined,
				validation === "full" ? Commands.validateFull() : undefined,
				validation === "partial" ? Commands.validatePart({ focusFirstError: true }) : undefined,
				validation && messages ? Commands.setMessageState({ messages }) : undefined
			];
		}

		interface TargetScreenParams {
			readonly initialScreen: Screen;
			readonly target: Target;
			readonly expectedTargetScreen: Screen;
		}

		function testNavigationTargetScreen({
			initialScreen,
			target,
			expectedTargetScreen
		}: TargetScreenParams) {
			// Ignore Commands.changeScreenState, its tested in another case
			const { spy, middleware } = MiddlewareHelpers.createMiddlewareSpy([
				Commands.changeScreenState
			]);

			const store = createApp({ document: validDocument, middleware, screen: initialScreen });
			store.dispatch(Events.navigationButton({ target }));

			MiddlewareHelpers.assertActions(spy, getExpectedActions({ expectedTargetScreen }));
		}

		function getTargetAndExpectedTargetScreen(
			screenChangeActionExpected = true,
			currentScreen: Screen = "Screen2"
		): { readonly target: Target; readonly expectedTargetScreen: Screen | undefined } {
			return currentScreen === "Screen1"
				? {
						target: "screen-2",
						expectedTargetScreen: screenChangeActionExpected ? "Screen2" : undefined
					}
				: {
						target: "screen-1",
						expectedTargetScreen: screenChangeActionExpected ? "Screen1" : undefined
					};
		}

		interface WithoutIssuesParams {
			readonly validation?: FormModel.ButtonValidationEnum;
		}

		function testNavigationWithoutIssues({ validation }: WithoutIssuesParams): void {
			const { spy, middleware } = createMiddlewareSpyForNavWithValidation();

			const { target, expectedTargetScreen } = getTargetAndExpectedTargetScreen();

			const store = createApp({ document: validDocument, middleware });
			store.dispatch(Events.navigationButton({ target, validation }));

			MiddlewareHelpers.assertActions(
				spy,
				getExpectedActions({ expectedTargetScreen, validation })
			);
		}

		interface WithParseErrorParams {
			readonly screenChangeActionExpected: boolean;
			readonly errorOnCurrentScreen: boolean;
			readonly validation?: FormModel.ButtonValidationEnum;
			readonly options?: { validation?: "full" | "partial" };
		}

		function testNavigationWithParseError({
			errorOnCurrentScreen,
			screenChangeActionExpected,
			validation
		}: WithParseErrorParams): void {
			const { spy, middleware } = createMiddlewareSpyForNavWithValidation();
			const numberFieldPath = DocumentHelpers.createDocumentPath(["A12T_Buttons"], ["NumberField"]);
			const messages = createValidationEntryWithParsingError(
				numberFieldPath,
				"A",
				"numberContainsIllegalSymbols"
			);

			const screen = errorOnCurrentScreen ? "Screen1" : "Screen2";
			const { target, expectedTargetScreen } = getTargetAndExpectedTargetScreen(
				screenChangeActionExpected,
				screen
			);

			const store = createApp({ document: validDocument, middleware, messages, screen });
			store.dispatch(Events.navigationButton({ target, validation }));

			if (expectedTargetScreen) {
				MiddlewareHelpers.assertActions(
					spy,
					getExpectedActions({ expectedTargetScreen, validation })
				);
			} else {
				MiddlewareHelpers.assertNoAction(spy, Commands.changeScreen({ screenName: "" }));
			}
		}

		interface WithValidationWarningOrInfoParams {
			readonly validation?: FormModel.ButtonValidationEnum;
			readonly disableRuleConfirmation?: FormModel.DisableRuleConfirmation;
		}

		function testNavigationWithValidationInfo({
			validation,
			disableRuleConfirmation
		}: WithValidationWarningOrInfoParams): void {
			const { spy, middleware } = createMiddlewareSpyForNavWithValidation();

			const errorPath = DocumentHelpers.createDocumentPath(["A12T_Buttons"], ["RequiredField"]);

			const messages: Messages = {
				[DocumentPath.toString(errorPath)]: {
					validationMessages: [
						{
							element: errorPath,
							errorText: [
								{
									key: "documentModel.ruleErrorMessage.buttons-document.A12T_Buttons.InfoRuleForString",
									defaults: {
										en: '$RequiredField$ starts with the letters "AB".',
										de: '$RequiredField$ fängt mit den Buchstaben "AB" an.'
									},
									args: {
										RequiredField: {
											type: "localizable",
											value: undefined,
											properties: [
												{
													defaults: {},
													key: "documentModel.label.buttons-document.A12T_Buttons.RequiredField"
												}
											]
										}
									}
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

			const { target, expectedTargetScreen } = getTargetAndExpectedTargetScreen();

			const store = createApp({ document: documentWithInfo, middleware, disableRuleConfirmation });
			store.dispatch(Events.navigationButton({ target, validation }));

			const changeScreenAction = Commands.changeScreen({
				screenName: expectedTargetScreen!
			});

			const expectedActionsWithValidation = (validation: FormModel.ButtonValidationEnum) => [
				validation === "full"
					? Commands.validateFull()
					: Commands.validatePart({ focusFirstError: true }),
				Commands.setMessageState({ messages }),
				disableRuleConfirmation !== undefined
					? changeScreenAction
					: Commands.userConfirmationRequested({
							actionsToDispatch: [
								changeScreenAction,
								Commands.changeScreenState({
									index: 0,
									focusedComponent: {
										formModelPath: [
											{
												elementName: expectedTargetScreen as string
											}
										],
										subElement: "current-screen"
									}
								})
							],
							validation
						})
			];

			const expectedActionsWithoutValidation = () => [changeScreenAction];

			const expectedActions: (Action | undefined)[] = validation
				? expectedActionsWithValidation(validation)
				: expectedActionsWithoutValidation();

			MiddlewareHelpers.assertActions(spy, expectedActions);
		}

		function testNavigationWithValidationWarning({
			validation,
			disableRuleConfirmation
		}: WithValidationWarningOrInfoParams): void {
			const { spy, middleware } = createMiddlewareSpyForNavWithValidation();

			const errorPath = DocumentHelpers.createDocumentPath(["A12T_Buttons"], ["RequiredField"]);

			const messages: Messages = {
				[DocumentPath.toString(errorPath)]: {
					validationMessages: [
						{
							element: errorPath,
							errorText: [
								{
									key: "documentModel.ruleErrorMessage.buttons-document.A12T_Buttons.WarningRuleForString",
									defaults: {
										en: '$RequiredField$ should start with the letter "A"',
										de: '$RequiredField$ sollte mit dem Buchstaben "A" beginnen.'
									},
									args: {
										RequiredField: {
											type: "localizable",
											value: undefined,
											properties: [
												{
													defaults: {},
													key: "documentModel.label.buttons-document.A12T_Buttons.RequiredField"
												}
											]
										}
									}
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

			const { target, expectedTargetScreen } = getTargetAndExpectedTargetScreen();

			const store = createApp({
				document: documentWithWarning,
				middleware,
				disableRuleConfirmation
			});
			store.dispatch(Events.navigationButton({ target, validation }));

			const changeScreenAction = Commands.changeScreen({
				screenName: expectedTargetScreen as string
			});

			const expectedActionsWithValidation = (validation: FormModel.ButtonValidationEnum) => [
				validation === "full"
					? Commands.validateFull()
					: Commands.validatePart({ focusFirstError: true }),
				Commands.setMessageState({ messages }),
				disableRuleConfirmation === "WARNING"
					? changeScreenAction
					: Commands.userConfirmationRequested({
							actionsToDispatch: [
								changeScreenAction,
								Commands.changeScreenState({
									index: 0,
									focusedComponent: {
										formModelPath: [
											{
												elementName: expectedTargetScreen as string
											}
										],
										subElement: "current-screen"
									}
								})
							],
							validation
						})
			];

			const expectedActionsWithoutValidation = () => [changeScreenAction];

			const expectedActions: (Action | undefined)[] = validation
				? expectedActionsWithValidation(validation)
				: expectedActionsWithoutValidation();

			MiddlewareHelpers.assertActions(spy, expectedActions);
		}

		interface WithValidationErrorParams {
			readonly screenChangeActionExpected: boolean;
			readonly validation?: FormModel.ButtonValidationEnum;
		}

		function testNavigationWithValidationError({
			screenChangeActionExpected,
			validation
		}: WithValidationErrorParams): void {
			const { spy, middleware } = createMiddlewareSpyForNavWithValidation();

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

			const { target, expectedTargetScreen } = getTargetAndExpectedTargetScreen(
				screenChangeActionExpected
			);

			const store = createApp({ document: documentWithError, middleware });
			store.dispatch(Events.navigationButton({ target, validation }));

			MiddlewareHelpers.assertActions(
				spy,
				getExpectedActions({ expectedTargetScreen, validation, messages })
			);
		}

		function testNavigationFocusedComponent({ initialScreen, target }: TargetScreenParams) {
			const { spy, middleware } = MiddlewareHelpers.createMiddlewareSpy([]);

			const store = createApp({ document: validDocument, middleware, screen: initialScreen });
			store.dispatch(Events.navigationButton({ target }));

			const expectedAction = Commands.changeScreenState({
				index: 0,
				focusedComponent: {
					formModelPath: ModelHelpers.createModelPath("Screen2"),
					subElement: "current-screen"
				}
			});

			MiddlewareHelpers.assertAction(spy, expectedAction);
		}

		function createMiddlewareSpyForNavWithValidation(): {
			readonly spy: Mock<(a: AnyAction) => AnyAction>;
			readonly middleware: Middleware;
		} {
			/**
			 * Ignore Commands.changeScreenState and Commands.CorrectionMode.setValidationBarState
			 * They are dispatched by another middleware listening to validate part and
			 * therefore tested in the validatePart middleware tests
			 */
			return MiddlewareHelpers.createMiddlewareSpy([
				Commands.changeScreenState,
				Commands.CorrectionMode.setValidationBarState
			]);
		}

		type Screen = "Screen1" | "Screen2";
		type Target = "#previous" | "#next" | "screen-1" | "screen-2";
		type Messages = ReadonlyObjectMap<EngineStore.Validation.Entry>;

		interface CreateAppProps {
			readonly document: object;
			readonly middleware: Middleware;
			readonly messages?: Messages;
			readonly screen?: Screen;
			readonly repeatInstanceState?: ReadonlyObjectMap<EngineStore.Repeat.InstanceState>;
			readonly disableRuleConfirmation?: FormModel.DisableRuleConfirmation;
		}

		function createApp({
			document,
			middleware,
			messages,
			screen,
			repeatInstanceState,
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
					data: { document },
					ui: {
						screenLocation: [
							{
								locationPath: [{ elementName: screen ?? "Screen2" }],
								path: [],
								repeatInstanceState
							}
						],
						messages
					}
				}
			});
		}
	});
});
