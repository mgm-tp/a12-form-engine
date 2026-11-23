// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { ActivityActions } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import type { EngineStore } from "@com.mgmtp.a12.formengine/formengine-core";

// tag::createAction[]
const initialUiSlice: Partial<EngineStore.UIState> = {
	disabled: true
};

export const createAction = ActivityActions.create({
	activityDescriptor: { model: "form", instance: "1" },
	slices: {
		ui: initialUiSlice
	}
});
// end::createAction[]
