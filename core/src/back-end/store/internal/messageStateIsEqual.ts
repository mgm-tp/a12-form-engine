// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import deepEqual from "fast-deep-equal";

import type { ReadonlyObjectMap } from "../../../models/internal/utils/json.js";

import type { EngineStore } from "./store.js";

/** @internal */
export function messageStateIsEqual(
	oldState: ReadonlyObjectMap<EngineStore.Validation.Entry>,
	newState: ReadonlyObjectMap<EngineStore.Validation.Entry>
): boolean {
	return (
		Object.keys(oldState).length === Object.keys(newState).length &&
		Object.entries(oldState).every(([key, entry]) => {
			const oldMessages = entry?.validationMessages;
			const oldParseError = entry?.parseError;
			const newEntry = newState[key];
			const newMessages = newEntry?.validationMessages;
			const newParseError = newEntry?.parseError;

			return (
				areParseErrorsEqual(oldParseError, newParseError) &&
				areValidationMessagesEqual({ oldMessages, newMessages })
			);
		})
	);
}

function areValidationMessagesEqual({
	oldMessages,
	newMessages
}: {
	oldMessages: readonly EngineStore.Validation.Message[] | undefined;
	newMessages: readonly EngineStore.Validation.Message[] | undefined;
}): boolean {
	if (oldMessages === undefined || newMessages === undefined) {
		return oldMessages === newMessages;
	}
	return (
		oldMessages.length === newMessages.length &&
		oldMessages.every((msg, idx) => {
			const newMsg = newMessages[idx];
			return deepEqual(msg, newMsg);
		})
	);
}

function areParseErrorsEqual(
	pe1: EngineStore.Validation.ParseError | undefined,
	pe2: EngineStore.Validation.ParseError | undefined
): boolean {
	return (
		pe1 === pe2 ||
		(pe1?.value === pe2?.value &&
			areValidationMessagesEqual({
				oldMessages: pe1?.message ? [pe1?.message] : [],
				newMessages: pe2?.message ? [pe2?.message] : []
			}))
	);
}
