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
