// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { ActivitySelectors } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";

import { isInstanceDescriptor } from "./formEngineModule.js";

export function selectCurrentFormName(state: object): string | undefined {
	const activityId = Object.values(ActivitySelectors.activities()(state)).find(a =>
		isInstanceDescriptor(a?.descriptor)
	)?.id;

	return activityId
		? ActivitySelectors.activityPropById(activityId, a => a.descriptor.formName)(state)
		: undefined;
}
