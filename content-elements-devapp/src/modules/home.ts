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
