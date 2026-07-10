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

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type { EntityInstancePath, GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { Commands, Events } from "../../../../../../back-end/store/index.js";
import { DocumentPath } from "../../../../../../models/internal/utils/document-utils.js";
import { createDocumentPath } from "../../../../../utils/createDocumentPath.js";
import { MiddlewareHelpers } from "../../../../../utils/MiddlewareHelpers.js";
import { createTestStore, loadModels } from "../../../../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../../../../utils/setupFixture.js";
import { CONTROLS_INDEX } from "../../../../../utils/test-model-helpers/controls.index.js";
import { DR } from "../../../../../utils/test-model-helpers/detached.repeat.js";
import {
	createValidationEntry,
	createValidationEntryWithParsingError
} from "../../../../../utils/validation.js";

export function executeTestsForDocumentAndMessageChanges(): void {
	const middlewareSpy = setupFixture(() => MiddlewareHelpers.createMiddlewareSpy());

	function setupStore(dirty?: boolean, data?: {}, messages?: {}) {
		return createTestStore({
			storeConfig: {
				models: models,
				data: { dirty: dirty || false, document: data || {} },
				ui: { messages }
			},
			middlewares: [middlewareSpy.middleware]
		});
	}

	const models = setupModelsFixture("computation-validation.correctionmode");

	beforeEach(() => {
		middlewareSpy.spy.mock.resetCalls();
	});

	const F2M_PATH = createDocumentPath(["root"], ["F2M"]);
	const F1_PATH = createDocumentPath(["root"], ["F1"]);

	function createEventAction(
		value: number | null,
		path: EntityInstancePath = F2M_PATH,
		formModelElementPath?: ModelPath
	) {
		return Events.valueChange({ value, path, formModelElementPath });
	}

	describe("Document changed", () => {
		it("dispatches a Command.setDocument with the updated document and a Command.setDataDirty(true) action", () => {
			setupStore().dispatch(createEventAction(42));

			const expectedCommands = [
				Commands.setDocument({
					document: { root: { F2M: 42 } },
					changes: [{ type: "ValueChanged", path: F2M_PATH }]
				}),
				Commands.setDataDirty(true)
			];

			MiddlewareHelpers.assertActions(middlewareSpy.spy, expectedCommands);
		});

		it("does not dispatch a Command.setDataDirty(true) action if the document is already dirty", () => {
			setupStore(true).dispatch(createEventAction(42));

			const expectedCommands = [
				Commands.setDocument({
					document: { root: { F2M: 42 } },
					changes: [{ type: "ValueChanged", path: F2M_PATH }]
				})
			];

			MiddlewareHelpers.assertActions(middlewareSpy.spy, expectedCommands);
		});

		describe("and a detached repeat detail screen is opened", () => {
			it("dispatches Commands.changeScreenState with dirty=true", () => {
				const models = loadModels("repeat", "detached");
				const store = createTestStore({
					storeConfig: {
						models,
						data: { document: {} },
						ui: {
							screenLocation: [
								{ locationPath: [], path: [] },
								{
									locationPath: DR.NestedRepeat.nested_dr_dr_locationPath,
									path: createDocumentPath(["Root"], ["Nested_L1"])
								}
							]
						}
					},
					middlewares: [middlewareSpy.middleware]
				});

				const valueChangeEvent = Events.valueChange({
					path: createDocumentPath(["Root"], ["Nested_L1"], ["L1_Number"]),
					value: 44
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

			function createConcreteDocumentPath(index: number): EntityInstancePath {
				return createDocumentPath(["root", 1], ["contacts", index], ["details", 1], ["name", 1]);
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
				}).dispatch(Events.valueChange({ value: "foo", path, formModelElementPath }));

				MiddlewareHelpers.assertAction(
					middlewareSpy.spy,
					Commands.setDocument({
						document: options.expectedResult,
						changes: [{ type: "ValueChanged", path }]
					})
				);
			}

			describe("with a semantic index", () => {
				const documentPath = createConcreteDocumentPath(2);

				it("dispatches a Commands.setDocument action with a document with a new row if it did not exist", () => {
					testFunction({
						documentPath,
						formModelElementPath: CONTROLS_INDEX.APPLICANT_NAME_CONTROL,
						initialDocument: {
							root: { contacts: [{ details: { name: "bar" } }] }
						},
						expectedResult: {
							root: {
								contacts: [
									{ details: { name: "bar" } },
									{ applicant: true, details: { name: "foo" } }
								]
							}
						}
					});
				});

				it("dispatches a Commands.setDocument action with a document with a updated row if it exists", () => {
					testFunction({
						documentPath,
						formModelElementPath: CONTROLS_INDEX.APPLICANT_NAME_CONTROL,
						initialDocument: {
							root: { contacts: [{}, { applicant: true, details: { name: "bar" } }] }
						},
						expectedResult: {
							root: { contacts: [{}, { applicant: true, details: { name: "foo" } }] }
						}
					});
				});
			});

			describe("with a numeric index", () => {
				const documentPath = createConcreteDocumentPath(2);

				it("dispatches a Commands.setDocument action with a document with a new row if it did not exist", () => {
					testFunction({
						documentPath,
						formModelElementPath: CONTROLS_INDEX.SECOND_CONTACT_NAME_CONTROL,
						initialDocument: {},
						expectedResult: { root: { contacts: [{ details: {} }, { details: { name: "foo" } }] } }
					});
				});

				it("dispatches a Commands.setDocument action with a document with a updated row if it exists", () => {
					testFunction({
						documentPath,
						formModelElementPath: CONTROLS_INDEX.SECOND_CONTACT_NAME_CONTROL,
						initialDocument: {
							root: { contacts: [{}, { applicant: true, details: { name: "bar" } }] }
						},
						expectedResult: {
							root: { contacts: [{}, { applicant: true, details: { name: "foo" } }] }
						}
					});
				});
			});
		});
	});

	describe("Document did not changed", () => {
		it("dispatches no Command.setDocument if the document did not change", () => {
			setupStore(false, { root: { F2M: 42 } }).dispatch(createEventAction(42));

			MiddlewareHelpers.assertActions(middlewareSpy.spy, []);
		});
	});

	describe("Validation messages changed", () => {
		it("dispatches a Command.setMessageState action with the new message state if there is a validation error", () => {
			setupStore().dispatch(createEventAction(12, F1_PATH));

			const expectedCommands = [
				Commands.setDocument({
					document: { root: { F1: 12 } },
					changes: [{ type: "ValueChanged", path: F1_PATH }]
				}),
				Commands.setMessageState({
					messages: {
						[DocumentPath.toString(F1_PATH)]: {
							validationMessages: [
								{
									element: F1_PATH,
									errorCode: "42",
									errorKey: "/root/R1",
									errorText: [
										{
											key: "documentModel.ruleErrorMessage.computation-validation\\pcorrectionmode-document.root.R1",
											args: {
												"F1.value": {
													properties: {
														formattingConfig: {
															leadingZerosAllowed: false,
															minFractionalDigits: 0,
															modelPath: [
																{
																	elementName: "root"
																},
																{
																	elementName: "F1"
																}
															],
															modelId: "computation-validation.correctionmode-document",
															type: "NumberType"
														}
													},
													type: "formattable",
													value: 12
												}
											},
											defaults: {
												en: "$F1.value$ is not the answer!",
												de: "$F1.value$ ist nicht die Antwort!"
											}
										}
									],
									severity: "ERROR",
									referencedFields: [F1_PATH]
								}
							]
						}
					}
				}),
				Commands.setDataDirty(true)
			];

			MiddlewareHelpers.assertActions(middlewareSpy.spy, expectedCommands);
		});

		it("dispatches a Command.setMessageState action with the new message state if a parsing error got cleared", () => {
			const parsingError = createValidationEntryWithParsingError(
				F2M_PATH,
				"abc",
				"numberContainsIllegalSymbols"
			);
			setupStore(false, { root: { F2M: null } }, parsingError).dispatch(createEventAction(null));

			const expectedCommands = [Commands.setMessageState({ messages: {} })];

			MiddlewareHelpers.assertActions(middlewareSpy.spy, expectedCommands);
		});

		it("dispatches a Command.setMessageState action with the new message state if a validation error got cleared", () => {
			const validationError = createValidationEntry({ path: F2M_PATH });
			setupStore(true, {}, validationError).dispatch(createEventAction(42));

			const expectedCommands = [
				Commands.setDocument({
					document: { root: { F2M: 42 } },
					changes: [{ type: "ValueChanged", path: F2M_PATH }]
				}),
				Commands.setMessageState({ messages: {} })
			];

			MiddlewareHelpers.assertActions(middlewareSpy.spy, expectedCommands);
		});
	});
}
