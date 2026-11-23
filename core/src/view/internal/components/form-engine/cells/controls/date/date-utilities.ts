// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { DateRange } from "@com.mgmtp.a12.widgets/widgets-core/lib/datepicker/main/date-range.api.js";
import type { YearRange } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/year-month-selector/year-selector.api.js";

import type { FormModel } from "../../../../../../../models/index.js";

/** @internal */
export const DateUtils = {
	calculateYearRange,
	calculateInitialDate,
	calculateInitialDateRange,
	isDateRangeArray
};

function calculateYearRange(
	datePickerConfig: FormModel.DatePickerConfig | undefined
): YearRange | undefined {
	if (datePickerConfig === undefined) {
		return undefined;
	}
	const { minYear, maxYear, absolute } = datePickerConfig;
	if (minYear === undefined || maxYear === undefined) {
		return undefined;
	}
	if (absolute) {
		return { start: minYear, end: maxYear };
	} else {
		const currentYear = new Date().getFullYear();
		return { start: currentYear + minYear, end: currentYear + maxYear };
	}
}

function calculateInitialDate(datePickerConfig?: FormModel.DatePickerConfig): Date {
	const initialDate = new Date();
	const { absolute, preselectionYear } = datePickerConfig ?? {};

	initialDate.setFullYear(
		absolute
			? preselectionYear || initialDate.getFullYear()
			: initialDate.getFullYear() + (preselectionYear ?? 0)
	);

	return initialDate;
}

function calculateInitialDateRange(datePickerConfig?: FormModel.DatePickerConfig): DateRange {
	return { from: calculateInitialDate(datePickerConfig), to: undefined };
}

function isDateRangeArray(value: unknown): value is Date[] {
	return Array.isArray(value) && value.length === 2 && value.every(e => e instanceof Date);
}
