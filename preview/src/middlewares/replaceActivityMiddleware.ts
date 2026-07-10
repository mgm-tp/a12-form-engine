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

import type { Middleware } from "redux";

import { Activity, ActivityActions, ActivitySelectors } from "@com.mgmtp.a12.client/client-core";

import { replaceActivity } from "../store/previewSlice.js";
import { assertExists } from "../utils/assertions.js";

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
