// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { EngineStore } from "../../store.js";

/** @internal */
export function handleClearUserConfirmation(state: EngineStore.UIState): EngineStore.UIState {
	return {
		...state,
		actionConfirmationRequested: undefined
	};
}
