// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type {
	Localizer,
	ValueConversion
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import type { ButtonProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/main/button.api.js";
import type { MenuItem } from "@com.mgmtp.a12.widgets/widgets-core/lib/menu/main/menu.api.js";

import { UiId } from "../../../../../back-end/utils/internal/generateUiId.js";
import type { RequiredButUndefined } from "../../../../../back-end/utils/internal/types.js";
import { FormModel, FormModelPath } from "../../../../../models/index.js";
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
		className: FormModel.stylableToClassName(button.buttonStyling),
		labelHidden: button.buttonStyling?.labelHidden
	};
}
