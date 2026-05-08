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

import { within } from "@com.mgmtp.a12.devtools/react";

import type { Models } from "../../../../back-end/store/internal/store.js";
import type { FormModel } from "../../../../models/index.js";
import { HEAD_CELL_CONTENT } from "../../../rtl-utils/data-roles.js";
import type { RtlRenderWrapper } from "../../../rtl-utils/render-wrapper.js";
import { SetupHelpers } from "../../../utils/setup.js";
import { setupModelsFixture } from "../../../utils/setupFixture.js";
import {
	IDS as ExpressionLabelIds,
	expressionLabelDocument,
	formattedExpressionUiState
} from "../../../utils/test-model-helpers/expression-label.js";
import { IDS } from "../../../utils/test-model-helpers/repeat.column-label.js";

describe("api.view.repeat", () => {
	describe("Head Row", () => {
		const repeatModels = setupModelsFixture("repeat", "column-label");
		const expressionLabelModels = setupModelsFixture("localization", "expression-label");

		describe("Inline Repeat", () => {
			describe("Multilingual label", () => {
				executeTest({
					models: repeatModels,
					tableId: IDS.ID_INLINE_REPEAT,
					expressionCellId: IDS.ID_IR_MODEL_COLUMN_EXPRESSION,
					notRequiredFieldId: IDS.ID_IR_MODEL_COLUMN_NOT_REQUIRED_FIELD,
					requiredFieldId: IDS.ID_IR_MODEL_COLUMN_REQUIRED_FIELD,
					notRequiredFieldLabel: "L1_Number",
					requiredFieldLabel: "L1_Date",
					expressionCellLabel: "L1_Expression"
				});
			});

			describe("Expression label", () => {
				executeTest({
					models: expressionLabelModels,
					data: { document: expressionLabelDocument },
					tableId: ExpressionLabelIds.INLINE_REPEAT,
					expressionCellId: ExpressionLabelIds.INLINE_EXPRESSION_OVERVIEW_COLUMN,
					notRequiredFieldId: ExpressionLabelIds.INLINE_FIELD_OVERVIEW_COLUMN,
					requiredFieldId: ExpressionLabelIds.INLINE_FIELD_OVERVIEW_COLUMN_FIELD_CONFIG,
					notRequiredFieldLabel: "Field Based Column: TestValue",
					requiredFieldLabel: "DocumentModelLabel.en",
					expressionCellLabel: "Expression Overview Column: TestValue"
				});
			});

			describe("Formatted Expression label", () => {
				executeTest({
					models: expressionLabelModels,
					data: { document: expressionLabelDocument },
					tableId: ExpressionLabelIds.INLINE_REPEAT_FORMATTED,
					expressionCellId: ExpressionLabelIds.INLINE_EXPRESSION_OVERVIEW_COLUMN_FORMATTED,
					notRequiredFieldId: ExpressionLabelIds.INLINE_FIELD_OVERVIEW_COLUMN_FORMATTED,
					requiredFieldId: ExpressionLabelIds.INLINE_FIELD_OVERVIEW_COLUMN_FIELD_CONFIG_FORMATTED,
					notRequiredFieldLabel: "Field Overview Column crossed out: <del>TestValue</del>",
					requiredFieldLabel: "DocumentModelLabel.en",
					expressionCellLabel: "Expression Overview Column crossed out: <del>TestValue</del>",
					formattedExpression: true
				});
			});
		});

		describe("Detached Repeat", () => {
			describe("Multilingual label", () => {
				executeTestForOverviewTable({
					models: repeatModels,
					tableId: IDS.ID_DETACHED_REPEAT,
					expressionCellId: IDS.ID_DR_MODEL_COLUMN_EXPRESSION,
					notRequiredFieldId: IDS.ID_DR_MODEL_COLUMN_NOT_REQUIRED_FIELD,
					requiredFieldId: IDS.ID_DR_MODEL_COLUMN_REQUIRED_FIELD,
					notRequiredFieldLabel: "L1_Number",
					requiredFieldLabel: "L1_Date",
					expressionCellLabel: "L1_Expression"
				});
			});

			describe("Expression label", () => {
				executeTestForOverviewTable({
					models: expressionLabelModels,
					data: { document: expressionLabelDocument },
					tableId: ExpressionLabelIds.DETACHED_REPEAT,
					expressionCellId: ExpressionLabelIds.DETACHED_EXPRESSION_OVERVIEW_COLUMN,
					notRequiredFieldId: ExpressionLabelIds.DETACHED_FIELD_OVERVIEW_COLUMN,
					requiredFieldId: ExpressionLabelIds.DETACHED_FIELD_OVERVIEW_COLUMN_FIELD_CONFIG,
					notRequiredFieldLabel: "Field Overview Column: TestValue",
					requiredFieldLabel: "DocumentModelLabel.en",
					expressionCellLabel: "Expression Overview Column: TestValue"
				});
			});

			describe("Formatted Expression label", () => {
				executeTestForOverviewTable({
					models: expressionLabelModels,
					data: { document: expressionLabelDocument },
					tableId: ExpressionLabelIds.DETACHED_REPEAT_FORMATTED,
					expressionCellId: ExpressionLabelIds.DETACHED_EXPRESSION_OVERVIEW_COLUMN_FORMATTED,
					notRequiredFieldId: ExpressionLabelIds.DETACHED_FIELD_OVERVIEW_COLUMN_FORMATTED,
					requiredFieldId: ExpressionLabelIds.DETACHED_FIELD_OVERVIEW_COLUMN_FIELD_CONFIG_FORMATTED,
					notRequiredFieldLabel: "Field Overview Column in italics: <em>TestValue</em>",
					requiredFieldLabel: "DocumentModelLabel.en",
					expressionCellLabel: "Expression Overview Column in italics: <em>TestValue</em>",
					formattedExpression: true
				});
			});
		});

		describe("Embedded Repeat", () => {
			describe("Multilingual label", () => {
				executeTestForOverviewTable({
					models: repeatModels,
					tableId: IDS.ID_EMBEDDED_REPEAT,
					expressionCellId: IDS.ID_ER_MODEL_COLUMN_EXPRESSION,
					notRequiredFieldId: IDS.ID_ER_MODEL_COLUMN_NOT_REQUIRED_FIELD,
					requiredFieldId: IDS.ID_ER_MODEL_COLUMN_REQUIRED_FIELD,
					notRequiredFieldLabel: "L1_Number",
					requiredFieldLabel: "L1_Date",
					expressionCellLabel: "L1_Expression"
				});
			});

			describe("Expression label", () => {
				executeTestForOverviewTable({
					models: expressionLabelModels,
					data: { document: expressionLabelDocument },
					tableId: ExpressionLabelIds.EMBEDDED_REPEAT,
					expressionCellId: ExpressionLabelIds.EMBEDDED_EXPRESSION_OVERVIEW_COLUMN,
					notRequiredFieldId: ExpressionLabelIds.EMBEDDED_FIELD_OVERVIEW_COLUMN,
					requiredFieldId: ExpressionLabelIds.EMBEDDED_FIELD_OVERVIEW_COLUMN_FIELD_CONFIG,
					notRequiredFieldLabel: "Field Overview Column: TestValue",
					requiredFieldLabel: "DocumentModelLabel.en",
					expressionCellLabel: "Expression Overview Column: TestValue"
				});
			});

			describe("Formatted Expression label", () => {
				executeTestForOverviewTable({
					models: expressionLabelModels,
					data: { document: expressionLabelDocument },
					tableId: ExpressionLabelIds.EMBEDDED_REPEAT_FORMATTED,
					expressionCellId: ExpressionLabelIds.EMBEDDED_EXPRESSION_OVERVIEW_COLUMN_FORMATTED,
					notRequiredFieldId: ExpressionLabelIds.EMBEDDED_FIELD_OVERVIEW_COLUMN_FORMATTED,
					requiredFieldId: ExpressionLabelIds.EMBEDDED_FIELD_OVERVIEW_COLUMN_FIELD_CONFIG_FORMATTED,
					notRequiredFieldLabel: "Field Overview Column as code: <code>TestValue</code>",
					requiredFieldLabel: "DocumentModelLabel.en",
					expressionCellLabel: "Expression Overview Column as code: <code>TestValue</code>",
					formattedExpression: true
				});
			});
		});

		function executeTest(props: {
			models: Models;
			data?: object;
			tableId: string;
			notRequiredFieldId: string;
			requiredFieldId: string;
			expressionCellId: string;
			notRequiredFieldLabel: string;
			requiredFieldLabel: string;
			expressionCellLabel: string;
			formattedExpression?: boolean;
		}): void {
			describe("given a field overview column referencing a field which is not required", () => {
				describe("and 'markingOfRequiredFields' in the form-model content is set to 'REQUIRED'", () => {
					it("renders a head row component with a label set to the localized given label", async () => {
						const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
							models: setMarkingOfRequiredFieldsInFormModel(props.models, "REQUIRED"),
							data: props.data,
							ui: props.formattedExpression ? formattedExpressionUiState : undefined
						});

						findHeadCellAndAssertLabel(
							wrapper,
							props.notRequiredFieldId,
							props.notRequiredFieldLabel
						);
					});
				});

				describe("and 'markingOfRequiredFields' in the form-model content is not defined", () => {
					it("renders a head row component with a label set to the localized given label", async () => {
						const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
							models: setMarkingOfRequiredFieldsInFormModel(props.models, undefined),
							data: props.data,
							ui: props.formattedExpression ? formattedExpressionUiState : undefined
						});

						findHeadCellAndAssertLabel(
							wrapper,
							props.notRequiredFieldId,
							props.notRequiredFieldLabel
						);
					});
				});

				describe("and 'markingOfRequiredFields' in the form-model content is set to 'NONE'", () => {
					it("renders a head row component with a label set to the localized given label", async () => {
						const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
							models: setMarkingOfRequiredFieldsInFormModel(props.models, "NONE"),
							data: props.data,
							ui: props.formattedExpression ? formattedExpressionUiState : undefined
						});

						findHeadCellAndAssertLabel(
							wrapper,
							props.notRequiredFieldId,
							props.notRequiredFieldLabel
						);
					});
				});
			});

			describe("given a field overview column referencing a field which is required", () => {
				describe("and 'markingOfRequiredFields' in the form-model content is set to 'REQUIRED'", () => {
					it("renders a head row component with a label set to the localized given label plus an asterisk", async () => {
						const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
							models: setMarkingOfRequiredFieldsInFormModel(props.models, "REQUIRED"),
							data: props.data,
							ui: props.formattedExpression ? formattedExpressionUiState : undefined
						});

						findHeadCellAndAssertLabel(
							wrapper,
							props.requiredFieldId,
							`${props.requiredFieldLabel}*`
						);
					});
				});

				describe("and 'markingOfRequiredFields' in the form-model content is not defined", () => {
					it("renders a head row component with a label set to the localized given label plus an asterisk", async () => {
						const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
							models: setMarkingOfRequiredFieldsInFormModel(props.models, undefined),
							data: props.data,
							ui: props.formattedExpression ? formattedExpressionUiState : undefined
						});

						findHeadCellAndAssertLabel(
							wrapper,
							props.requiredFieldId,
							`${props.requiredFieldLabel}*`
						);
					});
				});

				describe("and 'markingOfRequiredFields' in the form-model content is set to 'NONE'", () => {
					it("renders a head row component with a label set to the localized given label with no asterisk", async () => {
						const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
							models: setMarkingOfRequiredFieldsInFormModel(props.models, "NONE"),
							data: props.data,
							ui: props.formattedExpression ? formattedExpressionUiState : undefined
						});

						findHeadCellAndAssertLabel(wrapper, props.requiredFieldId, props.requiredFieldLabel);
					});
				});
			});

			describe("given an expression overview column", () => {
				it("renders a head row component with a label set to the localized given label", async () => {
					const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
						models: props.models,
						data: props.data,
						ui: props.formattedExpression ? formattedExpressionUiState : undefined
					});

					findHeadCellAndAssertLabel(wrapper, props.expressionCellId, props.expressionCellLabel);
				});
			});
		}

		function executeTestForOverviewTable(props: {
			models: Models;
			data?: object;
			tableId: string;
			notRequiredFieldId: string;
			requiredFieldId: string;
			expressionCellId: string;
			notRequiredFieldLabel: string;
			requiredFieldLabel: string;
			expressionCellLabel: string;
			formattedExpression?: boolean;
		}): void {
			describe("given a field overview column referencing a field which is not required", () => {
				describe("and 'markingOfRequiredFields' in the form-model content is set to 'REQUIRED'", () => {
					it("renders a head row component with a label set to the localized given label", async () => {
						const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
							models: setMarkingOfRequiredFieldsInFormModel(props.models, "REQUIRED"),
							data: props.data,
							ui: props.formattedExpression ? formattedExpressionUiState : undefined
						});

						findHeadCellAndAssertLabel(
							wrapper,
							props.notRequiredFieldId,
							props.notRequiredFieldLabel
						);
					});
				});

				describe("and 'markingOfRequiredFields' in the form-model content is not defined", () => {
					it("renders a head row component with a label set to the localized given label", async () => {
						const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
							models: setMarkingOfRequiredFieldsInFormModel(props.models, undefined),
							data: props.data,
							ui: props.formattedExpression ? formattedExpressionUiState : undefined
						});

						findHeadCellAndAssertLabel(
							wrapper,
							props.notRequiredFieldId,
							props.notRequiredFieldLabel
						);
					});
				});

				describe("and 'markingOfRequiredFields' in the form-model content is set to 'NONE'", () => {
					it("renders a head row component with a label set to the localized given label", async () => {
						const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
							models: setMarkingOfRequiredFieldsInFormModel(props.models, "NONE"),
							data: props.data,
							ui: props.formattedExpression ? formattedExpressionUiState : undefined
						});

						findHeadCellAndAssertLabel(
							wrapper,
							props.notRequiredFieldId,
							props.notRequiredFieldLabel
						);
					});
				});
			});

			describe("given a field overview column referencing a field which is required", () => {
				describe("and 'markingOfRequiredFields' in the form-model content is set to 'REQUIRED'", () => {
					it("renders a head row component with a label set to the localized given label with no asterisk", async () => {
						const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
							models: setMarkingOfRequiredFieldsInFormModel(props.models, "REQUIRED"),
							data: props.data,
							ui: props.formattedExpression ? formattedExpressionUiState : undefined
						});

						findHeadCellAndAssertLabel(wrapper, props.requiredFieldId, props.requiredFieldLabel);
					});
				});

				describe("and 'markingOfRequiredFields' in the form-model content is set not defined", () => {
					it("renders a head row component with a label set to the localized given label with no asterisk", async () => {
						const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
							models: setMarkingOfRequiredFieldsInFormModel(props.models, undefined),
							data: props.data,
							ui: props.formattedExpression ? formattedExpressionUiState : undefined
						});

						findHeadCellAndAssertLabel(wrapper, props.requiredFieldId, props.requiredFieldLabel);
					});
				});

				describe("and 'markingOfRequiredFields' in the form-model content is set to 'NONE'", () => {
					it("renders a head row component with a label set to the localized given label with no asterisk", async () => {
						const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
							models: setMarkingOfRequiredFieldsInFormModel(props.models, "NONE"),
							data: props.data,
							ui: props.formattedExpression ? formattedExpressionUiState : undefined
						});

						findHeadCellAndAssertLabel(wrapper, props.requiredFieldId, props.requiredFieldLabel);
					});
				});
			});

			describe("given an expression overview column", () => {
				it("renders a head row component with a label set to the localized given label", async () => {
					const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
						models: props.models,
						data: props.data,
						ui: props.formattedExpression ? formattedExpressionUiState : undefined
					});

					findHeadCellAndAssertLabel(wrapper, props.expressionCellId, props.expressionCellLabel);
				});
			});
		}
	});
});

function setMarkingOfRequiredFieldsInFormModel(
	models: Models,
	markingOfRequiredFields?: FormModel.MarkingOfRequiredFields
): Models {
	const formModelWithRequiredSet: FormModel = {
		header: models.formModel.header,
		content: {
			...models.formModel.content,
			markingOfRequiredFields: markingOfRequiredFields
		}
	};
	return {
		...models,
		formModel: formModelWithRequiredSet
	};
}

function findHeadCellAndAssertLabel(
	wrapper: RtlRenderWrapper,
	modelColumnId: string,
	expectedText: string
): void {
	const headerCell = within(wrapper.baseElement).getByTestId(modelColumnId);

	const headerCellContent = within(headerCell).getByDataRole(HEAD_CELL_CONTENT);

	// descend into expression span wrapper
	const container =
		headerCellContent.firstElementChild?.tagName === "SPAN"
			? headerCellContent.firstElementChild
			: headerCellContent;

	const actualText = container.innerHTML;

	strictEqual(actualText, expectedText);
}
