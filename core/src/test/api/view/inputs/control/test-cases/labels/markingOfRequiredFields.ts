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

import type { ReactElement } from "react";

import { query } from "@com.mgmtp.a12.devtools/react";

import type { FormModel } from "../../../../../../../models/index.js";
import { getComponentMocks } from "../../../../../../rtl-utils/getComponentMocks.js";
import { isReactElement } from "../../../../../../rtl-utils/mock-utils.js";
import { SetupHelpers } from "../../../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../../../utils/setupFixture.js";
import {
	IDS as ExpressionLabelIds,
	expressionLabelDocument,
	formattedExpressionUiState
} from "../../../../../../utils/test-model-helpers/expression-label.js";
import { IDS } from "../../../../../../utils/test-model-helpers/tooltips.js";
import { IDS as MarkingIds } from "../../../../../../utils/test-model-helpers/validation.required.markingOfRequiredFields.js";

import { renderStringInput } from "../renderStringInput.js";

import { getReactElementContentLabel } from "./getReactElementContentLabel.js";
import { setMarkingOfRequiredFieldsInFormModel } from "./setMarkingOfRequiredFieldsInFormModel.js";

export function executeMarkingOfRequiredFieldsOnFormLevel(): void {
	const tooltipModels = setupModelsFixture("controls.tooltips");
	const expressionLabelModels = setupModelsFixture("localization", "expression-label");

	describe("with a multilingual label", () => {
		describe("and 'markingOfRequiredFields' in the form-model content is set to 'REQUIRED'", () => {
			it("renders a component with prop 'label' set to the localized given label plus an asterisk", () => {
				const modelElement = renderStringInput({
					models: setMarkingOfRequiredFieldsInFormModel(tooltipModels, "REQUIRED"),
					elementId: IDS.STRING_INPUT
				});
				strictEqual(modelElement.label, "StringType*");
			});
		});

		describe("and 'markingOfRequiredFields' in the form-model content is set not defined", () => {
			it("renders a component with prop 'label' set to the localized given label plus an asterisk", () => {
				const modelElement = renderStringInput({
					models: setMarkingOfRequiredFieldsInFormModel(tooltipModels, undefined),
					elementId: IDS.STRING_INPUT
				});
				strictEqual(modelElement.label, "StringType*");
			});
		});

		describe("and 'markingOfRequiredFields' in the form-model content is set to 'NONE'", () => {
			it("renders a component with prop 'label' set to the localized given label with no asterisk", () => {
				const modelElement = renderStringInput({
					models: setMarkingOfRequiredFieldsInFormModel(tooltipModels, "NONE"),
					elementId: IDS.STRING_INPUT
				});
				strictEqual(modelElement.label, "StringType");
			});
		});
	});

	describe("with an expression label", () => {
		describe("and 'markingOfRequiredFields' in the form-model content is set to 'REQUIRED'", () => {
			it("renders a component with prop 'label' set to the localized given label plus an asterisk", () => {
				const modelElement = renderStringInput({
					models: setMarkingOfRequiredFieldsInFormModel(expressionLabelModels, "REQUIRED"),
					document: expressionLabelDocument,
					elementId: ExpressionLabelIds.CONTROL_WITH_LABEL
				});
				const label = getReactElementChildrenSpanAndString(modelElement.label) ?? [];
				strictEqual(label[0], "Control: TestValue");
				strictEqual(label[1], "*");
			});
		});

		describe("and 'markingOfRequiredFields' in the form-model content is set not defined", () => {
			it("renders a component with prop 'label' set to the localized given label plus an asterisk", () => {
				const modelElement = renderStringInput({
					models: setMarkingOfRequiredFieldsInFormModel(expressionLabelModels, undefined),
					document: expressionLabelDocument,
					elementId: ExpressionLabelIds.CONTROL_WITH_LABEL
				});
				const label = getReactElementChildrenSpanAndString(modelElement.label) ?? [];
				strictEqual(label[0], "Control: TestValue");
				strictEqual(label[1], "*");
			});
		});

		describe("and 'markingOfRequiredFields' in the form-model content is set to 'NONE'", () => {
			it("renders a component with prop 'label' set to the localized given label with no asterisk", () => {
				const modelElement = renderStringInput({
					models: setMarkingOfRequiredFieldsInFormModel(expressionLabelModels, "NONE"),
					document: expressionLabelDocument,
					elementId: ExpressionLabelIds.CONTROL_WITH_LABEL
				});
				const label = getReactElementContentLabel(modelElement.label) ?? [];
				strictEqual(label, "Control: TestValue");
			});
		});

		describe("that contains markdown formatting", () => {
			describe("and 'markingOfRequiredFields' in the form-model content is set to 'REQUIRED'", () => {
				it("renders a component with prop 'label' set to the formatted localized given label plus an asterisk", () => {
					const modelElement = renderStringInput({
						models: setMarkingOfRequiredFieldsInFormModel(expressionLabelModels, "REQUIRED"),
						document: expressionLabelDocument,
						uiState: formattedExpressionUiState,
						elementId: ExpressionLabelIds.CONTROL_WITH_LABEL_FORMATTED
					});
					const label = getReactElementChildrenSpanAndString(modelElement.label) ?? [];
					strictEqual(label[0], "Control crossed out: <del>TestValue</del>");
					strictEqual(label[1], "*");
				});
			});

			describe("and 'markingOfRequiredFields' in the form-model content is set not defined", () => {
				it("renders a component with prop 'label' set to the formatted localized given label plus an asterisk", () => {
					const modelElement = renderStringInput({
						models: setMarkingOfRequiredFieldsInFormModel(expressionLabelModels, undefined),
						document: expressionLabelDocument,
						uiState: formattedExpressionUiState,
						elementId: ExpressionLabelIds.CONTROL_WITH_LABEL_FORMATTED
					});
					const label = getReactElementChildrenSpanAndString(modelElement.label) ?? [];
					strictEqual(label[0], "Control crossed out: <del>TestValue</del>");
					strictEqual(label[1], "*");
				});
			});

			describe("and 'markingOfRequiredFields' in the form-model content is set to 'NONE'", () => {
				it("renders a component with prop 'label' set to the formatted localized given label with no asterisk", () => {
					const modelElement = renderStringInput({
						models: setMarkingOfRequiredFieldsInFormModel(expressionLabelModels, "NONE"),
						document: expressionLabelDocument,
						uiState: formattedExpressionUiState,
						elementId: ExpressionLabelIds.CONTROL_WITH_LABEL_FORMATTED
					});
					const label = getReactElementContentLabel(modelElement.label);
					strictEqual(label, "Control crossed out: <del>TestValue</del>");
				});
			});
		});
	});
}

