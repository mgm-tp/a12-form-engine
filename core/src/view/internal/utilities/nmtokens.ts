// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

/**
 * @internal
 * Concat the given strings using whitespace. Lenient towards empty lists and
 * undefined, in which case undefined is returned.
 */
export function nmTokensToString(tokens?: string[]): string | undefined {
	return tokens && tokens.length > 0 ? tokens.join(" ") : undefined;
}
