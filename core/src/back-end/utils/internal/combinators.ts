// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Predicate } from "fp-ts/lib/Predicate.js";

/**
 * @internal
 * Combines multiple predicates into one that returns `true` only if all predicates return `true`.
 */
export function and<A>(...predicates: Predicate<A>[]): Predicate<A> {
	return (a: A) => predicates.every(predicate => predicate(a));
}
