// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
	UIStateSelector,
	useContentEditorState,
	useSettingState
} from "@com.mgmtp.a12.contentengine/contentengine-editor";
import type { SelectItem } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/select/main/select.api.js";

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

	const disabled = useContentEditorState(UIStateSelector.isReadonlySetting());

	return (
		<SettingTemplate.Setting
			label={label}
			suffix={
				<StyledSelect
					value={settingState.dropdownProps.value}
					items={selectItems}
					$width={width}
					onValueChanged={onValueChanged ?? defaultOnValueChanged}
					disabled={disabled}
				/>
			}
		/>
	);
}
