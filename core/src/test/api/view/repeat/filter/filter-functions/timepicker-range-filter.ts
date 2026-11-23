// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { query } from "@com.mgmtp.a12.devtools/react";
import type { TimePickerProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/time-picker/main/time-picker.api.js";

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
