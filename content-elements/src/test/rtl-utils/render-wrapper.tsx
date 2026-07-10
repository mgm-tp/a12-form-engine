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

import { renderHook } from "@testing-library/react";
import type { RenderHookResult } from "@testing-library/react";
import { Provider } from "react-redux";

import {
	ContentEngineContextProvider,
	DocumentPathContextProvider
} from "@com.mgmtp.a12.contentengine/contentengine-core";
import { render } from "@com.mgmtp.a12.devtools/react";

import type { ComponentMap } from "../../main/core/contentElements/componentMap/componentMap.js";
import { ComponentMapContext } from "../../main/core/contentElements/componentMap/componentMapContext.js";
import type { FunctionMap } from "../../main/core/contentElements/functionMap/functionMap.js";
import { FunctionMapContext } from "../../main/core/contentElements/functionMap/functionMapContext.js";
import type { WidgetMap } from "../../main/core/index.js";
import { WidgetMapContext } from "../../main/core/index.js";

import { mockStore } from "../mocks/mockStore.js";

import { getComponentMocks } from "./getComponentMocks.js";
import { getFunctionMocks } from "./getFunctionMocks.js";
import { getWidgetMocks } from "./getWidgetMocks.js";

export interface RenderWrapper {
	widgetMap: WidgetMap;
	componentMap: ComponentMap;
	functionMap: FunctionMap;
	container: HTMLElement;
	baseElement: HTMLElement;
}

export function renderWrapper(
	ui: React.ReactNode,
	options?: {
		widgetMap?: Partial<WidgetMap>;
		componentMap?: Partial<ComponentMap>;
		functionMap?: Partial<FunctionMap>;
	}
): RenderWrapper {
	const componentMap = {
		...getComponentMocks(),
		...options?.componentMap
	};
	const widgetMap = {
		...getWidgetMocks(),
		...options?.widgetMap
	};
	const functionMap = {
		...getFunctionMocks(),
		...options?.functionMap
	};

	const { container, baseElement } = render(
		<Provider store={mockStore()}>
			<ContentEngineContextProvider libraryId={""} size="lg">
				<DocumentPathContextProvider groupPath={""}>
					<ComponentMapContext.Provider value={componentMap}>
						<FunctionMapContext.Provider value={functionMap}>
							<WidgetMapContext.Provider value={widgetMap}>{ui}</WidgetMapContext.Provider>
						</FunctionMapContext.Provider>
					</ComponentMapContext.Provider>
				</DocumentPathContextProvider>
			</ContentEngineContextProvider>
		</Provider>
	);

	return {
		widgetMap,
		componentMap,
		functionMap,
		container,
		baseElement
	};
}

export function renderHookWrapper<T>(
	render: () => T,
	options?: {
		widgetMap?: Partial<WidgetMap>;
		componentMap?: Partial<ComponentMap>;
		functionMap?: Partial<FunctionMap>;
	}
): RenderHookResult<T, unknown> {
	const componentMap = {
		...getComponentMocks(),
		...options?.componentMap
	};
	const widgetMap = {
		...getWidgetMocks(),
		...options?.widgetMap
	};
	const functionMap = {
		...getFunctionMocks(),
		...options?.functionMap
	};

	return renderHook(render, {
		wrapper: ({ children }) => (
			<Provider store={mockStore()}>
				<ContentEngineContextProvider libraryId={""} size="lg">
					<DocumentPathContextProvider groupPath={""}>
						<ComponentMapContext.Provider value={componentMap}>
							<FunctionMapContext.Provider value={functionMap}>
								<WidgetMapContext.Provider value={widgetMap}>{children}</WidgetMapContext.Provider>
							</FunctionMapContext.Provider>
						</ComponentMapContext.Provider>
					</DocumentPathContextProvider>
				</ContentEngineContextProvider>
			</Provider>
		)
	});
}
