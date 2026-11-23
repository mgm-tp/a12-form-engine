// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { deepStrictEqual, ok, strictEqual } from "node:assert/strict";
import type { Mock } from "node:test";

export function assertCalledWith(candidate: unknown, ...args: unknown[]) {
	assertNodeMock(candidate);
	assertCalled(candidate);

	deepStrictEqual(candidate.mock.calls.at(0)?.arguments, args);
}

export function assertCalledWithArgument(
	candidate: unknown,
	argumentIndex: number,
	expectedValue: unknown
) {
	assertNodeMock(candidate);
	assertCalled(candidate);

	const actualValue = candidate.mock.calls.at(0)?.arguments.at(argumentIndex);
	deepStrictEqual(actualValue, expectedValue);
}

export function assertCallCount(candidate: unknown, expectedCallCount: number) {
	assertNodeMock(candidate);

	strictEqual(candidate.mock.callCount(), expectedCallCount);
}

function assertCalled(component: NodeMock<unknown>): void {
	ok(component.mock.calls.length > 0);
}

type NodeMock<T> = Mock<(props: T) => void>;

function assertNodeMock<T>(candidate: unknown): asserts candidate is NodeMock<T> {
	ok(
		!!(candidate as any).mock, // candidate can be a proxy, so don't use property enumeration (e.g. "in", "Object.keys")
		`Expected ${toString(candidate)} to be a node mock`
	);
}

function toString(candidate: unknown): string {
	return isFunction(candidate) ? candidate.name : String(candidate);
}

function isFunction(candidate: unknown): candidate is () => unknown {
	return typeof candidate === "function";
}
