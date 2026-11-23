// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

/**
 * Constants for element IDs and test values used in hideCondition tests.
 */
export namespace HIDE_CONDITION {
	// Element IDs from the form model
	export const CONTROL_FOR_BOOLEAN_MASTER_ID = "a12-fieldForBooleanMaster-field_0a1d3";
	export const CONTROL_FOR_CONFIRM_MASTER_ID = "a12-fieldForConfirmMaster-field_4a47c";
	export const CONTROL_FOR_ENUM_MASTER_ID = "a12-fieldForEnumMaster-field_1d95d";

	export const SECTION_ID = "a12-section_3fdc9";
	export const NESTED_SECTION_ID = "a12-section_6f87c";
	export const MULTI_COLUMN_SECTION_ID = "a12-multicolumnsection_4f2d7";
	export const CONTROL_GRID_ID = "a12-controlgrid_f1c15";
	export const BUTTON_PANEL_ID = "a12-buttonpanel_92d2b";
	export const INLINE_REPEAT_ID = "a12-inlinerepeat_271e0";
	export const DETACHED_REPEAT_ID = "a12-detachedrepeat_cc543";
	export const EMBEDDED_REPEAT_ID = "a12-embeddedrepeat_32537";
	export const CUSTOM_SCREEN_ELEMENT_ID = "a12-customscreenelement_c33a9";
	export const ROW_ID = "a12-row_e1fcd";
	export const CONTROL_ID = "a12-stringField-field_b40c9-3";

	// Cell types
	export const TEXT_CELL_ID = "a12-textcell_f0729-content";
	export const EXPRESSION_CELL_ID = "a12-expressioncell_05231-expression";
	export const CUSTOM_CELL_ID = "customcell_bd7a8";

	// Control with index
	export const CONTROL_WITH_INDEX_ID = "a12-fieldForIndexedControl-field_69265";
	export const CONTROL_WITH_INDEX_AND_INDEXED_MASTER_ID =
		"a12-fieldForIndexedControl-field_69265-2";

	// Column types - master outside repeat
	export const FIELD_COLUMN_ID = "a12-fieldbasedrepeatoverviewcolumn_e4f4f-cell-0";
	export const EXPRESSION_COLUMN_ID = "a12-expressionrepeatoverviewcolumn_abaec-bodycell-0";

	// Column type - master inside repeat (sibling column)
	export const FIELD_COLUMN_WITH_MASTER_IN_GROUP_ID =
		"a12-fieldbasedrepeatoverviewcolumn_e8f18-cell-0";
}

/**
 * Creates a document where all hideCondition-controlled elements are hidden.
 * This sets master fields to values that trigger the hide condition.
 */
export function createDocumentThatHidesEverything(): GroupInstance {
	return {
		root: {
			masterFieldTypes: {
				// Boolean master = true hides the dependent control
				booleanMaster: true,
				// Confirm master = true hides the dependent control
				confirmMaster: true,
				// Enum master = blue hides the dependent control (also red and null)
				enumMaster: "blue"
			},
			masterFieldsForElements: {
				// All confirm masters set to true to hide elements
				masterForSection: true,
				masterForMultiColumnSection: true,
				masterForControlGrid: true,
				masterForButtonPanel: true,
				masterForInlineRepeat: true,
				masterForDetachedRepeat: true,
				masterForEmbeddedRepeat: true,
				masterForCustomScreenElement: true,
				masterForRow: true,
				masterForControl: true,
				masterForControlWithIndex: true,
				masterForMultiSelectControl: true,
				masterForControlWithValidationRule: true,
				masterForTextCell: true,
				masterForExpressionCell: true,
				masterForCustomCell: true,
				masterForFieldColumn: true,
				masterForExpressionColumn: true
			},
			fieldsForMasterTypes: {},
			fieldsForElements: {},
			repeatableGroup: [
				{
					// Master for column within the repeatable group - set to true to hide
					masterForColumnInGroup: true
				}
			],
			repeatableGroupForIndexedControl: [
				{},
				{
					// indexed master at index 2 - set to true to hide
					indexedMasterForIndexControl: true
				}
			]
		}
	};
}

/**
 * Creates a document where all hideCondition-controlled elements are visible.
 * This sets master fields to values that do NOT trigger the hide condition.
 */
export function createDocumentThatShowsEverything(): GroupInstance {
	return {
		root: {
			masterFieldTypes: {
				// Boolean master = false shows the dependent control
				booleanMaster: false,
				// Confirm master = null (unchecked) shows the dependent control
				confirmMaster: null,
				// Enum master = green shows the dependent control (only blue, red, null hide)
				enumMaster: "green"
			},
			masterFieldsForElements: {
				// All confirm masters set to null (unchecked) to show elements
				masterForSection: null,
				masterForMultiColumnSection: null,
				masterForControlGrid: null,
				masterForButtonPanel: null,
				masterForInlineRepeat: null,
				masterForDetachedRepeat: null,
				masterForEmbeddedRepeat: null,
				masterForCustomScreenElement: null,
				masterForRow: null,
				masterForControl: null,
				masterForControlWithIndex: null,
				masterForMultiSelectControl: null,
				masterForControlWithValidationRule: null,
				masterForTextCell: null,
				masterForExpressionCell: null,
				masterForCustomCell: null,
				masterForFieldColumn: null,
				masterForExpressionColumn: null
			},
			fieldsForMasterTypes: {},
			fieldsForElements: {},
			repeatableGroup: [
				{
					// Master for column within the repeatable group - set to null to show
					masterForColumnInGroup: null
				}
			],
			repeatableGroupForIndexedControl: [
				{},
				{
					// indexed master at index 2 - set to null to show
					indexedMasterForIndexControl: null
				}
			]
		}
	};
}

/**
 * Creates a document for testing null master values.
 * - Boolean null: hide condition "true" does NOT match null, so element should be visible
 * - Confirm null: hide condition "true" does NOT match null, so element should be visible
 * - Enum null: hide condition includes null, so element should be hidden
 */
export function createDocumentWithNullMasterValues(): GroupInstance {
	return {
		root: {
			masterFieldTypes: {
				// null for boolean - hide condition "true" should NOT match
				booleanMaster: null,
				// null for confirm - hide condition "true" should NOT match
				confirmMaster: null,
				// null is in the enum hide condition cases, so should be hidden
				enumMaster: null
			},
			masterFieldsForElements: {},
			fieldsForMasterTypes: {},
			fieldsForElements: {}
		}
	};
}
