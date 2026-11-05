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

import type { DocumentValidationError } from "@com.mgmtp.a12.dataservices/dataservices-access";

import { FORMAL_VALIDATION_RULE_PATH } from "../../back-end/store/internal/kernel-adapter.js";
import type { EngineStore } from "../../back-end/store/internal/store.js";
import {
	createValidationMessagesFromServerResults,
	extractDocumentValidationResults,
	mergeServerMessages
} from "../../client-extensions/internal/extensions/platform-server-connectors/internal/providers/handleServerValidation.js";
import { DocumentPath } from "../../models/internal/utils/document-utils.js";

const base: DocumentValidationError = {
	errorText: "Field name cannot be empty",
	errorCode: "Error rule_f06c8",
	messageType: "VALUE_ERROR",
	rulePath: "/ContractRoot/ContractName",
	referencedFieldsPointers: ["/ContractRoot[1]/ContractName[1]"],
	severityType: "ERROR",
	errorFieldPointer: "/ContractRoot[1]/ContractName[1]"
};

describe("createValidationMessagesFromServerResults", () => {
	it("maps a value error to a validation message", () => {
		const [message] = createValidationMessagesFromServerResults([base], "en");
		deepStrictEqual(message.element, [
			{ elementName: "ContractRoot", index: 1 },
			{ elementName: "ContractName", index: 1 }
		]);
		strictEqual(message.errorKey, "/ContractRoot/ContractName");
		strictEqual(message.errorCode, "Error rule_f06c8");
		strictEqual(message.severity, "ERROR");
		deepStrictEqual(message.referencedFields, [
			[
				{ elementName: "ContractRoot", index: 1 },
				{ elementName: "ContractName", index: 1 }
			]
		]);
	});

	it("uses errorTextKey as localizable key with the resolved text as default", () => {
		const [message] = createValidationMessagesFromServerResults(
			[{ ...base, errorTextKey: "documentModel.ruleErrorMessage.M.ContractRoot.rule1" }],
			"en"
		);
		deepStrictEqual(message.errorText, [
			{
				key: "documentModel.ruleErrorMessage.M.ContractRoot.rule1",
				defaults: { en: "Field name cannot be empty" }
			}
		]);
	});

	it("falls back to a non-resolving key when errorTextKey is missing", () => {
		const [message] = createValidationMessagesFromServerResults([base], "de");
		strictEqual(message.errorText[0].key, "dataservices.documentValidationResult");
		deepStrictEqual(message.errorText[0].defaults, { de: "Field name cannot be empty" });
	});

	it("takes refOmissionErrorResponsiblePointers for omission errors", () => {
		const [message] = createValidationMessagesFromServerResults(
			[
				{
					...base,
					messageType: "OMISSION_ERROR",
					refOmissionErrorResponsiblePointers: ["/ContractRoot[1]/Other[1]"]
				}
			],
			"en"
		);
		deepStrictEqual(message.referencedFields, [
			[
				{ elementName: "ContractRoot", index: 1 },
				{ elementName: "Other", index: 1 }
			]
		]);
	});

	it("keys a message without an error field pointer at the root", () => {
		const [message] = createValidationMessagesFromServerResults(
			[{ ...base, errorFieldPointer: undefined, referencedFieldsPointers: [] }],
			"en"
		);
		deepStrictEqual(message.element, []);
	});

	it("carries a wildcard repetition through to a message that matches every row", () => {
		const [message] = createValidationMessagesFromServerResults(
			[
				{
					...base,
					errorFieldPointer: "/Contacts[0]/ContactType[1]",
					referencedFieldsPointers: ["/Contacts[0]/ContactType[1]"]
				}
			],
			"en"
		);
		deepStrictEqual(message.element, [
			{ elementName: "Contacts", index: 0 },
			{ elementName: "ContactType", index: 1 }
		]);
		strictEqual(
			DocumentPath.matches(message.element, DocumentPath.fromString("/Contacts[2]/ContactType[1]")),
			true
		);
	});

	it("carries an undetermined repetition through unchanged, matching no row", () => {
		const [message] = createValidationMessagesFromServerResults(
			[
				{
					...base,
					errorFieldPointer: "/Contacts[-5]/ContactType[1]",
					referencedFieldsPointers: ["/Contacts[-5]/ContactType[1]"]
				}
			],
			"en"
		);
		deepStrictEqual(message.element, [
			{ elementName: "Contacts", index: -5 },
			{ elementName: "ContactType", index: 1 }
		]);
		strictEqual(
			DocumentPath.matches(message.element, DocumentPath.fromString("/Contacts[2]/ContactType[1]")),
			false
		);
	});

	it("keys a message without a rulePath like the client's own kernel messages", () => {
		const [message] = createValidationMessagesFromServerResults(
			[{ ...base, rulePath: undefined }],
			"en"
		);
		strictEqual(message.errorKey, FORMAL_VALIDATION_RULE_PATH);
		strictEqual(message.errorText[0].key, "dataservices.documentValidationResult");
	});
});

