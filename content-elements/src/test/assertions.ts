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
 * 1. Open-Source License – EUPL v1.2
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
