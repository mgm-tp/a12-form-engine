// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

export function isRecord(value: unknown): value is Record<string, unknown> {
	return (
		typeof value === "object" && value !== null && !Array.isArray(value) && !(value instanceof Date)
	);
}
