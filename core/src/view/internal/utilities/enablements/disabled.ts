// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { DataSelectors, UiStateSelectors } from "../../../../back-end/store/index.js";
import type { EngineState } from "../../../../back-end/store/internal/store.js";
import { FormModel } from "../../../../models/index.js";
import type { EnablementByButtonName } from "../../configuration/engine-configuration.js";

import { checkScope } from "./enablement-utilities.js";

/**
 * Evaluate if the given form model element is supposed to be disabled.
 *
 * Note: If you want to take event or navigation buttons into account and are
 * using a custom enablement map, you should also provide this map in the
 * enablements parameter.
 *
 * @param options.formModelElement The form model element to be checked
 * @param options.state The current state
 * @param options.enablements An object containing custom enablement maps
 * @param options.enablements.buttons The enablement map for event and navigation buttons
 *
 * @returns Whether the given form model element is disabled
 */
export function isDisabled(options: {
	readonly formModelElement: object;
	readonly state: EngineState;
	readonly enablements?: {
		buttons?: EnablementByButtonName;
	};
}): boolean {
	const { formModelElement, state, enablements } = options;

	if (formModelElement && FormModel.ButtonType.isEventButton(formModelElement)) {
		return isEventButtonDisabled(formModelElement, state, enablements?.buttons);
	} else if (formModelElement && FormModel.ButtonType.isNavigationButton(formModelElement)) {
		return isNavigationButtonDisabled(formModelElement, state, enablements?.buttons);
	}

	return UiStateSelectors.disabled()(state);
}

function isEventButtonDisabled(
	modelElement: FormModel.EventButton,
	state: EngineState,
	byButtonName: EnablementByButtonName = {}
): boolean {
	const buttonDisabled = byButtonName[modelElement.name]?.disabled;
	if (buttonDisabled !== undefined) {
		return buttonDisabled;
	}

	const isDirty = UiStateSelectors.dirty()(state) || DataSelectors.dirty()(state);
	const disabledByDirtyState = modelElement.enablement === "DISABLED" && !isDirty;

	if (disabledByDirtyState) {
		return true;
	}

	const readonly = UiStateSelectors.readonly()(state);

	const disabledByScope = checkScope(readonly, "DISABLED", modelElement.scope);

	return disabledByScope || UiStateSelectors.disabled()(state);
}

function isNavigationButtonDisabled(
	modelElement: FormModel.NavigationButton,
	state: EngineState,
	byButtonName: EnablementByButtonName = {}
): boolean {
	const buttonDisabled = byButtonName[modelElement.name]?.disabled;
	if (buttonDisabled !== undefined) {
		return buttonDisabled;
	}

	const readonly = UiStateSelectors.readonly()(state);

	const disabledByScope = checkScope(readonly, "DISABLED", modelElement.scope);

	return disabledByScope || UiStateSelectors.disabled()(state);
}
