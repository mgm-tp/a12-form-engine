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

import type {
	DynamicConfiguration,
	DynamicFlow,
	DynamicMenu,
	DynamicRegion,
	DataLoader,
	ViewNGProps
} from "@com.mgmtp.a12.client/client-core";
import {
	ActivityActions,
	ActivitySelectors,
	ApplicationActions,
	NullRegionLayoutNG
} from "@com.mgmtp.a12.client/client-core";

import { DevappLayoutNG } from "../components/DevappLayout.js";

/**
 * The devapp uses a custom ApplicationFrameLayout
 *
 * - SIDEBAR and MODAL regions are not defined, because we dont need them
 * - CONTENT is just NullLayout, because we always put a single activity view in it
 */
const DEVAPP_REGION: DynamicRegion[] = [
	{
		name: "",
		layout: DevappLayoutNG,
		subRegions: [
			{
				name: "CONTENT",
				layout: NullRegionLayoutNG
			}
		]
	}
];

export const INDEX_DEEP_LINK_HASH = "feature:ModelIndex";
export const INDEX_DESCRIPTOR = { feature: "ModelIndex" };
const CONTACT_DESCRIPTOR = { feature: "Contact" };
const VERSION_DESCRIPTOR = { feature: "Versions" };

const ModelIndex = lazy(() => import("../components/ModelsOverview.js"));
const Contact = lazy(() => import("../views/ContactView.js"));
const VersionInfo = lazy(() => import("../views/VersionInfoView.js"));

function LazyIndex(props: ViewNGProps) {
	return (
		<Suspense>
			<ModelIndex {...props} />
		</Suspense>
	);
}
function LazyContact(props: ViewNGProps) {
	return (
		<Suspense>
			<Contact {...props} />
		</Suspense>
	);
}

function LazyVersionInfo(props: ViewNGProps) {
	return (
		<Suspense>
			<VersionInfo {...props} />
		</Suspense>
	);
}

const DEVAPP_FLOWS: DynamicFlow[] = [
	{
		name: "devapp-stuff",
		scenes: [
			{
				name: `index.scene`,
				matches: descriptor => descriptor.feature === INDEX_DESCRIPTOR.feature,
				sceneChange: {
					onEnter: [
						{
							type: "DYNAMIC_ADD_VIEW",
							component: LazyIndex,
							region: "/CONTENT"
						}
					]
				}
			},
			{
				name: `versions.scene`,
				matches: descriptor => descriptor.feature === VERSION_DESCRIPTOR.feature,
				sceneChange: {
					onEnter: [
						{
							type: "DYNAMIC_ADD_VIEW",
							component: LazyVersionInfo,
							region: "/CONTENT"
						}
					]
				}
			},
			{
				name: `contact.scene`,
				matches: descriptor => descriptor.feature === CONTACT_DESCRIPTOR.feature,
				sceneChange: {
					onEnter: [
						{
							type: "DYNAMIC_ADD_VIEW",
							component: LazyContact,
							region: "/CONTENT"
						}
					]
				}
			}
		]
	}
];

const ACTIONS: Record<string, DynamicMenu["action"]> = {
	index: dispatch => {
		dispatch(
			ApplicationActions.startMainActivityRequested({
				action: ActivityActions.create({
					activityDescriptor: INDEX_DESCRIPTOR,
					loadingState: "missing"
				}),
				descriptor: {}
			})
		);
	},
	versions: dispatch => {
		dispatch(
			ApplicationActions.startMainActivityRequested({
				action: ActivityActions.create({
					activityDescriptor: VERSION_DESCRIPTOR,
					loadingState: "without"
				}),
				descriptor: {}
			})
		);
	},
	contact: dispatch => {
		dispatch(
			ApplicationActions.startMainActivityRequested({
				action: ActivityActions.create({
					activityDescriptor: CONTACT_DESCRIPTOR,
					loadingState: "without"
				}),
				descriptor: {}
			})
		);
	}
};

export const devappModule: DynamicConfiguration = {
	id: "devapp-module",
	regions() {
		return DEVAPP_REGION;
	},
	flows() {
		return DEVAPP_FLOWS;
	},
	menus(state) {
		const currentFeature = ActivitySelectors.latestActivity()(state)?.descriptor.feature;

		return [
			{
				id: "index",
				label: { key: "application.menu.index.label" },
				action: ACTIONS.index,
				selected: currentFeature === INDEX_DESCRIPTOR.feature
			},
			{
				id: "versions",
				label: { key: "application.menu.versions.label" },
				action: ACTIONS.versions,
				selected: currentFeature === VERSION_DESCRIPTOR.feature
			},
			{
				id: "contact",
				label: { key: "application.menu.contact.label" },
				action: ACTIONS.contact,
				selected: currentFeature === CONTACT_DESCRIPTOR.feature
			}
		];
	}
};

/**
 * A DataLoader that loads the necessary data for the model overview page
 * (containing the names of all form models and their groups)
 *
 * For simplicity, the data is always loaded locally (backend choice does not matter)
 *
 * Technically, this should be registered as part of the devappModule above, but the Module API
 * does not allow registering DataLoaders -> therefore we register it manually via appsetup
 */
export const ModelIndexDataLoader: DataLoader = {
	name: "model-index-loader",
	canHandle(activityDescriptor) {
		return activityDescriptor.feature === INDEX_DESCRIPTOR.feature;
	},
	async load() {
		const devAppModelsList = await loadIndex();

		return { devAppModelsList };
	},
	save() {
		throw new Error("Saving the model index is not allowed");
	},

	delete() {
		throw new Error("Deleting the model index is not allowed");
	}
};

const loadIndex = (indexName = "index") =>
	fetch(`modelIndex/${indexName}.json`).then(response => response.json());
