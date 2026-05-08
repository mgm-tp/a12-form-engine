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

import type { EngineStore } from "../../../back-end/store/index.js";

export namespace IDS {
	export const SECTION = "a12-section-3722a";
	export const SECTION_FORMATTED = "a12-section-bf3fd";
	export const COLLAPSIBLE_SECTION = "a12-section-3aae7";
	export const COLLAPSIBLE_SECTION_FORMATTED = "a12-section-a7ce4";

	export const CONTROL_GRID = "a12-controlgrid-b99ea-title-headline";
	export const CONTROL_GRID_FORMATTED = "a12-controlgrid-0963d-title-headline";

	export const MULTI_COLUMN_SECTION = "a12-multicolumnsection-619bb-title-headline";
	export const MULTI_COLUMN_SECTION_FORMATTED = "a12-multicolumnsection-98b5a-title-headline";
	export const ROW = "a12-row-125c8-title-row";
	export const ROW_FORMATTED = "a12-row-a98cb-title-row";
	export const BUTTON_PANEL = "a12-buttonpanel-5a48d-title-headline";
	export const BUTTON_PANEL_FORMATTED = "a12-buttonpanel-89229-title-headline";

	export const EVENT_BUTTON = "a12-button-00492";
	export const NAVIGATION_BUTTON = "a12-button-81ee2";

	export const CONTROL_WITH_LABEL = "a12-stringfield-F4";
	export const CONTROL_WITH_LABEL_FORMATTED = "a12-stringfield-F4-4";
	export const CONTROL_WITH_FIELD_CONFIG_LABEL = "a12-stringfield_optional-field_b5f8c";
	export const CONTROL_WITH_FIELD_CONFIG_LABEL_FORMATTED =
		"a12-stringfield_optional_formatted-field_b5f8d";
	export const INDEXED_CONTROL_WITH_LABEL = "a12-stringfield-field_7b890";
	export const EXPRESSION_CELL = "expressioncell-a9a45";
	export const EXPRESSION_CELL_FORMATTED = "expressioncell-d3ee6";
	export const MULTI_SELECT = "a12-multiSelect-group_95c98";
	export const INDEXED_MULTI_SELECT = "a12-multiSelect-multi-select_31649";

	export const INLINE_REPEAT = "a12-inlinerepeat-2c9ed-table";
	export const INLINE_REPEAT_FORMATTED = "a12-inlinerepeat-26989-table";
	export const EMBEDDED_REPEAT = "a12-embeddedrepeat-d9156-table";
	export const EMBEDDED_REPEAT_FORMATTED = "a12-embeddedrepeat-306a7-table";
	export const DETACHED_REPEAT = "a12-detachedrepeat-9658d-table";
	export const DETACHED_REPEAT_FORMATTED = "a12-detachedrepeat-49a4b-table";

	export const INLINE_FIELD_OVERVIEW_COLUMN = "fieldbasedrepeatoverviewcolumn-5da07";
	export const INLINE_FIELD_OVERVIEW_COLUMN_FORMATTED = "fieldbasedrepeatoverviewcolumn-31c5e";
	export const EMBEDDED_FIELD_OVERVIEW_COLUMN = "fieldbasedrepeatoverviewcolumn-f2f37";
	export const EMBEDDED_FIELD_OVERVIEW_COLUMN_FORMATTED = "fieldbasedrepeatoverviewcolumn-a1fcd";
	export const DETACHED_FIELD_OVERVIEW_COLUMN = "fieldbasedrepeatoverviewcolumn-357ad";
	export const DETACHED_FIELD_OVERVIEW_COLUMN_FORMATTED = "fieldbasedrepeatoverviewcolumn-d01b2";

	export const INLINE_FIELD_OVERVIEW_COLUMN_FIELD_CONFIG = "fieldbasedrepeatoverviewcolumn-e51e8";
	export const INLINE_FIELD_OVERVIEW_COLUMN_FIELD_CONFIG_FORMATTED =
		"fieldbasedrepeatoverviewcolumn-3754b";
	export const EMBEDDED_FIELD_OVERVIEW_COLUMN_FIELD_CONFIG = "fieldbasedrepeatoverviewcolumn-b6a21";
	export const EMBEDDED_FIELD_OVERVIEW_COLUMN_FIELD_CONFIG_FORMATTED =
		"fieldbasedrepeatoverviewcolumn-f1fd0";
	export const DETACHED_FIELD_OVERVIEW_COLUMN_FIELD_CONFIG = "fieldbasedrepeatoverviewcolumn-ec68a";
	export const DETACHED_FIELD_OVERVIEW_COLUMN_FIELD_CONFIG_FORMATTED =
		"fieldbasedrepeatoverviewcolumn-91a53";

