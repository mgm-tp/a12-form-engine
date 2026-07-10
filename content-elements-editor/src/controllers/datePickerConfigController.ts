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

import {
	createReducerBuilder,
	SettingEvents
} from "@com.mgmtp.a12.contentengine/contentengine-editor";
import type { SettingsStore } from "@com.mgmtp.a12.contentengine/contentengine-editor";
import type { BaseControlProps } from "@com.mgmtp.a12.formengine/formengine-content-elements";

import { ClearDatePickerConfig } from "./datePickerConfigActions.js";

/** @internal */
export type DatePickerSettingState = SettingState;

/** @internal */
export const DatePickerConfigElement = {
	MinYear: "minYear",
	MaxYear: "maxYear",
	Absolute: "absolute",
	PreselectionYear: "preselectionYear"
} as const;

interface NumberState {
	value?: number;
	input?: string;
	errorMessage?: string;
}

type ModelState = BaseControlProps["datePickerConfig"] | undefined;
type SettingState = {
	[DatePickerConfigElement.MinYear]: NumberState;
	[DatePickerConfigElement.MaxYear]: NumberState;
	[DatePickerConfigElement.Absolute]: boolean;
	[DatePickerConfigElement.PreselectionYear]: NumberState;
};
type UIState = SettingState;

const defaultNumberState: NumberState = {};

function createNumberState(value?: number): NumberState {
	if (!value) {
		return defaultNumberState;
	}

	return { value, input: String(value) };
}

function parseNumber(value: string): NumberState {
	if (value) {
		const parsed = parseFloat(value);

		return isNaN(parsed)
			? {
					input: value,
					errorMessage: "Invalid number input"
				}
			: { value: parsed, input: String(parsed) };
	}

	return defaultNumberState;
}

const defaultDatePickerConfigState = {
	[DatePickerConfigElement.MinYear]: defaultNumberState,
	[DatePickerConfigElement.MaxYear]: defaultNumberState,
	[DatePickerConfigElement.Absolute]: false,
	[DatePickerConfigElement.PreselectionYear]: defaultNumberState
};

/** @internal */
export function createDatePickerConfigController(): SettingsStore.Controller<
	SettingState,
	ModelState,
	UIState
> {
	return {
		converter(modelState) {
			if (modelState === undefined) {
				return defaultDatePickerConfigState;
			}

			return {
				[DatePickerConfigElement.MinYear]: createNumberState(modelState.minYear),
				[DatePickerConfigElement.MaxYear]: createNumberState(modelState.maxYear),
				[DatePickerConfigElement.Absolute]: modelState.absolute ?? false,
				[DatePickerConfigElement.PreselectionYear]: createNumberState(modelState.preselectionYear)
			};
		},
		formatter(state) {
			const minYear = state[DatePickerConfigElement.MinYear].value;
			const maxYear = state[DatePickerConfigElement.MaxYear].value;
			const absolute = state[DatePickerConfigElement.Absolute];
			const preselectionYear = state[DatePickerConfigElement.PreselectionYear].value;

			return minYear || maxYear || absolute || preselectionYear
				? {
						minYear,
						maxYear,
						absolute: absolute ? absolute : undefined,
						preselectionYear
					}
				: undefined;
		},
		reducer: createReducerBuilder<SettingState>()
			.addCase(SettingEvents.onChangeValue, (state, action) => {
				const { element, value } = action.payload;

				if (element === DatePickerConfigElement.Absolute) {
					assertCondition(typeof value === "boolean");
					state[DatePickerConfigElement.Absolute] = value;
				} else {
					throw new Error("Invalid element. Got: " + element);
				}
			})
			.addCase(SettingEvents.onChangeInput, (state, action) => {
				const { element, input } = action.payload;
				assertCondition(
					element === DatePickerConfigElement.MinYear ||
						element === DatePickerConfigElement.MaxYear ||
						element === DatePickerConfigElement.PreselectionYear
				);

				state[element] = parseNumber(input);
			})
			.addCase(ClearDatePickerConfig, state => {
				state = defaultDatePickerConfigState;

				return state;
			})
			.build(),
		selector(state) {
			return state;
		},
		errorExtractor(state) {
			return [
				DatePickerConfigElement.MinYear,
				DatePickerConfigElement.MaxYear,
				DatePickerConfigElement.PreselectionYear
			].some(element => (state[element] as NumberState).errorMessage !== undefined);
		}
	};
}

function assertCondition(condition: boolean, message?: string): asserts condition {
	if (!condition) {
		throw new Error(message ?? "Generic assertion error - given condition is not met.");
	}
}
