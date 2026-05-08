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

import { query } from "@com.mgmtp.a12.devtools/react";

import { UiId } from "../../../../../../back-end/utils/internal/generateUiId.js";
import type { BufferedTextLine } from "../../../../../../view/internal/components/widgets/form-engine/buffered-text-line.js";

import type { RenderSideEffect } from "../render-sideeffect.js";

import type { FilterPropsSelector } from "./props-selector.js";

export interface TextLineFunctions {
	query: FilterPropsSelector<BufferedTextLine.PropsType>;
	triggerChange: (value: string) => RenderSideEffect;
}

export function textLineFunctions(column: string): TextLineFunctions {
	const queryOne: TextLineFunctions["query"] = wrapper => {
		const id = UiId.generateForFieldOverviewColumnFilter({ id: column });
		return query(wrapper.componentMap.BufferedTextLine).withId(id).props();
	};

	const triggerChange: TextLineFunctions["triggerChange"] = value => wrapper => {
		const textline = queryOne(wrapper);
		textline.onValueSubmit(value);
	};

	return { query: queryOne, triggerChange };
}
