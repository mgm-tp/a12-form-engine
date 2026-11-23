// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Mock } from "node:test";
import { mock } from "node:test";

import { isRecord } from "../../back-end/utils/internal/guards.js";

export type Mocked<T> = {
	[K in keyof T]: T[K] extends (...args: never[]) => unknown ? Mock<T[K]> : T[K];
};

/**
 * Wraps each function prop with a mock.fn (recursively). Other props are
 * returned unchanged.
 */
export function mockFunctions<T>(obj: T): Mocked<T> {
	// Initialize the mocked object with the same structure
	const mockedObject = {} as Mocked<T>;

	for (const key in obj) {
		const value = obj[key];

		if (typeof value === "function" && !(value as any).mock) {
			// If the value is a function, mock it
			mockedObject[key] = mock.fn(value);
		} else if (isRecord(value) && "type" in value && typeof value.type === "function") {
			// hack for React.memo (it returns an object, not a function)
			mockedObject[key] = mock.fn(value.type) as any;
		} else if (value && typeof value === "object" && !Array.isArray(value)) {
			// If the value is a nested object, recursively mock its properties
			mockedObject[key] = mockFunctions(value) as any;
		} else {
			// Copy non-function, non-object properties as-is
			mockedObject[key] = value as any;
		}
	}

	return mockedObject;
}
