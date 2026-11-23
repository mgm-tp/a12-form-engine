// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type {
	KeywordLength,
	SettingsStore
} from "@com.mgmtp.a12.contentengine/contentengine-editor";
import {
	createKeywordLengthController,
	Length
} from "@com.mgmtp.a12.contentengine/contentengine-editor";

/** @internal */
export function createOptionalEnumController(
	params: KeywordLength.ControllerConfig & { defaultValue: string }
): SettingsStore.Controller<
	KeywordLength.SettingState,
	KeywordLength.ModelState,
	KeywordLength.UIState
> {
	const keyWordLengthController = createKeywordLengthController(params);

	return {
		...keyWordLengthController,
		formatter(state) {
			return state.type === Length.ValueType.KEYWORD
				? state.unit === params.defaultValue
					? undefined
					: state.unit
				: `${state.value}${state.unit}`;
		}
	};
}
