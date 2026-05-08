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

import type { Activity } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import { ActivitySelectors } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import type { DynamicConfiguration } from "@com.mgmtp.a12.client/client-core/lib/core/configurationNG/index.js";

import { isRecord } from "../../typeguards.js";

import { WrappedContentEngineView } from "./view.js";

export interface InstanceDescriptor extends Activity.DataHolderDescriptor {
	readonly contentModelName: string;
	readonly instance: string;
}

export function isInstanceDescriptor(value: Activity.Descriptor): value is InstanceDescriptor {
	return isRecord(value) && value.instance !== undefined && value.contentModelName !== undefined;
}

export const contentEngineModule: DynamicConfiguration = {
	id: "content-engine-module",
	flows(state) {
		const contentModelName = selectCurrentContentModelName(state);

		return [
			{
				name: "content-engine-flow",
				scenes: [
					{
						name: "content-engine-scene",
						matches: isInstanceDescriptor,
						sceneChange: contentModelName
							? {
									onEnter: [
										{
											type: "DYNAMIC_ADD_VIEW",
											component: WrappedContentEngineView,
											region: "/CONTENT",
											models: [{ modelType: "content", name: contentModelName }]
										}
									]
								}
							: {}
					}
				]
			}
		];
	}
};

function selectCurrentContentModelName(state: object): string | undefined {
	const activityId = Object.values(ActivitySelectors.activities()(state)).find(
		a => a && isInstanceDescriptor(a.descriptor)
	)?.id;

	return activityId
		? ActivitySelectors.activityPropById(activityId, a => a.descriptor.contentModelName)(state)
		: undefined;
}
