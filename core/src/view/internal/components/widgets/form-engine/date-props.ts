// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { DateRange } from "@com.mgmtp.a12.widgets/widgets-core/lib/datepicker/main/date-range.api.js";
import type { YearRange } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/year-month-selector/year-selector.api.js";

import type { ClockMode } from "../../../configuration/engine-configuration.js";

import type { BufferedTextLine } from "./buffered-text-line.js";

interface BaseDateTextLineProps extends BufferedTextLine.PropsType {
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
	readonly timeMode?: ClockMode;

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