describe("extractDocumentValidationResults", () => {
	// the shape Data Services' JsonRpc2Response.Exception guard requires
	const exception = (extraDetails: unknown) => ({
		level: "ERROR",
		title: { key: "error.title", default: "Invalid document" },
		description: { key: "error.description", default: "Document is not valid" },
		details: { code: "-32002", subsystem: "dataservices", time: "2026-09-10T00:00:00Z" },
		extraDetails
	});

	it("extracts the results from a validation error", () => {
		deepStrictEqual(
			extractDocumentValidationResults(exception({ documentValidationResults: [base] })),
			[base]
		);
	});

	it("returns undefined when the error carries no results", () => {
		strictEqual(extractDocumentValidationResults(undefined), undefined);
		strictEqual(extractDocumentValidationResults(exception({})), undefined);
		strictEqual(
			extractDocumentValidationResults(exception({ documentValidationResults: "x" })),
			undefined
		);
	});

	it("returns undefined for an error that is not a Data Services exception", () => {
		strictEqual(
			extractDocumentValidationResults({
				extraDetails: { documentValidationResults: [base] }
			}),
			undefined
		);
	});

	it("rejects the set when an entry does not match the documented contract", () => {
		strictEqual(
			extractDocumentValidationResults(
				exception({ documentValidationResults: [base, null, "junk"] })
			),
			undefined
		);
	});
});

describe("mergeServerMessages", () => {
	const message = (errorKey: string): EngineStore.Validation.Message => ({
		element: [{ elementName: "Root", index: 1 }],
		referencedFields: [],
		errorText: [{ key: "k" }],
		errorCode: "c",
		errorKey,
		severity: "ERROR"
	});

	it("merges into existing entries under the element path key", () => {
		const merged = mergeServerMessages(
			{ "/Root[1]": { validationMessages: [message("client")] } },
			[message("server")]
		);
		strictEqual(merged["/Root[1]"]?.validationMessages.length, 2);
	});

	it("does not duplicate an equal message on repeated saves", () => {
		const once = mergeServerMessages({}, [message("server")]);
		const twice = mergeServerMessages(once, [message("server")]);
		strictEqual(twice["/Root[1]"]?.validationMessages.length, 1);
	});

	const serverMessages = (rulePath: string) =>
		createValidationMessagesFromServerResults(
			[
				{
					errorText: "Value of field Root is invalid",
					errorCode: "c",
					messageType: "VALUE_ERROR",
					rulePath,
					referencedFieldsPointers: ["/Root[1]"],
					severityType: "ERROR",
					errorFieldPointer: "/Root[1]"
				}
			],
			"en"
		);

	it("replaces the previous save's server messages instead of accumulating them", () => {
		const afterFirstSave = mergeServerMessages(
			{ "/Root[1]": { validationMessages: [message("client")] } },
			serverMessages("/Root/StaleRule")
		);

		const afterSecondSave = mergeServerMessages(afterFirstSave, serverMessages("/Root/FreshRule"));

		deepStrictEqual(
			afterSecondSave["/Root[1]"]?.validationMessages.map(m => m.errorKey),
			["client", "/Root/FreshRule"]
		);
	});

	it("drops the previous save's server messages when the server reports none", () => {
		const afterFirstSave = mergeServerMessages(
			{ "/Root[1]": { validationMessages: [message("client")] } },
			serverMessages("/Root/StaleRule")
		);

		const afterSecondSave = mergeServerMessages(afterFirstSave, []);

		deepStrictEqual(
			afterSecondSave["/Root[1]"]?.validationMessages.map(m => m.errorKey),
			["client"]
		);
	});

	it("keeps the client's message unchanged when the server reports the same error", () => {
		const sharedRule = "/Root/SharedRule";

		const afterSave = mergeServerMessages(
			{ "/Root[1]": { validationMessages: [message(sharedRule)] } },
			serverMessages(sharedRule)
		);

		deepStrictEqual(afterSave["/Root[1]"]?.validationMessages, [message(sharedRule)]);
	});

	it("keeps the client's message unchanged when neither side reports a rulePath", () => {
		const afterSave = mergeServerMessages(
			{ "/Root[1]": { validationMessages: [message(FORMAL_VALIDATION_RULE_PATH)] } },
			createValidationMessagesFromServerResults(
				[
					{
						errorText: "Value of field Root is invalid",
						errorCode: "c",
						messageType: "VALUE_ERROR",
						referencedFieldsPointers: ["/Root[1]"],
						severityType: "ERROR",
						errorFieldPointer: "/Root[1]"
					}
				],
				"en"
			)
		);

		deepStrictEqual(afterSave["/Root[1]"]?.validationMessages, [
			message(FORMAL_VALIDATION_RULE_PATH)
		]);
	});
});
