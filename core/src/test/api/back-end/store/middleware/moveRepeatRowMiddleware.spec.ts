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

import type { EngineStore } from "../../../../../back-end/store/index.js";
import { Commands, Events } from "../../../../../back-end/store/index.js";
import { DocumentPath } from "../../../../../models/internal/utils/document-utils.js";
import type { ReadonlyObjectMap } from "../../../../../models/internal/utils/json.js";
import { MiddlewareHelpers } from "../../../../utils/back-end-helpers.js";
import { DocumentHelpers } from "../../../../utils/document-helpers.js";
import { ModelHelpers } from "../../../../utils/model-helpers.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../../../utils/setupFixture.js";
import { createDocument } from "../../../../utils/test-model-helpers/repeat.row-actions.js";

const { createDocumentPath } = DocumentHelpers;
const { createModelPath } = ModelHelpers;
const { createTestStore } = SetupHelpers;

describe("api.back-end.store.middleware", () => {
	describe("moveRepeatRowMiddleware", () => {
		describe("handles Events.Repeat.moveRowTriggered", () => {
			const models = setupModelsFixture("repeat.row-actions");

			const middlewareSpy = setupFixture(() => MiddlewareHelpers.createMiddlewareSpy());

			const validDocument = createDocument({
				repeat: [
					{ stringField: "Row 1", numberField: 42 },
					{ stringField: "Row 2", numberField: 44 },
					{ stringField: "Row 3", numberField: 45 }
				]
			});

			const invalidDocument = createDocument({
				repeat: [
					{ stringField: "Row 1", numberField: 42 },
					{ stringField: "Row 2", numberField: 12 },
					{ stringField: "Row 3", numberField: 45 }
				]
			});

			const expectedPositiveDeltaDocument = createDocument({
				repeat: [
					{ stringField: "Row 1", numberField: 42 },
					{ stringField: "Row 3", numberField: 45 },
					{ stringField: "Row 2", numberField: 44 }
				]
			});

			const expectedNegativeDeltaDocument = createDocument({
				repeat: [
					{ stringField: "Row 2", numberField: 44 },
					{ stringField: "Row 1", numberField: 42 },
					{ stringField: "Row 3", numberField: 45 }
				]
			});

			const repeatFormModelPath = createModelPath(
				"InlineRepeat",
				"inline-repeat-repeat_Only_Move_True"
			);
			const rowPath = createDocumentPath(["Root"], ["repeat", 2]);
			function createAction(delta: number) {
				return Events.Repeat.moveRowTriggered({
					repeatFormModelPath: repeatFormModelPath,
					rowPath: rowPath,
					delta: delta
				});
			}

			const messagesBefore = {
				[DocumentPath.toString(rowPath)]: {
					validationMessages: [
						{
							element: rowPath,
							errorCode: "Error rule_83c8e",
							errorKey: "/Root/repeat/rule42",
							errorText: [{ key: "foo", defaults: { en: "12 < 42" } }],
							severity: "ERROR",
							referencedFields: [rowPath]
						} as EngineStore.Validation.Message
					]
				}
			};

			function createMessagesAfter(delta: number) {
				const newRowPath = createDocumentPath(["Root"], ["repeat", 2 + delta]);
				const messagesAfter: ReadonlyObjectMap<EngineStore.Validation.Entry> = {
					[DocumentPath.toString(newRowPath)]: {
						validationMessages: [
							{
								element: newRowPath,
								errorCode: "Error rule_83c8e",
								errorKey: "/Root/repeat/rule42",
								errorText: [{ key: "foo", defaults: { en: "12 < 42" } }],
								severity: "ERROR",
								referencedFields: [newRowPath]
							}
						]
					}
				};

				return messagesAfter;
			}

			describe("Given a negative delta in the payload", () => {
				const delta = -1;
				it("updates the document correctly", () => {
					const action = createAction(delta);
					middlewareSpy.spy.mock.resetCalls();
					setupStore(false, validDocument, {}).dispatch(action);

					MiddlewareHelpers.assertAction(
						middlewareSpy.spy,
						Commands.setDocument({
							document: expectedNegativeDeltaDocument,
							changes: [
								{
									type: "GroupMoved",
									path: DocumentHelpers.createDocumentPath(["Root"], ["repeat", 2]),
									delta
								}
							]
						})
					);
				});

				it("updates the messages correctly", () => {
					const action = createAction(delta);
					middlewareSpy.spy.mock.resetCalls();
					setupStore(false, validDocument, messagesBefore).dispatch(action);

					MiddlewareHelpers.assertAction(
						middlewareSpy.spy,
						Commands.setMessageState({ messages: createMessagesAfter(delta) })
					);
				});
			});

			describe("Given a positive delta in the payload", () => {
				const delta = 1;
				it("updates the document correctly", () => {
					const action = createAction(delta);
					middlewareSpy.spy.mock.resetCalls();
					setupStore(false, validDocument, {}).dispatch(action);

					MiddlewareHelpers.assertAction(
						middlewareSpy.spy,
						Commands.setDocument({
							document: expectedPositiveDeltaDocument,
							changes: [
								{
									type: "GroupMoved",
									path: DocumentHelpers.createDocumentPath(["Root"], ["repeat", 2]),
									delta
								}
							]
						})
					);
				});

				it("updates the messages correctly", () => {
					const action = createAction(delta);
					middlewareSpy.spy.mock.resetCalls();
					setupStore(false, validDocument, messagesBefore).dispatch(action);

					MiddlewareHelpers.assertAction(
						middlewareSpy.spy,
						Commands.setMessageState({ messages: createMessagesAfter(delta) })
					);
				});
			});

			describe("if the data is not already dirty", () => {
				before(() => {
					const action = createAction(1);
					middlewareSpy.spy.mock.resetCalls();
					setupStore(false, invalidDocument, {}).dispatch(action);
				});

				const expectedCommands: { [key: string]: Action<{}> } = {
					setDocument: Commands.setDocument({
						document: expectedPositiveDeltaDocument,
						changes: []
					}),
					setDataDirty: Commands.setDataDirty(true),
					changeRepeatInstanceStateEntry: Commands.changeRepeatInstanceStateEntry({
						locationPath: createModelPath("Screen1"),
						repeatFormModelPath: repeatFormModelPath,
						entry: {
							newRow: undefined,
							expandedRowPath: undefined
						}
					})
				};

				it("dispatches a Commands.setDataDirty action with 'true' as payload", () => {
					MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommands.setDataDirty);
				});

				it("dispatches a Commands.changeRepeatInstanceStateEntry action with newRow='undefined'", () => {
					MiddlewareHelpers.assertAction(
						middlewareSpy.spy,
						expectedCommands.changeRepeatInstanceStateEntry
					);
				});

				it("dispatches only these action", () => {
					MiddlewareHelpers.assertNumberOfActions(
						middlewareSpy.spy,
						Object.keys(expectedCommands).map((key: string) => expectedCommands[key])
					);
				});
			});

			describe("if the data is already dirty", () => {
				before(() => {
					const action = createAction(1);
					middlewareSpy.spy.mock.resetCalls();
					setupStore(true, invalidDocument, {}).dispatch(action);
				});

				const expectedCommands: { [key: string]: Action<{}> } = {
					setDocument: Commands.setDocument({
						document: expectedPositiveDeltaDocument,
						changes: []
					}),
					changeRepeatInstanceStateEntry: Commands.changeRepeatInstanceStateEntry({
						locationPath: createModelPath("Screen1"),
						repeatFormModelPath: repeatFormModelPath,
						entry: {
							newRow: undefined,
							expandedRowPath: undefined
						}
					})
				};

				it("does not dispatch a Commands.setDataDirty action with 'true' as payload", () => {
					MiddlewareHelpers.assertNumberOfActions(
						middlewareSpy.spy,
						Object.keys(expectedCommands).map((key: string) => expectedCommands[key])
					);
				});
			});

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
		});
	});
});
