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

import { lazy, Suspense } from "react";
import { useSelector } from "react-redux";

import type {
	Activity,
	DataProvider,
	DynamicConfiguration,
	DynamicScene,
	ViewNGProps
} from "@com.mgmtp.a12.client/client-core";
import { ActivitySelectors, NullRegionLayoutNG } from "@com.mgmtp.a12.client/client-core";
import type { Config, FormActivity } from "@com.mgmtp.a12.formengine/formengine-core";
import { FormEngineViews } from "@com.mgmtp.a12.formengine/formengine-core";

import { externalEnumerationProvider } from "../customizations/configurable_externalenumeration.js";
import { CustomSelectorMap } from "../customizations/customSelectorMap.js";

import { getCustomization } from "./customizationModule.js";
import { selectCurrentFormName } from "./utils.js";

const CustomPreview = lazy(() => import("../views/PreviewView.js"));

function LazyPreview(props: ViewNGProps) {
	return (
		<Suspense>
			<CustomPreview {...props} />
		</Suspense>
	);
}

export interface InstanceDataholder extends Activity.DataHolder<FormActivity.Data.SingleDocumentData> {
	readonly descriptor: {
		readonly formName: string;
		readonly instance: string;
	};
}

export function isInstanceDescriptor(descriptor?: Activity.Descriptor): boolean {
	return (
		descriptor?.instance !== undefined &&
		descriptor.formName !== undefined &&
		descriptor.isDetail === undefined
	);
}

/**
 * Matches "detail" instance activities, created alongside an already-open instance activity to
 * add a further view into the same region (e.g. for a MasterDetail example) instead of replacing
 * it. See `DevappCustomization.layout`.
 */
export function isInstanceDetailDescriptor(descriptor?: Activity.Descriptor): boolean {
	return (
		descriptor?.instance !== undefined &&
		descriptor.formName !== undefined &&
		descriptor.isDetail !== undefined
	);
}

export interface LoadInstanceConfig extends DataProvider.LoadConfig {
	readonly dataHolders: [InstanceDataholder];
}

export interface SaveInstanceConfig extends DataProvider.SaveConfig {
	readonly dataHolders: [InstanceDataholder];
}

function DynamicView(props: ViewNGProps) {
	// Looked up per-activity (rather than via `selectCurrentFormName`) so that a "detail" view
	// added alongside the main instance activity (see `detail-instance-scene` below) resolves its
	// own customization instead of the main activity's.
	const formName = useSelector(
		ActivitySelectors.activityPropById(props.activityId, activity => activity.descriptor.formName)
	);

	// The activity behind this view can be cancelled (e.g. a MasterDetail detail pane being
	// replaced) while this component is still mounted, playing its exit transition - `formName`
	// then resolves to undefined. Rendering nothing here is deliberate: falling through to
	// `getCustomization(undefined) ?? {}` would default `withoutPreview` to false, wrapping stale
	// content in the full `LazyPreview`/`PreviewView` app shell for the remainder of the exit
	// transition instead of just fading out.
	if (formName === undefined) {
		return null;
	}

	const { FormEngineView, config, withoutPreview } = getCustomization(formName) ?? {};

	const FE = FormEngineView ?? FormEngineViews.FormEngine;

	const customConfig: Partial<Config> = {
		uiIdPrefix: "Test-Prefix",
		externalEnumerationProvider,
		selectorMap: CustomSelectorMap,
		...config
	};

	// Keyed by activityId: the region layout (e.g. `MasterDetailRegionLayoutNG`) keys its panes by
	// position, not activity, so replacing one detail activity with another re-renders this same
	// `FE` instance in place. Without a key here, the FormEngine render guard (which never shows
	// its placeholder again once initialized) would keep showing the *previous* activity's content
	// until the new one's model finishes loading, instead of resetting for the new activity.
	return withoutPreview ? (
		// PreviewApplication normally establishes the page height (`height: 100%`, cascading from a
		// sized ancestor); without it there is nothing to size against, so it is set explicitly here.
		<div style={{ height: "100vh" }}>
			<FE key={props.activityId} {...props} {...customConfig} />
		</div>
	) : (
		<LazyPreview {...props}>
			<FE key={props.activityId} {...props} {...customConfig} />
		</LazyPreview>
	);
}

/**
 * Detail activities can use a different form than the main instance activity (e.g. a "master"
 * settings form spawning a differently-modeled "detail" form). Since a `DynamicScene`'s
 * `sceneChange` is static (not a function of the specific matching activity), one scene per
 * distinct detail form name currently present is generated here instead.
 */
function detailInstanceScenes(state: object): DynamicScene[] {
	const detailFormNames = new Set<string>();

	for (const activity of Object.values(ActivitySelectors.activities()(state))) {
		const descriptor = activity?.descriptor;
		if (descriptor && isInstanceDetailDescriptor(descriptor) && descriptor.formName) {
			detailFormNames.add(descriptor.formName);
		}
	}

	return Array.from(detailFormNames).map(detailFormName => ({
		name: `detail-instance-scene-${detailFormName}`,
		matches: descriptor =>
			isInstanceDetailDescriptor(descriptor) && descriptor.formName === detailFormName,
		sceneChange: {
			onEnter: [
				{
					type: "DYNAMIC_ADD_VIEW",
					component: DynamicView,
					region: "/CONTENT",
					models: [{ modelType: "form", name: detailFormName }]
				}
			]
		}
	}));
}

/**
 * A module that provides the dynamic scene for the FormEngine preview.
 *
 * ## Scene
 * The FormEngine Preview is displayed full-screen (without the AppFrame menu). To achieve this:
 * - the root layout is switched to `Null` on enter
 * - the `CONTENT` region is cleared before adding the view
 *
 * ## Deep linking
 *
 * If the form activity is restored from a deep link, client code will try to determine the loadingState from
 * the matching scene (which doesn't exist yet, because the activity did not reach the store at that point).
 * To prevent this error, we always provide the scene here (using an empty scene change if there is no form).
 *
 * ## Customization
 *
 * By default, this module will use:
 *
 * - the default `FormEngineView.FormEngine` component
 * - a default FE config (see above)
 *
 * To customize these properties per form model name,
 * `DevappCustomization` modules can be registered.
 */
export const formEngineModule: DynamicConfiguration = {
	id: "default-single-instance-module",
	flows(state) {
		const formName = selectCurrentFormName(state);
		const customization = getCustomization(formName);

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
											region: "/CONTENT",
											layout: customization?.layout
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
					},
					...detailInstanceScenes(state)
				]
			}
		];
	}
};
