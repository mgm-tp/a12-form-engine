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

import { query } from "@com.mgmtp.a12.devtools/react";
import type { TimePickerProps } from "@com.mgmtp.a12.widgets/widgets-core";

import { UiId } from "../../../../../../back-end/utils/internal/generateUiId.js";

import type { RenderSideEffect } from "../render-sideeffect.js";

import type { FilterPropsSelector } from "./props-selector.js";

export interface TimePickerRangeFunctions {
	query: (name: string) => FilterPropsSelector<TimePickerProps>;
	queryAll: FilterPropsSelector<TimePickerProps[]>;
	triggerChange: (name: string, value?: Date) => RenderSideEffect;
	triggerValidate: (name: string, value: string) => RenderSideEffect;
}

const options = ["from", "to"] as const;
export function TimePickerRangeFunctions(column: string): TimePickerRangeFunctions {
	const queryOne: TimePickerRangeFunctions["query"] = name => wrapper => {
		const id = UiId.generateForFieldOverviewColumnFilter({ id: column, suffix: `-${name}` });
		return query(wrapper.widgetMap.TimePicker).withId(id).props();
	};

	const queryAll: TimePickerRangeFunctions["queryAll"] = wrapper => {
		return options.map(queryOne).map(e => e(wrapper));
	};

	const triggerChange: TimePickerRangeFunctions["triggerChange"] = (name, value) => wrapper => {
		const timepicker = queryOne(name)(wrapper);
		timepicker.onChange?.(value);
	};

	const triggerValidate: TimePickerRangeFunctions["triggerValidate"] = (name, value) => wrapper => {
		const timepicker = queryOne(name)(wrapper);
		timepicker.onValidate?.({ value, valid: true });
	};

	return { query: queryOne, queryAll, triggerChange, triggerValidate };
}
