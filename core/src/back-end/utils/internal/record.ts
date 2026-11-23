// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

/**
 * Map single property (key-value pair) -> record.
 *
 * Only string keys are supported.
 */
export function mapRecord<T, U>(callback: (value: T, key: string) => U) {
	return function (record: Record<string, T>): Record<string, U> {
		return Object.fromEntries(Object.entries(record).map(e => [e[0], callback(e[1], e[0])]));
	};
}
