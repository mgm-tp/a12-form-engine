// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
