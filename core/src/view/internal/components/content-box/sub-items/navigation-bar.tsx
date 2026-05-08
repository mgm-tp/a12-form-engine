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

import type { ReactElement } from "react";
import { useContext } from "react";

import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";

import { UiStateSelectors } from "../../../../../back-end/store/index.js";
import { ModelSelectors } from "../../../../../back-end/store/internal/selectors/models.js";
import { FormModel } from "../../../../../models/index.js";
import { ComponentMapContext } from "../../../configuration/componentMap/component-map-context.js";
import { WidgetMapContext } from "../../../configuration/widget-map-context.js";
import { getNavigationButtonProps } from "../../form-engine/buttons/getNavigationButtonProps.js";
import { DataContext } from "../../form-engine/data-context.js";

import type { ContentBoxRenderConfiguration } from "../content-box-render-configuration.js";

import { getButtonsFromHeaderFooterType, isNotNull } from "./utils.js";

/** @internal */
export type NavigationBarProps = {
	readonly element?: FormModel.HeaderFooterType;
	readonly config: ContentBoxRenderConfiguration;
};

/** @internal */
export function NavigationBar({ element, config }: NavigationBarProps): ReactElement | null {
	const { renderOptions } = config;
	const widgetMap = useContext(WidgetMapContext);
	const componentMap = useContext(ComponentMapContext);
	const { ContentBoxNavigationBar } = componentMap;
	const dataContext = useContext(DataContext);
	const { localizer, conversion } = useContext(LocalizerContext);

	const currentScreenLocation = UiStateSelectors.currentScreenLocation()(
		config.renderOptions.state
	);
	const currentLocationPath = currentScreenLocation.locationPath;
	const { subHeaderBox } = ModelSelectors.formModel()(renderOptions.state).content;

	const navItems = [
		// All navigation buttons provided by the form subHeaderBox
		...getButtonsFromHeaderFooterType(subHeaderBox)
			.filter(FormModel.ButtonType.isNavigationButton)
			.map(button =>
				getNavigationButtonProps({
					button,
					config: { ...config, parentPath: [{ elementName: subHeaderBox.id }] },
					dataContext,
					localizer,
					conversion,
					widgetMap,
					componentMap
				})
			)
			.filter(isNotNull),
		// All navigation buttons provided by the screen subHeaderBox
		...getButtonsFromHeaderFooterType(element)
			.filter(FormModel.ButtonType.isNavigationButton)
			.map(button =>
				getNavigationButtonProps({
					button,
					config: {
						...config,
						parentPath: [...currentLocationPath, { elementName: subHeaderBox.id }]
					},
					dataContext,
					localizer,
					conversion,
					widgetMap,
					componentMap
				})
			)
			.filter(isNotNull)
	];

	return navItems.length > 0 ? <ContentBoxNavigationBar navItems={navItems} /> : null;
}
