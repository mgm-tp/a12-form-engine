// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { strictEqual } from "node:assert/strict";

import { query } from "@com.mgmtp.a12.devtools/react";

import { mouseEventMock } from "../../../../rtl-utils/mock-utils.js";
import { ER } from "../../../../utils/test-model-helpers/embedded.repeat.js";

import type { EmbeddedRepeatTestEnv } from "./utils.js";
import { setup } from "./utils.js";

export function executeAddButtonTests(testEnv: EmbeddedRepeatTestEnv): void {
	it("triggers addRow", async () => {
		const { widgetMap } = await setup({ testEnv });

		const addButtonProps = query(widgetMap.Button)
			.withId(ER.SortingAndFiltering.ID_ER_ADD_BUTTON)
			.props();

		addButtonProps?.onClick?.(mouseEventMock);

		strictEqual(
			testEnv.stubs.addRow.mock.callCount(),
			1,
			`Dispatch function was called ${testEnv.stubs.addRow.mock.callCount()} time(s). Expected call count: 1`
		);
	});
}
