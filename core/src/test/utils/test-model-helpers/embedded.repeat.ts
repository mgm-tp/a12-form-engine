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

import { createModelPath } from "../createModelPath.js";

const screenSortingAndFiltering = "SortingAndFiltering";

const erRepeatPath = createModelPath(screenSortingAndFiltering, "sec3", "ER_Nested");

// Constants for the Embedded Repeat example
export const ER = {
	ROOT: "Root",
	repeatableGroup: "Nested_L1",
	SortingAndFiltering: {
		screenSortingAndFiltering,
		repeatFormModelPath: createModelPath(
			screenSortingAndFiltering,
			"sec1",
			"embedded-repeat-Nested_L1"
		),
		er_locationPath: createModelPath(
			screenSortingAndFiltering,
			"sec1",
			"embedded-repeat-Nested_L1",
			"cg"
		),
		ID_ER: "a12-inlinerepeat-da601",
		ID_ER_RO: "a12-inlinerepeat-5d3b7",
		ID_ER_ADD_BUTTON: "a12-add-button-inlinerepeat-da601",
		ID_COLUMN_L1_STRING: "a12-fieldbasedrepeatoverviewcolumn-2c388-bodycell-0",
		ID_COLUMN_L1_NUMBER: "a12-fieldbasedrepeatoverviewcolumn-adcda-bodycell-0",
		ID_COLUMN_L1_BOOLEAN: "a12-fieldbasedrepeatoverviewcolumn-1ccd0-bodycell-0",
		ID_COLUMN_L1_CONFIRM: "a12-fieldbasedrepeatoverviewcolumn-577a0-bodycell-0",
		ID_COLUMN_L1_ENUMERATION: "a12-fieldbasedrepeatoverviewcolumn-07a2d-bodycell-0",
		ID_COLUMN_L1_DATE: "a12-fieldbasedrepeatoverviewcolumn-2f3cf-bodycell-0",
		ID_COLUMN_L1_DATETIME: "a12-fieldbasedrepeatoverviewcolumn-98625-bodycell-0",
		ID_COLUMN_L1_TIME: "a12-fieldbasedrepeatoverviewcolumn-35944-bodycell-0",
		ID_COLUMN_L1_MULTI_SELECT: "a12-fieldbasedrepeatoverviewcolumn-8a0b8-bodycell-0",
		ID_COLUMN_L1_EXPRESSION: "a12-expressionrepeatoverviewcolumn-bae04-bodycell-0",
		ID_EXPANDED_ROW: "a12-inlinerepeat-da601-expandedrow",
		ID_EXPANDED_ROW_CONTROL_GRID: "a12-controlgrid-b0013",
		ID_BODY_ROW: "a12-inlinerepeat-da601-bodyrow",
		ID_CLOSE_BUTTON: "a12-close-button-inlinerepeat-da601",
		ID_EDIT_BUTTON: "a12-edit-button-inlinerepeat-da601",
		ID_REMOVE_BUTTON: "a12-remove-button-inlinerepeat-da601",
		ID_CUSTOM_BUTTON: "a12-custom-event-button-inlinerepeat-da601",
		erRepeatPath,
		erDetailControlGridPath: [...erRepeatPath, ...createModelPath("cg")]
	},
	ColumnProperties: {
		screen: "ColumnProperties",
		ID_REPEAT_PINNING: "a12-inlinerepeat-a44be",
		ID_COLUMN_WIDTH: "a12-inlinerepeat-b99b2",
		ID_LEFT_1: "a12-fieldbasedrepeatoverviewcolumn-75664-cell-0",
		ID_LEFT_2: "a12-fieldbasedrepeatoverviewcolumn-abb7c-cell-0",
		ID_NONE_1: "a12-fieldbasedrepeatoverviewcolumn-03a0f-cell-0",
		ID_NONE_2: "a12-fieldbasedrepeatoverviewcolumn-6dc91-cell-0",
		ID_RIGHT_1: "a12-fieldbasedrepeatoverviewcolumn-bb84e-cell-0",
		ID_RIGHT_2: "a12-fieldbasedrepeatoverviewcolumn-150ee-cell-0",
		ID_REPEAT_VERTICAL_ALIGNMENT: "a12-embeddedrepeat-356ab"
	},
	TableStyle: {
		ID_COLUMN_L1_STRING: "a12-fieldbasedrepeatoverviewcolumn-5a7bf-bodycell-0",
		ID_COLUMN_L1_MULTI_SELECT: "a12-fieldbasedrepeatoverviewcolumn-4df6c-bodycell-0",
		ID_COLUMN_L1_EXPRESSION: "a12-expressionrepeatoverviewcolumn-2d340-bodycell-0"
	}
} as const;
