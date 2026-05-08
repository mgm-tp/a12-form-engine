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

import { lazy, Suspense } from "react";
import { useSelector } from "react-redux";

import type { Activity } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import type { DynamicConfiguration } from "@com.mgmtp.a12.client/client-core/lib/core/configurationNG/index.js";
import type { DataProvider } from "@com.mgmtp.a12.client/client-core/lib/core/data/index.js";
import { NullRegionLayoutNG } from "@com.mgmtp.a12.client/client-core/lib/core/frame/index.js";
import type { ViewNGProps } from "@com.mgmtp.a12.client/client-core/lib/core/view/index.js";
import type { FormActivity, Config } from "@com.mgmtp.a12.formengine/formengine-core";
import {
	createDefaultMiddlewareOptions,
	formEngineDataReducers,
	formEngineSagas,
	FormEngineViews
} from "@com.mgmtp.a12.formengine/formengine-core";

import { devappAttachmentLoader } from "../backend/devappAttachmentLoader.js";
import { instancesLoadingSaga } from "../config/instancesLoadingSaga.js";
import { externalEnumerationProvider } from "../customizations/configurable_externalenumeration.js";
import { CustomSelectorMap } from "../customizations/customSelectorMap.js";
import { createPreviewFormEngineMiddlewares, nowProvider, previewReducers } from "../shared.js";
import { isRecord } from "../typeguards.js";

import { getCustomization } from "./customizationModule.js";
import { selectCurrentFormName } from "./utils.js";

const ResizablePreview = lazy(() => import("../views/PreviewView.js"));

function LazyPreview(props: ViewNGProps) {
	return (
		<Suspense>
			<ResizablePreview {...props} />
		</Suspense>
	);
}

export interface InstanceDataholder extends Activity.DataHolder<FormActivity.Data.SingleDocumentData> {
	readonly descriptor: {
		readonly formName: string;
		readonly instance: string;
	};
}

export function isInstanceDescriptor(value: unknown): boolean {
	return isRecord(value) && value.instance !== undefined && value.formName !== undefined;
}

export interface LoadInstanceConfig extends DataProvider.LoadConfig {
	readonly dataHolders: [InstanceDataholder];
}

export interface SaveInstanceConfig extends DataProvider.SaveConfig {
	readonly dataHolders: [InstanceDataholder];
}

const defaultOptions = {
	...createDefaultMiddlewareOptions(),
	externalEnumerationProvider,
	nowProvider
};

function DynamicView(props: ViewNGProps) {
	const formName = useSelector(selectCurrentFormName);

	const { FormEngineView, config } = getCustomization(formName) ?? {};

	const FE = FormEngineView ?? FormEngineViews.FormEngine;

	const customConfig: Partial<Config> = {
		uiIdPrefix: "Test-Prefix",
		externalEnumerationProvider,
		selectorMap: CustomSelectorMap,
		...config
	};

	return (
		<LazyPreview {...props}>
			<FE {...props} {...customConfig} name="PreviewFE" />
		</LazyPreview>
	);
}

/**
 * A module that provides:
 *
 * - a scene that dynamically renders the FormEngine component
 * - the necessary setup for the FormEngine functionality (reducers, sagas, middlewares)
 *
 * ## Scene
 * The FormEngine Preview should be displayed full-screen (without having the menu of the AppFrame). To achieve this:
 * - the root layout is switched to `Null` on enter
 * - the `CONTENT` region is cleared before adding our view
 *
 * ## Deep linking
 *
 * If the form activity is restored from a deep link, client code will try to determine the loadingState from
 * the matching scene (which doesn't exist yet, because the activity did not reach the store at that point).
 * To prevent this error, we always provided the scene here (using an empty scene change if there is no form).
 *
 * ## Customization
 *
 * By default, this module will use:
 *
 * - the default `FormEngineView.FormEngine` component
 * - a default FE config (see above)
 * - default middleware options
 *
 * To customize these properties per form model name,
 * `DevappCustomization` modules can be registered.
 */
export const formEngineModule: DynamicConfiguration = {
	id: "default-single-instance-module",
	flows(state) {
		const formName = selectCurrentFormName(state);

		return [
			{
				name: "default-single-instance-flow",
				scenes: [
					{
						name: "default-single-instance-scene",
						matches: isInstanceDescriptor,
						sceneChange: formName
							? {
									onEnter: [
										{
											type: "DYNAMIC_CLEAR_REGION",
											region: "",
											layout: NullRegionLayoutNG
										},
										{
											type: "DYNAMIC_CLEAR_REGION",
											region: "/CONTENT"
										},
										{
											type: "DYNAMIC_ADD_VIEW",
											component: DynamicView,
											region: "/CONTENT",
											models: [{ modelType: "form", name: formName }]
										}
									]
								}
							: {}
					}
				]
			}
		];
	},
	dataReducers() {
		return [...formEngineDataReducers, ...previewReducers];
	},
	sagas() {
		return [
			...formEngineSagas({
				attachmentLoader: devappAttachmentLoader
			}),
			instancesLoadingSaga
		];
	},
	middlewares(state) {
		const formName = selectCurrentFormName(state);

		const customizations = getCustomization(formName);

		return formName
			? createPreviewFormEngineMiddlewares({
					...defaultOptions,
					...customizations?.middlewareOptions
				})
			: [];
	}
};
