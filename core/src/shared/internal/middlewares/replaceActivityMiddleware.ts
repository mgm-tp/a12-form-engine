// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Middleware } from "redux";

import {
	Activity,
	ActivityActions,
	ActivitySelectors
} from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";

import { assertExists } from "../../../back-end/utils/internal/assertions.js";

import { replaceActivity } from "../previewSlice.js";

/**
 * Middleware that changes the instance of the current activity and sets the loadingState
 * back to "missing". The logic must not be in render code because we need the current activity without
 * triggering re-renders whenever the activity changes.
 *
 * Note: This middleware is a workaround. We can not use a rootReducer because cancelRequested
 * is handled by a saga (that asks the user for confirmation).
 */
export const replaceActivityMiddleware: Middleware = api => next => action => {
	if (replaceActivity.match(action)) {
		const { activityId, newInstance } = action.payload;
		const currentActivity = ActivitySelectors.activityById(activityId)(api.getState());
		assertExists(currentActivity);

		const newDescriptor = { ...currentActivity.descriptor, instance: newInstance };
		const newDataHolders = currentActivity.dataHolders.map(dh => {
			if (Activity.DataHolder.hasNotDescriptor(currentActivity.descriptor)(dh)) {
				return dh;
			} else {
				return {
					...dh,
					descriptor: newDescriptor,
					loadingState: "missing" as const
				};
			}
		});
		const cancelAction = ActivityActions.cancelRequested({
			activityIds: [activityId],
			replacementActivity: {
				...currentActivity,
				descriptor: newDescriptor,
				dataHolders: newDataHolders
			}
		});
		api.dispatch(cancelAction);
	}
	return next(action);
};
