// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { ReadonlyObjectMap } from "../../../models/internal/utils/json.js";

import type { Change } from "./documentChange.js";

/** This code is only exported for A12 internal use and should not be used in production. */
export interface DetailedUpdateResult {
	readonly document: GroupInstance;
	readonly changes: ReadonlyObjectMap<Change>;
}

/** @internal */
export namespace DetailedUpdateResult {
	export function merge(x: DetailedUpdateResult, y: DetailedUpdateResult): DetailedUpdateResult {
		return { ...x, ...y, changes: { ...x.changes, ...y.changes } };
	}
}
