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

import deepEqual from "fast-deep-equal";

import type { ReadonlyObjectMap } from "../../../models/internal/utils/ReadonlyObjectMap.js";

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

/**
 * Compares two message lists by position, so a different order counts as a different state.
 * Shared by both validation slices, so they cannot drift apart.
 */
function areValidationMessagesEqual<
	T extends EngineStore.Validation.Message | EngineStore.Validation.CustomMessage
>({
	oldMessages,
	newMessages
}: {
	oldMessages: readonly T[] | undefined;
	newMessages: readonly T[] | undefined;
}): boolean {
	if (oldMessages === undefined || newMessages === undefined) {
		return oldMessages === newMessages;
	}
	return (
		oldMessages.length === newMessages.length &&
		oldMessages.every((msg, idx) => deepEqual(msg, newMessages[idx]))
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

/** @internal */
export function customMessageStateIsEqual(
	oldState: ReadonlyObjectMap<EngineStore.Validation.CustomEntry>,
	newState: ReadonlyObjectMap<EngineStore.Validation.CustomEntry>
): boolean {
	return (
		Object.keys(oldState).length === Object.keys(newState).length &&
		Object.entries(oldState).every(([key, entry]) => {
			const oldMessages = entry?.validationMessages;
			const newMessages = newState[key]?.validationMessages;
			return areValidationMessagesEqual({ oldMessages, newMessages });
		})
	);
}
