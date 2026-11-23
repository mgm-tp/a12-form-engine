// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ReactElement } from "react";
import { useContext } from "react";

import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";

import type { WithDataTestId } from "../../../../../back-end/utils/internal/types.js";
import type { FormModel } from "../../../../../models/internal/form-model.js";
import { ComponentMapContext } from "../../../configuration/componentMap/component-map-context.js";
import type { FormModelMap } from "../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../configuration/widget-map-context.js";

import { DataContext } from "../data-context.js";

import { ButtonView } from "./button-view.js";
import { getNavigationButtonProps } from "./getNavigationButtonProps.js";

type NavigationButtonProps = WithDataTestId<{
	readonly modelElement: FormModel.NavigationButton;
	readonly config: FormModelMap.RenderConfiguration;
}>;

/** @internal */
export function NavigationButton(props: NavigationButtonProps): ReactElement | null {
	const widgetMap = useContext(WidgetMapContext);
	const componentMap = useContext(ComponentMapContext);
	const dataContext = useContext(DataContext);
	const { localizer, conversion } = useContext(LocalizerContext);
	const { config, modelElement: button } = props;

	const buttonProps = getNavigationButtonProps({
		button,
		config,
		conversion,
		dataContext,
		localizer,
		widgetMap,
		componentMap
	});

	return (
		buttonProps && (
			<ButtonView
				data-testid={props["data-testid"]}
				modelElement={button}
				buttonProps={buttonProps}
			/>
		)
	);
}
