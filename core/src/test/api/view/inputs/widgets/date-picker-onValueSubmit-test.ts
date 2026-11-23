// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

/**
 * Test for the "onValueSubmit" event, applied to all kinds of date controls.
 */
import { strictEqual } from "node:assert/strict";
import type { Mock } from "node:test";

import { query } from "@com.mgmtp.a12.devtools/react";

import type { RtlRenderWrapper } from "../../../../rtl-utils/render-wrapper.js";

type RenderFunc = (opts: object) => Promise<RtlRenderWrapper & { onValueSubmit: Mock<() => void> }>;

export function describeOnValueSubmitTest(render: RenderFunc, value: string): void {
	describe("if a value is entered in the input", () => {
		it("calls the onValueSubmit method with the value from the props", async () => {
			const wrapper = await render({});
			const input = query(wrapper.componentMap.BufferedTextLine).props();
			input.onValueSubmit(value);

			strictEqual(wrapper.onValueSubmit.mock.callCount(), 1);
		});
	});
}
