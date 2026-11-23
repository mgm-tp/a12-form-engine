// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Action } from "typescript-fsa";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";

import { assertExists } from "../../../../utils/internal/assertions.js";
import type { Commands } from "../../actions.js";
import type { EngineStore } from "../../store.js";

/** @internal */
export function handleChangeRepeatInstanceStateEntry(
	state: EngineStore.UIState,
	{
		payload: { repeatFormModelPath, entry }
	}: Action<Commands.ChangeRepeatInstanceStateEntryPayload>
): EngineStore.UIState {
	const repeatFormModelPathAsString = ModelPath.toString(repeatFormModelPath);

	const lastEntry = state.screenLocation.at(-1);
	assertExists(lastEntry, "Expected at least one screen location");

	return {
		...state,
		screenLocation: state.screenLocation.with(-1, {
			...lastEntry,
			repeatInstanceState: {
				...(lastEntry.repeatInstanceState ?? {}),
				[repeatFormModelPathAsString]: {
					...entry,
					// always reset document when expanded row closes
					tableInteractionDocument:
						entry.expandedRowPath === undefined ? undefined : entry.tableInteractionDocument
				}
			}
		})
	};
}
