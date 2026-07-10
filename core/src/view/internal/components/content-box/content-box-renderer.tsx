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

import type { JSX, PropsWithChildren } from "react";
import { useContext } from "react";

import { ComponentMapContext } from "../../configuration/componentMap/component-map-context.js";
import { DefaultComponentMap } from "../../configuration/componentMap/DefaultComponentMap.js";
import { DefaultWidgetMap } from "../../configuration/DefaultWidgetMap.js";
import type { FormModelMap } from "../../configuration/engine-configuration.js";
import { DefaultSelectorMap, SelectorContext } from "../../configuration/selectorContext.js";
import { WidgetMapContext } from "../../configuration/widget-map-context.js";

import type { FormEngineRendererPropsType } from "../form-engine/form-engine-props.js";

import { ContentBox } from "./content-box-component.js";
import type { ContentBoxRenderConfiguration } from "./content-box-render-configuration.js";

type FormEngineContentBoxRendererProps = PropsWithChildren<
	Pick<FormEngineRendererPropsType, "config" | "state" | "eventHandlers">
>;

/**
 * @internal
 * Plain (non-connected) React component to render a content box.
 */
export function FormEngineContentBoxRenderer(
	props: FormEngineContentBoxRendererProps
): JSX.Element {
	const options: FormModelMap.RenderOptions = {
		state: props.state,
		config: props.config,
		eventHandlers: props.eventHandlers
	};

	const initialConfig: ContentBoxRenderConfiguration = {
		renderOptions: options,
		parentPath: []
	};

	const componentMap = useContext(ComponentMapContext) ?? DefaultComponentMap;

	const widgetMap = initialConfig.renderOptions.config.widgetMap ?? DefaultWidgetMap;
	const selectorMap = initialConfig.renderOptions.config.selectorMap ?? DefaultSelectorMap;

	return (
		<ComponentMapContext.Provider value={componentMap}>
			<WidgetMapContext.Provider value={widgetMap}>
				<SelectorContext.Provider value={selectorMap}>
					<ContentBox config={initialConfig}>{props.children}</ContentBox>
				</SelectorContext.Provider>
			</WidgetMapContext.Provider>
		</ComponentMapContext.Provider>
	);
}
