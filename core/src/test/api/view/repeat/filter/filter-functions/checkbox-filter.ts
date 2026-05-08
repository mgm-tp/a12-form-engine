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
 * 1. Open-Source License – EUPL v1.2
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
