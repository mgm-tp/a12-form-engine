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

import { within } from "@com.mgmtp.a12.devtools/react";
import { DataRoles } from "@com.mgmtp.a12.widgets/widgets-core";

import { setupModelsFixture } from "../../../utils/setupFixture.js";
import { IDS } from "../../../utils/test-model-helpers/aria-level.js";
import {
	IDS as ExpressionLabelIds,
	expressionLabelDocument,
	formattedExpressionUiState
} from "../../../utils/test-model-helpers/expression-label.js";
import { setupFormEngineRendererWithRtlAsync } from "../../../utils/setup.js";

import { TypographyHeadline } from "./typography-headline-mock.js";

describe("api.view.layout", () => {
	describe("Row", () => {
		describe("when empty", () => {
			const models = setupModelsFixture("container", "container-visibility");

			it("is hidden", async () => {
				const wrapper = await setupFormEngineRendererWithRtlAsync({
					models
				});

				const row = within(wrapper.baseElement).queryById("a12-row-594df");
				strictEqual(row, null);
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

					within(wrapper.baseElement).getById(IDS.TITLE_ROW_ROW_WITH_LABEL);
				});
			});

			describe("with an expression label defined in the model", () => {
				it("renders a title", async () => {
					const wrapper = await setupFormEngineRendererWithRtlAsync({
						models: expressionLabelModels,
						data: { document: expressionLabelDocument }
					});

					const rowTitle = within(wrapper.baseElement).getById(ExpressionLabelIds.ROW);

					strictEqual(rowTitle.textContent, "Row: TestValue");
				});

				it("renders a formatted title if the expression contained markdown formatting", async () => {
					const wrapper = await setupFormEngineRendererWithRtlAsync({
						config: {
							widgetMap: {
								TypographyHeadline
							}
						},
						models: expressionLabelModels,
						data: { document: expressionLabelDocument },
						ui: formattedExpressionUiState
					});

					const rowTitle = within(wrapper.baseElement).getById(ExpressionLabelIds.ROW_FORMATTED);

					const label = within(rowTitle).getByDataRole(
						DataRoles.Typography.Headline.Label
					).firstElementChild;

					strictEqual(label?.innerHTML, "Row in bold: <strong>TestValue</strong>");
				});
			});

			describe("with no label defined in the model", () => {
				it("doesn't render a title", async () => {
					const wrapper = await setupFormEngineRendererWithRtlAsync({
						models: a11yModels
					});

					const rowTitle = within(wrapper.baseElement).queryById(IDS.ROW_WITHOUT_LABEL);

					strictEqual(rowTitle, null);
				});
			});
		});
	});
});
