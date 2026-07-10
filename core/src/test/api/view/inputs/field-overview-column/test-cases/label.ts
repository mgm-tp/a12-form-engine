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

import { equal } from "node:assert/strict";

import { query, within } from "@com.mgmtp.a12.devtools/react";
import { DataRoles } from "@com.mgmtp.a12.widgets/widgets-core";

import { getComponentMocks } from "../../../../../rtl-utils/getComponentMocks.js";
import { US_LOCALE } from "../../../../../utils/localization.js";
import { setupFormEngineRendererWithRtlAsync } from "../../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../../utils/setupFixture.js";
import {
	expressionLabelDocument,
	IDS as ExpressionLabelIds,
	formattedExpressionUiState
} from "../../../../../utils/test-model-helpers/expression-label.js";
import { LOCALIZATION } from "../../../../../utils/test-model-helpers/localization.js";
import { widgetMocksForInputTests } from "../../input-element/inputTestWidgetMocks.js";

export function executeTestForFieldOverviewColumnLabel(): void {
	const computationModels = setupModelsFixture("computation-validation.computation");
	const expressionLabelModels = setupModelsFixture("localization", "expression-label");
	const localizationModels = setupModelsFixture("localization");

	describe("given a multilingual label", () => {
		it("renders a component with prop 'label' = the given label", async () => {
			const wrapper = await setupFormEngineRendererWithRtlAsync({
				componentMap: getComponentMocks(),
				models: computationModels,
				locale: US_LOCALE,
				data: {
					document: {
						root: {
							NonRep: {},
							Rep: [
								{
									FieldA: 1,
									FieldB: 2,
									FieldC: 3
								}
							],
							FieldD: 3
						}
					}
				}
			});

			const input = query(wrapper.componentMap.BufferedTextLine)
				.withId("a12-fieldbasedrepeatoverviewcolumn-070fa-cell-0")
				.props();
			equal(input.label, "C");
		});
	});

	describe("given an expression label", () => {
		it("renders a component with prop 'label' = the given label", async () => {
			const wrapper = await setupFormEngineRendererWithRtlAsync({
				config: {
					widgetMap: widgetMocksForInputTests()
				},
				models: expressionLabelModels,
				data: {
					document: expressionLabelDocument
				}
			});

			const cell = within(wrapper.baseElement).getById(
				`a12-${ExpressionLabelIds.INLINE_FIELD_OVERVIEW_COLUMN}-bodycell-0`
			);

			const expressionSpan = within(cell).getByDataRole(DataRoles.TextField.Label);
			equal(expressionSpan.textContent, "Field Based Column: TestValue");
		});

		describe("that contains markdown formatting", () => {
			it("renders a component with prop 'label' = the formatted given label", async () => {
				const wrapper = await setupFormEngineRendererWithRtlAsync({
					config: {
						widgetMap: widgetMocksForInputTests()
					},
					models: expressionLabelModels,
					data: {
						document: expressionLabelDocument
					},
					ui: formattedExpressionUiState
				});

				const cell = within(wrapper.baseElement).getById(
					`a12-${ExpressionLabelIds.INLINE_FIELD_OVERVIEW_COLUMN_FORMATTED}-bodycell-0`
				);

				const expressionSpan = within(cell).getByDataRole(
					DataRoles.TextField.Label
				).firstElementChild;
				equal(expressionSpan?.innerHTML, "Field Overview Column crossed out: <del>TestValue</del>");
			});
		});
	});

	describe("given no column label", () => {
		describe("but given a multilingual label in the field configuration", () => {
			it("renders a component with prop 'label' = the field configuration label", async () => {
				const wrapper = await setupFormEngineRendererWithRtlAsync({
					componentMap: getComponentMocks(),
					models: localizationModels,
					locale: US_LOCALE,
					data: { document: expressionLabelDocument }
				});
				const input = query(wrapper.componentMap.BufferedTextLine)
					.withId(LOCALIZATION.ID_INLINE_REPEAT_COLUMN_LABEL_FIELD_CONFIG)
					.props();
				equal(input.label, "FieldConfigLabel.en");
			});
		});

		describe("but given an expression label in the field configuration", () => {
			it("renders a component with prop 'label' = the document model label", async () => {
				const wrapper = await setupFormEngineRendererWithRtlAsync({
					componentMap: getComponentMocks(),
					models: expressionLabelModels,
					locale: US_LOCALE,
					data: {
						document: expressionLabelDocument
					}
				});

				const input = query(wrapper.componentMap.BufferedTextLine)
					.withId(`a12-${ExpressionLabelIds.INLINE_FIELD_OVERVIEW_COLUMN_FIELD_CONFIG}-cell-0`)
					.props();
				equal(input.label, "DocumentModelLabel.en");
			});
		});

		describe("and no label in the field configuration", () => {
			it("renders a component with prop 'label' = the document model label", async () => {
				const wrapper = await setupFormEngineRendererWithRtlAsync({
					componentMap: getComponentMocks(),
					models: localizationModels,
					locale: US_LOCALE,
					data: { document: expressionLabelDocument }
				});
				const input = query(wrapper.componentMap.BufferedTextLine)
					.withId(LOCALIZATION.ID_INLINE_REPEAT_COLUMN_LABEL)
					.props();
				equal(input.label, "DocumentModelLabel.en");
			});
		});
	});

	describe("labelHiddenButRead", () => {
		it("always renders a component with prop 'hideLabel' = true", async () => {
			const wrapper = await setupFormEngineRendererWithRtlAsync({
				componentMap: getComponentMocks(),
				models: computationModels,
				locale: US_LOCALE,
				data: {
					document: {
						root: {
							NonRep: {},
							Rep: [
								{
									FieldA: 1,
									FieldB: 2,
									FieldC: 3
								}
							],
							FieldD: 3
						}
					}
				}
			});

			const input = query(wrapper.componentMap.BufferedTextLine)
				.withId("a12-fieldbasedrepeatoverviewcolumn-070fa-cell-0")
				.props();
			equal(input.hideLabel, true);
		});
	});
}
