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

/**
 * Test for the "onValueSubmit" event, applied to all kinds of date controls.
 */
import { strictEqual } from "assert";
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
