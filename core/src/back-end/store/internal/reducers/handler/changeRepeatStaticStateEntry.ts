// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Action } from "typescript-fsa";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";

import type { Commands } from "../../actions.js";
import type { EngineStore } from "../../store.js";

/** @internal */
export function handleChangeRepeatStaticStateEntry(
	state: EngineStore.UIState,
	action: Action<Commands.ChangeRepeatStaticStateEntryPayload>
): EngineStore.UIState {
	const repeatFormModelPathAsString = ModelPath.toString(action.payload.repeatFormModelPath);

	return {
		...state,
		repeatStaticState: {
			...(state.repeatStaticState || {}),
			[repeatFormModelPathAsString]: action.payload.entry
		}
	};
}
