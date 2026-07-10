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

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api";

import type { EngineStore } from "../../../back-end/store/index.js";
import { addFieldLabelLocalizables } from "../../../back-end/store/internal/reducers/handler/setMessageState.js";
import type { ReadonlyObjectMap } from "../../../models/index.js";
import { DocumentPath } from "../../../models/internal/utils/document-utils.js";
import { createDocumentPath } from "../../utils/createDocumentPath.js";
import {
	createValidationEntry,
	createValidationEntryWithParsingError,
	createValidationMessage
} from "../../utils/validation.js";

describe("unit.back-end.store.reducers.addFieldLabelLocalizables", () => {
	const provider = (p: ModelPath) => [
		{
			key: `uiModel.fm1.controlLabel.${p.at(-1)?.elementName}`,
			defaults: { en: "Control Label" }
		},
		{
			key: `uiModel.fm1.fieldConfigLabel.${p.at(-1)?.elementName}`,
			defaults: { en: "Field Config Label" }
		},
		{
			key: `documentModel.label.dm1.${p.at(-1)?.elementName}`,
			defaults: { en: "Control Label" }
		}
	];

	describe("entry without error text", () => {
		it("validationMessage variant", () => {
			const messages = createValidationEntry({ path: createDocumentPath(["f1"]) });

			const newMessages = addFieldLabelLocalizables(messages, provider);

			deepStrictEqual(newMessages, messages);
		});

		it("parseError variant", () => {
			const path = createDocumentPath(["f1"]);
			const messages = createValidationEntryWithParsingError(
				path,
				"invalid",
				"numberContainsIllegalSymbols"
			);

			const newMessages = addFieldLabelLocalizables(messages, provider);

			deepStrictEqual(newMessages, messages);
		});
	});

	describe("entry with error text without localizable args", () => {
		it("validationMessage variant", () => {
			const messages = createValidationEntry({
				path: createDocumentPath(["f1"]),
				errorText: [{ key: "error.simple", defaults: { en: "Error" } }]
			});

			const newMessages = addFieldLabelLocalizables(messages, provider);

			deepStrictEqual(newMessages, messages);
		});

		it("parseError variant", () => {
			const path = createDocumentPath(["f1"]);
			const messages: ReadonlyObjectMap<EngineStore.Validation.Entry> = {
				[DocumentPath.toString(path)]: {
					validationMessages: [],
					parseError: {
						value: "invalid",
						message: createValidationMessage({
							path,
							errorText: [{ key: "error.simple", defaults: { en: "Error" } }]
						})
					}
				}
			};

			const newMessages = addFieldLabelLocalizables(messages, provider);

			deepStrictEqual(newMessages, messages);
		});
	});

	describe("entry with error text with localizable args, but without placeholder", () => {
		it("validationMessage variant", () => {
			const messages = createValidationEntry({
				path: createDocumentPath(["f1"]),
				errorText: [
					{
						key: "error.withArgs",
						defaults: { en: "Error {0}" },
						args: {
							"0": { type: "plain", value: "someValue" }
						}
					}
				]
			});

			const newMessages = addFieldLabelLocalizables(messages, provider);

			deepStrictEqual(newMessages, messages);
		});

		it("parseError variant", () => {
			const path = createDocumentPath(["f1"]);
			const messages: ReadonlyObjectMap<EngineStore.Validation.Entry> = {
				[DocumentPath.toString(path)]: {
					validationMessages: [],
					parseError: {
						value: "invalid",
						message: createValidationMessage({
							path,
							errorText: [
								{
									key: "error.withArgs",
									defaults: { en: "Error {0}" },
									args: {
										"0": { type: "plain", value: "someValue" }
									}
								}
							]
						})
					}
				}
			};

			const newMessages = addFieldLabelLocalizables(messages, provider);

			deepStrictEqual(newMessages, messages);
		});
	});

	describe("entry with error text with localizable args and a placeholder that does not reference a dm field", () => {
		it("validationMessage variant", () => {
			const messages = createValidationEntry({
				path: createDocumentPath(["f1"]),
				errorText: [
					{
						key: "error.withLocalizable",
						defaults: { en: "Error {0}" },
						args: {
							"0": {
								type: "localizable",
								value: "other",
								properties: [{ key: "other.key", defaults: { en: "Other" } }]
							}
						}
					}
				]
			});

			const newMessages = addFieldLabelLocalizables(messages, provider);

			deepStrictEqual(newMessages, messages);
		});

		it("parseError variant", () => {
			const path = createDocumentPath(["f1"]);
			const messages: ReadonlyObjectMap<EngineStore.Validation.Entry> = {
				[DocumentPath.toString(path)]: {
					validationMessages: [],
					parseError: {
						value: "invalid",
						message: createValidationMessage({
							path,
							errorText: [
								{
									key: "error.withLocalizable",
									defaults: { en: "Error {0}" },
									args: {
										"0": {
											type: "localizable",
											value: "other",
											properties: [{ key: "other.key", defaults: { en: "Other" } }]
										}
									}
								}
							]
						})
					}
				}
			};

			const newMessages = addFieldLabelLocalizables(messages, provider);

			deepStrictEqual(newMessages, messages);
		});
	});

	describe("entry with error text with localizable args and a placeholder that references a dm field", () => {
		it("validationMessage variant", () => {
			const fieldPath = createDocumentPath(["f1"]);
			const messages = createValidationEntry({
				path: fieldPath,
				errorText: [
					{
						key: "error.withDmLabel",
						defaults: { en: "Error {0}" },
						args: {
							"0": {
								type: "localizable",
								value: "f1",
								properties: [{ key: "documentModel.label.dm1.f1", defaults: { en: "Field 1" } }]
							}
						}
					}
				]
			});

			const newMessages = addFieldLabelLocalizables(messages, provider);

			// The label should be extended with the provider's result
			const expectedLocalizables = provider([{ elementName: "f1" }]);
			const placeholder =
				newMessages[DocumentPath.toString(fieldPath)]?.validationMessages[0].errorText[0].args?.[
					"0"
				];
			strictEqual(placeholder?.type, "localizable");
			deepStrictEqual(placeholder.properties, expectedLocalizables);
		});

		it("parseError variant", () => {
			const fieldPath = createDocumentPath(["f1"]);
			const messages: ReadonlyObjectMap<EngineStore.Validation.Entry> = {
				[DocumentPath.toString(fieldPath)]: {
					validationMessages: [],
					parseError: {
						value: "invalid",
						message: createValidationMessage({
							path: fieldPath,
							errorText: [
								{
									key: "error.withDmLabel",
									defaults: { en: "Error {0}" },
									args: {
										"0": {
											type: "localizable",
											value: "f1",
											properties: [
												{ key: "documentModel.label.dm1.f1", defaults: { en: "Field 1" } }
											]
										}
									}
								}
							]
						})
					}
				}
			};

			const newMessages = addFieldLabelLocalizables(messages, provider);

			// The label should be extended with the provider's result
			const expectedLocalizables = provider(fieldPath);
			const placeholder =
				newMessages[DocumentPath.toString(fieldPath)]?.parseError?.message.errorText[0].args?.["0"];
			strictEqual(placeholder?.type, "localizable");
			if (placeholder?.type === "localizable") {
				deepStrictEqual(placeholder.properties, expectedLocalizables);
			}
		});
	});

	describe("entry with error text with localizable args and a placeholder thats already extended", () => {
		it("validationMessage variant", () => {
			const fieldPath = createDocumentPath(["f1"]);
			const messages = createValidationEntry({
				path: fieldPath,
				errorText: [
					{
						key: "error.withDmLabel",
						defaults: { en: "Error {0}" },
						args: {
							"0": {
								type: "localizable",
								value: "f1",
								properties: provider(fieldPath)
							}
						}
					}
				]
			});

			const newMessages = addFieldLabelLocalizables(messages, provider);

			// Already extended, should not change
			deepStrictEqual(newMessages, messages);
		});

		it("parseError variant", () => {
			const fieldPath = createDocumentPath(["f1"]);
			const messages: ReadonlyObjectMap<EngineStore.Validation.Entry> = {
				[DocumentPath.toString(fieldPath)]: {
					validationMessages: [],
					parseError: {
						value: "invalid",
						message: createValidationMessage({
							path: fieldPath,
							errorText: [
								{
									key: "error.withDmLabel",
									defaults: { en: "Error {0}" },
									args: {
										"0": {
											type: "localizable",
											value: "f1",
											properties: provider(fieldPath)
										}
									}
								}
							]
						})
					}
				}
			};

			const newMessages = addFieldLabelLocalizables(messages, provider);

			// Already extended, should not change
			deepStrictEqual(newMessages, messages);
		});
	});
});