/**
 * Extracts the label from a nested structure
 *
 * ReactElement { children } [ ReactElement { content }, string ]
 *
 * that is caused by getLabelWithAsterisk.
 *
 * In this case, the label is rendered into two React nodes.
 */
function getReactElementChildrenSpanAndString(label: ReactElement | string | undefined) {
	return isReactElement(label) &&
		Array.isArray(label.props.children) &&
		isReactElement(label.props.children[0]) &&
		typeof label.props.children[1] === "string"
		? ([label.props.children[0].props.content, label.props.children[1]] as const)
		: undefined;
}

export function executeMarkingOfRequiredFieldsOnControlLevel(): void {
	const markingOfRequiredFieldsModels = setupModelsFixture(
		"computation-validation.required",
		"markingOfRequiredFields"
	);

	describe("markingOfRequiredFieldsOnControl", () => {
		describe("control referencing optional field", () => {
			executeTest(MarkingIds.OPTIONAL_UNSET, "OptionalString", false, undefined);
			executeTest(MarkingIds.OPTIONAL_NONE, "OptionalString", false, "NONE");
			executeTest(MarkingIds.OPTIONAL_ALWAYS, "OptionalString", true, "ALWAYS");
		});
		describe("control referencing required field", () => {
			executeTest(MarkingIds.REQUIRED_UNSET, "RequiredString", true, undefined);
			executeTest(MarkingIds.REQUIRED_NONE, "RequiredString", false, "NONE");
			executeTest(MarkingIds.REQUIRED_ALWAYS, "RequiredString", true, "ALWAYS");
		});
	});

	function executeTest(
		id: string,
		label: string,
		asteriskExpected: boolean,
		marking?: FormModel.MarkingOfRequiredFields
	) {
		describe(`and 'markingOfRequiredFields' is set to ${marking}`, () => {
			it(`renders a component with prop 'label' set to the given label with${
				asteriskExpected ? "" : " no"
			} asterisk`, () => {
				const componentMap = getComponentMocks();
				SetupHelpers.setupFormEngineRendererWithRtl({
					models: markingOfRequiredFieldsModels,
					componentMap
				});

				const props = query(componentMap.BufferedTextLine).withId(id).props();

				strictEqual(props["label"], `${label}${asteriskExpected ? "*" : ""}`);
				strictEqual(props["inputProps"]?.["aria-required"], asteriskExpected || undefined);
			});
		});
	}
}
