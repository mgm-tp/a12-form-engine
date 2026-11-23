// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX, PropsWithChildren } from "react";

import { ComponentMapContext } from "../core/contentElements/componentMap/componentMapContext.js";
import { DefaultComponentMap } from "../core/contentElements/componentMap/defaultComponentMap.js";
import { DefaultFunctionMap } from "../core/contentElements/functionMap/defaultFunctionMap.js";
import { FunctionMapContext } from "../core/contentElements/functionMap/functionMapContext.js";
import type { FormElementConfig, WidgetMap } from "../core/index.js";
import { FormElementContext, WidgetMapContext } from "../core/index.js";
import { DefaultWidgetMap } from "../defaultRender/defaultWidgetMap.js";

export interface FormElementContextsProviderProps extends PropsWithChildren {
	/** Name of the content model being rendered. */
	readonly contentModelName: string;
	/** Form element configuration. Defaults to `{ timeMode: "12h" }` if not provided. */
	readonly configuration?: FormElementConfig;
	/** Widget map to use for rendering. Defaults to {@link DefaultWidgetMap} if not provided. */
	readonly widgetMap?: WidgetMap;
}

/** Provides all React contexts required for rendering form content elements. */
export function FormElementContextsProvider({
	children,
	contentModelName,
	configuration,
	widgetMap
}: FormElementContextsProviderProps): JSX.Element {
	return (
		<FormElementContext.Provider
			value={{ contentModelName, config: configuration ?? { timeMode: "12h" } }}
		>
			<WidgetMapContext.Provider value={widgetMap ?? DefaultWidgetMap}>
				<ComponentMapContext.Provider value={DefaultComponentMap}>
					<FunctionMapContext.Provider value={DefaultFunctionMap}>
						{children}
					</FunctionMapContext.Provider>
				</ComponentMapContext.Provider>
			</WidgetMapContext.Provider>
		</FormElementContext.Provider>
	);
}