	export const INLINE_EXPRESSION_OVERVIEW_COLUMN = "expressionrepeatoverviewcolumn-5ad71";
	export const INLINE_EXPRESSION_OVERVIEW_COLUMN_FORMATTED = "expressionrepeatoverviewcolumn-83a8a";
	export const EMBEDDED_EXPRESSION_OVERVIEW_COLUMN = "expressionrepeatoverviewcolumn-22f55";
	export const EMBEDDED_EXPRESSION_OVERVIEW_COLUMN_FORMATTED =
		"expressionrepeatoverviewcolumn-6a96b";
	export const DETACHED_EXPRESSION_OVERVIEW_COLUMN = "expressionrepeatoverviewcolumn-41982";
	export const DETACHED_EXPRESSION_OVERVIEW_COLUMN_FORMATTED =
		"expressionrepeatoverviewcolumn-cbf85";

	export const CUSTOM_SCREEN_ELEMENT = "a12-customscreenelement-4197b";
	export const CUSTOM_SCREEN_ELEMENT_FORMATTED = "a12-customscreenelement-1476f";

	export namespace ROW_ACTIONS {
		export const ROW = "a12-inlinerepeat-2c9ed-bodyrow-0";
		export const ROW_FORMATTED = "a12-inlinerepeat-26989-bodyrow-0";

		export namespace BUTTONS {
			export const LABEL = "a12-custom-event1-button-inlinerepeat-2c9ed-1";
			export const LABEL_FORMATTED = "a12-custom-event1-button-inlinerepeat-26989-1";
			export const ICON_AND_LABELHIDDEN = "a12-custom-event2-button-inlinerepeat-2c9ed-1";
			export const LABEL_AND_ICON = "a12-custom-event3-button-inlinerepeat-2c9ed-1";

			export const CONFIRMATION_WITH_LABEL = "a12-custom-event4-button-inlinerepeat-2c9ed-1";
			export const CONFIRMATION_WITH_LABEL_FORMATTED =
				"a12-custom-event4-button-inlinerepeat-26989-1";
			export const CONFIRMATION_WITH_ICON_AND_LABELHIDDEN =
				"a12-custom-event5-button-inlinerepeat-2c9ed-1";
			export const CONFIRMATION_WITH_LABEL_AND_ICON =
				"a12-custom-event6-button-inlinerepeat-2c9ed-1";
		}

		export namespace LIST_ITEMS {
			export const LABEL = "a12-custom-event1-list-item-inlinerepeat-2c9ed-1";
			export const LABEL_FORMATTED = "a12-custom-event1-list-item-inlinerepeat-26989-1";
			export const ICON_AND_LABELHIDDEN = "a12-custom-event2-list-item-inlinerepeat-2c9ed-1";
			export const LABEL_AND_ICON = "a12-custom-event3-list-item-inlinerepeat-2c9ed-1";

			export const CONFIRMATION_WITH_LABEL = "a12-custom-event4-list-item-inlinerepeat-2c9ed-1";
			export const CONFIRMATION_WITH_LABEL_FORMATTED =
				"a12-custom-event4-list-item-inlinerepeat-26989-1";
			export const CONFIRMATION_WITH_ICON_AND_LABELHIDDEN =
				"a12-custom-event5-list-item-inlinerepeat-2c9ed-1";
			export const CONFIRMATION_WITH_LABEL_AND_ICON =
				"a12-custom-event6-list-item-inlinerepeat-2c9ed-1";
		}

		export namespace CELLS {
			export const labelFormattedRow = "a12-fieldbasedrepeatoverviewcolumn-9a77e-bodycell-0";
			export const labelRow = "a12-fieldbasedrepeatoverviewcolumn-7c3be-bodycell-0";
			export const labelAndIconRow = labelRow;
		}
	}
}

export const expressionLabelDocument = {
	root: {
		stringfield_empty: "TestValue",
		repeat: [
			{
				stringfield_empty: "TestValue from repeat",
				stringfield_COPY: "Dummy"
			}
		]
	}
};

export const formattedExpressionUiState: Pick<EngineStore.UIState, "screenLocation"> &
	Partial<EngineStore.UIState> = {
	screenLocation: [
		{
			path: [],
			locationPath: [{ elementName: "FormattedExpressionLabels" }]
		}
	]
};
