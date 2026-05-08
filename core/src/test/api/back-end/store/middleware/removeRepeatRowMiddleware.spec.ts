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

import { strictEqual } from "node:assert/strict";

import type { Action } from "typescript-fsa";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type {
	EntityInstancePath,
	GroupInstance
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { Commands, Events } from "../../../../../back-end/store/internal/actions.js";
import type { EngineStore, Models } from "../../../../../back-end/store/internal/store.js";
import {
	DocumentPath,
	DocumentUtils
} from "../../../../../models/internal/utils/document-utils.js";
import type { ReadonlyObjectMap } from "../../../../../models/internal/utils/json.js";
import { MiddlewareHelpers } from "../../../../utils/back-end-helpers.js";
import { DocumentHelpers } from "../../../../utils/document-helpers.js";
import { ModelHelpers } from "../../../../utils/model-helpers.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../../../utils/setupFixture.js";
import { DOCUMENT_PATHS } from "../../../../utils/test-model-helpers/computation.js";
import { DR } from "../../../../utils/test-model-helpers/detached.repeat.js";
import { REPEAT, createDocumentForRepeat } from "../../../../utils/test-model-helpers/repeat.js";

const { createTestStore, loadData } = SetupHelpers;
const { createModelPath } = ModelHelpers;
const { createDocumentPath } = DocumentHelpers;

describe("api.back-end.store.middleware", () => {
	describe("removeRepeatRowMiddleware", () => {
		describe("handles Events.Repeat.removeRow", () => {
			const middlewareSpy = setupFixture(() => MiddlewareHelpers.createMiddlewareSpy());

			beforeEach(() => {
				middlewareSpy.spy.mock.resetCalls();
			});

			function setup(document: GroupInstance, models: Models, ui?: Partial<EngineStore.UIState>) {
				return createTestStore({
					storeConfig: {
						models,
						data: { document },
						ui
					},
					middlewares: [middlewareSpy.middleware]
				});
			}

			const setDataDirtyTrueCommand = Commands.setDataDirty(true);
			const clearMessageStateCommand = Commands.setMessageState({ messages: {} });

			describe("given an inline repeat", () => {
				const INLINE_REPEAT_MODEL_REP_NAME = "Nested_L6";

				const INLINE_REPEAT_MODEL_ROOT_PATH = createDocumentPath(["Root"]);
				const INLINE_REPEAT_MODEL_REP_PATH = createDocumentPath(["Root"], ["Nested_L6", 0]);
				const INLINE_REPEAT_REPEAT_FORM_MODEL_PATH = createModelPath(
					"SortingAndFiltering",
					"inline-repeat-Nested_L6"
				);
				const INLINE_REPEAT_LOCATION_PATH = createModelPath("SortingAndFiltering");

				const expectedDocument = createDocumentForRepeat({
					nestedL6: [
						{ L6_String: "Row 1", L6_Number: 1 },
						{ L6_String: "Row 3", L6_Number: 3 }
					]
				});

				function createEntry(options: {
					keyPath: EntityInstancePath;
					referencedFields: EntityInstancePath[];
					value: string;
				}): ReadonlyObjectMap<EngineStore.Validation.Entry> {
					const { keyPath, referencedFields, value } = options;

					const baseErrorInformation = {
						errorCode: "zahlHatUngueltigeZeichen",
						errorKey: "formalePruefung",
						errorText: [{ key: "foo", defaults: { en: "The value must be integer." } }],
						severity: "ERROR" as "ERROR" | "WARNING"
					};
					return {
						[DocumentPath.toString(keyPath)]: {
							parseError: {
								value: value,
								message: {
									...baseErrorInformation,
									element: keyPath,
									referencedFields: referencedFields
								}
							},
							validationMessages: []
						}
					};
				}

				function createNumberPath(index: number): EntityInstancePath {
					return createDocumentPath(
						[REPEAT.rootGroup],
						[REPEAT.nestedL6, index],
						[REPEAT.nestedGroup],
						[REPEAT.L6_Number]
					);
				}

				function createStringPath(index: number): EntityInstancePath {
					return createDocumentPath(
						[REPEAT.rootGroup],
						[REPEAT.nestedL6, index],
						[REPEAT.nestedGroup],
						[REPEAT.L6_String]
					);
				}

				const removeRowEvent = Events.Repeat.removeRow({
					rowPath: [
						...INLINE_REPEAT_MODEL_ROOT_PATH,
						...createDocumentPath([INLINE_REPEAT_MODEL_REP_NAME, 2]) // Remove second row
					],
					repeatFormModelPath: INLINE_REPEAT_REPEAT_FORM_MODEL_PATH
				});
				const changeRepeatInstanceStateEntryCommand = Commands.changeRepeatInstanceStateEntry({
					entry: { page: 1, newRow: undefined, expandedRowPath: undefined },
					locationPath: INLINE_REPEAT_LOCATION_PATH,
					repeatFormModelPath: INLINE_REPEAT_REPEAT_FORM_MODEL_PATH
				});

				const changeScreenState = Commands.changeScreenState({
					index: 0,
					focusedComponent: { formModelPath: INLINE_REPEAT_REPEAT_FORM_MODEL_PATH }
				});

				const inlineRepeatModels = setupModelsFixture("repeat", "inline");

				it("dispatches Commands.setDocument with an updated document", () => {
					const document = loadData(
						"repeat",
						"dataForRemoveRowTest",
						inlineRepeatModels.documentModel
					);
					const store = setup(document, inlineRepeatModels);

					const rows = DocumentUtils.getRows(document, INLINE_REPEAT_MODEL_REP_PATH);
					strictEqual(rows.length, 3, "equaled that there are 3 initial rows");

					store.dispatch(removeRowEvent);

					const expectedSetDocumentCommand = Commands.setDocument({
						changes: [
							{
								type: "ValueChanged",
								path: DocumentHelpers.createDocumentPath(["Root"], ["L6_Number_Sum"])
							},
							{ type: "GroupRemoved", path: removeRowEvent.payload.rowPath }
						],
						document: expectedDocument
					});

					const expectedActions = [
						expectedSetDocumentCommand,
						setDataDirtyTrueCommand,
						changeRepeatInstanceStateEntryCommand,
						changeScreenState
					];

					MiddlewareHelpers.assertActions(middlewareSpy.spy, expectedActions);
				});

				it("dispatches Commands.setMessageState with updated validation messages", () => {
					const document = loadData(
						"repeat",
						"dataForRemoveRowTest",
						inlineRepeatModels.documentModel
					);
					const ui: Partial<EngineStore.UIState> = {
						messages: {
							...createEntry({
								keyPath: createNumberPath(1),
								referencedFields: [createNumberPath(1)],
								value: "1"
							}),
							...createEntry({
								keyPath: createNumberPath(2),
								referencedFields: [createNumberPath(2)],
								value: "2"
							}),
							...createEntry({
								keyPath: createNumberPath(3),
								referencedFields: [createNumberPath(3), createStringPath(3)],
								value: "3"
							}),
							...createEntry({
								keyPath: createNumberPath(4),
								referencedFields: [createNumberPath(4)],
								value: "4"
							})
						}
					};
					const store = setup(document, inlineRepeatModels, ui);

					store.dispatch(removeRowEvent);

					const expectedSetMessageStatePayload: Commands.SetMessageStatePayload = {
						messages: {
							...createEntry({
								keyPath: createNumberPath(1),
								referencedFields: [createNumberPath(1)],
								value: "1"
							}),
							...createEntry({
								keyPath: createNumberPath(2),
								referencedFields: [createNumberPath(2), createStringPath(2)],
								value: "3"
							}),
							...createEntry({
								keyPath: createNumberPath(3),
								referencedFields: [createNumberPath(3)],
								value: "4"
							})
						}
					};
					MiddlewareHelpers.assertAction(
						middlewareSpy.spy,
						Commands.setMessageState(expectedSetMessageStatePayload)
					);
				});

				it("dispatches validateFull when validation bar is visible", () => {
					const ui: Partial<EngineStore.UIState> = {
						validationBar: {
							visible: true,
							expanded: false,
							currentMessageKey: "test"
						}
					};
					const store = setup({}, inlineRepeatModels, ui);

					store.dispatch(removeRowEvent);

					MiddlewareHelpers.assertAction(middlewareSpy.spy, Commands.validateFull());
				});

				it("does not dispatch validateFull when validation bar is not visible", () => {
					const ui: Partial<EngineStore.UIState> = {
						validationBar: {
							visible: false,
							expanded: false,
							currentMessageKey: "test"
						}
					};
					const store = setup({}, inlineRepeatModels, ui);

					store.dispatch(removeRowEvent);

					MiddlewareHelpers.assertNoAction(middlewareSpy.spy, Commands.validateFull());
				});
			});

			describe("given an inline repeat with computations", () => {
				const COMPUTATION_MODEL_ROW_PATH = createDocumentPath(["root"], ["Rep", 2]);
				const COMPUTATION_MODEL_REPEAT_FORM_MODEL_PATH = createModelPath("Screen1", "ir");

				const expectedDocument = {
					root: {
						NonRep: {
							FieldA: 1,
							FieldB: 2,
							FieldG: -1,
							FieldC: 3,
							ResultDivision: 0.5
						},
						Rep: [
							{
								FieldA: 1,
								FieldB: 2,
								FieldC: 3
							}
						],
						FieldD: 3,
						MultiSelectComputation: {
							FieldH: 0
						}
					}
				};

				const removeRowEvent = Events.Repeat.removeRow({
					rowPath: COMPUTATION_MODEL_ROW_PATH,
					repeatFormModelPath: COMPUTATION_MODEL_REPEAT_FORM_MODEL_PATH
				});

				const computationModels = setupModelsFixture("computation-validation.computation");

				it("re-validates the document and dispatches Commands.setMessageState with the correct messages", () => {
					const document = loadData(
						"computation-validation.computation",
						"dataForRemoveRowTest",
						computationModels.documentModel
					);
					const ui: Partial<EngineStore.UIState> = {
						messages: {
							[DocumentPath.toString(createDocumentPath(["root", 1], ["FieldD", 1]))]: {
								validationMessages: [
									{
										element: createDocumentPath(["root", 1], ["FieldD", 1]),
										errorText: [
											{ key: "foo", defaults: { en: "Value should not be bigger than 20!" } }
										],
										errorCode: "Error rule_af781",
										errorKey: "/root/NewRule_1",
										severity: "ERROR",
										referencedFields: [createDocumentPath(["root", 1], ["FieldD", 1])]
									}
								]
							}
						}
					};
					const store = setup(document, computationModels, ui);

					store.dispatch(removeRowEvent);

					MiddlewareHelpers.assertAction(middlewareSpy.spy, clearMessageStateCommand);
				});

				it("dispatches Commands.setDocument with the recomputed document ", () => {
					const document = loadData(
						"computation-validation.computation",
						"data2",
						computationModels.documentModel
					);
					const store = setup(document, computationModels);

					store.dispatch(removeRowEvent);

					const expectedCommand = Commands.setDocument({
						changes: [
							{ type: "ValueChanged", path: DOCUMENT_PATHS.FIELD_QUOTIENT },
							{ type: "ValueChanged", path: DOCUMENT_PATHS.FIELD_D },
							{ type: "ValueChanged", path: DOCUMENT_PATHS.FIELD_H },
							{ type: "GroupRemoved", path: removeRowEvent.payload.rowPath }
						],
						document: expectedDocument
					});

					MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
				});
			});

			describe("given an inline repeat with paging", () => {
				const PAGING_LAST_PATH = createDocumentPath(["Root"], ["Nested_L1", 4]);
				const PAGING_MIDDLE_PATH = createDocumentPath(["Root"], ["Nested_L1", 2]);
				const PAGING_REPEAT_MODEL_PATH = createModelPath("Paging", "inline-repeat-paging");
				const PAGING_LOCATION_PATH = createModelPath("Paging");

				function createRemoveRowEvent(rowPath: EntityInstancePath) {
					return Events.Repeat.removeRow({
						rowPath,
						repeatFormModelPath: PAGING_REPEAT_MODEL_PATH
					});
				}
				function createChangeRepeatInstanceStateCommand(
					page: number
				): Action<Commands.ChangeRepeatInstanceStateEntryPayload> {
					return Commands.changeRepeatInstanceStateEntry({
						locationPath: PAGING_LOCATION_PATH,
						repeatFormModelPath: PAGING_REPEAT_MODEL_PATH,
						entry: { page, newRow: undefined, expandedRowPath: undefined }
					});
				}

				const inlineRepeatModels = setupModelsFixture("repeat", "inline");

				it(
					"dispatches Commands.changeRepeatInstanceStateEntry with page set to the last page with entries, if the current " +
						"page doesn't contain rows anymore after removing a row",
					() => {
						const document = loadData(
							"repeat",
							"dataForPagingTest",
							inlineRepeatModels.documentModel
						);
						const ui: Partial<EngineStore.UIState> = {
							screenLocation: [
								{
									path: [],
									locationPath: PAGING_LOCATION_PATH,
									repeatInstanceState: {
										[ModelPath.toString(PAGING_REPEAT_MODEL_PATH)]: {
											page: 2
										}
									}
								}
							]
						};
						const store = setup(document, inlineRepeatModels, ui);

						// Remove 4th row, the only on page 2
						store.dispatch(createRemoveRowEvent(PAGING_LAST_PATH));

						MiddlewareHelpers.assertAction(
							middlewareSpy.spy,
							createChangeRepeatInstanceStateCommand(1)
						);
					}
				);

				it(
					"dispatches Commands.changeRepeatInstanceStateEntry with page set to the current page, " +
						"if it still contains rows after removing a row",
					() => {
						const document = loadData(
							"repeat",
							"dataForPagingTest",
							inlineRepeatModels.documentModel
						);
						const ui: Partial<EngineStore.UIState> = {
							screenLocation: [
								{
									path: [],
									locationPath: PAGING_LOCATION_PATH,
									repeatInstanceState: {
										[ModelPath.toString(PAGING_REPEAT_MODEL_PATH)]: {
											page: 1
										}
									}
								}
							]
						};
						const store = setup(document, inlineRepeatModels, ui);

						// Remove 2nd row, the 2nd on page 1
						store.dispatch(createRemoveRowEvent(PAGING_MIDDLE_PATH));

						MiddlewareHelpers.assertAction(
							middlewareSpy.spy,
							createChangeRepeatInstanceStateCommand(1)
						);
					}
				);
			});

			describe("given a repeat in a detached repeat detail screen", () => {
				const models = setupModelsFixture("repeat", "detached");

				it("dispatches a Commands.changeScreenState action to set the dirty state of the screen", () => {
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

					const removeRowEvent = Events.Repeat.removeRow({
						rowPath: DocumentHelpers.createDocumentPath(["Root"], ["Nested_L1"], ["Nested_L2"]),
						repeatFormModelPath: [
							...DR.NestedRepeat.nested_dr_dr_locationPath,
							{ elementName: "inline-repeat-Nested_L2" }
						]
					});

					store.dispatch(removeRowEvent);
					const changeScreenState = Commands.changeScreenState({
						index: 1,
						dirty: true
					});

					MiddlewareHelpers.assertAction(middlewareSpy.spy, changeScreenState);
				});
			});
		});
	});
});
