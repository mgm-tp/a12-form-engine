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

import type { SagaGenerator } from "typed-redux-saga";
import { call, put } from "typed-redux-saga";

import type { DataProvider } from "@com.mgmtp.a12.client/client-core";
import type {
	DocumentJsonRpc2Request,
	DocumentValidationError,
	JsonRpc2ResponseError,
	RpcSettledResult
} from "@com.mgmtp.a12.dataservices/dataservices-access";
import { JsonRpc2Response } from "@com.mgmtp.a12.dataservices/dataservices-access";

import { UniqueConstraintError } from "../UniqueConstraintError.js";

import {
	extractDocumentValidationResults,
	handleServerValidation
} from "./handleServerValidation.js";

type UniquenessCheckOutcome =
	RpcSettledResult<DocumentJsonRpc2Request.CheckUniquenessJsonRpc2Request>;

type SaveRequestOutcome = RpcSettledResult<
	DocumentJsonRpc2Request.AddJsonRpc2Request | DocumentJsonRpc2Request.ModifyJsonRpc2Request
>;

/**
 * @internal
 * What a save request and the uniqueness check preceding it jointly report, as one of four
 * mutually exclusive cases.
 */
export type SaveOutcome =
	| {
			readonly kind: "saved";
			/** Only an added document reports one; a modification has no document reference. */
			readonly docRef: string | undefined;
			readonly validationResults: readonly DocumentValidationError[];
	  }
	| {
			readonly kind: "uniquenessViolated";
			readonly error: UniqueConstraintError;
			readonly validationResults: readonly DocumentValidationError[];
	  }
	| {
			readonly kind: "invalidDocument";
			readonly reason: JsonRpc2ResponseError;
			readonly validationResults: readonly DocumentValidationError[];
	  }
	| { readonly kind: "failed"; readonly reason: JsonRpc2ResponseError };

/**
 * @internal
 * Decides what the two responses of a save mean. This is the only place that reads the shape of
 * the server's response, so a stricter response type is adopted here.
 *
 * Data Services reports a violated uniqueness criterion on either of two channels - as violations
 * of the preceding check, or as an exception of the save itself - which this reduces to one case.
 * `language` localizes the exception, whose message the server already resolved.
 */
export function classifySaveOutcome(
	uniquenessOutcome: UniquenessCheckOutcome,
	saveOutcome: SaveRequestOutcome,
	language: string
): SaveOutcome {
	if (
		uniquenessOutcome.status === "fulfilled" &&
		uniquenessOutcome.value.result.violations.length > 0
	) {
		return {
			kind: "uniquenessViolated",
			error: UniqueConstraintError.fromViolations(uniquenessOutcome.value.result.violations),
			// the server validates before it checks uniqueness, so either response carries what it
			// validated - a uniqueness violation alone leaves an empty set, which drops stale messages
			validationResults:
				saveOutcome.status === "rejected"
					? (extractDocumentValidationResults(saveOutcome.reason.error.data) ?? [])
					: (saveOutcome.value.result?.validationResults ?? [])
		};
	}

	if (saveOutcome.status === "fulfilled") {
		const result = saveOutcome.value.result;
		return {
			kind: "saved",
			docRef: result != null && "docRef" in result ? result.docRef : undefined,
			// a save that persisted the document reports what it validated in the result itself,
			// not under the error's extraDetails
			validationResults: result?.validationResults ?? []
		};
	}

	if (JsonRpc2Response.uniqueConstraintViolationError.isInstance(saveOutcome.reason)) {
		return {
			kind: "uniquenessViolated",
			error: UniqueConstraintError.fromException(saveOutcome.reason, language),
			// the exception hard-sets its extraDetails to the constraint alone, so the results the
			// server computed before it checked uniqueness never reach this channel
			validationResults: []
		};
	}

	const validationResults = extractDocumentValidationResults(saveOutcome.reason.error.data);

	return validationResults === undefined
		? { kind: "failed", reason: saveOutcome.reason }
		: { kind: "invalidDocument", reason: saveOutcome.reason, validationResults };
}

/**
 * @internal
 * Reports a save that did not persist the document: shows whatever the server validated and
 * dispatches the failing save action. Rethrows the server's response when the validation bar does
 * not explain the failure, so that the caller's normal error handling takes over.
 */
export function* reportFailedSave(
	config: DataProvider.SaveConfig,
	language: string,
	outcome: Exclude<SaveOutcome, { kind: "saved" }>
): SagaGenerator<void> {
	const { activityId } = config;
	const { saving } = config.details;

	switch (outcome.kind) {
		case "uniquenessViolated":
			yield* call(handleServerValidation, activityId, outcome.validationResults, language);
			yield* put(saving.failed(outcome.error));
			break;
		case "invalidDocument": {
			const reportsAnError = yield* call(
				handleServerValidation,
				activityId,
				outcome.validationResults,
				language
			);
			if (!reportsAnError) {
				throw outcome.reason;
			}

			yield* put(saving.failed({}));
			break;
		}
		case "failed":
			throw outcome.reason;
	}
}
