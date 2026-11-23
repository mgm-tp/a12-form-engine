// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX, ReactNode } from "react";
import { useContext } from "react";

import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";

import { ComponentMapContext } from "../../configuration/componentMap/component-map-context.js";
import { DefaultComponentMap } from "../../configuration/componentMap/DefaultComponentMap.js";
import { DefaultWidgetMap } from "../../configuration/DefaultWidgetMap.js";
import { DefaultSelectorMap, SelectorContext } from "../../configuration/selectorContext.js";
import { WidgetMapContext } from "../../configuration/widget-map-context.js";

import type { FormEngineRendererPropsType } from "../form-engine/form-engine-props.js";

import { ContentBox } from "./content-box-component.js";
import type { ContentBoxRenderConfiguration } from "./content-box-render-configuration.js";

/**
 * @internal
 * Plain (non-connected) React component to render a content box.
 */
export function FormEngineContentBoxRenderer(
	props: FormEngineRendererPropsType & { children?: ReactNode }
): JSX.Element {
	// TODO: why do we need to prepare the full config incl. renderOptions here for the contentBox?
	const localizer = useContext(LocalizerContext).localizer;
	const options = {
		state: props.state,
		config: props.config,
		eventHandlers: props.eventHandlers,
		localizer
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
