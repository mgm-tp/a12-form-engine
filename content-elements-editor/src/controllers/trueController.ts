// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { SettingsStore } from "@com.mgmtp.a12.contentengine/contentengine-editor";
import { createBooleanController } from "@com.mgmtp.a12.contentengine/contentengine-editor";

/** @internal */
export type TrueSettingState = UIState;

type SettingState = boolean;
type ModelState = true | undefined;
type UIState = boolean;

/** @internal */
export function createTrueController(
	defaultValue: boolean,
	reverse = false
): SettingsStore.Controller<SettingState, ModelState, UIState> {
	const booleanController = createBooleanController(defaultValue, reverse);

	return {
		...booleanController,
		formatter(state) {
			return state ? state : undefined;
		}
	};
}
