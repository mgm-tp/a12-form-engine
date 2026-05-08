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

import { strictEqual } from "node:assert/strict";

import { query } from "@com.mgmtp.a12.devtools/react";

import { getInputMocks } from "../../../../../../rtl-utils/getInputMocks.js";
import { SetupHelpers } from "../../../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../../../utils/setupFixture.js";
import {
	expressionLabelDocument,
	IDS as ExpressionLabelIds,
	formattedExpressionUiState
} from "../../../../../../utils/test-model-helpers/expression-label.js";
import { IDS } from "../../../../../../utils/test-model-helpers/tooltips.js";

import { renderStringInput } from "../renderStringInput.js";

import { executeA11yTests } from "./a11y.js";
import { getReactElementContentLabel } from "./getReactElementContentLabel.js";
import {
	executeMarkingOfRequiredFieldsOnControlLevel,
	executeMarkingOfRequiredFieldsOnFormLevel
} from "./markingOfRequiredFields.js";
import { executeReadonlyOrDisabledTests } from "./readonlyOrDisabled.js";

export function executeTestLabel(): void {
	const tooltipModels = setupModelsFixture("controls.tooltips");
	const expressionLabelModels = setupModelsFixture("localization", "expression-label");

	describe("given a control referencing a field which is not required", () => {
		describe("with a multilingual label", () => {
			it("renders a component with prop 'label' set to the localized given label", () => {
				const inputMap = getInputMocks();
				SetupHelpers.setupFormEngineRendererWithRtl({
					models: tooltipModels,
					inputMap
				});
				const modelElement = query(inputMap.NumberInput)
					.withProp("uiId", IDS.NUMBER_INPUT)
					.props().modelElement;
				strictEqual(modelElement.label, "NumberType");
			});
		});

		describe("with an expression label", () => {
			it("renders a component with prop 'label' set to the localized given label", () => {
				const modelElement = renderStringInput({
					models: expressionLabelModels,
					document: expressionLabelDocument,
					elementId: ExpressionLabelIds.CONTROL_WITH_FIELD_CONFIG_LABEL
				});
				strictEqual(
					getReactElementContentLabel(modelElement.label),
					"Field Configuration: TestValue"
				);
			});

			describe("that contains markdown formatting", () => {
				it("renders a component with prop 'label' set to the localized given label", () => {
					const modelElement = renderStringInput({
						models: expressionLabelModels,
						document: expressionLabelDocument,
						elementId: ExpressionLabelIds.CONTROL_WITH_FIELD_CONFIG_LABEL_FORMATTED,
						uiState: formattedExpressionUiState
					});
					strictEqual(
						getReactElementContentLabel(modelElement.label),
						"Field Configuration in italics: <em>TestValue</em>"
					);
				});
			});

			describe("and a control index", () => {
				it("renders a component with prop 'label' set to the localized given label", () => {
					const modelElement = renderStringInput({
						models: expressionLabelModels,
						document: expressionLabelDocument,
						elementId: ExpressionLabelIds.INDEXED_CONTROL_WITH_LABEL
					});
					strictEqual(
						getReactElementContentLabel(modelElement.label),
						"Indexed Control: TestValue from repeat"
					);
				});
			});
		});
	});

	describe("given a control referencing a field which is required", () => {
		executeReadonlyOrDisabledTests();
		executeMarkingOfRequiredFieldsOnFormLevel();
	});

	describe("given a control referencing a multi-select", () => {
		describe("with an expression label", () => {
			it("renders a component with prop 'label' set to the localized given label", () => {
				const inputMap = getInputMocks();
				SetupHelpers.setupFormEngineRendererWithRtl({
					models: expressionLabelModels,
					data: { document: expressionLabelDocument },
					inputMap
				});
				const modelElement = query(inputMap.MultiSelectInput)
					.withProp("uiId", ExpressionLabelIds.MULTI_SELECT)
					.props().modelElement;
				strictEqual(getReactElementContentLabel(modelElement.label), "Multi-Select: TestValue");
			});

			describe("and a control index", () => {
				it("renders a component with prop 'label' set to the localized given label", () => {
					const inputMap = getInputMocks();
					SetupHelpers.setupFormEngineRendererWithRtl({
						models: expressionLabelModels,
						data: { document: expressionLabelDocument },
						inputMap
					});
					const modelElement = query(inputMap.MultiSelectInput)
						.withProp("uiId", ExpressionLabelIds.INDEXED_MULTI_SELECT)
						.props().modelElement;
					strictEqual(
						getReactElementContentLabel(modelElement.label),
						"Multi-Select with Control Index: TestValue from repeat"
					);
				});
			});
		});
	});

	executeA11yTests();
	executeMarkingOfRequiredFieldsOnControlLevel();
}
