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

import type { KeywordLengthSettingState } from "@com.mgmtp.a12.contentengine/contentengine-editor";
import { SettingEvents, useSettingState } from "@com.mgmtp.a12.contentengine/contentengine-editor";

import type { TrueSettingState } from "../controllers/trueController.js";
import { messageExpositionItems, tooltipPositionItems } from "../dropdownItems.js";

import { SelectSetting } from "./selectSetting.js";
import { displayedTooltipPosition, tooltipsOnTopFor } from "./tooltipPosition.js";

/** @internal */
export function MessageExpositionSetting(): JSX.Element {
	const messageExpositionPath = ["messageExposition"];
	const tooltipPositionPath = ["tooltipPosition"];
	const tooltipsOnTopPath = ["tooltipsOnTop"];

	const [messageExpositionSetting, dispatchMessageExposition] =
		useSettingState<KeywordLengthSettingState>(messageExpositionPath);
	const [tooltipPositionSetting, dispatchTooltipPosition] =
		useSettingState<KeywordLengthSettingState>(tooltipPositionPath);
	const [tooltipsOnTopSetting, dispatchTooltipsOnTop] =
		useSettingState<TrueSettingState>(tooltipsOnTopPath);

	// The deprecated tooltipsOnTop is kept in sync, as runtimes that don't know tooltipPosition still read it.
	const onValueChangedTooltipPosition = useCallback(
		(newValue: string) => {
			dispatchTooltipPosition(SettingEvents.onChangeUnit({ unit: newValue }));
			dispatchTooltipsOnTop(
				SettingEvents.onChangeValue({ value: tooltipsOnTopFor(newValue) ? "true" : "" })
			);
		},
		[dispatchTooltipPosition, dispatchTooltipsOnTop]
	);

	// The tooltip position only applies to the TOOLTIP exposition, so it is reset to the default on any change.
	const onValueChangedMessageExposition = useCallback(
		(newValue: string) => {
			dispatchMessageExposition(SettingEvents.onChangeUnit({ unit: newValue }));
			onValueChangedTooltipPosition("BESIDE");
		},
		[dispatchMessageExposition, onValueChangedTooltipPosition]
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
				<SelectSetting
					label={"Tooltip position"}
					settingPath={tooltipPositionPath}
					items={tooltipPositionItems}
					width={120}
					displayedValue={displayedTooltipPosition(
						tooltipPositionSetting.dropdownProps.value,
						tooltipsOnTopSetting
					)}
					onValueChanged={onValueChangedTooltipPosition}
				/>
			)}
		</>
	);
}
