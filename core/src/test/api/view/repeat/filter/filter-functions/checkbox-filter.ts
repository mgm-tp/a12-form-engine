// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ChangeEvent } from "react";

import { query } from "@com.mgmtp.a12.devtools/react";
import type { CheckboxItemProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/checkbox-group/main/checkbox-group.api.js";

import { UiId } from "../../../../../../back-end/utils/internal/generateUiId.js";

import type { RenderSideEffect } from "../render-sideeffect.js";

import type { FilterPropsSelector } from "./props-selector.js";

export interface CheckBoxFunctions {
	query: (name: string) => FilterPropsSelector<CheckboxItemProps>;
	queryAll: FilterPropsSelector<CheckboxItemProps[]>;
	triggerChange: (name: string) => RenderSideEffect;
}

export function checkBoxFunctions(column: string, options: string[]): CheckBoxFunctions {
	const queryOne: CheckBoxFunctions["query"] = name => wrapper => {
		const id = UiId.generateForFieldOverviewColumnFilter({ id: column, suffix: `-${name}` });
		return query(wrapper.widgetMap.CheckboxGroupItem).withId(id).props();
	};

	const queryAll: CheckBoxFunctions["queryAll"] = wrapper => {
		return options.map(queryOne).map(e => e(wrapper));
	};

	const triggerChange: CheckBoxFunctions["triggerChange"] = name => wrapper => {
		const cb = queryOne(name)(wrapper);
		cb.onChange?.({} as ChangeEvent<HTMLInputElement>);
	};

	return { query: queryOne, queryAll, triggerChange };
}
