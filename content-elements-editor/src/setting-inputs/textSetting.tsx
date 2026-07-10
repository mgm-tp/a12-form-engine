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
