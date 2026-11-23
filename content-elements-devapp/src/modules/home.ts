// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { ActivityActions } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import { ApplicationActions } from "@com.mgmtp.a12.client/client-core/lib/core/application/index.js";
import type {
	DynamicConfiguration,
	DynamicFlow,
	DynamicMenu,
	DynamicRegion
} from "@com.mgmtp.a12.client/client-core/lib/core/configurationNG/index.js";
import {
	ApplicationFrameLayoutNG,
	NullRegionLayoutNG,
	StackRegionLayoutNG
} from "@com.mgmtp.a12.client/client-core/lib/core/frame/index.js";

import { Home } from "../components/home/home.js";

export const HomeModule: DynamicConfiguration = {
	id: "home-dynamic-configuration",
	regions: () => regions,
	menus: () => menus,
	flows: () => flows
};

const regions: DynamicRegion[] = [
	{
		name: "",
		layout: ApplicationFrameLayoutNG,
		subRegions: [
			{ name: "CONTENT", layout: StackRegionLayoutNG },
			{
				name: "SIDEBAR",
				layout: NullRegionLayoutNG
			},
			{
				name: "MODAL",
				layout: StackRegionLayoutNG
			},
			{
				name: "HIDDEN",
				layout: StackRegionLayoutNG
			}
		]
	}
];

const menus: DynamicMenu[] = [
	{
		id: "home-menu",
		label: { key: "home.menu", defaults: { ["de"]: "Start", ["en"]: "Home" } },
		action: dispatch => {
			dispatch(
				ApplicationActions.startMainActivityRequested({
					action: ActivityActions.create({
						activityDescriptor: { home: "true" },
						loadingState: "loaded"
					}),
					descriptor: {}
				})
			);
		}
	}
];

const flows: DynamicFlow[] = [
	{
		name: "home-flow",
		scenes: [
			{
				name: "home-scene",
				matches: descriptor => descriptor.home === "true",
				sceneChange: {
					onEnter: [
						{
							type: "DYNAMIC_ADD_VIEW",
							region: "/CONTENT",
							component: Home
						}
					],
					onExit: [
						{
							type: "DYNAMIC_CLEAR_REGION",
							layout: NullRegionLayoutNG,
							region: "/CONTENT"
						}
					]
				}
			}
		]
	}
];
