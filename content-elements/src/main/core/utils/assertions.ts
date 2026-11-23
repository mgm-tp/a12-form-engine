// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

/** @internal */
export function assertObject(reference: unknown, message?: string): asserts reference {
	if (reference === undefined || reference === null) {
		throw new Error(message ?? `Generic assertion error - given reference is '${reference}'.`);
	}
}

/** @internal */
export function assertExists(reference: unknown, message?: string): asserts reference {
	if (reference === undefined || reference === null) {
		throw new Error(message ?? `Generic assertion error - given reference is '${reference}'.`);
	}
}

/** @internal */
export function assertCondition(condition: boolean, message?: string): asserts condition {
	if (!condition) {
		throw new Error(message ?? "Generic assertion error - given condition is not met.");
	}
}
