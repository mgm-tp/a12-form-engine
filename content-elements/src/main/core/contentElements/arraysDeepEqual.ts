// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import deepEqual from "fast-deep-equal";

/**
 * @internal
 *
 * Checks the deep equality of two arrays.
 *
 * Note: Use with caution!
 * This method is only supposed to be used to prevent unnecessary
 * re-renderings in React components by passing it to `useSelector`.
 * Make sure to only use it if necessary and perform any filtering or mapping
 * beforehand to reduce the complexity of the comparison.
 */
export function arraysDeepEqual(a: readonly unknown[], b: readonly unknown[]): boolean {
	return a.length === b.length && a.every((item, index) => deepEqual(item, b[index]));
}
