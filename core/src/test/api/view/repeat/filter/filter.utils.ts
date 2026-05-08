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

import { deepStrictEqual, fail, notStrictEqual, ok, strictEqual } from "node:assert/strict";
import { mock } from "node:test";

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";

import { UiStateSelectors } from "../../../../../back-end/store/index.js";
import type {
	EngineStore,
	FilterParseError,
	Models,
	RepeatFilter
} from "../../../../../back-end/store/internal/store.js";
import { isDateRangeFilter, isRangeFilter } from "../../../../../back-end/store/internal/store.js";
import { BufferedTextLine } from "../../../../../view/internal/components/widgets/form-engine/buffered-text-line.js";
import type { ComponentMap } from "../../../../../view/internal/configuration/componentMap/component-map.js";
import { DefaultComponentMap } from "../../../../../view/internal/configuration/componentMap/DefaultComponentMap.js";
import { US_LOCALE } from "../../../../utils/localization.js";
import { ModelHelpers } from "../../../../utils/model-helpers.js";
import { SetupHelpers } from "../../../../utils/setup.js";

import type { FilterInputProps, FilterPropsSelector } from "./filter-functions/props-selector.js";
import { run as runInteraction, type Interaction } from "./interaction.js";
import type { RenderSideEffect } from "./render-sideeffect.js";

const { createModelPath } = ModelHelpers;

export function createUIState(
	{ filterRowOpen = true, filters }: EngineStore.Repeat.StaticState = {},
	{ newRow }: EngineStore.Repeat.InstanceState = {}
): Partial<EngineStore.UIState> {
	return {
		screenLocation: [
			{
				path: [],
				locationPath: [{ elementName: "SortingAndFiltering" }],
				repeatInstanceState: {
					"/SortingAndFiltering/sec1/inline-repeat-Nested_L1": {
						newRow
					}
				}
			}
		],
		repeatStaticState: {
			"/SortingAndFiltering/sec1/inline-repeat-Nested_L1": {
				filterRowOpen,
				filters
			}
		}
	};
}

function createUIStateForTimeZoneModels(
	{ filterRowOpen = true, filters }: EngineStore.Repeat.StaticState = {},
	{ newRow }: EngineStore.Repeat.InstanceState = {}
): Partial<EngineStore.UIState> {
	return {
		screenLocation: [
			{
				path: [],
				locationPath: [{ elementName: "Screen1" }],
				repeatInstanceState: {
					"/Screen1/sec/inline-repeat-repeatable": {
						newRow
					}
				}
			}
		],
		repeatStaticState: {
			"/Screen1/sec/inline-repeat-repeatable": {
				filterRowOpen,
				filters
			}
		}
	};
}

export const REPEAT_MODEL_PATH = ["SortingAndFiltering", "sec1", "inline-repeat-Nested_L1"];

const REPEAT_TIMEZONE_MODEL_PATH = ["Screen1", "sec", "inline-repeat-repeatable"];

export async function disabledFilterTest(
	models: Models,
	propsSelector: FilterPropsSelector<FilterInputProps[]>,
	expectedCount: number
): Promise<void> {
	const componentMap = componentMapWithMocks();
	const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
		componentMap,
		models,
		locale: US_LOCALE,
		data: {},
		ui: { ...createUIState(), disabled: true },
		config: { externalEnumerationProvider }
	});

	const match = propsSelector(wrapper);
	strictEqual(match.length, expectedCount);
	ok(match.every(props => props.disabled === true));
	ok(match.every(props => props.readonly !== true));
}

export async function readonlyFilterTest(
	models: Models,
	propsSelector: FilterPropsSelector<FilterInputProps[]>,
	expectedCount: number
): Promise<void> {
	const componentMap = componentMapWithMocks();
	const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
		componentMap,
		models,
		locale: US_LOCALE,
		data: {},
		ui: { ...createUIState(), readonly: true },
		config: { externalEnumerationProvider }
	});
	const match = propsSelector(wrapper);
	strictEqual(match.length, expectedCount);
	ok(match.every(props => props.disabled !== true));
	ok(match.every(props => props.readonly !== true));
}

export function componentMapWithMocks(): ComponentMap {
	return {
		...DefaultComponentMap,
		BufferedTextLine: mock.fn(BufferedTextLine)
	};
}

