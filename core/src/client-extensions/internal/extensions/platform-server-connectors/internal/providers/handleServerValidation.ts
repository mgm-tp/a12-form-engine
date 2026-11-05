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

import { put, select } from "typed-redux-saga";
import type { SagaGenerator } from "typed-redux-saga";

import {
	DocumentValidationError,
	JsonRpc2Response
} from "@com.mgmtp.a12.dataservices/dataservices-access";

import { Commands } from "../../../../../../back-end/store/internal/actions.js";
import {
	computeUniqueDocumentPaths,
	FORMAL_VALIDATION_RULE_PATH
} from "../../../../../../back-end/store/internal/kernel-adapter.js";
import { EngineStore } from "../../../../../../back-end/store/internal/store.js";
import { DocumentPath } from "../../../../../../models/internal/utils/document-utils.js";
import type { ReadonlyObjectMap } from "../../../../../../models/internal/utils/ReadonlyObjectMap.js";
import { FormEngineActions } from "../../../form-engine/internal/actions.js";
import { FormEngineSelectors } from "../../../form-engine/internal/selectors.js";

const FALLBACK_ERROR_TEXT_KEY = "dataservices.documentValidationResult";

/** @internal */
export function extractDocumentValidationResults(
	errorData: unknown
): readonly DocumentValidationError[] | undefined {
	if (!JsonRpc2Response.Exception.isInstance(errorData)) {
		return undefined;
	}

	const results = errorData.extraDetails?.documentValidationResults;
	return Array.isArray(results) && results.every(DocumentValidationError.isInstance)
		? results
		: undefined;
}

/** @internal */
export function createValidationMessagesFromServerResults(
	results: readonly DocumentValidationError[],
	language: string
): EngineStore.Validation.Message[] {
	return results.map(result => {
		const referencedPointers =
			result.messageType === "OMISSION_ERROR"
				? result.refOmissionErrorResponsiblePointers
				: result.referencedFieldsPointers;
		const referencedFields = computeUniqueDocumentPaths(
			(referencedPointers ?? []).map(DocumentPath.fromString)
		);

		return {
			element:
				result.errorFieldPointer != null ? DocumentPath.fromString(result.errorFieldPointer) : [],
			referencedFields,
			errorText: [
				{
					key: result.errorTextKey ?? FALLBACK_ERROR_TEXT_KEY,
					defaults: { [language]: result.errorText }
				}
			],
			errorCode: result.errorCode,
			errorKey: result.rulePath ?? FORMAL_VALIDATION_RULE_PATH,
			severity: result.severityType as EngineStore.Validation.MessageSeverity,
			origin: "server"
		};
	});
}

function hasServerMessages(
	messages: ReadonlyObjectMap<EngineStore.Validation.Entry> | undefined
): boolean {
	return Object.values(messages ?? {}).some(entry =>
		entry?.validationMessages.some(m => m.origin === "server")
	);
}

/**
 * @internal
 * Every reported message is dispatched and shown in the validation bar, whatever its severity.
 * @returns whether an ERROR was among them. Callers that swallow the original error on the
 * assumption that it becomes visible in the validation bar must check this and fall back to
 * their normal error handling when it is false - a response carrying only warnings and infos
 * does not explain why the save failed.
 */
export function* handleServerValidation(
	activityId: string,
	results: readonly DocumentValidationError[],
	language: string
): SagaGenerator<boolean> {
	const uiState = yield* select(FormEngineSelectors.uiState(activityId));
	const { messages } = uiState ?? {};

	const newMessages = createValidationMessagesFromServerResults(results, language);
	const merged = mergeServerMessages(messages ?? {}, newMessages);

	if (newMessages.length === 0) {
		// a response without results reports the whole document as valid, so an earlier
		// response's messages have to go - but there is nothing to show a validation bar for
		if (hasServerMessages(messages)) {
			yield* put(
				FormEngineActions.command({
					activityId,
					engineEvent: Commands.setMessageState({ messages: merged })
				})
			);
		}
		return false;
	}

	yield* put(
		FormEngineActions.command({
			activityId,
			engineEvent: Commands.setMessageState({ messages: merged })
		})
	);
	yield* put(
		FormEngineActions.command({
			activityId,
			engineEvent: Commands.CorrectionMode.setValidationBarState({
				validationBar: { visible: true }
			})
		})
	);
	yield* put(
		FormEngineActions.command({
			activityId,
			engineEvent: Commands.CorrectionMode.focusValidationBar()
		})
	);
	return newMessages.some(EngineStore.Validation.Message.isError);
}

/** @internal */
export function mergeServerMessages(
	messages: ReadonlyObjectMap<EngineStore.Validation.Entry>,
	newMessages: readonly EngineStore.Validation.Message[]
): ReadonlyObjectMap<EngineStore.Validation.Entry> {
	const merged: { [key: string]: EngineStore.Validation.Entry | undefined } = {};
	for (const [key, entry] of Object.entries(messages)) {
		if (entry === undefined) {
			continue;
		}
		const clientMessages = entry.validationMessages.filter(m => m.origin !== "server");
		if (clientMessages.length > 0 || entry.parseError !== undefined) {
			merged[key] = { ...entry, validationMessages: clientMessages };
		}
	}
	for (const message of newMessages) {
		const key = DocumentPath.toString(message.element);
		const existing = merged[key];
		if (
			!existing?.validationMessages.some(m => EngineStore.Validation.Message.areEqual(m, message))
		) {
			merged[key] = EngineStore.Validation.Entry.merge(existing, { validationMessages: [message] });
		}
	}
	return merged;
}
