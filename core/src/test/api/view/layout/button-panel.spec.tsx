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

import { ok, strictEqual } from "node:assert/strict";

import { screen, within } from "@com.mgmtp.a12.devtools/react";
import { DataRoles } from "@com.mgmtp.a12.widgets/widgets-core";

import { assertCondition } from "../../../../back-end/utils/internal/assertions.js";
import { findElementByFormModelPath } from "../../../../models/index.js";
import { isFormModelButtonPanel } from "../../../../models/internal/FormModelGuards.js";
import type { WidgetMap } from "../../../../view/index.js";
import { ButtonPanel } from "../../../../view/internal/components/form-engine/buttons/button-panel.js";
import { BUTTON_PANEL } from "../../../../view/internal/components/form-engine/data-roles.js";
import { rtlRenderWrapperAsync } from "../../../rtl-utils/render-wrapper.js";
import { assertExists } from "../../../utils/assertions.js";
import { createModelPath } from "../../../utils/createModelPath.js";
import {
	setupFormEngineRendererWithRtlAsync,
	setupRenderConfiguration
} from "../../../utils/setup.js";
import { setupModelsFixture } from "../../../utils/setupFixture.js";
import { IDS } from "../../../utils/test-model-helpers/aria-level.js";
import { BUTTONS } from "../../../utils/test-model-helpers/button.form.js";
import {
	expressionLabelDocument,
	IDS as ExpressionLabelIds,
	formattedExpressionUiState
} from "../../../utils/test-model-helpers/expression-label.js";

import { TypographyHeadline } from "./typography-headline-mock.js";

describe("api.view.layout", () => {
	describe("ButtonPanel", () => {
		const models = setupModelsFixture("container", "container-visibility");
		describe("when empty", () => {
			it("is hidden", async () => {
				const wrapper = await setupFormEngineRendererWithRtlAsync({
					models
				});

				const buttonPanel = within(wrapper.baseElement).queryById("a12-buttonpanel-7dc25");
				strictEqual(buttonPanel, null);
			});
		});

		describe("with HIDDEN_IN_READONLY_MODE", () => {
			it("is visible when readonly=false", async () => {
				const wrapper = await setupFormEngineRendererWithRtlAsync({
					models
				});
				const buttonPanel = within(wrapper.baseElement).queryById("a12-buttonpanel-a7f42");
				ok(buttonPanel);
			});
			it("is hidden when readonly=true", async () => {
				const wrapper = await setupFormEngineRendererWithRtlAsync({
					models,
					ui: {
						readonly: true
					}
				});
				const buttonPanel = within(wrapper.baseElement).queryById("a12-buttonpanel-a7f42");
				strictEqual(buttonPanel, null);
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

					within(wrapper.baseElement).getByTestId(IDS.BUTTON_PANEL_WITH_LABEL);
				});
			});

			describe("with an expression label defined in the model", () => {
				it("renders a title", async () => {
					const wrapper = await setupFormEngineRendererWithRtlAsync({
						models: expressionLabelModels,
						data: { document: expressionLabelDocument }
					});

					const buttonPanelTitle = within(wrapper.baseElement).getByTestId(
						ExpressionLabelIds.BUTTON_PANEL
					);

					strictEqual(buttonPanelTitle.textContent, "Button Panel: TestValue");
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

					const headline = within(wrapper.baseElement).getByDataTestId(
						ExpressionLabelIds.BUTTON_PANEL_FORMATTED
					);
					const title = within(headline).getByDataRole(DataRoles.Typography.Headline.Label);

					// h1 id=... is generated by markdown renderer
					strictEqual(
						title.firstElementChild?.innerHTML,
						'<h1 id="button-panel-as-h1-testvalue">Button Panel as H1: TestValue</h1>'
					);
				});
			});

			describe("with no label defined in the model", () => {
				it("doesn't render a title", async () => {
					const wrapper = await setupFormEngineRendererWithRtlAsync({
						models: a11yModels
					});

					const buttonPanelTitle = within(wrapper.baseElement).queryByTestId(
						IDS.BUTTON_PANEL_WITHOUT_LABEL
					);

					strictEqual(buttonPanelTitle, null);
				});
			});
		});

		describe("data-role", () => {
			const models = setupModelsFixture("buttons");

			it("should render a ButtonPanel with data-role 'button-panel' on the outermost div", async () => {
				const { formModel } = models;
				const buttonPanel = findElementByFormModelPath(formModel, BUTTONS.buttonPanel);
				assertExists(buttonPanel);
				assertCondition(isFormModelButtonPanel(buttonPanel));

				const renderConfiguration = setupRenderConfiguration({
					models,
					parentPath: createModelPath(BUTTONS.screen1)
				});

				await rtlRenderWrapperAsync(
					<ButtonPanel modelElement={buttonPanel} config={renderConfiguration} />
				);

				const buttonPanels = screen.getAllByDataRole(BUTTON_PANEL);

				strictEqual(buttonPanels.length, 1);
			});
		});
	});
});
