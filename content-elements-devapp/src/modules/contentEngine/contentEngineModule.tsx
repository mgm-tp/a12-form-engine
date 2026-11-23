// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
