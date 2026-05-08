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

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type {
	Localizer,
	ValueConversion
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import type { ButtonProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/main/button.api.js";
import type { MenuItem } from "@com.mgmtp.a12.widgets/widgets-core/lib/menu/main/menu.api.js";

import { ModelSelectors } from "../../../../../back-end/store/internal/selectors/models.js";
import { UiStateSelectors } from "../../../../../back-end/store/internal/selectors/ui-state.js";
import type { FormModel } from "../../../../../models/index.js";
import { calcTargetScreenName } from "../../../../../models/internal/utils/targetScreenName.js";
import type { ComponentMap } from "../../../configuration/componentMap/component-map.js";
import type { FormModelMap } from "../../../configuration/engine-configuration.js";
import type { WidgetMap } from "../../../configuration/widget-map.js";
import type { ContentBoxRenderConfiguration } from "../../content-box/content-box-render-configuration.js";

import { getTitleLabel } from "../model-element-labels.js";

import type { ButtonMenuProps } from "./getButtonProps.js";
import { getButtonProps } from "./getButtonProps.js";

/**
 * @internal
 */
export type NavigationMenuProps = ButtonMenuProps &
	Pick<ButtonProps | MenuItem, "onClick"> &
	Pick<MenuItem, "selected">;

/**
 * @internal
 * Returns the props that menu items and navigation buttons have in common (+ "selected" and "ariaLabel" from menu).
 * Returns null if the button should not be rendered (e.g it is hidden)
 */
export function getNavigationButtonProps(props: {
	button: FormModel.NavigationButton;
	config: ContentBoxRenderConfiguration;
	dataContext: EntityInstancePath;
	localizer: Localizer;
	conversion: ValueConversion;
	widgetMap: WidgetMap;
	componentMap: ComponentMap;
}): NavigationMenuProps | null {
	const { button, config, localizer, conversion, componentMap } = props;
	const { renderOptions } = config;

	const formModel = ModelSelectors.formModel()(renderOptions.state);
	const currentScreenLocation = UiStateSelectors.currentScreenLocation()(renderOptions.state);
	const currentScreenPath = currentScreenLocation.locationPath;
	const screenName = currentScreenPath[0].elementName;
	const screenId = findIdOfCurrentScreen(screenName, formModel);
	const fallbackLabel = findTargetScreenTitle(
		screenName,
		button.target,
		formModel,
		renderOptions,
		localizer,
		conversion,
		componentMap
	);

	const buttonProps = getButtonProps({ ...props, fallbackLabel });
	if (!buttonProps) {
		return null;
	}

	const inCorrectionMode =
		UiStateSelectors.correctionModeBackup()(renderOptions.state) !== undefined;
	const isCurrentScreen = button.target ? button.target === screenId : false;
	const disableButton =
		(inCorrectionMode && !isCurrentScreen) ||
		UiStateSelectors.screenLocationStack()(renderOptions.state).length > 1;

	return {
		...buttonProps,
		selected: isCurrentScreen,
		disabled: disableButton || buttonProps.disabled,
		onClick: () => {
			renderOptions.eventHandlers.onNavigationButton(button.target, button.validation);
		}
	};
}

function findIdOfCurrentScreen(screenName: string, formModel: FormModel): string | undefined {
	const screen = formModel.content.screens.find(s => s.name === screenName);
	return screen?.id;
}

function findTargetScreenTitle(
	currentScreenName: string,
	target: FormModel.NavigationButtonTarget,
	formModel: FormModel,
	options: FormModelMap.RenderOptions,
	localizer: Localizer,
	converter: ValueConversion,
	componentMap: ComponentMap
): string | undefined {
	const targetScreenName = calcTargetScreenName(currentScreenName, target, formModel);
	const targetScreen = formModel.content.screens.find(s => s.name === targetScreenName);
	if (targetScreen) {
		const formModelPath = ModelPath.fromString(`/${targetScreen.name}`);
		// for screens it is always the root context
		const dataContext: EntityInstancePath = [];
		return getTitleLabel(
			options,
			targetScreen,
			formModelPath,
			dataContext,
			localizer,
			converter,
			componentMap,
			false
		);
	} else {
		return undefined;
	}
}
