// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

/** @internal */
export function nmTokensToString(tokens?: string[]): string | undefined {
	return tokens && tokens.length > 0 ? tokens.join(" ") : undefined;
}
