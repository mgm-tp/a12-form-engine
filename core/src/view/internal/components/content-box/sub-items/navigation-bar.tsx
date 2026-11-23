// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
