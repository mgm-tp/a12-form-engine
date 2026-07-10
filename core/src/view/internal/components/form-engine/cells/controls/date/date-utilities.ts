/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * Dual License
 * ------------
 * This source file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License - EUPL v1.2
 *    You may redistribute and/or modify this file under the terms of the
 *    European Union Public License, version 1.2 - see https://eupl.eu/.
 *
 * 2. Commercial License
 *    Alternatively, you may obtain a commercial license from
 *    mgm technology partners GmbH, that permits use of this software
 *    under different terms (including support and maintenance services).
 *
 *    Please contact a12-license@mgm-tp.com for more information.
 *
 * You must select and comply with exactly one of the above license options.
 *
 * Warranty Disclaimer (applies to either option)
 * ----------------------------------------------
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */

import type { DateRange, YearRange } from "@com.mgmtp.a12.widgets/widgets-core";

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
