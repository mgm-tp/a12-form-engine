// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Action } from "typescript-fsa";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";

import { Commands } from "../../actions.js";
import { UiStateSelectors } from "../../selectors/ui-state.js";
import type { EngineState } from "../../store.js";

/** @internal */
export function collapseAllExpandedRowsActions(state: EngineState): Action<object>[] {
	const currentScreenLocation = UiStateSelectors.currentScreenLocation()(state);
	const repeatInstanceState = UiStateSelectors.repeatInstanceState()(state);

	if (repeatInstanceState !== undefined) {
		for (const [repeatModelPath, repeatInstanceStateEntry] of Object.entries(repeatInstanceState)) {
			if (repeatInstanceStateEntry?.expandedRowPath !== undefined) {
				return [
					Commands.changeRepeatInstanceStateEntry({
						locationPath: currentScreenLocation.locationPath,
						repeatFormModelPath: ModelPath.fromString(repeatModelPath),
						entry: {
							...repeatInstanceStateEntry,
							expandedRowPath: undefined
						}
					})
				];
			}
		}
	}
	return [];
}
