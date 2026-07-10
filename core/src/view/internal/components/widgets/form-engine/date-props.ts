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

import type { BufferedTextLineProps } from "./buffered-text-line.js";

interface BaseDateTextLineProps extends BufferedTextLineProps {
	readonly id: string;
	readonly enableDatePicker?: boolean;
	readonly timeZone?: string;
	readonly openPickerLabel: string;
	readonly okLabel: string;
}

/** @internal */
export interface DateTextLineProps extends BaseDateTextLineProps {
	readonly typedValue: Date | string | null;
	readonly initialDatePickerSelection?: Date;

	readonly yearRange?: YearRange;

	onTypedValueSubmit(date: Date): void;
	getLocalizedDateString(date?: Date): string;
}

/** @internal */
export interface DateTimeTextLineProps extends BaseDateTextLineProps {
	readonly typedValue: Date | null;
	readonly initialDatePickerSelection: Date;

	readonly clearLabel: string;
	readonly backLabel: string;
	readonly editTimeLabel: string;
	readonly placeholderText: string;

	readonly yearRange?: YearRange;

	onTypedValueSubmit(date: Date): void;
	getLocalizedDateString(date: Date | null): string;
}

/** @internal */
export interface DateRangeTextLineProps extends BaseDateTextLineProps {
	readonly typedValue: DateRange;
	readonly initialDatePickerSelection?: DateRange;

	readonly clearLabel: string;

	readonly yearRange?: YearRange;

	onTypedValueSubmit(dateRange?: DateRange): void;
	getLocalizedDateString(dateRange?: DateRange): string;
}
