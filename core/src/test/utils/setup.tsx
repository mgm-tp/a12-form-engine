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

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { mock } from "node:test";

import { type ComponentType, type PropsWithChildren } from "react";
import { connect, Provider } from "react-redux";
import type { Middleware, Store } from "redux";
import { applyMiddleware, compose, legacy_createStore as createStore } from "redux";

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type {
	DocumentModel,
	GroupInstance,
	ICustomConditionFactory
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { DocumentRtCustomExtensionService } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import {
	DocumentServiceFactory,
	GeneratedCodeAccessorFactory
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/facade.js";
import type { Locale, Localizer } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import { defaultLocalizerFactory } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import type { SizeDetectorProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/layout/size-detector/main/size-detector.api.js";

import type { EngineState, EngineStore, MiddlewareOptions } from "../../back-end/store/index.js";
import {
	createCombinedReducer,
	createEngineMiddlewares,
	createEngineStore
} from "../../back-end/store/index.js";
import type { Models } from "../../back-end/store/internal/store.js";
import type { FormModel } from "../../models/index.js";
import { defaultValueParser, unmarshallFormModel } from "../../models/index.js";
import type {
	Config,
	DefaultDispatchProps,
	DefaultOwnProps,
	DefaultStateProps,
	DispatchConfiguration,
	FormEngineRendererPropsType,
	FormModelMap,
	ScrollHandlerProps,
	WidgetMap
} from "../../view/index.js";
import {
	defaultMapDispatchToProps,
	defaultMapStateToProps,
	DefaultWidgetMap,
	FormEngineRenderer,
	ScrollHandler
} from "../../view/index.js";
import { FormEngineContentBoxRenderer } from "../../view/internal/components/content-box/content-box-renderer.js";
import { DefaultComponentMap } from "../../view/internal/configuration/componentMap/DefaultComponentMap.js";
import { createConfig, DefaultFormModelMap } from "../../view/internal/configuration/Defaults.js";

import { getWidgetMocks } from "../rtl-utils/getWidgetMocks.js";
import type { RtlRenderWrapper, SetupWithRtlOptions } from "../rtl-utils/render-wrapper.js";
import { rtlRenderWrapper } from "../rtl-utils/render-wrapper.js";

import { DisableMockComponents } from "./disable-mocks.js";
import { US_LOCALE } from "./localization.js";
import { DATA_DIR_NAME, MODEL_DIR_NAME } from "./paths.js";

export namespace SetupHelpers {
	export type JsonAdapter = (json: FormModel) => FormModel;

	export function loadModels(group: string, form?: string, jsonAdapter?: JsonAdapter): Models {
		const documentModelCode = readFileSync(join(MODEL_DIR_NAME, `${group}-document.json`), {
			encoding: "utf-8"
		});
		const documentModel = new DocumentServiceFactory()
			.getDocumentModelSerializer()
			.deserialize(documentModelCode);

		const validationCode = readFileSync(join(MODEL_DIR_NAME, `${group}-document.validation.js`), {
			encoding: "utf-8"
		});
		const validatorProvider = new GeneratedCodeAccessorFactory().createScriptAccessor(
			validationCode
		);

		const formName = form ? `${group}.${form}-form.json` : `${group}-form.json`;
		const formEngineCode = readFileSync(join(MODEL_DIR_NAME, formName), {
			encoding: "utf-8"
		});

		const formModelJson = JSON.parse(formEngineCode) as FormModel;

		const formModel = unmarshallFormModel(
			jsonAdapter?.(formModelJson) ?? formModelJson,
			documentModel,
			defaultValueParser(documentModel)
		);

		return { documentModel, validatorProvider, formModel };
	}

	export function loadData(
		group: string,
		name: string,
		documentModel: DocumentModel
	): GroupInstance {
		const docJson = readFileSync(join(DATA_DIR_NAME, `${group}-${name}.json`), {
			encoding: "utf-8"
		});
		return new DocumentServiceFactory()
			.getDocumentService()
			.parseDates(JSON.parse(docJson), documentModel) as GroupInstance;
	}

	export interface SetupParams {
		readonly storeConfig: StoreConfig;
		readonly middlewares?: Middleware[];
		readonly middlewareOptions?: Partial<MiddlewareOptions>;
		readonly customConditionsFactory?: ICustomConditionFactory;
		readonly uiConfig?: Partial<Config>;
		readonly mountInDOM?: boolean;
		readonly dispatchConfig?: Partial<DispatchConfiguration>;
		readonly disableRepeatBehavior?: boolean;
		readonly disableScrollToTopLevelScreen?: boolean;
		readonly size?: SizeDetectorProps.Size;
		readonly localizer?: Localizer;
	}

	export interface StoreConfig {
		readonly store?: Store<EngineState>;
		readonly locale?: Locale;
		readonly data?: Partial<EngineStore.DataState>;
		readonly models?: Models;
		readonly ui?: Partial<EngineStore.UIState>;
	}

	export function createTestStore({
		storeConfig,
		middlewares = [],
		middlewareOptions,
		customConditionsFactory
	}: SetupParams): Store<EngineState> {
		const config = {
			...storeConfig,
			models: storeConfig.models ?? ({ formModel: {}, documentModel: {} } as Models),
			locale: storeConfig.locale ?? US_LOCALE,
			data: storeConfig.data ?? {}
		};

		if (customConditionsFactory) {
			// TODO: will be fixed with A12-16990
			// eslint-disable-next-line @typescript-eslint/no-deprecated
			DocumentRtCustomExtensionService.registerCustomConditions(customConditionsFactory);
		}

		const initialState = createEngineStore(config);
		const engineReducer = createCombinedReducer(initialState);
		const storeEnhancer = applyMiddleware(
			...middlewares,
			...createEngineMiddlewares({ externalEnumerationProvider: () => ({}), ...middlewareOptions })
		);
		return createStore(engineReducer, initialState, compose(storeEnhancer));
	}

	export function setupRenderConfiguration(options: {
		readonly models: Models;
		readonly locale?: Locale;
		readonly data?: Partial<EngineStore.DataState>;
		readonly ui?: Partial<EngineStore.UIState>;
		readonly dispatchConfig?: DispatchConfiguration;
		readonly config?: Partial<Config>;
		readonly parentPath?: ModelPath;
	}): FormModelMap.RenderConfiguration {
		const locale = options.locale ?? US_LOCALE;
		const state = createEngineStore({
			data: options.data ?? {},
			locale,
			models: options.models,
			ui: options.ui
		});

		return {
			renderOptions: {
				config: createConfig(options.config ?? {}, state),
				state,
				eventHandlers: options.dispatchConfig ?? defaultMapDispatchToProps(mock.fn()).eventHandlers
			},
			parentPath: options.parentPath ?? []
		};
	}

	export interface ConnectedRtlOptions extends SetupWithRtlOptions {
		readonly withScrollHandler?: true;
		readonly scrollHandlerOptions?: Partial<ScrollHandlerProps>;
		readonly middlewares?: Middleware[];
		readonly store?: Store<EngineState>;
	}

	export interface ConnectedRtlWrapper extends RtlRenderWrapper {
		readonly store: Store<EngineState>;
	}

	export function setupConnectedFormEngineWithRtl(
		options: ConnectedRtlOptions
	): ConnectedRtlWrapper {
		const store =
			options.store ?? createTestStore({ storeConfig: options, middlewares: options.middlewares });
		const ScrollHandler = (props: PropsWithChildren) => {
			return options.withScrollHandler ? (
				<ScrollHandlerConnected
					uiIdPrefix={options.config?.uiIdPrefix}
					{...options.scrollHandlerOptions}
				>
					{props.children}
				</ScrollHandlerConnected>
			) : (
				props.children
			);
		};
		const AdditionalWrapper = (props: PropsWithChildren) => (
			<Provider store={store}>
				<ScrollHandler>{props.children}</ScrollHandler>
			</Provider>
		);
		const CustomEngine = (props: FormEngineRendererPropsType) => (
			<EngineConnected {...props} customEventHandlers={options.dispatchConfig} />
		);
		return {
			store,
			...setupComponentWithRtl(CustomEngine, { ...options, AdditionalWrapper })
		};
	}

	// unfortunately, these need to be separate (async) functions
	export const setupFormEngineRendererWithRtlAsync = DisableMockComponents.render(
		(options: SetupWithRtlOptions) => setupComponentWithRtl(FormEngineRenderer, options)
	);

	export const setupContentBoxRendererWithRtlAsync = DisableMockComponents.render(
		(options: SetupWithRtlOptions) => setupComponentWithRtl(FormEngineContentBoxRenderer, options)
	);

	export const setupConnectedFormEngineWithRtlAsync = DisableMockComponents.render(
		setupConnectedFormEngineWithRtl
	);
	// <-- end

	export function setupFormEngineRendererWithRtl(options: SetupWithRtlOptions): RtlRenderWrapper {
		return setupComponentWithRtl(FormEngineRenderer, options);
	}

	export function setupContentBoxRendererWithRtl(options: SetupWithRtlOptions): RtlRenderWrapper {
		return setupComponentWithRtl(FormEngineContentBoxRenderer, options);
	}

	function setupComponentWithRtl(
		Component: ComponentType<FormEngineRendererPropsType>,
		options: SetupWithRtlOptions
	): RtlRenderWrapper {
		const definiteLocale = options.locale ?? US_LOCALE;
		const state = createEngineStore({
			data: options.data ?? {},
			locale: definiteLocale,
			models: options.models,
			ui: options.ui
		});

		const localizer = options.localizer ?? defaultLocalizerFactory({ locale: definiteLocale });

		const widgetMap: WidgetMap = {
			...getWidgetMocks(),
			...options.config?.widgetMap
		};

		const partialConfig: Partial<Config> = {
			...options.config,
			widgetMap
		};

		const component = (
			<Component
				state={state}
				config={createConfig(partialConfig, state)}
				eventHandlers={options.dispatchConfig ?? defaultMapDispatchToProps(mock.fn()).eventHandlers}
				scrollRef={options.scrollRef}
			/>
		);

		return rtlRenderWrapper(
			options.AdditionalWrapper ? (
				<options.AdditionalWrapper>{component}</options.AdditionalWrapper>
			) : (
				component
			),
			{
				localizer,
				componentMap: options.componentMap,
				inputMap: options.inputMap,
				tableMap: options.tableMap,
				completeWidgetMap: widgetMap,
				withWidgets: options.withWidgets,
				size: options.size
			}
		);
	}

	export function createRepeatInstanceStateEntry(
		options: Partial<EngineStore.Repeat.InstanceState>
	): EngineStore.Repeat.InstanceState {
		return {
			newRow: options.newRow
				? {
						rowState: options.newRow.rowState ? options.newRow.rowState : "workingOn",
						rowPath: options.newRow?.rowPath
					}
				: undefined,
			page: options.page ?? 1,
			expandedRowPath: options.expandedRowPath
		};
	}

	export function createRepeatStaticStateEntry(
		options: Partial<EngineStore.Repeat.StaticState>
	): EngineStore.Repeat.StaticState {
		return {
			sortingState: {
				orderPath: options.sortingState?.orderPath ?? [{ elementName: "path" }],
				sorting: options.sortingState?.sorting ?? "asc"
			},
			filters: options.filters,
			filterRowOpen: options.filterRowOpen
		};
	}

	function scrollHandlerMapStateToProps(
		state: EngineState,
		ownProps: PropsWithChildren<Partial<ScrollHandlerProps>>
	): ScrollHandlerProps {
		return {
			uiState: state.ui,
			models: state.models,
			uiIdPrefix: ownProps.uiIdPrefix,
			...ownProps
		};
	}

	const ScrollHandlerConnected = connect(scrollHandlerMapStateToProps)(ScrollHandler);

	type CustomOwnProps = DefaultOwnProps & { customEventHandlers?: Partial<DispatchConfiguration> };

	const EngineConnected = connect<
		DefaultStateProps,
		DefaultDispatchProps,
		CustomOwnProps,
		EngineState
	>(defaultMapStateToProps, function mapDispatchToProps(dispatch, ownProps) {
		return {
			eventHandlers: {
				...defaultMapDispatchToProps(dispatch).eventHandlers,
				...ownProps.customEventHandlers
			}
		};
	})(FormEngineRenderer);

	/**
	 * Can be used in a rtl unit test where the subtree of the component under test is irrelevant.
	 */
	export function stubDefaultComponentMap(): void {
		for (const key of Object.keys(DefaultComponentMap) as (keyof typeof DefaultComponentMap)[]) {
			mock.method(DefaultComponentMap, key, () => <></>);
		}
	}

	/**
	 * Can be used in a rtl unit test by setting the DefaultWidgetMap as value of a widgetMapContext provider,
	 * when the subtree of the component under test is irrelevant.
	 */
	export function stubDefaultWidgetMap(): void {
		for (const key of Object.keys(DefaultWidgetMap) as (keyof WidgetMap)[]) {
			mock.method(DefaultWidgetMap, key, () => <></>);
		}
	}

	/**
	 * Can be used in a rtl unit test, when the subtree of the component under test is irrelevant.
	 */
	export function stubFormModelMap(): void {
		for (const key of Object.keys(DefaultFormModelMap) as (keyof FormModelMap)[]) {
			mock.method(DefaultFormModelMap[key], "component", () => <></>);
		}
	}
}

export function createScreenLocationMock(): ReadonlyArray<EngineStore.ScreenState> {
	return [
		{
			locationPath: [
				{
					elementName: "Screen1"
				}
			],
			path: []
		}
	];
}
