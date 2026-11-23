// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { useCallback } from "react";
import type { JSX } from "react";

import type { KeywordLengthSettingState } from "@com.mgmtp.a12.contentengine/contentengine-editor";
import { SettingEvents, useSettingState } from "@com.mgmtp.a12.contentengine/contentengine-editor";

import { messageExpositionItems } from "../dropdownItems.js";

import { SelectSetting } from "./selectSetting.js";
import { SwitchSetting } from "./switchSetting.js";

/** @internal */
export function MessageExpositionSetting(): JSX.Element {
	const messageExpositionPath = ["messageExposition"];
	const tooltipsOnTopPath = ["tooltipsOnTop"];

	const [messageExpositionSetting, dispatchMessageExposition] =
		useSettingState<KeywordLengthSettingState>(messageExpositionPath);
	const [, dispatchTooltipsOnTop] = useSettingState<KeywordLengthSettingState>(tooltipsOnTopPath);

	const onValueChangedMessageExposition = useCallback(
		(newValue: string) => {
			dispatchMessageExposition(SettingEvents.onChangeUnit({ unit: newValue }));
			dispatchTooltipsOnTop(SettingEvents.onChangeValue({ value: "" }));
		},
		[dispatchMessageExposition, dispatchTooltipsOnTop]
	);

	return (
		<>
			<SelectSetting
				label={"Message Exposition"}
				settingPath={messageExpositionPath}
				items={messageExpositionItems}
				width={120}
				onValueChanged={onValueChangedMessageExposition}
			/>
			{messageExpositionSetting.dropdownProps.value === "TOOLTIP" && (
				<SwitchSetting label={"Show tooltips on top"} settingPath={tooltipsOnTopPath} />
			)}
		</>
	);
}
