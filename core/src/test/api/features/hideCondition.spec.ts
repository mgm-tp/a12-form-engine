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

import { ok } from "node:assert/strict";

import { within } from "@com.mgmtp.a12.devtools/react";
import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import type { RtlRenderWrapper } from "../../rtl-utils/render-wrapper.js";
import { RenderGroupFixture } from "../../utils/rtl-render-group.js";
import { setupFormEngineRendererWithRtlAsync } from "../../utils/setup.js";
import { setupModelsFixture } from "../../utils/setupFixture.js";
import {
	createDocumentThatHidesEverything,
	createDocumentThatShowsEverything,
	createDocumentWithNullMasterValues,
	HIDE_CONDITION
} from "../../utils/test-model-helpers/hideCondition.js";

describe("api.features", () => {
	describe("hideCondition", () => {
		const models = setupModelsFixture("enablement.hidecondition");

		function setupWrapper(dataCreator: () => GroupInstance): Promise<RtlRenderWrapper> {
			const data = dataCreator();
			return setupFormEngineRendererWithRtlAsync({
				models,
				data: { document: data }
			});
		}

		describe("Document that hides everything (master values match hide conditions)", () => {
			const { render, it } = RenderGroupFixture(() =>
				setupWrapper(createDocumentThatHidesEverything)
			);

			describe("Master field types", () => {
				it("Boolean master field: hides the dependent control", () => {
					const control = within(render.wrapper.baseElement).queryById(
						HIDE_CONDITION.CONTROL_FOR_BOOLEAN_MASTER_ID
					);
					ok(control === null, "the control should not be visible");
				});

				it("Confirm master field: hides the dependent control", () => {
					const control = within(render.wrapper.baseElement).queryById(
						HIDE_CONDITION.CONTROL_FOR_CONFIRM_MASTER_ID
					);
					ok(control === null, "the control should not be visible");
				});

				it("Enumeration master field: hides the dependent control when value is 'blue'", () => {
					const control = within(render.wrapper.baseElement).queryById(
						HIDE_CONDITION.CONTROL_FOR_ENUM_MASTER_ID
					);
					ok(control === null, "the control should not be visible");
				});
			});

			describe("Element types supporting hideCondition", () => {
				it("Section: is hidden", () => {
					const section = within(render.wrapper.baseElement).queryById(HIDE_CONDITION.SECTION_ID);
					ok(section === null, "the section should not be visible");
				});

				it("Nested Section: is hidden", () => {
					const section = within(render.wrapper.baseElement).queryById(
						HIDE_CONDITION.NESTED_SECTION_ID
					);
					ok(section === null, "the nested section should not be visible");
				});

				it("Multi Column Section: is hidden", () => {
					const section = within(render.wrapper.baseElement).queryById(
						HIDE_CONDITION.MULTI_COLUMN_SECTION_ID
					);
					ok(section === null, "the multi column section should not be visible");
				});

				it("Control Grid: is hidden", () => {
					const controlGrid = within(render.wrapper.baseElement).queryById(
						HIDE_CONDITION.CONTROL_GRID_ID
					);
					ok(controlGrid === null, "the control grid should not be visible");
				});

				it("Button Panel: is hidden", () => {
					const buttonPanel = within(render.wrapper.baseElement).queryById(
						HIDE_CONDITION.BUTTON_PANEL_ID
					);
					ok(buttonPanel === null, "the button panel should not be visible");
				});

				it("Inline Repeat: is hidden", () => {
					const inlineRepeat = within(render.wrapper.baseElement).queryById(
						HIDE_CONDITION.INLINE_REPEAT_ID
					);
					ok(inlineRepeat === null, "the inline repeat should not be visible");
				});

				it("Detached Repeat: is hidden", () => {
					const detachedRepeat = within(render.wrapper.baseElement).queryById(
						HIDE_CONDITION.DETACHED_REPEAT_ID
					);
					ok(detachedRepeat === null, "the detached repeat should not be visible");
				});

				it("Embedded Repeat: is hidden", () => {
					const embeddedRepeat = within(render.wrapper.baseElement).queryById(
						HIDE_CONDITION.EMBEDDED_REPEAT_ID
					);
					ok(embeddedRepeat === null, "the embedded repeat should not be visible");
				});

				it("Row: is hidden", () => {
					const row = within(render.wrapper.baseElement).queryById(HIDE_CONDITION.ROW_ID);
					ok(row === null, "the row should not be visible");
				});

				it("Control: is hidden", () => {
					const control = within(render.wrapper.baseElement).queryById(HIDE_CONDITION.CONTROL_ID);
					ok(control === null, "the control should not be visible");
				});

				it("Control with Index: is hidden", () => {
					const control = within(render.wrapper.baseElement).queryById(
						HIDE_CONDITION.CONTROL_WITH_INDEX_ID
					);
					ok(control === null, "the control with index should not be visible");
				});

				it("Control with Index and indexed master field: is hidden", () => {
					const control = within(render.wrapper.baseElement).queryById(
						HIDE_CONDITION.CONTROL_WITH_INDEX_AND_INDEXED_MASTER_ID
					);
					ok(control === null, "the control with indexed master should not be visible");
				});

				it("Custom Screen Element: is hidden", () => {
					const customScreenElement = within(render.wrapper.baseElement).queryById(
						HIDE_CONDITION.CUSTOM_SCREEN_ELEMENT_ID
					);
					ok(customScreenElement === null, "the custom screen element should not be visible");
				});

				it("Text Cell: content is hidden", () => {
					const textCell = within(render.wrapper.baseElement).queryById(
						HIDE_CONDITION.TEXT_CELL_ID
					);
					ok(textCell?.firstChild === null, "the text cell content should not be visible");
				});

				it("Expression Cell: content is hidden", () => {
					const expressionCell = within(render.wrapper.baseElement).queryById(
						HIDE_CONDITION.EXPRESSION_CELL_ID
					);
					ok(
						expressionCell?.firstChild === null,
						"the expression cell content should not be visible"
					);
				});

				it("Custom Cell: is hidden", () => {
					const customCell = within(render.wrapper.baseElement).queryById(
						HIDE_CONDITION.CUSTOM_CELL_ID
					);
					ok(customCell === null, "the custom cell should not be visible");
				});

				it("Field Based Column with master outside the repeat: is hidden", () => {
					const fieldColumn = within(render.wrapper.baseElement).queryById(
						HIDE_CONDITION.FIELD_COLUMN_ID
					);
					ok(fieldColumn === null, "the field column should not be visible");
				});

				it("Field Based Column with master inside the repeat (sibling column): is hidden", () => {
					const fieldColumn = within(render.wrapper.baseElement).queryById(
						HIDE_CONDITION.FIELD_COLUMN_WITH_MASTER_IN_GROUP_ID
					);
					ok(fieldColumn === null, "the field column with master in group should not be visible");
				});

				it("Expression Column with master outside the repeat: content is hidden", () => {
					const expressionColumn = within(render.wrapper.baseElement).queryById(
						HIDE_CONDITION.EXPRESSION_COLUMN_ID
					);
					ok(
						expressionColumn?.firstChild === null,
						"the expression column content should not be visible"
					);
				});
			});
		});

		describe("Document that shows everything (master values do not match hide conditions)", () => {
			const { render, it } = RenderGroupFixture(() =>
				setupWrapper(createDocumentThatShowsEverything)
			);

			describe("Master field types", () => {
				it("Boolean master field: shows the dependent control", () => {
					const control = within(render.wrapper.baseElement).queryById(
						HIDE_CONDITION.CONTROL_FOR_BOOLEAN_MASTER_ID
					);
					ok(control, "the control should be visible");
				});

				it("Confirm master field: shows the dependent control", () => {
					const control = within(render.wrapper.baseElement).queryById(
						HIDE_CONDITION.CONTROL_FOR_CONFIRM_MASTER_ID
					);
					ok(control, "the control should be visible");
				});

				it("Enumeration master field: shows the dependent control when value is 'green'", () => {
					const control = within(render.wrapper.baseElement).queryById(
						HIDE_CONDITION.CONTROL_FOR_ENUM_MASTER_ID
					);
					ok(control, "the control should be visible");
				});
			});

			describe("Element types supporting hideCondition", () => {
				it("Section: is visible", () => {
					const section = within(render.wrapper.baseElement).queryById(HIDE_CONDITION.SECTION_ID);
					ok(section, "the section should be visible");
				});

				it("Nested Section: is visible", () => {
					const section = within(render.wrapper.baseElement).queryById(
						HIDE_CONDITION.NESTED_SECTION_ID
					);
					ok(section, "the nested section should be visible");
				});

				it("Multi Column Section: is visible", () => {
					const section = within(render.wrapper.baseElement).queryById(
						HIDE_CONDITION.MULTI_COLUMN_SECTION_ID
					);
					ok(section, "the multi column section should be visible");
				});

				it("Control Grid: is visible", () => {
					const controlGrid = within(render.wrapper.baseElement).queryById(
						HIDE_CONDITION.CONTROL_GRID_ID
					);
					ok(controlGrid, "the control grid should be visible");
				});

				it("Button Panel: is visible", () => {
					const buttonPanel = within(render.wrapper.baseElement).queryById(
						HIDE_CONDITION.BUTTON_PANEL_ID
					);
					ok(buttonPanel, "the button panel should be visible");
				});

				it("Inline Repeat: is visible", () => {
					const inlineRepeat = within(render.wrapper.baseElement).queryById(
						HIDE_CONDITION.INLINE_REPEAT_ID
					);
					ok(inlineRepeat, "the inline repeat should be visible");
				});

				it("Detached Repeat: is visible", () => {
					const detachedRepeat = within(render.wrapper.baseElement).queryById(
						HIDE_CONDITION.DETACHED_REPEAT_ID
					);
					ok(detachedRepeat, "the detached repeat should be visible");
				});

				it("Embedded Repeat: is visible", () => {
					const embeddedRepeat = within(render.wrapper.baseElement).queryById(
						HIDE_CONDITION.EMBEDDED_REPEAT_ID
					);
					ok(embeddedRepeat, "the embedded repeat should be visible");
				});

				it("Row: is visible", () => {
					const row = within(render.wrapper.baseElement).queryById(HIDE_CONDITION.ROW_ID);
					ok(row, "the row should be visible");
				});

				it("Control: is visible", () => {
					const control = within(render.wrapper.baseElement).queryById(HIDE_CONDITION.CONTROL_ID);
					ok(control, "the control should be visible");
				});

				it("Control with Index: is visible", () => {
					const control = within(render.wrapper.baseElement).queryById(
						HIDE_CONDITION.CONTROL_WITH_INDEX_ID
					);
					ok(control, "the control with index should be visible");
				});

				it("Control with Index and indexed master field: is visible", () => {
					const control = within(render.wrapper.baseElement).queryById(
						HIDE_CONDITION.CONTROL_WITH_INDEX_AND_INDEXED_MASTER_ID
					);
					ok(control, "the control with indexed master should be visible");
				});

				it("Custom Screen Element: is visible", () => {
					const customScreenElement = within(render.wrapper.baseElement).queryById(
						HIDE_CONDITION.CUSTOM_SCREEN_ELEMENT_ID
					);
					ok(customScreenElement, "the custom screen element should be visible");
				});

				it("Text Cell: content is visible", () => {
					const textCell = within(render.wrapper.baseElement).queryById(
						HIDE_CONDITION.TEXT_CELL_ID
					);
					ok(textCell?.firstChild, "the text cell content should be visible");
				});

				it("Expression Cell: content is visible", () => {
					const expressionCell = within(render.wrapper.baseElement).queryById(
						HIDE_CONDITION.EXPRESSION_CELL_ID
					);
					ok(expressionCell?.firstChild, "the expression cell should be visible");
				});

				it("Custom Cell: is visible", () => {
					const customCell = within(render.wrapper.baseElement).queryById(
						HIDE_CONDITION.CUSTOM_CELL_ID
					);
					ok(customCell, "the custom cell should be visible");
				});

				it("Field Based Column with master outside the repeat: is visible", () => {
					const fieldColumn = within(render.wrapper.baseElement).queryById(
						HIDE_CONDITION.FIELD_COLUMN_ID
					);
					ok(fieldColumn, "the field column should be visible");
				});

				it("Field Based Column with master inside the repeat (sibling column): is visible", () => {
					const fieldColumn = within(render.wrapper.baseElement).queryById(
						HIDE_CONDITION.FIELD_COLUMN_WITH_MASTER_IN_GROUP_ID
					);
					ok(fieldColumn, "the field column with master in group should be visible");
				});

				it("Expression Column with master outside the repeat: content is visible", () => {
					const expressionColumn = within(render.wrapper.baseElement).queryById(
						HIDE_CONDITION.EXPRESSION_COLUMN_ID
					);
					ok(expressionColumn?.firstChild, "the expression column content should be visible");
				});
			});
		});

		describe("Document with null master values", () => {
			const { render, it } = RenderGroupFixture(() =>
				setupWrapper(createDocumentWithNullMasterValues)
			);

			it("Boolean master field: shows the dependent control when value is null (null != true)", () => {
				const control = within(render.wrapper.baseElement).queryById(
					HIDE_CONDITION.CONTROL_FOR_BOOLEAN_MASTER_ID
				);
				ok(
					control,
					"the control should be visible because null does not match hide condition 'true'"
				);
			});

			it("Confirm master field: shows the dependent control when value is null (null != true)", () => {
				const control = within(render.wrapper.baseElement).queryById(
					HIDE_CONDITION.CONTROL_FOR_CONFIRM_MASTER_ID
				);
				ok(
					control,
					"the control should be visible because null does not match hide condition 'true'"
				);
			});

			it("Enumeration master field: hides the dependent control when value is null", () => {
				const control = within(render.wrapper.baseElement).queryById(
					HIDE_CONDITION.CONTROL_FOR_ENUM_MASTER_ID
				);
				ok(control === null, "the control should not be visible because null is in hide condition");
			});
		});
	});
});
