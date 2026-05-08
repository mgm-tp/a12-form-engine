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
import type { SwitchProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/switch/main/switch.api.js";

import { UiId } from "../../../../../../back-end/utils/internal/generateUiId.js";

import type { RenderSideEffect } from "../render-sideeffect.js";

import type { FilterPropsSelector } from "./props-selector.js";

export interface EmptySwitchFunctions {
	query: () => FilterPropsSelector<SwitchProps>;
	triggerChange: (value: boolean) => RenderSideEffect;
}

export function emptySwitchFunctions(column: string): EmptySwitchFunctions {
	const queryOne: EmptySwitchFunctions["query"] = () => wrapper => {
		const id = UiId.generateForFieldOverviewColumnFilter({ id: column, suffix: `-empty` });
		return query(wrapper.widgetMap.Switch).withId(id).props();
	};

	const triggerChange: EmptySwitchFunctions["triggerChange"] = value => wrapper => {
		const switchProps = queryOne()(wrapper);
		switchProps.onChange(value, {} as ChangeEvent<HTMLInputElement>);
	};

	return { query: queryOne, triggerChange };
}
