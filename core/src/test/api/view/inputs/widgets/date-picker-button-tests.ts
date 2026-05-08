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
 * Tests for the "open" button, applied to all kinds of date controls.
 */
import { query } from "@com.mgmtp.a12.devtools/react";

import type { RtlRenderWrapper } from "../../../../rtl-utils/render-wrapper.js";

interface RenderOpts {
	enableDatePicker: boolean;
	readonly: boolean;
	disabled: boolean;
}

type RenderFunc = (opts: RenderOpts) => Promise<RtlRenderWrapper>;

export function describeDatePickerButtonTests(render: RenderFunc): void {
	describe("given props with", () => {
		describe("enableDatePicker=true", () => {
			describe("readonly=false and disabled=false", () => {
				it("renders a BufferedTextLine with a picker button", async () => {
					const wrapper = await render({
						enableDatePicker: true,
						readonly: false,
						disabled: false
					});
					query(wrapper.widgetMap.Button).withId("my-date-button-picker").assertRendered();
				});
			});

			describe("readonly=true and disabled=false", () => {
				it("renders a BufferedTextLine with no picker button", async () => {
					const wrapper = await render({
						enableDatePicker: true,
						readonly: true,
						disabled: false
					});
					query(wrapper.widgetMap.Button).withId("my-date-button-picker").assertNotRendered();
				});
			});

			describe("readonly=false and disabled=true", () => {
				it("renders a BufferedTextLine with no picker button", async () => {
					const wrapper = await render({
						enableDatePicker: true,
						readonly: false,
						disabled: true
					});
					query(wrapper.widgetMap.Button).withId("my-date-button-picker").assertNotRendered();
				});
			});
		});

		describe("enableDatePicker=false", () => {
			it("renders a BufferedTextLine with no picker button", async () => {
				const wrapper = await render({
					enableDatePicker: false,
					readonly: true,
					disabled: true
				});
				query(wrapper.widgetMap.Button).withId("my-date-button-picker").assertNotRendered();
			});
		});
	});
}
