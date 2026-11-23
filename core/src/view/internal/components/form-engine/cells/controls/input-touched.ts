// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { UiStateSelectors } from "../../../../../../back-end/store/internal/selectors/ui-state.js";
import type { FormModelMap } from "../../../../configuration/engine-configuration.js";

/** @internal */
export function inputTouched(options: FormModelMap.RenderOptions): void {
	if (options.config.earlyDetectDirtyControl !== true) {
		return;
	}

	const uiDirty = UiStateSelectors.dirty()(options.state);
	const currentScreenLocationStack = UiStateSelectors.screenLocationStack()(options.state);
	const screenDirty = UiStateSelectors.currentScreenLocation()(options.state).dirty;

	if (uiDirty !== true || (currentScreenLocationStack.length > 1 && screenDirty !== true)) {
		options.eventHandlers.onInputTouched();
	}
}
