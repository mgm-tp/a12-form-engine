// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

/**
 * An object representing a Value for a `Control` or `FieldOverviewColumn`.
 */
export interface Value {
	/** Formatted UI-value */
	readonly ui: string;
	/** Plain data value */
	readonly data: string | number | boolean | Date | null | object | undefined;
	/** Document path to the value */
	readonly path: EntityInstancePath;
	/** Form model path to the `Control` or `FieldOverviewColumn` */
	readonly formModelPath?: ModelPath;
}

/** @internal */
export function isEmpty(
	data: string | number | boolean | Date | null | object | undefined
): data is "" | null | undefined {
	return data === "" || data === null || data === undefined;
}
