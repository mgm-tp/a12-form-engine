// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { isUiState } from "../../../../../back-end/store/internal/selectors/engineState.js";
import type { EngineStore } from "../../../../../back-end/store/internal/store.js";
import { createUIState } from "../../../../../back-end/store/internal/storeFactory.js";
import type { FormModel } from "../../../../../models/internal/form-model.js";

type Slice = object | undefined;

/**
 * @internal
 *
 * Gets or creates a {@link EngineStore.UIState} from a given dataholder slice
 */
export function resolveUiState(slice: Slice, fm: FormModel): EngineStore.UIState;
export function resolveUiState(slice: Slice, fm?: FormModel): EngineStore.UIState | undefined;
export function resolveUiState(slice: Slice, fm?: FormModel): EngineStore.UIState | undefined {
	return isUiState(slice)
		? slice
		: fm
			? createUIState({
					screenLocation: [
						{
							locationPath: [{ elementName: fm.content.screens[0].name }],
							path: []
						}
					],
					...slice
				})
			: undefined;
}
