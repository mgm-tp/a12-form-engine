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

import type { Action } from "@com.mgmtp.a12.client/typescript-fsa-redux-5-compat";
import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type { EntityInstancePath, GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { Commands, Events } from "../../../../../../back-end/store/index.js";
import type { EngineStore } from "../../../../../../back-end/store/internal/store.js";
import type { MultiSelectData, ReadonlyObjectMap } from "../../../../../../models/index.js";
import { createDocumentPath } from "../../../../../utils/createDocumentPath.js";
import { MiddlewareHelpers } from "../../../../../utils/MiddlewareHelpers.js";
import { createTestStore, loadModels } from "../../../../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../../../../utils/setupFixture.js";
import { CONTROLS_INDEX } from "../../../../../utils/test-model-helpers/controls.index.js";
import { DR } from "../../../../../utils/test-model-helpers/detached.repeat.js";
import { createValidationEntry } from "../../../../../utils/validation.js";

export function executeTestsForMultiSelectValueChange(): void {
	const middlewareSpy = setupFixture(() => MiddlewareHelpers.createMiddlewareSpy());

	function setupStore(dirty?: boolean, data?: {}, ui?: Partial<EngineStore.UIState>) {
		return createTestStore({
			storeConfig: {
				models: models,
				data: { dirty: dirty || false, document: data || {} },
				ui: ui
			},
			middlewares: [middlewareSpy.middleware]
		});
	}

	const models = setupModelsFixture("controls.multi-select");

	beforeEach(() => {
		middlewareSpy.spy.mock.resetCalls();
	});

	const pathToMultiSelect = createDocumentPath(["root"], ["MultiSelect01", 0]);

	function createEventAction(path: EntityInstancePath, value: MultiSelectData) {
		return Events.multiSelectValueChange({ value, path, formModelElementPath: [] });
	}

	function createExpectedSetDocumentAction(
		values: { value: string }[]
	): Action<Commands.SetDocumentPayload> {
		return Commands.setDocument({
			document: { root: { MultiSelect01: values } },
			changes: [
				{
					type: "ValueChanged",
					path: createDocumentPath(["root"], ["MultiSelect01", 1], ["value"])
				},
				{
					type: "ValueChanged",
					path: createDocumentPath(["root"], ["MultiSelect01", 2], ["value"])
				}
			]
		});
	}

	function createExpectedSetDocumentActionForRepeatableGroup(
		values: { value: string }[]
	): Action<Commands.SetDocumentPayload> {
		return Commands.setDocument({
			document: { root: { repeatableGroup: [{ MultiSelect01: values }] } },
			changes: [
				{
					type: "ValueChanged",
					path: createDocumentPath(["root"], ["repeatableGroup"], ["MultiSelect01", 1], ["value"])
				},
				{
					type: "ValueChanged",
					path: createDocumentPath(["root"], ["repeatableGroup"], ["MultiSelect01", 2], ["value"])
				}
			]
		});
	}

	describe("Document changed", () => {
		it("dispatches a Command.setDocument with the updated document and a Command.setDataDirty(true) action", () => {
			const value = [{ value: "key1" }, { value: "key3" }];
			setupStore().dispatch(createEventAction(pathToMultiSelect, value));

			const expectedCommands = [
				createExpectedSetDocumentAction(value),
				Commands.setDataDirty(true)
			];

			MiddlewareHelpers.assertActions(middlewareSpy.spy, expectedCommands);
		});

		it("does not dispatch a Command.setDataDirty(true) action if the document is already dirty", () => {
			const value = [{ value: "key1" }, { value: "key3" }];
			setupStore(true).dispatch(createEventAction(pathToMultiSelect, value));

			const expectedCommands = [createExpectedSetDocumentAction(value)];

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

				const valueChangeEvent = Events.multiSelectValueChange({
					path: createDocumentPath(["Root"], ["Nested_L1"], ["L1_MultiSelect", 0]),
					value: [{ value: "V1" }],
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

			const value = [{ value: "chronic_pain" }, { value: "implantates" }];

			function createConcreteDocumentPath(index: number): EntityInstancePath {
				return createDocumentPath(
					["root", 1],
					["contacts_with_all_field_types", index],
					["details", 1],
					["issues", 1]
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
				}).dispatch(Events.multiSelectValueChange({ value, path, formModelElementPath }));

				MiddlewareHelpers.assertAction(
					middlewareSpy.spy,
					Commands.setDocument({
						document: options.expectedResult,
						changes: [
							{
								type: "ValueChanged",
								path: [
									...path.slice(0, path.length - 1),
									...createDocumentPath(["issues", 1], ["value"])
								]
							},
							{
								type: "ValueChanged",
								path: [
									...path.slice(0, path.length - 1),
									...createDocumentPath(["issues", 2], ["value"])
								]
							}
						]
					})
				);
			}

			const documentPath = createConcreteDocumentPath(2);

			it(
				"dispatches a Commands.setDocument action with a document with a new row for the multi-select " +
					"and a preceding row if they did not exist yet",
				() => {
					testFunction({
						documentPath,
						formModelElementPath: CONTROLS_INDEX.SECOND_CONTACT_ISSUES_CONTROL,
						initialDocument: {},
						expectedResult: {
							root: {
								contacts_with_all_field_types: [
									{ details: { photo: {} } },
									{ details: { photo: {}, issues: value } }
								]
							}
						}
					});
				}
			);

			it("dispatches a Commands.setDocument action with a document with a updated row if it exists", () => {
				testFunction({
					documentPath,
					formModelElementPath: CONTROLS_INDEX.SECOND_CONTACT_ISSUES_CONTROL,
					initialDocument: {
						root: {
							contacts_with_all_field_types: [
								{ details: { photo: {} } },
								{ details: { photo: {}, issues: [] } }
							]
						}
					},
					expectedResult: {
						root: {
							contacts_with_all_field_types: [
								{ details: { photo: {} } },
								{ details: { photo: {}, issues: value } }
							]
						}
					}
				});
			});
		});
	});

	describe("Validation messages changed", () => {
		describe("Control", () => {
			function createValueError(index: number): ReadonlyObjectMap<EngineStore.Validation.Entry> {
				const pathToInvalidValue = [
					...createDocumentPath(["root"], ["MultiSelect01", index]),
					{ elementName: "value", index: 1 }
				];

				return createValidationEntry({
					path: pathToInvalidValue,
					errorCode: "Error rule_48811",
					errorKey: "/root/Rule1",
					errorText: [
						{
							key: "documentModel.ruleErrorMessage.controls\\pmulti-select-document.root.Rule1",
							defaults: { en: "$MultiSelect01/value.value$ should not be selected!" },
							args: {
								"MultiSelect01/value.value": {
									properties: [
										{
											defaults: {
												en: "Value 2"
											},
											key: "documentModel.enumValues.controls\\pmulti-select-document.root.MultiSelect01.value.key2"
										}
									],
									type: "localizable",
									value: "key2"
								}
							}
						}
					]
				});
			}

			it("dispatches a Command.setMessageState action with the new message state", () => {
				const value = [{ value: "key1" }, { value: "key2" }];
				setupStore(true).dispatch(createEventAction(pathToMultiSelect, value));

				const expectedCommands = [
					createExpectedSetDocumentAction(value),
					Commands.setMessageState({ messages: createValueError(2) })
				];

				MiddlewareHelpers.assertActions(middlewareSpy.spy, expectedCommands);
			});

			it("keeps the error when the value changes but the error was not resolved", () => {
				const value = [{ value: "key2" }, { value: "key3" }];
				setupStore(true).dispatch(createEventAction(pathToMultiSelect, value));

				const expectedCommands = [
					createExpectedSetDocumentAction(value),
					Commands.setMessageState({ messages: createValueError(1) })
				];

				MiddlewareHelpers.assertActions(middlewareSpy.spy, expectedCommands);
			});

			it("dispatches a Command.setMessage action with an updated message state if validation errors get resolved", () => {
				const anyError = createValidationEntry({ path: createDocumentPath(["Any"], ["Path"]) });
				const store = setupStore(true, {}, { messages: { ...createValueError(1), ...anyError } });
				const value = [{ value: "key1" }, { value: "key3" }];
				store.dispatch(createEventAction(pathToMultiSelect, value));

				const expectedCommands = [
					createExpectedSetDocumentAction(value),
					Commands.setMessageState({ messages: anyError })
				];

				MiddlewareHelpers.assertActions(middlewareSpy.spy, expectedCommands);
			});
		});

		describe("FieldOverviewColumn", () => {
			function createValueError(index: number): ReadonlyObjectMap<EngineStore.Validation.Entry> {
				const pathToInvalidValue = [
					...createDocumentPath(["root"], ["repeatableGroup"], ["MultiSelect01", index]),
					{ elementName: "value", index: 1 }
				];

				return createValidationEntry({
					path: pathToInvalidValue,
					errorCode: "Error rule_48811",
					errorKey: "/root/repeatableGroup/Rule1",
					errorText: [
						{
							key: "documentModel.ruleErrorMessage.controls\\pmulti-select-document.root.repeatableGroup.Rule1",
							defaults: { en: "$MultiSelect01/value.value$ should not be selected!" },
							args: {
								"MultiSelect01/value.value": {
									properties: [
										{
											defaults: {
												en: "Value 2"
											},
											key: "documentModel.enumValues.controls\\pmulti-select-document.root.repeatableGroup.MultiSelect01.value.key2"
										}
									],
									type: "localizable",
									value: "key2"
								}
							}
						}
					]
				});
			}

			const pathToMultiSelectInRepeat = createDocumentPath(
				["root"],
				["repeatableGroup"],
				["MultiSelect01", 0]
			);

			it("dispatches a Command.setMessageState action with the new message state", () => {
				const store = setupStore(true, { root: { repeatableGroup: [{}] } });

				const value = [{ value: "key2" }, { value: "key3" }];
				store.dispatch(createEventAction(pathToMultiSelectInRepeat, value));

				const expectedCommands = [
					createExpectedSetDocumentActionForRepeatableGroup(value),
					Commands.setMessageState({ messages: createValueError(1) })
				];

				MiddlewareHelpers.assertActions(middlewareSpy.spy, expectedCommands);
			});

			it("dispatches a Command.setMessage action with an empty message state if all validation errors are resolved", () => {
				const anyError = createValidationEntry({ path: createDocumentPath(["Any"], ["Path"]) });
				const store = setupStore(
					true,
					{ root: { repeatableGroup: [{}] } },
					{ messages: { ...createValueError(1), ...anyError } }
				);

				const value = [{ value: "key1" }, { value: "key3" }];
				store.dispatch(createEventAction(pathToMultiSelectInRepeat, value));

				const expectedCommands = [
					createExpectedSetDocumentActionForRepeatableGroup(value),
					Commands.setMessageState({ messages: anyError })
				];

				MiddlewareHelpers.assertActions(middlewareSpy.spy, expectedCommands);
			});
		});
	});
}
