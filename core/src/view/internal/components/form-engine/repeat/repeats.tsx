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
 * 1. Open-Source License - EUPL v1.2
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

import type { ReactElement } from "react";

import type { Selector } from "../../../../../back-end/store/internal/selectors/selectors.js";
import { UiStateSelectors } from "../../../../../back-end/store/internal/selectors/ui-state.js";
import type { FormModel } from "../../../../../models/index.js";
import { FormModelPath } from "../../../../../models/internal/utils/form-model-path.js";
import type { FormModelMap } from "../../../configuration/engine-configuration.js";
import { isHidden } from "../../../utilities/enablements/hidden.js";
import { isReadonly } from "../../../utilities/enablements/readonly.js";

import { DetachedRepeat as DR } from "./detached/detached-repeat.js";
import { EmbeddedRepeat as ER } from "./embedded/embedded-repeat.js";
import { InlineRepeat as IR } from "./inline/inline-repeat.js";

/**
 * @internal
 *
 * Maps an InlineRepeat from the Form-Model to a RenderModel.Div element
 */
export function InlineRepeat(props: {
	modelElement: FormModel.InlineRepeat;
	config: FormModelMap.RenderConfiguration;
}): ReactElement | null {
	const newConfig = updateConfig(props.modelElement, props.config);
	return repeatIsVisible(props.modelElement, props.config) ? (
		<IR
			modelElement={props.modelElement}
			config={newConfig}
			disabled={disabled()(newConfig.renderOptions.state)}
			readonly={readonly(newConfig)}
		/>
	) : null;
}

/**
 * @internal
 *
 * Maps a DetachedRepeat from the Form-Model to a RenderModel.Div element
 */
export function DetachedRepeat(props: {
	modelElement: FormModel.DetachedRepeat;
	config: FormModelMap.RenderConfiguration;
}): ReactElement | null {
	const newConfig = updateConfig(props.modelElement, props.config);
	return repeatIsVisible(props.modelElement, props.config) ? (
		<DR
			modelElement={props.modelElement}
			config={newConfig}
			disabled={disabled()(newConfig.renderOptions.state)}
			readonly={readonly(newConfig)}
		/>
	) : null;
}

/**
 * @internal
 *
 * Maps an EmbeddedRepeat from the Form-Model to a RenderModel.Div element
 */
export function EmbeddedRepeat(props: {
	modelElement: FormModel.EmbeddedRepeat;
	config: FormModelMap.RenderConfiguration;
}): ReactElement | null {
	const newConfig = updateConfig(props.modelElement, props.config);
	return repeatIsVisible(props.modelElement, props.config) ? (
		<ER
			modelElement={props.modelElement}
			config={newConfig}
			disabled={disabled()(newConfig.renderOptions.state)}
			readonly={readonly(newConfig)}
		/>
	) : null;
}

function repeatIsVisible(
	modelElement: FormModel.Repeat,
	config: FormModelMap.RenderConfiguration
): boolean {
	const currentScreen = UiStateSelectors.currentScreenLocation()(config.renderOptions.state);
	return !isHidden({
		formModelElement: modelElement,
		dataContext: currentScreen.path,
		state: config.renderOptions.state
	});
}

function updateConfig(
	repeat: FormModel.Repeat,
	config: FormModelMap.RenderConfiguration
): FormModelMap.RenderConfiguration {
	const repeatFormModelPath = FormModelPath.extend(config.parentPath, repeat);
	return { ...config, parentPath: repeatFormModelPath };
}

function readonly(config: FormModelMap.RenderConfiguration): boolean {
	const { renderOptions: options, parentPath: repeatFormModelPath } = config;

	const currentScreen = UiStateSelectors.currentScreenLocation()(options.state);
	const dataContext = currentScreen.path;

	return isReadonly({
		formModelPath: repeatFormModelPath,
		dataContext,
		state: options.state
	});
}

function disabled(): Selector<boolean> {
	return state =>
		UiStateSelectors.disabled()(state) ||
		UiStateSelectors.correctionModeBackup()(state) !== undefined;
}
