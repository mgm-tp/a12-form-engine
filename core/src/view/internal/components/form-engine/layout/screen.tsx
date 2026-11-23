// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ReactElement } from "react";

import { ModelSelectors, UiStateSelectors } from "../../../../../back-end/store/index.js";
import { UiId } from "../../../../../back-end/utils/internal/generateUiId.js";
import { findElementByFormModelPath } from "../../../../../models/index.js";
import { FormModel } from "../../../../../models/internal/form-model.js";
import type { FormModelMap } from "../../../configuration/engine-configuration.js";
import { UtilityClasses } from "../../../utilities/css-classes.js";
import { nmTokensToString } from "../../../utilities/nmtokens.js";

import { DataContext } from "../data-context.js";
import { DETACHED_REPEAT_DETAIL_SCREEN, SCREEN } from "../data-roles.js";
import { createFormModelElement } from "../model-components.js";

import { WarningInfoConfirmation } from "./warning-info-confirmation.js";

/** @internal  */
export function ScreenComponent(props: {
	modelElement: FormModel.Screen;
	config: FormModelMap.RenderConfiguration;
}): ReactElement | null {
	const { modelElement: screen, config } = props;

	const { renderOptions: options } = config;

	const screenLocation = UiStateSelectors.currentScreenLocation()(config.renderOptions.state);
	const screenChildren = screen.screenElements.map(screenElement =>
		createFormModelElement(screenElement, config)
	);

	const isDetachedRepeatDetailScreenOpen = UiStateSelectors.isDetachedRepeatDetailScreenOpen()(
		options.state
	);
	const id = isDetachedRepeatDetailScreenOpen
		? getUiIdForDetachedRepeat(config)
		: UiId.generate({ element: screen, uiIdPrefix: options.config.uiIdPrefix });

	const className = nmTokensToString([UtilityClasses.PADDING]);

	const dataRole = isDetachedRepeatDetailScreenOpen ? DETACHED_REPEAT_DETAIL_SCREEN : SCREEN;

	return (
		<DataContext.Provider value={screenLocation.path}>
			<div className={className} id={id} data-role={dataRole}>
				{screenChildren}
			</div>
			<WarningInfoConfirmation renderOptions={options} />
		</DataContext.Provider>
	);
}

function getUiIdForDetachedRepeat(config: FormModelMap.RenderConfiguration): string {
	const currentScreenLocation = UiStateSelectors.currentScreenLocation()(
		config.renderOptions.state
	);
	const detachedRepeatPath = currentScreenLocation.locationPath.slice(
		0,
		currentScreenLocation.locationPath.length - 1
	);
	const detachedRepeat = findElementByFormModelPath(
		ModelSelectors.formModel()(config.renderOptions.state),
		detachedRepeatPath
	);

	const drId =
		detachedRepeat && FormModel.DetachedRepeat.isInstance(detachedRepeat)
			? UiId.generate({ element: detachedRepeat })
			: "";

	return UiId.generateForDetachedRepeatScreen({
		repeatId: drId,
		uiIdPrefix: config.renderOptions.config.uiIdPrefix
	});
}
