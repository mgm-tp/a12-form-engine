// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { query } from "@com.mgmtp.a12.devtools/react";

import { UiId } from "../../../../../../back-end/utils/internal/generateUiId.js";
import type { BufferedTextLine } from "../../../../../../view/internal/components/widgets/form-engine/buffered-text-line.js";

import type { RenderSideEffect } from "../render-sideeffect.js";

import type { FilterPropsSelector } from "./props-selector.js";

export interface TextLineRangeFunctions {
	query: (name: string) => FilterPropsSelector<BufferedTextLine.PropsType>;
	queryAll: FilterPropsSelector<BufferedTextLine.PropsType[]>;
	triggerChange: (name: string, value: string) => RenderSideEffect;
}

const options = ["from", "to"] as const;
export function textLineRangeFunctions(column: string): TextLineRangeFunctions {
	const queryOne: TextLineRangeFunctions["query"] = name => wrapper => {
		const id = UiId.generateForFieldOverviewColumnFilter({ id: column, suffix: `-${name}` });
		return query(wrapper.componentMap.BufferedTextLine).withId(id).props();
	};

	const queryAll: TextLineRangeFunctions["queryAll"] = wrapper => {
		return options.map(queryOne).map(e => e(wrapper));
	};

	const triggerChange: TextLineRangeFunctions["triggerChange"] = (name, value) => wrapper => {
		const textline = queryOne(name)(wrapper);
		textline.onValueSubmit(value);
	};

	return { query: queryOne, queryAll, triggerChange };
}
