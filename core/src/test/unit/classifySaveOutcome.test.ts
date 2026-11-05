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

import { classifySaveOutcome } from "../../client-extensions/internal/extensions/platform-server-connectors/internal/providers/saveOutcome.js";

type UniquenessCheckOutcome = Parameters<typeof classifySaveOutcome>[0];
type SaveRequestOutcome = Parameters<typeof classifySaveOutcome>[1];

// the fields Data Services' own DocumentValidationError guard requires, plus the pointer
const validationResult = {
	errorText: "Field name cannot be empty",
	errorCode: "rule_f06c8",
	messageType: "VALUE_ERROR",
	severityType: "ERROR",
	referencedFieldsPointers: ["/ContractRoot/ContractName"],
	errorFieldPointer: "/ContractRoot[1]/ContractName[1]"
};

function uniquenessCheck(violations: readonly unknown[]): UniquenessCheckOutcome {
	return {
		status: "fulfilled",
		value: { jsonrpc: "2.0", id: "uniqueness", result: { violations } }
	} as unknown as UniquenessCheckOutcome;
}

function savedWith(result: unknown): SaveRequestOutcome {
	return {
		status: "fulfilled",
		value: { jsonrpc: "2.0", id: "save", result }
	} as unknown as SaveRequestOutcome;
}

// the shape Data Services' JsonRpc2Response.Exception guard requires
function validationException(documentValidationResults: readonly unknown[]) {
	return {
		level: "error",
		title: { key: "error.document.validation.title", default: "Invalid document" },
		description: { key: "error.document.validation", default: "Document is not valid" },
		details: { code: "-32002", subsystem: "document", time: "2026-04-22T00:00:00Z" },
		extraDetails: { documentValidationResults }
	};
}

function rejectedWith(error: unknown): SaveRequestOutcome {
	return {
		status: "rejected",
		reason: { jsonrpc: "2.0", id: "save", error }
	} as unknown as SaveRequestOutcome;
}

describe("classifySaveOutcome", () => {
	it("reports a successful save together with the results the server validated", () => {
		const outcome = classifySaveOutcome(
			uniquenessCheck([]),
			// a save that persisted the document reports what it validated in the result itself
			savedWith({ docRef: "doc-1", validationResults: [validationResult] }),
			"en"
		);

		strictEqual(outcome.kind, "saved");
		strictEqual(outcome.kind === "saved" && outcome.docRef, "doc-1");
		deepStrictEqual(outcome.kind === "saved" && outcome.validationResults, [validationResult]);
	});

	it("leaves the results empty when a successful save reports none", () => {
		const outcome = classifySaveOutcome(uniquenessCheck([]), savedWith({ docRef: "doc-1" }), "en");

		strictEqual(outcome.kind, "saved");
		deepStrictEqual(outcome.kind === "saved" && outcome.validationResults, []);
	});

	it("turns the violations of the check into the error, with the results of the rejected save", () => {
		const outcome = classifySaveOutcome(
			uniquenessCheck([{ errorKey: "unique.contractName", errorMessage: { en: "already taken" } }]),
			rejectedWith({
				code: -32000,
				message: "Validation failed",
				data: validationException([validationResult])
			}),
			"en"
		);

		strictEqual(outcome.kind, "uniquenessViolated");
		deepStrictEqual(outcome.kind === "uniquenessViolated" && outcome.error.messages, [
			{ key: "unique.contractName", defaults: { en: "already taken" } }
		]);
		deepStrictEqual(outcome.kind === "uniquenessViolated" && outcome.validationResults, [
			validationResult
		]);
	});

	it("keeps the results of a save that succeeded although the check reports a violation", () => {
		const outcome = classifySaveOutcome(
			uniquenessCheck([{ errorKey: "unique.contractName", errorMessage: {} }]),
			savedWith({ docRef: "doc-1", validationResults: [validationResult] }),
			"en"
		);

		strictEqual(outcome.kind, "uniquenessViolated");
		deepStrictEqual(outcome.kind === "uniquenessViolated" && outcome.validationResults, [
			validationResult
		]);
	});

	it("reports no results for a uniqueness violation when neither response carries any", () => {
		const outcome = classifySaveOutcome(
			uniquenessCheck([{ errorKey: "unique.contractName", errorMessage: {} }]),
			savedWith({ docRef: "doc-1" }),
			"en"
		);

		strictEqual(outcome.kind, "uniquenessViolated");
		deepStrictEqual(outcome.kind === "uniquenessViolated" && outcome.validationResults, []);
	});

	it("reduces a unique constraint exception to the same case, localized with the given language", () => {
		const outcome = classifySaveOutcome(
			uniquenessCheck([]),
			rejectedWith({
				code: -32060,
				message: "Unique constraint violated",
				data: {
					level: "error",
					title: { key: "conflict.title", default: "Conflict" },
					description: { key: "conflict.description", default: "Duplicate" },
					details: {
						code: "UNIQUE_CONSTRAINT_VIOLATION",
						subsystem: "document",
						time: "2026-04-22T00:00:00Z"
					}
				}
			}),
			"de"
		);

		strictEqual(outcome.kind, "uniquenessViolated");
		deepStrictEqual(outcome.kind === "uniquenessViolated" && outcome.error.messages, [
			{ key: "conflict.description", defaults: { de: "Duplicate" } }
		]);
		deepStrictEqual(outcome.kind === "uniquenessViolated" && outcome.validationResults, []);
	});

	it("reports a rejected save that carries validation results as an invalid document", () => {
		const outcome = classifySaveOutcome(
			uniquenessCheck([]),
			rejectedWith({
				code: -32000,
				message: "Validation failed",
				data: validationException([validationResult])
			}),
			"en"
		);

		strictEqual(outcome.kind, "invalidDocument");
		deepStrictEqual(outcome.kind === "invalidDocument" && outcome.validationResults, [
			validationResult
		]);
	});

	it("reports an empty result set as an invalid document, not as a plain failure", () => {
		const outcome = classifySaveOutcome(
			uniquenessCheck([]),
			rejectedWith({
				code: -32000,
				message: "Validation failed",
				data: validationException([])
			}),
			"en"
		);

		strictEqual(outcome.kind, "invalidDocument");
		deepStrictEqual(outcome.kind === "invalidDocument" && outcome.validationResults, []);
	});

	it("reports a rejected save without validation results as a plain failure", () => {
		const outcome = classifySaveOutcome(
			uniquenessCheck([]),
			rejectedWith({ code: -32000, message: "Something else failed" }),
			"en"
		);

		strictEqual(outcome.kind, "failed");
	});
});
