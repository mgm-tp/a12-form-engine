// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { strictEqual } from "node:assert/strict";

import { query } from "@com.mgmtp.a12.devtools/react";

import { getComponentMocks } from "../../../../rtl-utils/getComponentMocks.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";
import { IDS as TextCellIds } from "../../../../utils/test-model-helpers/text-cell.js";

const { setupFormEngineRendererWithRtl } = SetupHelpers;

describe("api.view.cell", () => {
	describe("Text Cell", () => {
		const models = setupModelsFixture("controls.textcell");

		function setup() {
			return setupFormEngineRendererWithRtl({
				models,
				componentMap: getComponentMocks()
			});
		}

		describe("with a decoration defined in the model", () => {
			it("renders a MessageBox with variant 'info' for a given decoration 'INFO'", () => {
				const { widgetMap } = setup();
				const props = query(widgetMap.MessageBox)
					.withId(TextCellIds.TEXT_CELL_DECORATION_INFO)
					.props();
				strictEqual(props.variant, "info");
			});

			it("renders a MessageBox with variant 'warning' for a given decoration 'WARNING'", () => {
				const { widgetMap } = setup();
				const props = query(widgetMap.MessageBox)
					.withId(TextCellIds.TEXT_CELL_DECORATION_WARNING)
					.props();
				strictEqual(props.variant, "warning");
			});

			it("renders a MessageBox with variant 'success' for a given decoration 'SUCCESS'", () => {
				const { widgetMap } = setup();
				const props = query(widgetMap.MessageBox)
					.withId(TextCellIds.TEXT_CELL_DECORATION_SUCCESS)
					.props();
				strictEqual(props.variant, "success");
			});

			it("renders a MessageBox with variant 'error' for a given decoration 'ERROR'", () => {
				const { widgetMap } = setup();
				const props = query(widgetMap.MessageBox)
					.withId(TextCellIds.TEXT_CELL_DECORATION_ERROR)
					.props();
				strictEqual(props.variant, "error");
			});
		});

		describe("with no decoration defined in the model", () => {
			it("renders no MessageBox", () => {
				const { componentMap, widgetMap } = setup();
				query(widgetMap.MessageBox).withId(TextCellIds.TEXT_CELL_NO_DECORATION).assertNotRendered();
				query(componentMap.HtmlTextDiv)
					.withTestId(TextCellIds.TEXT_CELL_NO_DECORATION)
					.assertRenderedTimes(1);
			});
		});

		describe("with embedded, unsafe HTML defined in the model", () => {
			it("renders a sanitized, safe HTML output", () => {
				const { componentMap } = setup();
				const props = query(componentMap.HtmlTextDiv)
					.withTestId(TextCellIds.TEXT_CELL_UNSAFE_HTML)
					.props();
				strictEqual(props.content?.includes("<a href=\"javascript:alert('hello')\">"), false);
			});
		});
	});
});
