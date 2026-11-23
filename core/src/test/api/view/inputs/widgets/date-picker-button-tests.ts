// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
