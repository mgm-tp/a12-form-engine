// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { useCallback } from "react";
import type { JSX } from "react";

import type {
	BooleanSettingState,
	SettingPath
} from "@com.mgmtp.a12.contentengine/contentengine-editor";
import {
	SettingEvents,
	SettingTemplate,
	useSettingState
} from "@com.mgmtp.a12.contentengine/contentengine-editor";

import { StyledSwitch } from "./styledWidgets.js";

/** @internal */
export interface SwitchSettingProps {
	readonly label: string;
	readonly settingPath: SettingPath;
}

/** @internal */
export function SwitchSetting(props: SwitchSettingProps): JSX.Element {
	const { settingPath, label } = props;
	const [settingState, dispatch] = useSettingState<BooleanSettingState>(settingPath);

	const onChange = useCallback(
		(newValue: boolean) => {
			dispatch(SettingEvents.onChangeValue({ value: newValue ? "true" : "" }));
		},
		[dispatch]
	);

	return (
		<SettingTemplate.Setting
			label={label}
			suffix={<StyledSwitch checked={settingState} onChange={onChange} />}
		/>
	);
}
