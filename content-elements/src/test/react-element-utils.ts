// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
