// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { equal } from "node:assert/strict";

import { query } from "@com.mgmtp.a12.devtools/react";

import type { WidgetMap } from "../../../../../view/index.js";

export function assertButtonEnablement(widgetMap: WidgetMap, id: string, disabled: boolean) {
	const button = query(widgetMap.Button).withId(id).props();
	equal(button.disabled, disabled);
}
