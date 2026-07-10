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

import { useCallback } from "react";
import type { JSX } from "react";

import type { StringSettingState } from "@com.mgmtp.a12.contentengine/contentengine-editor";
import {
	ModelStateSelector,
	SettingEvents,
	SettingTemplate,
	useContentEditorState,
	useSettingState
} from "@com.mgmtp.a12.contentengine/contentengine-editor";

import type { DatePickerSettingState } from "../controllers/datePickerConfigController.js";
import { DatePickerConfigElement } from "../controllers/datePickerConfigController.js";

import { StyledBufferedInput, StyledSwitch } from "./styledWidgets.js";

/** @internal */
export function DatePickerConfigSetting(): JSX.Element | null {
	const [idSetting] = useSettingState<StringSettingState>(["elementId"]);

	const documentModelService = useContentEditorState(ModelStateSelector.documentModelService());
	const dmElement = idSetting.input
		? documentModelService?.getElementById(idSetting.input)
		: undefined;
	const hasDatePickerConfig =
		dmElement?.type === "Field" &&
		["DateType", "DateTimeType", "DateRangeType"].includes(dmElement.fieldType.type);

	const [datePickerConfigSetting, dispatch] = useSettingState<DatePickerSettingState>([
		"datePickerConfig"
	]);

	const onSubmitMinYear = useCallback(
		(input: string) =>
			dispatch(SettingEvents.onChangeInput({ input, element: DatePickerConfigElement.MinYear })),
		[dispatch]
	);
	const onSubmitMaxYear = useCallback(
		(input: string) =>
			dispatch(SettingEvents.onChangeInput({ input, element: DatePickerConfigElement.MaxYear })),
		[dispatch]
	);
	const onSubmitPreselectionYear = useCallback(
		(input: string) =>
			dispatch(
				SettingEvents.onChangeInput({
					input,
					element: DatePickerConfigElement.PreselectionYear
				})
			),
		[dispatch]
	);

	const onChangeAbsolute = useCallback(
		(newValue: boolean) => {
			dispatch(
				SettingEvents.onChangeValue({
					value: newValue,
					element: DatePickerConfigElement.Absolute
				})
			);
		},
		[dispatch]
	);

	return hasDatePickerConfig ? (
		<SettingTemplate.Section label="Date Picker Config">
			<SettingTemplate.Setting
				label={"Min Year"}
				suffix={
					<StyledBufferedInput
						$width={"60%"}
						value={datePickerConfigSetting[DatePickerConfigElement.MinYear].input}
						onValueSubmit={onSubmitMinYear}
					/>
				}
			/>
			<SettingTemplate.Setting
				label={"Max Year"}
				suffix={
					<StyledBufferedInput
						$width={"60%"}
						value={datePickerConfigSetting[DatePickerConfigElement.MaxYear].input}
						onValueSubmit={onSubmitMaxYear}
					/>
				}
			/>
			<SettingTemplate.Setting
				label={"Absolute"}
				suffix={
					<StyledSwitch
						checked={datePickerConfigSetting[DatePickerConfigElement.Absolute]}
						onChange={onChangeAbsolute}
					/>
				}
			/>
			<SettingTemplate.Setting
				label={"Preselection Year"}
				suffix={
					<StyledBufferedInput
						$width={"60%"}
						value={datePickerConfigSetting[DatePickerConfigElement.PreselectionYear].input}
						onValueSubmit={onSubmitPreselectionYear}
					/>
				}
			/>
		</SettingTemplate.Section>
	) : null;
}
