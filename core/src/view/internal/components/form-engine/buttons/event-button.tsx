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

import type { WithDataTestId } from "../../../../../back-end/utils/internal/types.js";
import type { FormModel } from "../../../../../models/internal/form-model.js";
import { FormModelPath } from "../../../../../models/internal/utils/form-model-path.js";
import { ComponentMapContext } from "../../../configuration/componentMap/component-map-context.js";
import type { FormModelMap } from "../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../configuration/widget-map-context.js";

import { DataContext } from "../data-context.js";

import { ButtonView } from "./button-view.js";
import { getButtonProps } from "./getButtonProps.js";

type EventButtonProps = WithDataTestId<{
	readonly modelElement: FormModel.EventButton;
	readonly config: FormModelMap.RenderConfiguration;
}>;

/** @internal */
export function EventButton(props: EventButtonProps): ReactElement | null {
	const widgetMap = useContext(WidgetMapContext);
	const componentMap = useContext(ComponentMapContext);
	const dataContext = useContext(DataContext);
	const { localizer, conversion } = useContext(LocalizerContext);
	const { config, modelElement: button } = props;
	const { renderOptions, parentPath } = config;

	const buttonProps = getButtonProps({
		button,
		config,
		conversion,
		dataContext,
		localizer,
		widgetMap,
		componentMap
	});

	const onClick = () => {
		const buttonPath = FormModelPath.extend(parentPath, button);
		renderOptions.eventHandlers.onEventButton(button.event ?? "", buttonPath, button.validation);
	};

	return (
		buttonProps && (
			<ButtonView
				data-testid={props["data-testid"]}
				modelElement={button}
				buttonProps={{ ...buttonProps, onClick }}
			/>
		)
	);
}
