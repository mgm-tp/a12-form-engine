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

import { useCallback, useMemo } from "react";
import type { JSX } from "react";

import type {
	DropdownItemProps,
	KeywordLengthSettingState,
	SettingPath
} from "@com.mgmtp.a12.contentengine/contentengine-editor";
import {
	SettingEvents,
	SettingTemplate,
	useSettingState
} from "@com.mgmtp.a12.contentengine/contentengine-editor";
import type { SelectItem } from "@com.mgmtp.a12.widgets/widgets-core";

import { StyledSelect } from "./styledWidgets.js";

interface SelectSettingsProps {
	readonly label: string;
	readonly settingPath: SettingPath;
	readonly items: string[] | DropdownItemProps[];
	readonly width?: number;
	onValueChanged?: (newValue: string) => void;
}

/** @internal */
export function SelectSetting(props: SelectSettingsProps): JSX.Element {
	const { label, settingPath, items, width, onValueChanged } = props;
	const [settingState, dispatch] = useSettingState<KeywordLengthSettingState>(settingPath);

	const selectItems: SelectItem[] = useMemo(() => {
		return items.map(item => {
			const value = typeof item === "string" ? item : item.value;
			const label = typeof item === "string" ? item : item.label || item.value;
			const title = typeof item === "string" ? undefined : item.title;

			return { value, label, title };
		});
	}, [items]);

	const defaultOnValueChanged = useCallback(
		(newValue: string) => {
			dispatch(SettingEvents.onChangeUnit({ unit: newValue }));
		},
		[dispatch]
	);

	return (
		<SettingTemplate.Setting
			label={label}
			suffix={
				<StyledSelect
					value={settingState.dropdownProps.value}
					items={selectItems}
					$width={width}
					onValueChanged={onValueChanged ?? defaultOnValueChanged}
				/>
			}
		/>
	);
}
