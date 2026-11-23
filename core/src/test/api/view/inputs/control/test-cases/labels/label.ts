// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
