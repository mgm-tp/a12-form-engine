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

export interface ColumnHeaderCellsTestTableColumns {
	readonly NO_HINT_NOT_SORTABLE: string;
	readonly NO_HINT_SORTABLE: string;
	readonly HINT_NOT_SORTABLE: string;
	readonly HINT_AND_SORTABLE: string;
	readonly EXPRESSION_CELL_NOT_SORTABLE: string;
	readonly EXPRESSION_CELL_SORTABLE: string;
}

export const IDS = {
	Title: {
		INLINE_REPEAT: {
			STRING_ID: "a12-string1-field_5f585",
			STRING_HIDE_LABEL_ID: "a12-string1-field_5f585-2"
		}
	},
	TabAndFocus: {
		INLINE_REPEAT: {
			ADD_BUTTON: "a12-add-button-inlinerepeat-05d80",
			BODY_ROW: "a12-inlinerepeat-05d80-bodyrow",
			DELETE_BUTTON: "a12-remove-button-inlinerepeat-05d80",
			TABLE: "a12-inlinerepeat-05d80-table"
		},
		EMBEDDED_REPEAT: {
			ADD_BUTTON: "a12-add-button-embeddedrepeat-5e948",
			BODY_ROW: "a12-embeddedrepeat-5e948-bodyrow",
			EDIT_BUTTON: "a12-edit-button-embeddedrepeat-5e948",
			CLOSE_BUTTON: "a12-close-button-embeddedrepeat-5e948",
			EXPANDED_ROW: "a12-embeddedrepeat-5e948-expandedrow",
			CONTROL_GRID: "a12-controlgrid-186b3",
			DELETE_BUTTON: "a12-remove-button-embeddedrepeat-5e948",
			TABLE: "a12-embeddedrepeat-5e948-table"
		},
		DETACHED_REPEAT: {
			ADD_BUTTON: "a12-add-button-detachedrepeat-2333f",
			BODY_ROW: "a12-detachedrepeat-2333f-bodyrow",
			EDIT_BUTTON: "a12-edit-button-detachedrepeat-2333f",
			DELETE_BUTTON: "a12-remove-button-detachedrepeat-2333f",
			TABLE: "a12-detachedrepeat-2333f-table",
			ADD_CANCEL_BUTTON: "a12-add-cancel-button-detachedrepeat-2333f",
			COMMIT_BUTTON: "a12-add-apply-button-detachedrepeat-2333f",
			APPLY_BUTTON: "a12-edit-apply-button-detachedrepeat-2333f",
			EDIT_CANCEL_BUTTON: "a12-edit-cancel-button-detachedrepeat-2333f"
		}
	},
	ColumnHeaderCells: {
		INLINE_REPEAT_ID: "a12-inlinerepeat-e5ded-table",
		DETACHED_REPEAT_ID: "a12-detachedrepeat-ed637-table",
		EMBEDDED_REPEAT_ID: "a12-embeddedrepeat-d3988-table",
		IR_COLUMNS: {
			NO_HINT_NOT_SORTABLE: "fieldbasedrepeatoverviewcolumn-acffd",
			NO_HINT_SORTABLE: "fieldbasedrepeatoverviewcolumn-d75ef",
			HINT_NOT_SORTABLE: "fieldbasedrepeatoverviewcolumn-da89d",
			HINT_AND_SORTABLE: "fieldbasedrepeatoverviewcolumn-50055",
			EXPRESSION_CELL_NOT_SORTABLE: "expressionrepeatoverviewcolumn-acd7d",
			EXPRESSION_CELL_SORTABLE: "expressionrepeatoverviewcolumn-f3e6b"
		},
		DR_COLUMNS: {
			NO_HINT_NOT_SORTABLE: "fieldbasedrepeatoverviewcolumn-34d4f",
			NO_HINT_SORTABLE: "fieldbasedrepeatoverviewcolumn-77513",
			HINT_NOT_SORTABLE: "fieldbasedrepeatoverviewcolumn-3541c",
			HINT_AND_SORTABLE: "fieldbasedrepeatoverviewcolumn-b1082",
			EXPRESSION_CELL_NOT_SORTABLE: "expressionrepeatoverviewcolumn-aa109",
			EXPRESSION_CELL_SORTABLE: "expressionrepeatoverviewcolumn-b7806"
		},
		ER_COLUMNS: {
			NO_HINT_NOT_SORTABLE: "fieldbasedrepeatoverviewcolumn-95552",
			NO_HINT_SORTABLE: "fieldbasedrepeatoverviewcolumn-8fbad",
			HINT_NOT_SORTABLE: "fieldbasedrepeatoverviewcolumn-aff73",
			HINT_AND_SORTABLE: "fieldbasedrepeatoverviewcolumn-18468",
			EXPRESSION_CELL_NOT_SORTABLE: "expressionrepeatoverviewcolumn-fec68",
			EXPRESSION_CELL_SORTABLE: "expressionrepeatoverviewcolumn-c520e"
		}
	}
} as const;
