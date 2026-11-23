// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type {
	SettingsStore,
	StringSettingState
} from "@com.mgmtp.a12.contentengine/contentengine-editor";
import { createStringController } from "@com.mgmtp.a12.contentengine/contentengine-editor";

type SettingState = string | null;
type ModelState = string | undefined;

/** @internal */
export function createOptionalStringController(
	trim?: boolean
): SettingsStore.Controller<SettingState, ModelState, StringSettingState> {
	const stringController = createStringController(false, trim);

	return {
		...stringController,
		formatter(state) {
			return state ? state : undefined;
		}
	};
}
