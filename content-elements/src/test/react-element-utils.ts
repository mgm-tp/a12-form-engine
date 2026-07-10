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

import { strictEqual } from "node:assert/strict";

import type { ReactElement } from "react";

export function getReactElementName(element: ReactElement): string {
	return isFunction(element.type) ? element.type.name : "";
}

export function isReactElementArray(
	candidate: unknown
): candidate is ReactElement<Record<string, unknown>>[] {
	return Array.isArray(candidate) && candidate.length > 0 && isReactElement(candidate[0]);
}

export function assertIsReactElementArray(
	candidate: unknown
): asserts candidate is ReactElement<Record<string, unknown>>[] {
	strictEqual(
		isReactElementArray(candidate),
		true,
		`Expected ${typeof candidate} to be ReactElement[]`
	);
}

export function isReactElement(
	candidate: unknown
): candidate is ReactElement<Record<string, unknown>> {
	return isRecord(candidate) && "props" in candidate && "type" in candidate;
}

export function assertIsReactElement(
	candidate: unknown
): asserts candidate is ReactElement<Record<string, unknown>> {
	strictEqual(isReactElement(candidate), true, `Expected ${typeof candidate} to be ReactElement`);
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return (
		typeof value === "object" && value !== null && !Array.isArray(value) && !(value instanceof Date)
	);
}

function isFunction(candidate: unknown): candidate is () => unknown {
	return typeof candidate === "function";
}
