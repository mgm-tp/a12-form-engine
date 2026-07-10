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

import { deepStrictEqual, ok, strictEqual } from "node:assert/strict";

import { query, within } from "@com.mgmtp.a12.devtools/react";
import { DataRoles } from "@com.mgmtp.a12.widgets/widgets-core";

import type { WidgetMap } from "../../../../view/index.js";
import { setupModelsFixture } from "../../../utils/setupFixture.js";
import { IDS } from "../../../utils/test-model-helpers/aria-level.js";
import {
	IDS as ExpressionLabelIds,
	expressionLabelDocument,
	formattedExpressionUiState
} from "../../../utils/test-model-helpers/expression-label.js";
import { IDS as ResponsiveIds } from "../../../utils/test-model-helpers/responsive-grid.js";
import { setupFormEngineRendererWithRtlAsync } from "../../../utils/setup.js";

import { TypographyHeadline } from "./typography-headline-mock.js";

describe("api.view.layout", () => {
	describe("MultiColumnSection", () => {
		describe("when empty", () => {
			const models = setupModelsFixture("container", "container-visibility");

			it("is hidden", async () => {
				const wrapper = await setupFormEngineRendererWithRtlAsync({
					models
				});

				const mcs = within(wrapper.baseElement).queryById("a12-multicolumnsection-accd0");
				strictEqual(mcs, null);
			});

			it("is visible when any child is visible", async () => {
				const wrapper = await setupFormEngineRendererWithRtlAsync({
					models
				});

				const mcs = within(wrapper.baseElement).queryById("a12-multicolumnsection-88b9d");
				ok(mcs, "Expected to find multi-column-section!");
			});

			it("is hidden when all children are hidden", async () => {
				const wrapper = await setupFormEngineRendererWithRtlAsync({
					models,
					data: {
						document: {
							rootGroup: {
								booleanField: true
							}
						}
					}
				});

				const section = within(wrapper.baseElement).queryById("a12-multicolumnsection-88b9d");

				strictEqual(section, null);
			});
		});

		describe("layout", () => {
			const models = setupModelsFixture("container", "multicolumnsection");

			describe("given a layout with three columns", () => {
				const ID_MCS_ROW = "a12-section-f64d6-row";

				it("renders the layout correctly", async () => {
					const wrapper = await setupFormEngineRendererWithRtlAsync({ models });

					const row = query(wrapper.widgetMap.LayoutGridRow).withTestId(ID_MCS_ROW).props();

					deepStrictEqual(row.layoutConfig?.layout.lg, [4, 4, 4], "Wrong layout");
				});
			});
		});

		describe("responsive layouts", () => {
			const models = setupModelsFixture("container.responsive-grid");

			describe("given a three-column layout with lg 3-6-3, md 2-2-8 and sm 12-6-6", () => {
				it("renders the layout correctly", async () => {
					const wrapper = await setupFormEngineRendererWithRtlAsync({ models });

					const row = query(wrapper.widgetMap.LayoutGridRow).withTestId(ResponsiveIds.MCS).props();

					const expected = {
						lg: [3, 6, 3],
						md: [2, 2, 8],
						sm: [12, 6, 6]
					};

					deepStrictEqual(row.layoutConfig?.layout, expected);
				});
			});
		});

		describe("title", () => {
			const a11yModels = setupModelsFixture("a11y", "aria-level");
			const expressionLabelModels = setupModelsFixture("localization", "expression-label");

			describe("with a multilingual label defined in the model", () => {
				it("renders a title", async () => {
					const wrapper = await setupFormEngineRendererWithRtlAsync({
						models: a11yModels
					});

					const headline = within(wrapper.baseElement).getByTestId(
						IDS.MULTI_COLUMN_SECTION_WITH_LABEL
					);

					strictEqual(headline.textContent, "multi column section with label");
				});
			});

			describe("with an expression label defined in the model", () => {
				it("renders a title", async () => {
					const wrapper = await setupFormEngineRendererWithRtlAsync({
						models: expressionLabelModels,
						data: { document: expressionLabelDocument }
					});

					const headline = within(wrapper.baseElement).getByTestId(
						ExpressionLabelIds.MULTI_COLUMN_SECTION
					);

					strictEqual(headline.textContent, "Multi Column Section: TestValue");
				});

				it("renders a formatted title if the expression contained markdown formatting", async () => {
					const widgetMap: Partial<WidgetMap> = {
						TypographyHeadline
					};
					const wrapper = await setupFormEngineRendererWithRtlAsync({
						config: {
							widgetMap
						},
						models: expressionLabelModels,
						data: { document: expressionLabelDocument },
						ui: formattedExpressionUiState
					});

					const headline = within(wrapper.baseElement).getByTestId(
						ExpressionLabelIds.MULTI_COLUMN_SECTION_FORMATTED
					);
					const label = within(headline).getByDataRole(DataRoles.Typography.Headline.Label);

					strictEqual(
						label.firstElementChild?.innerHTML,
						"Multi Column Section in bold: <strong>TestValue</strong>"
					);
				});
			});

			describe("with no label defined in the model", () => {
				it("doesn't render a title", async () => {
					const wrapper = await setupFormEngineRendererWithRtlAsync({
						models: a11yModels
					});

					const headline = within(wrapper.baseElement).queryByTestId(
						IDS.MULTI_COLUMN_SECTION_WITHOUT_LABEL
					);

					strictEqual(headline, null);
				});
			});
		});
	});
});
