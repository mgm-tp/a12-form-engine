// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
