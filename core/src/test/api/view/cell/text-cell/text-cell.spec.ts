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
 * 1. Open-Source License - EUPL v1.2
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

import { strictEqual } from "node:assert/strict";

import { query } from "@com.mgmtp.a12.devtools/react";

import { getComponentMocks } from "../../../../rtl-utils/getComponentMocks.js";
import { setupFormEngineRendererWithRtl } from "../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";
import { IDS as TextCellIds } from "../../../../utils/test-model-helpers/text-cell.js";

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
