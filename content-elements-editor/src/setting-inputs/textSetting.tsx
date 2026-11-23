// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX } from "react";
import { useCallback } from "react";

import type {
	SettingPath,
	StringSettingState
} from "@com.mgmtp.a12.contentengine/contentengine-editor";
import {
	SettingEvents,
	SettingTemplate,
	useSettingState
} from "@com.mgmtp.a12.contentengine/contentengine-editor";

import { StyledBufferedInput } from "./styledWidgets.js";

/** @internal */
export interface TextSettingProps {
	readonly label: string;
	readonly settingPath: SettingPath;
	readonly width?: string;
	onValueSubmit?: (input: string) => void;
}

/** @internal */
export function TextSetting(props: TextSettingProps): JSX.Element {
	const { settingPath, label, width, onValueSubmit } = props;
	const [settingState, dispatch] = useSettingState<StringSettingState>(settingPath);

	const defaultOnValueSubmit = useCallback(
		(input: string) => dispatch(SettingEvents.onChangeInput({ input })),
		[dispatch]
	);

	return (
		<SettingTemplate.Setting
			label={label}
			suffix={
				<StyledBufferedInput
					$width={width ?? "60%"}
					value={settingState.input}
					onValueSubmit={onValueSubmit ?? defaultOnValueSubmit}
				/>
			}
		/>
	);
}
