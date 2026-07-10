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

export const IR = {
	General: {
		screen: "General",
		ID_L1_MULTI_SELECT_READONLY_COMMA: "a12-fieldbasedrepeatoverviewcolumn-1c3fb-cell-0",
		ID_L1_MULTI_SELECT_READONLY_BULLET: "a12-fieldbasedrepeatoverviewcolumn-e4d70-cell-0"
	},
	SortingAndFiltering: {
		screen: "SortingAndFiltering",
		ID_REPEAT: "a12-inlinerepeat-da601",
		ID_REPEAT_TABLE: "a12-inlinerepeat-da601-table",
		ID_REPEAT_TABLE_2: "a12-inlinerepeat-5d3b7-table",
		repeatFormModelPath: createModelPath("SortingAndFiltering", "sec1", "inline-repeat-Nested_L1"),
		ID_L1_STRING_COLUMN: "fieldbasedrepeatoverviewcolumn-2c388",
		ID_L1_NUMBER_COLUMN: "fieldbasedrepeatoverviewcolumn-adcda",
		ID_L1_TIME_COLUMN: "fieldbasedrepeatoverviewcolumn-35944",
		ID_L1_CUSTOM_COLUMN: "fieldbasedrepeatoverviewcolumn-59e72",
		ID_L1_ENUM_COLUMN: "fieldbasedrepeatoverviewcolumn-07a2d",
		ID_L1_ENUM_EXPOSITION_STRING_COLUMN: "fieldbasedrepeatoverviewcolumn_13619",
		ID_L1_EXT_ENUM_COLUMN: "fieldbasedrepeatoverviewcolumn-ece70",
		ID_L1_EXT_ENUM_EXPOSITION_FULL_COLUMN: "fieldbasedrepeatoverviewcolumn_6da8e",
		ID_L1_TYPEDEF_COLUMN: "fieldbasedrepeatoverviewcolumn-e6e66",
		ID_L1_STRING: `a12-fieldbasedrepeatoverviewcolumn-2c388-cell-0`,
		ID_L1_NUMBER: `a12-fieldbasedrepeatoverviewcolumn-adcda-cell-0`,
		ID_L1_BOOLEAN: "a12-fieldbasedrepeatoverviewcolumn-1ccd0-cell-0",
		ID_L1_CONFIRM: "a12-fieldbasedrepeatoverviewcolumn-577a0-cell-0",
		ID_L1_DATE: "a12-fieldbasedrepeatoverviewcolumn-2f3cf-cell-0",
		ID_L1_DATE_FRAGMENT: "a12-fieldbasedrepeatoverviewcolumn-83fe7-cell-0",
		ID_L1_TIME: "a12-fieldbasedrepeatoverviewcolumn-35944-cell-0",
		ID_L1_DATE_TIME: "a12-fieldbasedrepeatoverviewcolumn-98625-cell-0",
		ID_L1_DATE_RANGE: "a12-fieldbasedrepeatoverviewcolumn-444a6-cell-0",
		ID_L1_MULTI_SELECT: "a12-fieldbasedrepeatoverviewcolumn-96d91-cell-0-multiselect__input",
		ID_L1_CUSTOM: "a12-fieldbasedrepeatoverviewcolumn-59e72-cell-0",
		ID_L1_STRING_FIELD: "a12-L1_String-F18",
		ID_L1_NUMBER_FIELD_REF: "F19",
		ID_L1_NUMBER_FIELD: `a12-L1_Number-F19`,
		ID_L1_STRING_READONLY: "a12-fieldbasedrepeatoverviewcolumn-6fbdc-cell-4",
		ID_L1_STRING_READONLY_TEXT_OUTPUT: "a12-fieldbasedrepeatoverviewcolumn-41038-bodycell-0",
		repeatFormModelPathSec4: createModelPath(
			"SortingAndFiltering",
			"sec4",
			"inline-repeat-Nested_L6"
		),
		ID_L6_ADD_BUTTON: "a12-add-button-inlinerepeat-38ab5",
		ID_L1_ADD_BUTTON: "a12-add-button-inlinerepeat-da601",
		ID_REPEAT_SEC_4: "a12-inlinerepeat-38ab5",
		ID_MOVE_UP: "a12-up-button-inlinerepeat-38ab5",
		ID_MOVE_DOWN: "a12-down-button-inlinerepeat-38ab5",
		ID_CLONE_BUTTON: "a12-copy-button-inlinerepeat-38ab5"
	},
	ColumnProperties: {
		screen: "ColumnProperties",
		ID_REPEAT_PINNING: "a12-inlinerepeat-a44be-table",
		ID_COLUMN_WIDTH: "a12-inlinerepeat-b99b2-table",
		ID_LEFT_1: "a12-fieldbasedrepeatoverviewcolumn-75664-cell-0",
		ID_LEFT_2: "a12-fieldbasedrepeatoverviewcolumn-abb7c-cell-0",
		ID_NONE_1: "a12-fieldbasedrepeatoverviewcolumn-03a0f-cell-0",
		ID_NONE_2: "a12-fieldbasedrepeatoverviewcolumn-6dc91-cell-0",
		ID_RIGHT_1: "a12-fieldbasedrepeatoverviewcolumn-bb84e-cell-0",
		ID_RIGHT_2: "a12-fieldbasedrepeatoverviewcolumn-150ee-cell-0",
		ID_L1_STRING_READONLY: "a12-fieldbasedrepeatoverviewcolumn-7a504-cell-0",
		ID_REPEAT_RESIZABLE_COLUMNS: "a12-inlinerepeat-67b37-table",
		LABEL_COLUMN_WITH_INITIAL_WIDTH: "String2 (Initial Width: 3)",
		LABEL_COLUMN_WITH_DEFAULT_INITIAL_WIDTH: "String1",
		ID_REPEAT_FIXED_WIDTH: "a12-inlinerepeat-c2740-table",
		LABEL_COLUMN_FIXED_WIDTH: "L1_String (fixed width)",
		LABEL_COLUMN_NO_FIXED_WIDTH: "L1_Time (no fixed width)"
	},
	FieldExpositions: {
		screen: "FieldExpositions",
		ID_L3_TEXT_AREA: "a12-fieldbasedrepeatoverviewcolumn-94400-cell-0",
		ID_L5_ENUM_COMPACT: "a12-fieldbasedrepeatoverviewcolumn-348d3-cell-0",
		ID_L5_ENUM_AUTOCOMPLETE: "a12-fieldbasedrepeatoverviewcolumn-5106b-cell-0",
		ID_L5_ENUM_RADIO_FULL: "a12-fieldbasedrepeatoverviewcolumn-0bb9e-cell-0",
		ID_L5_ENUM_RADIO_COMPACT: "a12-fieldbasedrepeatoverviewcolumn-820db-cell-0",
		ID_L5_BOOLEAN: "a12-fieldbasedrepeatoverviewcolumn-2aa34-cell-0",
		ID_L5_BOOLEAN_CHECKBOX: "a12-fieldbasedrepeatoverviewcolumn-2ae21-cell-0",
		ID_L5_BOOLEAN_SWITCH: "a12-fieldbasedrepeatoverviewcolumn-3bf12-cell-0",
		ID_L5_BOOLEAN_SWITCH_WITH_VALUES: "a12-fieldbasedrepeatoverviewcolumn-4de03-cell-0",
		ID_L8_MULTI_SELECT_AUTOCOMPLETE: "a12-fieldbasedrepeatoverviewcolumn-a680c-cell-0",
		ID_L8_MULTI_SELECT_FULL: "a12-fieldbasedrepeatoverviewcolumn-aac4f-cell-0",
		ID_L8_MULTI_SELECT_INLINE: "a12-fieldbasedrepeatoverviewcolumn-c30ee-cell-0",
		ID_L10_CONFIRM: "a12-fieldbasedrepeatoverviewcolumn_159b3-cell-0",
		ID_L10_CONFIRM_CHECKBOX: "a12-fieldbasedrepeatoverviewcolumn_b1d34-cell-0",
		ID_L10_CONFIRM_SWITCH: "a12-fieldbasedrepeatoverviewcolumn_b566b-cell-0",
		ID_L10_CONFIRM_SWITCH_WITH_VALUES: "a12-fieldbasedrepeatoverviewcolumn_40f77-cell-0"
	},
	RowActions: {
		screen: "RowActions",
		BUTTON_WITH_ICON: "a12-custom-rowActionWithIcon-button-inlinerepeat-ba2fc-1",
		BUTTON_WITH_LABEL: "a12-custom-rowActionWithLabel-button-inlinerepeat-ba2fc-1",
		BUTTON_WITH_LABEL_AND_ICON: "a12-custom-rowActionWithIconAndLabel-button-inlinerepeat-ba2fc-1",
		BUTTON_ALL: "a12-custom-AllRowAction-button-inlinerepeat-ba2fc-1",
		BUTTON_EDIT: "a12-custom-EditRowAction-button-inlinerepeat-ba2fc-1",
		BUTTON_RO: "a12-custom-ReadonlyRowAction-button-inlinerepeat-ba2fc-1",
		CONFIRM_BUTTON_WITH_ICON: "a12-custom-ConfirmationWithIcon-button-inlinerepeat-f2134-1",
		CONFIRM_BUTTON_WITH_LABEL: "a12-custom-ConfirmationWithLabel-button-inlinerepeat-f2134-1",
		CONFIRM_BUTTON_WITH_LABEL_AND_ICON:
			"a12-custom-ConfirmationWithIconAndLabel-button-inlinerepeat-f2134-1",
		CONFIRM_BUTTON_ALL: "a12-custom-AllRowAction-button-inlinerepeat-f2134-1",
		CONFIRM_BUTTON_EDIT: "a12-custom-EditRowAction-button-inlinerepeat-f2134-1",
		CONFIRM_BUTTON_RO: "a12-custom-ReadonlyRowAction-button-inlinerepeat-f2134-1",
		CONFIRM_BUTTON_WITH_DIALOG_TITLE:
			"a12-custom-ConfirmationWithTitle-button-inlinerepeat-f2134-1",
		CONFIRM_BUTTON_WITHOUT_DIALOG_TITLE:
			"a12-custom-ConfirmationWithoutTitle-button-inlinerepeat-f2134-1",
		CONFIRM_DIALOG_OK_BUTTON:
			"a12-custom-ConfirmationWithTitle-button-inlinerepeat-f2134-1-confirm",
		CONFIRM_DIALOG_CANCEL_BUTTON:
			"a12-custom-ConfirmationWithTitle-button-inlinerepeat-f2134-1-cancel"
	},
	TableStyle: {
		ID_COLUMN_L1_STRING: "a12-fieldbasedrepeatoverviewcolumn-a0a00-bodycell-0",
		ID_COLUMN_L1_MULTI_SELECT: "a12-fieldbasedrepeatoverviewcolumn-03ca1-bodycell-0"
	}
} as const;
