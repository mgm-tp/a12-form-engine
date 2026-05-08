/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * Dual License
 * ------------
 * This source file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License – EUPL v1.2
 *    You may redistribute and/or modify this file under the terms of the
 *    European Union Public License, version 1.2 - see https://eupl.eu/.
 *
 * 2. Commercial License
 *    Alternatively, you may obtain a commercial license from
 *    mgm technology partners GmbH, that permits use of this software
 *    under different terms (including support and maintenance services).
 *
 *    Please contact a12-license@mgm-tp.com for more information.
 *
 * You must select and comply with exactly one of the above license options.
 *
 * Warranty Disclaimer (applies to either option)
 * ----------------------------------------------
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */

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
