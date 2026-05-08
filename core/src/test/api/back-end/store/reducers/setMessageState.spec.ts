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

import { strictEqual, deepStrictEqual } from "node:assert/strict";

import { Commands, UiStateSelectors } from "../../../../../back-end/store/index.js";
import type { EngineStore } from "../../../../../back-end/store/internal/store.js";
import type { ReadonlyObjectMap } from "../../../../../models/index.js";
import { DocumentPath } from "../../../../../models/index.js";
import { DocumentHelpers } from "../../../../utils/document-helpers.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { createValidationMessage } from "../../../../utils/validation.js";

const { createTestStore } = SetupHelpers;

describe("api.back-end.store.reducers", () => {
	describe("setMessageState", () => {
		it("sets the messages using the given payload", () => {
			const storeConfig = {
				data: { dirty: false, document: {} },
				ui: { screenLocation: [] }
			};

			const store = createTestStore({ storeConfig });

			const messages: ReadonlyObjectMap<EngineStore.Validation.Entry> = {
				key1: {
					validationMessages: [
						createValidationMessage({
							path: DocumentHelpers.createDocumentPath(["Path"])
						})
					]
				}
			};
			store.dispatch(Commands.setMessageState({ messages }));

			const actualMessages = UiStateSelectors.messages()(store.getState());
			deepStrictEqual(messages, actualMessages);
		});

		it("sets a parse error using the given payload", () => {
			const storeConfig = {
				data: { dirty: false, document: {} },
				ui: { screenLocation: [] }
			};

			const store = createTestStore({ storeConfig });

			const fieldPath = DocumentPath.fromString("/root[1]/field1[1]");

			const messages: ReadonlyObjectMap<EngineStore.Validation.Entry> = {
				key1: {
					validationMessages: [],
					parseError: {
						message: {
							element: fieldPath,
							errorCode: "bar",
							errorKey: "formalePruefung",
							errorText: [
								{
									key: "error.localizable",
									args: undefined,
									defaults: {}
								}
							],
							referencedFields: [fieldPath],
							severity: "ERROR"
						},
						value: "foo-bar"
					}
				}
			};
			store.dispatch(Commands.setMessageState({ messages }));

			const actualMessages = UiStateSelectors.messages()(store.getState());
			deepStrictEqual(messages, actualMessages);
		});

		it("updates an existing parse error using the given payload", () => {
			const fieldPath = DocumentPath.fromString("/root[1]/field1[1]");

			const initialParseError: EngineStore.Validation.ParseError = {
				message: {
					element: fieldPath,
					errorCode: "bar",
					errorKey: "formalePruefung",
					errorText: [
						{
							key: "error.localizable",
							args: undefined,
							defaults: {}
						}
					],
					referencedFields: [fieldPath],
					severity: "ERROR"
				},
				value: "initialUiValue"
			};

			const initialMessages: ReadonlyObjectMap<EngineStore.Validation.Entry> = {
				"/root[1]/field1[1]": {
					validationMessages: [],
					parseError: initialParseError
				}
			};

			const storeConfig = {
				data: { dirty: false, document: {} },
				ui: { screenLocation: [], messages: initialMessages }
			};

			const store = createTestStore({ storeConfig });

			const newMessages: ReadonlyObjectMap<EngineStore.Validation.Entry> = {
				"/root[1]/field1[1]": {
					validationMessages: [],
					parseError: { ...initialParseError, value: "updatedUiValue" }
				}
			};

			store.dispatch(Commands.setMessageState({ messages: newMessages }));

			const actualMessages = UiStateSelectors.messages()(store.getState());
			deepStrictEqual(newMessages, actualMessages);
		});

		describe("does not change the state if the messages in the given payload equal the current message state", () => {
			it("for an empty message state", () => {
				const storeConfig = {
					data: { dirty: false, document: {} },
					ui: { screenLocation: [] }
				};

				const store = createTestStore({ storeConfig });

				const messages: ReadonlyObjectMap<EngineStore.Validation.Entry> = {};
				store.dispatch(Commands.setMessageState({ messages }));

				const actualMessages = UiStateSelectors.messages()(store.getState());
				deepStrictEqual(messages, actualMessages);
			});

			it("for a message state that already contains validation and parse errors", () => {
				const field1Path = DocumentPath.fromString("/root[1]/field1[1]");
				const field2Path = DocumentPath.fromString("/root[1]/field2[1]");
				const field1Message: EngineStore.Validation.Message = {
					element: field1Path,
					errorCode: "foo",
					errorKey: "myTestRule",
					errorText: [
						{
							key: "error.localizable",
							args: undefined,
							defaults: {}
						}
					],
					referencedFields: [field1Path],
					severity: "ERROR"
				};
				const field2ParseError: EngineStore.Validation.ParseError = {
					message: {
						element: field2Path,
						errorCode: "bar",
						errorKey: "formalePruefung",
						errorText: [
							{
								key: "error.localizable",
								args: undefined,
								defaults: {}
							}
						],
						referencedFields: [field2Path],
						severity: "ERROR"
					},
					value: "foo-bar"
				};
				const initialMessages: ReadonlyObjectMap<EngineStore.Validation.Entry> = {
					"/root[1]/field1[1]": {
						validationMessages: [field1Message],
						parseError: undefined
					},
					"/root[1]/field2[1]": {
						validationMessages: [],
						parseError: field2ParseError
					}
				};
				const storeConfig = {
					data: { dirty: false, document: {} },
					ui: {
						screenLocation: [],
						messages: initialMessages
					}
				};

				const store = createTestStore({ storeConfig });

				store.dispatch(
					Commands.setMessageState({
						messages: {
							"/root[1]/field2[1]": {
								validationMessages: [],
								parseError: field2ParseError
							},
							"/root[1]/field1[1]": {
								validationMessages: [field1Message],
								parseError: undefined
							}
						}
					})
				);

				const actualMessages = UiStateSelectors.messages()(store.getState());
				strictEqual(initialMessages, actualMessages);
			});
		});
	});
});
