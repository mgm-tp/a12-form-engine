// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Selector } from "@com.mgmtp.a12.client/client-core/lib/core/store/index.js";

import type { EngineState } from "../../back-end/store/index.js";
import { FormEngineSelectors } from "../../client-extensions/index.js";

import { selectNow } from "./previewSlice.js";

interface PreviewEngineState extends EngineState {
	readonly preview?: {
		readonly now?: Date;
	};
}

/**
 * Only works in conjunction with a custom {@link previewEngineStateSelector}
 */
export function nowProvider(state: PreviewEngineState): Date | undefined {
	return state.preview?.now ?? undefined;
}

/**
 * Enhances the engine state with the now value from the dataholder slice so
 * the form engine middlewares can access it via the {@link nowProvider}.
 */
export function previewEngineStateSelector(
	activityId: string
): Selector<PreviewEngineState | undefined> {
	return state => {
		const engineState = FormEngineSelectors.engineState(activityId)(state);
		const now = selectNow(state, activityId);

		return engineState
			? now
				? {
						...engineState,
						preview: { now }
					}
				: engineState
			: undefined;
	};
}
