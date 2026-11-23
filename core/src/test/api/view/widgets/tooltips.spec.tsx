// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { ok, strictEqual } from "node:assert/strict";

import { isValidElement } from "react";
import type { JSX } from "react";

import { query } from "@com.mgmtp.a12.devtools/react";

import { Tooltips } from "../../../../view/internal/components/widgets/tooltips.js";
import { rtlRenderWrapper } from "../../../rtl-utils/render-wrapper.js";

describe("api.view.renderTooltips", () => {
	describe("and given an errorMessageContainer", () => {
		it("renders an ErrorTooltip with the given errorMessageContainer element", async () => {
			const { widgetMap } = rtlRenderWrapper(
				<Tooltips errorTooltip={{ id: "error", content: <MyErrorComponent /> }} />
			);

			const { text } = query(widgetMap.ErrorTooltip).withId("error").props();

			ok(isValidElement(text) && text.type === MyErrorComponent);
		});
	});

	describe("and given a warningMessageContainer", () => {
		it("renders a WarningTooltip with the given warningMessageContainer element", async () => {
			const { widgetMap } = rtlRenderWrapper(
				<Tooltips warningTooltip={{ id: "warning", content: <MyWarningComponent /> }} />
			);

			const { text } = query(widgetMap.WarningTooltip).withId("warning").props();

			ok(isValidElement(text) && text.type === MyWarningComponent);
		});
	});

	describe("and given an infoMessageContainer", () => {
		it("renders a HintTooltip with the given infoMessageContainer element", async () => {
			const { widgetMap } = rtlRenderWrapper(
				<Tooltips infoTooltip={{ id: "info", content: <MyInfoComponent /> }} />
			);

			const { text } = query(widgetMap.HintTooltip).withId("info").props();

			ok(isValidElement(text) && text.type === MyInfoComponent);
		});
	});

	describe("and given a hintText", () => {
		it("renders a HintTooltip", () => {
			const { widgetMap } = rtlRenderWrapper(
				<Tooltips hintTooltip={{ id: "hint", content: "test hint text" }} />
			);

			const { text } = query(widgetMap.HintTooltip).withId("hint").props();

			strictEqual(text, "test hint text");
		});
	});

	describe("and given all of them", () => {
		it("renders an ErrorTooltip, a WarningTooltip, an InfoTooltip and a HintTooltip", () => {
			const { widgetMap } = rtlRenderWrapper(
				<Tooltips
					errorTooltip={{ id: "error", content: <MyErrorComponent /> }}
					warningTooltip={{ id: "warning", content: <MyWarningComponent /> }}
					infoTooltip={{ id: "info", content: <MyInfoComponent /> }}
					hintTooltip={{ id: "hint", content: "test hint text" }}
				/>
			);

			query(widgetMap.ErrorTooltip).withId("error").assertRenderedTimes(1);
			query(widgetMap.WarningTooltip).withId("warning").assertRenderedTimes(1);
			query(widgetMap.HintTooltip).withId("info").assertRenderedTimes(1);
			query(widgetMap.HintTooltip).withId("hint").assertRenderedTimes(1);
		});
	});

	describe("and none is given", () => {
		it("does not render any tooltip", () => {
			const { widgetMap } = rtlRenderWrapper(<Tooltips />);

			query(widgetMap.ErrorTooltip).assertNotRendered();
			query(widgetMap.WarningTooltip).assertNotRendered();
			query(widgetMap.HintTooltip).assertNotRendered();
		});
	});
});

function MyInfoComponent(): JSX.Element {
	return <div id="MyInfoComponent"></div>;
}
function MyWarningComponent(): JSX.Element {
	return <div id="MyWarningComponent"></div>;
}
function MyErrorComponent(): JSX.Element {
	return <div id="MyErrorComponent"></div>;
}