export async function changeFilterValueTest(
	models: Models,
	columnName: string,
	interaction: Interaction,
	expectedRepeatFilter: RepeatFilter,
	additionalAssertion?: RenderSideEffect,
	timeZoneModel?: boolean,
	initialRepeatFilter?: RepeatFilter
): Promise<void> {
	const componentMap = componentMapWithMocks();
	const filters = initialRepeatFilter ? filterState(columnName, initialRepeatFilter) : undefined;
	const wrapper = await SetupHelpers.setupConnectedFormEngineWithRtlAsync({
		componentMap,
		models,
		locale: US_LOCALE,
		data: {},
		ui: timeZoneModel ? createUIStateForTimeZoneModels() : createUIState({ filters }),
		config: { externalEnumerationProvider }
	});
	const repeatPath = timeZoneModel ? REPEAT_TIMEZONE_MODEL_PATH : REPEAT_MODEL_PATH;

	await runInteraction(wrapper, interaction);

	const repeatStaticState = UiStateSelectors.repeatStaticStateEntry(createModelPath(...repeatPath))(
		wrapper.store.getState()
	);

	notStrictEqual(repeatStaticState, undefined);
	notStrictEqual(repeatStaticState?.filters, undefined);

	repeatFiltersEqual(repeatStaticState?.filters?.[columnName], {
		columnPath: createModelPath(...repeatPath, columnName),
		filter: expectedRepeatFilter
	});

	additionalAssertion?.(wrapper);
}

function repeatFiltersEqual(
	actual: { columnPath: ModelPath; filter: RepeatFilter } | undefined,
	expected: { columnPath: ModelPath; filter: RepeatFilter } | undefined
): void {
	if (!actual || !expected) {
		if (!actual && !expected) {
			return;
		}
		fail();
	}

	deepStrictEqual(actual.columnPath, expected.columnPath);

	if (isDateRangeFilter(actual.filter) && isDateRangeFilter(expected.filter)) {
		deepStrictEqual(actual.filter.filterRange?.data, expected.filter.filterRange?.data);

		const actualMsg = actual.filter.filterRange?.message;
		const expectedMsg = expected.filter.filterRange?.message;

		if (!!actualMsg !== !!expectedMsg) {
			fail();
		}
		if (actualMsg && expectedMsg) {
			deepStrictEqual(simplifyErrorObject(actualMsg), simplifyErrorObject(expectedMsg));
		}
	} else if (isRangeFilter(actual.filter) && isRangeFilter(expected.filter)) {
		// compare to
		deepStrictEqual(actual.filter.to?.data, expected.filter.to?.data);

		const actualToMsg = actual.filter.to?.message;
		const expectedToMsg = expected.filter.to?.message;
		if (!!actualToMsg !== !!expectedToMsg) {
			fail();
		}
		if (actualToMsg && expectedToMsg) {
			deepStrictEqual(simplifyErrorObject(actualToMsg), simplifyErrorObject(expectedToMsg));
		}

		// compare from
		deepStrictEqual(actual.filter.from?.data, expected.filter.from?.data);
		const actualFromMsg = actual.filter.from?.message;
		const expectedFromMsg = expected.filter.from?.message;
		if (!!actualFromMsg !== !!expectedFromMsg) {
			fail();
		}
		if (actualFromMsg && expectedFromMsg) {
			deepStrictEqual(simplifyErrorObject(actualFromMsg), simplifyErrorObject(expectedFromMsg));
		}
	} else {
		deepStrictEqual(actual, expected);
	}
}

function simplifyErrorObject(parseError: FilterParseError) {
	return {
		...parseError,
		error: {
			...parseError.error,
			errorText: parseError.error.errorText.defaults!["en"]
		}
	};
}

function filterState(
	columnName: string,
	filter: RepeatFilter
): EngineStore.Repeat.StaticState["filters"] {
	return {
		[columnName]: {
			columnPath: createModelPath(...REPEAT_MODEL_PATH, columnName),
			filter
		}
	};
}

export async function clearFilterValueTest(
	models: Models,
	columnName: string,
	initialRepeatFilter: RepeatFilter,
	interaction: Interaction
): Promise<void> {
	const componentMap = componentMapWithMocks();
	const filters = filterState(columnName, initialRepeatFilter);
	const wrapper = await SetupHelpers.setupConnectedFormEngineWithRtlAsync({
		componentMap,
		models,
		locale: US_LOCALE,
		data: {},
		ui: createUIState({ filters }),
		config: { externalEnumerationProvider }
	});

	await runInteraction(wrapper, interaction);

	const repeatStaticStateEntry = UiStateSelectors.repeatStaticStateEntry(
		createModelPath(...REPEAT_MODEL_PATH)
	)(wrapper.store.getState());

	notStrictEqual(repeatStaticStateEntry, undefined);
	notStrictEqual(repeatStaticStateEntry!.filters, undefined);
	strictEqual(repeatStaticStateEntry!.filters![columnName], undefined);
}

function externalEnumerationProvider() {
	return { V1: { en: "1" }, V2: { en: "2" }, V3: { en: "3" } };
}
