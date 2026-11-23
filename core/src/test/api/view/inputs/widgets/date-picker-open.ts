// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

/**
 * Procedure to open the date picker. Used by tests for all date controls.
 */
import { act } from "react";

import { query } from "@com.mgmtp.a12.devtools/react";

import { mouseEventMock } from "../../../../rtl-utils/mock-utils.js";
import type { RtlRenderWrapper } from "../../../../rtl-utils/render-wrapper.js";

export function openDatePicker(wrapper: RtlRenderWrapper): void {
	const button = query(wrapper.widgetMap.Button).withId("my-date-button-picker").props();
	act(() => {
		button.onClick?.(mouseEventMock);
	});
}
