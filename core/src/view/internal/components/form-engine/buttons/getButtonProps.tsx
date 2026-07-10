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

import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import type { Localizer, ValueConversion } from "@com.mgmtp.a12.utils/utils-localization";
import type { ButtonProps, MenuItem } from "@com.mgmtp.a12.widgets/widgets-core";

import { UiId } from "../../../../../back-end/utils/internal/generateUiId.js";
import type { RequiredButUndefined } from "../../../../../back-end/utils/internal/types.js";
import type { FormModel } from "../../../../../models/index.js";
import { FormModelPath } from "../../../../../models/index.js";
import { stylableToClassName } from "../../../../../models/internal/stylableToClassName.js";
import type { ComponentMap } from "../../../configuration/componentMap/component-map.js";
import type { WidgetMap } from "../../../configuration/widget-map.js";
import { isDisabled } from "../../../utilities/enablements/disabled.js";
import { isHidden } from "../../../utilities/enablements/hidden.js";
import type { ContentBoxRenderConfiguration } from "../../content-box/content-box-render-configuration.js";

import {
	calculateAriaLabel,
	getDescription,
	getLabel,
	getLabelAsHtml
} from "../model-element-labels.js";

/**
 * @internal
 */
export type ButtonMenuProps = Pick<
	ButtonProps | MenuItem,
	"id" | "title" | "icon" | "disabled" | "className" | "labelHidden"
> &
	RequiredButUndefined<Pick<ButtonProps | MenuItem, "label">> &
	Pick<MenuItem, "ariaLabel">;

/**
 * @internal
 * Returns the props that menu items and buttons have in common (+ "ariaLabel" from menu).
 * Returns null if the button should not be rendered (e.g it is hidden).
 */
export function getButtonProps(props: {
	button: FormModel.ButtonType;
	config: ContentBoxRenderConfiguration;
	dataContext: EntityInstancePath;
	localizer: Localizer;
	conversion: ValueConversion;
	widgetMap: WidgetMap;
	componentMap: ComponentMap;
	fallbackLabel?: string;
}): ButtonMenuProps | null {
	const {
		button,
		config,
		dataContext,
		localizer,
		conversion,
		widgetMap,
		fallbackLabel,
		componentMap
	} = props;
	const { renderOptions } = config;
	const { Icon } = widgetMap;
	const { HtmlTextSpan } = componentMap;

	const hidden = isHidden({
		formModelElement: button,
		dataContext,
		state: renderOptions.state,
		enablements: { buttons: renderOptions.config.enablements?.byButtonName }
	});
	if (hidden) {
		return null;
	}

	const icon = button.buttonStyling?.icon ? (
		<Icon iconTheme={button.buttonStyling.icon.theme}>{button.buttonStyling.icon.name}</Icon>
	) : undefined;

	const formModelPath = FormModelPath.extend(config.parentPath, button);
	const label = getLabel({
		options: renderOptions,
		element: button,
		formModelPath,
		dataContext,
		localizer,
		converter: conversion
	});
	const labelAsHtml = getLabelAsHtml(label, button, componentMap);

	const description = getDescription({
		options: renderOptions,
		element: button,
		formModelPath,
		localizer
	});

	const id = UiId.generate({ element: button, uiIdPrefix: renderOptions.config.uiIdPrefix });

	const disabled = isDisabled({
		formModelElement: button,
		state: renderOptions.state,
		enablements: { buttons: renderOptions.config.enablements?.byButtonName }
	});

	return {
		id,
		// fallbackLabel comes from the screen, which can be an expression (HTML)
		label:
			labelAsHtml ||
			(fallbackLabel && <HtmlTextSpan content={fallbackLabel} data-testid={`${id}-label`} />),
		title: icon && button.buttonStyling?.labelHidden ? (description ?? label) : description,
		ariaLabel: calculateAriaLabel({ label, description, fallbackLabel }),
		icon,
		disabled,
		className: stylableToClassName(button.buttonStyling),
		labelHidden: button.buttonStyling?.labelHidden
	};
}
