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

import type { Action, AnyAction } from "typescript-fsa";

import type { Activity } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import {
	ActivityActions,
	ActivitySelectors
} from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import { StoreFactories } from "@com.mgmtp.a12.client/client-core/lib/core/store/index.js";

import { INDEX_DEEP_LINK_HASH, INDEX_DESCRIPTOR } from "../modules/devappModule.js";
import { isInstanceDescriptor } from "../modules/formEngineModule.js";

/**
 * Manipulates push actions to fix issues with deep linking
 *
 * ## Data Loading
 *
 * Whenever a deep link is applied, the `loadingState` for the new activity is determined from the matching scene.
 * Since we're using dynamic configuration here, this scene might not exist.
 *
 * To ensure that data loading starts correctly, we manually set the `loadingState` here
 *
 * ## DataSource Id
 *
 * The deep linking features uses the `dataSourceActivityId` to chain activities
 * (parent and child are both encoded in a deep link when the child references the parent that way).
 *
 * However, when such a deep link is restored, the activities that are created and pushed will not include
 * that sourceId anymore -> reloading again now would only create the child activity.
 *
 * To ensure the parent-child relationship stays intact, we manually set the `dataSourceActivityId` here
 */
export const manipulatePushActionsForDeepLinkingMiddleware = StoreFactories.createMiddleware(
	(api, next, action) => {
		return next(
			needsDataLoading(action)
				? ({
						...action,
						payload: {
							activity: {
								...action.payload.activity,
								dataHolders: [
									{
										...action.payload.activity.dataHolders[0],
										loadingState: "missing",
										datasourceActivityId: addDataSourceId(
											api.getState(),
											action.payload.activity.descriptor
										)
									}
								]
							}
						}
					} satisfies Action<ActivityActions.PushPayload>)
				: action
		);
	}
);

/**
 * The activities that need data loading are
 *
 * - the ModelIndex
 * - the form engine for a specific instance
 */
function needsDataLoading(action: AnyAction): action is Action<ActivityActions.PushPayload> {
	return (
		ActivityActions.push.match(action) &&
		(action.payload.activity.descriptor.feature === INDEX_DESCRIPTOR.feature ||
			isInstanceDescriptor(action.payload.activity.descriptor))
	);
}

/**
 * When the instance activity is encountered here, its parent (the list activity) has to exist already
 */
function addDataSourceId(state: object, descriptor: Activity.Descriptor): string | undefined {
	const listActivityId = Object.values(ActivitySelectors.activities()(state)).find(a =>
		isInstanceDescriptor(a?.descriptor)
	)?.id;

	return isInstanceDescriptor(descriptor) ? listActivityId : undefined;
}

/**
 * Necessary because with dynamic configuration, there is no place to configure a "welcome page"
 */
export function setIndexPageIfEmpty() {
	// the deepLinking saga will trigger after setting the model graph and use this location
	if (location.hash.replace(/^#/, "") === "") {
		location.hash = INDEX_DEEP_LINK_HASH;
	}
}
