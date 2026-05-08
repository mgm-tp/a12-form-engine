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

import type { Action } from "typescript-fsa";

import { Commands } from "../../../../../back-end/store/index.js";
import { DocumentPath } from "../../../../../models/internal/utils/document-utils.js";
import { MiddlewareHelpers } from "../../../../utils/back-end-helpers.js";
import { DocumentHelpers } from "../../../../utils/document-helpers.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../../../utils/setupFixture.js";

const { createTestStore } = SetupHelpers;

describe("api.back-end.store.middleware", () => {
	describe("validateFullMiddlewareFactory", () => {
		describe("handles Commands.validateFull", () => {
			const middlewareSpy = setupFixture(() => MiddlewareHelpers.createMiddlewareSpy());

			const models = setupModelsFixture("computation-validation.correctionmode");

			describe("Given a document with no errors", () => {
				describe("and no payload in the Commands.validateFull action", () => {
					executeTestForNoErrors(Commands.validateFull(), true);
				});

				describe("and 'disableFocusBehavior' in the payload is true in the Commands.validateFull action", () => {
					executeTestForNoErrors(Commands.validateFull({ disableFocusBehavior: true }), false);
				});

				describe("and 'disableFocusBehavior' in the payload is false in the Commands.validateFull action", () => {
					executeTestForNoErrors(Commands.validateFull({ disableFocusBehavior: false }), true);
				});

				describe("and 'disableFocusBehavior' in the payload is undefined in the Commands.validateFull action", () => {
					executeTestForNoErrors(Commands.validateFull({}), true);
				});

				function executeTestForNoErrors(
					actionToDispatch: Action<void | Commands.ValidateFullPayload>,
					focusCurrentScreen?: boolean
				): void {
					const setMessageState = Commands.setMessageState({ messages: {} });
					const changeScreenState = Commands.changeScreenState({
						index: 0,
						focusedComponent: { formModelPath: [], subElement: "current-screen" }
					});
					const expectedValidationBarState = Commands.CorrectionMode.setValidationBarState({
						validationBar: { visible: true }
					});

					before(() => {
						middlewareSpy.spy.mock.resetCalls();
						setupStore().dispatch(actionToDispatch);
					});

					it("does not dispatch Commands.setMessageState", () => {
						MiddlewareHelpers.assertNoAction(middlewareSpy.spy, setMessageState);
					});

					if (focusCurrentScreen) {
						it("dispatches Commands.changeScreenState to set the focusedComponent to the form", () => {
							MiddlewareHelpers.assertAction(middlewareSpy.spy, changeScreenState);
						});
					} else {
						it("does not dispatch Commands.changeScreenState to set the focusedComponent to the form", () => {
							MiddlewareHelpers.assertNoAction(middlewareSpy.spy, changeScreenState);
						});
					}

					it("dispatches only these actions", () => {
						MiddlewareHelpers.assertNumberOfActions(middlewareSpy.spy, [
							...(focusCurrentScreen
								? [changeScreenState, expectedValidationBarState]
								: [expectedValidationBarState])
						]);
					});
				}
			});

			describe("Given a document with errors", () => {
				describe("and no payload in the Commands.validateFull action", () => {
					executeTestForErrors(Commands.validateFull(), true);
				});

				describe("and 'disableFocusBehavior' in the payload is true in the Commands.validateFull action", () => {
					executeTestForErrors(Commands.validateFull({ disableFocusBehavior: true }), false);
				});

				describe("and 'disableFocusBehavior' in the payload is false in the Commands.validateFull action", () => {
					executeTestForErrors(Commands.validateFull({ disableFocusBehavior: false }), true);
				});

				describe("and 'disableFocusBehavior' in the payload is undefined in the Commands.validateFull action", () => {
					executeTestForErrors(Commands.validateFull({}), true);
				});

				function executeTestForErrors(
					actionToDispatch: Action<void | Commands.ValidateFullPayload>,
					focusValidationBar?: boolean
				): void {
					before(() => {
						middlewareSpy.spy.mock.resetCalls();
						setupStore({ root: { F2M: 33 } }).dispatch(actionToDispatch);
					});

					const FIELD_PATH = DocumentHelpers.createDocumentPath(["root"], ["F2M"]);

					const setMessageState = Commands.setMessageState({
						messages: {
							[DocumentPath.toString(FIELD_PATH)]: {
								validationMessages: [
									{
										element: FIELD_PATH,
										errorCode: "42",
										errorKey: "/root/R2M",
										errorText: [
											{
												key: "documentModel.ruleErrorMessage.computation-validation\\pcorrectionmode-document.root.R2M",
												args: {
													"F2M.value": {
														properties: {
															formattingConfig: {
																leadingZerosAllowed: false,
																minFractionalDigits: 0,
																modelPath: [
																	{
																		elementName: "root"
																	},
																	{
																		elementName: "F2M"
																	}
																],
																modelId: "computation-validation.correctionmode-document",
																type: "NumberType"
															}
														},
														type: "formattable",
														value: 33
													}
												},
												defaults: {
													en: "$F2M.value$ is not the answer!",
													de: "$F2M.value$ ist nicht die Antwort!"
												}
											}
										],
										severity: "ERROR",
										referencedFields: [FIELD_PATH]
									}
								]
							}
						}
					});

					const changeScreenState = Commands.changeScreenState({
						index: 0,
						focusedComponent: { formModelPath: [], subElement: "validation-bar" }
					});

					const setValidationBarState = Commands.CorrectionMode.setValidationBarState({
						validationBar: { visible: true }
					});

					it("dispatches Commands.setMessageState with the validation messages", () => {
						MiddlewareHelpers.assertAction(middlewareSpy.spy, setMessageState);
					});

					it("dispatches Commands.CorrectionMode.setValidationBarState with validationBar visible='true'", () => {
						MiddlewareHelpers.assertAction(middlewareSpy.spy, setValidationBarState);
					});

					if (focusValidationBar) {
						it("dispatches Commands.changeScreenState to set the focusedComponent to the validationBar", () => {
							MiddlewareHelpers.assertAction(middlewareSpy.spy, changeScreenState);
						});
					} else {
						it("does not dispatch Commands.changeScreenState to set the focusedComponent to the validationBar", () => {
							MiddlewareHelpers.assertNoAction(middlewareSpy.spy, changeScreenState);
						});
					}

					it("dispatches only these action", () => {
						MiddlewareHelpers.assertNumberOfActions(middlewareSpy.spy, [
							setMessageState,
							setValidationBarState,
							...(focusValidationBar ? [changeScreenState] : [])
						]);
					});
				}
			});

			const baseDocument = {
				CustomTypes: {
					MultiSelect2: [{ value: "key1" }]
				}
			};

			function setupStore(document?: {}, messages?: {}) {
				return createTestStore({
					storeConfig: {
						models: models,
						data: { dirty: false, document: { ...baseDocument, ...document } },
						ui: { messages }
					},
					middlewares: [middlewareSpy.middleware]
				});
			}
		});
	});
});
