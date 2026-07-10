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
import type { JSX, PropsWithChildren, RefObject } from "react";
import { StyleSheetManager, ThemeProvider } from "styled-components";

import { render } from "@com.mgmtp.a12.devtools/react";
import type { Locale } from "@com.mgmtp.a12.utils/utils-localization";
import {
	defaultDataFormats,
	defaultLocalizerFactory,
	defaultValueConversion
} from "@com.mgmtp.a12.utils/utils-localization";
import type { Localizer } from "@com.mgmtp.a12.utils/utils-localization";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";
import {
	getBaseTheme,
	GlobalStyles,
	shouldForwardProp,
	SizeContext
} from "@com.mgmtp.a12.widgets/widgets-core";
import type { SizeDetectorProps } from "@com.mgmtp.a12.widgets/widgets-core";

import type { EngineStore, Models } from "../../back-end/store/index.js";
import type { PickPartial } from "../../back-end/utils/internal/types.js";
import type { Config, DispatchConfiguration, ScrollApi } from "../../view/index.js";
import {
	DefaultFilterCellMap,
	FilterCellMapContext
} from "../../view/internal/components/form-engine/repeat/components/head/filters/filter-cell-map.js";
import type { FilterCellMap } from "../../view/internal/components/form-engine/repeat/components/head/filters/filter-cell-map.js";
import { TableWidgetMapContext } from "../../view/internal/components/form-engine/repeat/table-widget-map.js";
import type { TableWidgetMap } from "../../view/internal/components/form-engine/repeat/table-widget-map.js";
import { ComponentMapContext } from "../../view/internal/configuration/componentMap/component-map-context.js";
import type { ComponentMap } from "../../view/internal/configuration/componentMap/component-map.js";
import { DefaultComponentMap } from "../../view/internal/configuration/componentMap/DefaultComponentMap.js";
import type { InputMap } from "../../view/internal/configuration/componentMap/input/input-map.js";
import {
	DefaultInputMap,
	InputMapContext
} from "../../view/internal/configuration/componentMap/input/input.js";
import { WidgetMapContext } from "../../view/internal/configuration/widget-map-context.js";
import type { WidgetMap } from "../../view/internal/configuration/widget-map.js";

import { DisableMockComponents } from "../utils/disable-mocks.js";
import { US_LOCALE } from "../utils/localization.js";

import { getWidgetMocks } from "./getWidgetMocks.js";
import { getTableWidgetMocks } from "./table-mocks/getTableMocks.js";

export interface RtlRenderWrapper {
	componentMap: ComponentMap;
	widgetMap: WidgetMap;
	tableMap: TableWidgetMap;
	container: HTMLElement;
	baseElement: HTMLElement;
}

// async version with support for the DISABLE_MOCK_COMPONENTS flag
export const rtlRenderWrapperAsync = (
	content: React.ReactNode,
	options: RtlRenderWrapperOptions = {}
) => DisableMockComponents.render(rtlRenderWrapperCurried(content))(options);

const rtlRenderWrapperCurried = (content: React.ReactNode) => (options: RtlRenderWrapperOptions) =>
	rtlRenderWrapper(content, options);

export interface RtlRenderWrapperOptions {
	locale?: Locale;
	localizer?: Localizer;
	size?: SizeDetectorProps.Size;
	widgetMap?: Partial<WidgetMap>;
	completeWidgetMap?: WidgetMap;
	componentMap?: Partial<ComponentMap>;
	inputMap?: InputMap;
	tableMap?: TableWidgetMap;
	filterCellMap?: FilterCellMap;
	withWidgets?: true;
}

export function rtlRenderWrapper(
	ui: React.ReactNode,
	options?: RtlRenderWrapperOptions
): RtlRenderWrapper {
	const locale = options?.locale ?? US_LOCALE;
	const localizer = options?.localizer ?? defaultLocalizerFactory({ locale });
	const dataFormats = defaultDataFormats(locale);
	const conversion = defaultValueConversion(dataFormats);

	const componentMap = { ...DefaultComponentMap, ...options?.componentMap };

	const inputMap = options?.inputMap ?? DefaultInputMap;

	const tableMap = options?.tableMap ?? getTableWidgetMocks();

	const filterCellMap = options?.filterCellMap ?? DefaultFilterCellMap;

	// when getWidgetMocks is already called in setup, reuse it to avoid
	// multiple (different!) instances of the same mocks! Clean this up!!!!
	const widgetMap = options?.completeWidgetMap ?? {
		...getWidgetMocks(),
		...options?.widgetMap
	};

	const uiWithContexts = (
		<LocalizerContext.Provider value={{ localizer, locale, dataFormats, conversion }}>
			<SizeContext.Provider value={{ currentSize: options?.size }}>
				<ComponentMapContext.Provider value={componentMap}>
					<InputMapContext.Provider value={inputMap}>
						<FilterCellMapContext.Provider value={filterCellMap}>
							<TableWidgetMapContext.Provider value={tableMap}>
								<WidgetMapContext.Provider value={widgetMap}>{ui}</WidgetMapContext.Provider>
							</TableWidgetMapContext.Provider>
						</FilterCellMapContext.Provider>
					</InputMapContext.Provider>
				</ComponentMapContext.Provider>
			</SizeContext.Provider>
		</LocalizerContext.Provider>
	);

	const { container, baseElement } = options?.withWidgets
		? render(<WidgetsContexts>{uiWithContexts}</WidgetsContexts>)
		: render(uiWithContexts);

	return {
		componentMap,
		widgetMap,
		tableMap,
		container,
		baseElement
	};
}

function WidgetsContexts(props: PropsWithChildren): JSX.Element {
	return (
		<StyleSheetManager shouldForwardProp={shouldForwardProp}>
			<ThemeProvider theme={getBaseTheme()}>
				<GlobalStyles />
				{props.children}
			</ThemeProvider>
		</StyleSheetManager>
	);
}

export type ConfigForTest = Partial<PickPartial<Config, "widgetMap">>;

export interface SetupWithRtlOptions {
	readonly models: Models;
	readonly locale?: Locale;
	readonly data?: Partial<EngineStore.DataState>;
	readonly ui?: Partial<EngineStore.UIState>;
	readonly dispatchConfig?: DispatchConfiguration;
	readonly config?: ConfigForTest;
	readonly localizer?: Localizer;
	readonly scrollRef?: RefObject<ScrollApi | null>;
	readonly componentMap?: Partial<ComponentMap>;
	readonly inputMap?: InputMap;
	readonly tableMap?: TableWidgetMap;
	readonly filterCellMap?: FilterCellMap;
	readonly withWidgets?: true;
	readonly size?: SizeDetectorProps.Size;
	readonly AdditionalWrapper?: React.FunctionComponent<PropsWithChildren>;
}
