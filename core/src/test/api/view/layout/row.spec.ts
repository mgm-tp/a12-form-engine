// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { strictEqual } from "node:assert/strict";

import { within } from "@com.mgmtp.a12.devtools/react";
import { DataRoles } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/data-roles.js";

import { SetupHelpers } from "../../../utils/setup.js";
import { setupModelsFixture } from "../../../utils/setupFixture.js";
import { IDS } from "../../../utils/test-model-helpers/aria-level.js";
import {
	IDS as ExpressionLabelIds,
	expressionLabelDocument,
	formattedExpressionUiState
} from "../../../utils/test-model-helpers/expression-label.js";

import { TypographyHeadline } from "./typography-headline-mock.js";

describe("api.view.layout", () => {
	describe("Row", () => {
		describe("when empty", () => {
			const models = setupModelsFixture("container", "container-visibility");

			it("is hidden", async () => {
				const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
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
					const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
						models: a11yModels
					});

					within(wrapper.baseElement).getById(IDS.TITLE_ROW_ROW_WITH_LABEL);
				});
			});

			describe("with an expression label defined in the model", () => {
				it("renders a title", async () => {
					const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
						models: expressionLabelModels,
						data: { document: expressionLabelDocument }
					});

					const rowTitle = within(wrapper.baseElement).getById(ExpressionLabelIds.ROW);

					strictEqual(rowTitle.textContent, "Row: TestValue");
				});

				it("renders a formatted title if the expression contained markdown formatting", async () => {
					const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
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
					const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
						models: a11yModels
					});

					const rowTitle = within(wrapper.baseElement).queryById(IDS.ROW_WITHOUT_LABEL);

					strictEqual(rowTitle, null);
				});
			});
		});
	});
});
