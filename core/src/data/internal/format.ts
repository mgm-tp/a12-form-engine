// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { FieldInstanceValue } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type {
	ValueConversion,
	ValueConversionConfig
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { DateUtils } from "../../view/internal/components/form-engine/cells/controls/date/date-utilities.js";

/** @internal */
export function formatValue(
	value: FieldInstanceValue | object | undefined,
	converter: ValueConversion,
	conversionConfig: ValueConversionConfig
): string {
	return value !== undefined &&
		value !== null &&
		(typeof value !== "object" || value instanceof Date || DateUtils.isDateRangeArray(value))
		? (converter.formatValue(value, conversionConfig) ?? "")
		: "";
}
