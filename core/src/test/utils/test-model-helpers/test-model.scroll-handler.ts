// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { createModelPath } from "./repeat.infinite-scrolling.js";

export const FORM_MODEL_PATHS = {
	DETACHED_REPEAT_DETAIL: createModelPath(
		"Screen1",
		"detached-repeat-repGroup",
		"detached-repeat-repGroup-detail-screen"
	),
	INLINE_REPEAT_CELL: createModelPath(
		"Screen1",
		"inline-repeat-repGroup",
		"fieldbasedrepeatoverviewcolumn-9c952"
	),
	INLINE_REPEAT_CELL_TEXT_OUTPUT: createModelPath(
		"Screen1",
		"inline-repeat-repGroup",
		"fieldbasedrepeatoverviewcolumn_e1cd9"
	),
	FIELD_1: createModelPath("Screen1", "cg1", "row-cff60", "control-111e6"),
	FIELD_1_TEXT_OUTPUT: createModelPath("Screen1", "cg1", "row-cff60", "control_d90b9"),
	FIELD_2: createModelPath("Screen1", "cg1", "row-25463", "control-e9ef0"),

	INLINE_REPEAT: createModelPath("Screen1", "inline-repeat-repGroup"),
	DETACHED_REPEAT: createModelPath("Screen1", "detached-repeat-repGroup"),
	EMBEDDED_REPEAT: createModelPath("Screen1", "embedded-repeat-repGroup"),
	CG_IN_EMBEDDED_REPEAT: createModelPath("Screen1", "embedded-repeat-repGroup", "cg")
};

export const IDS = {
	FIELD_1: "a12-field1-field_2bbaa",
	FIELD_1_TEXT_OUTPUT: "a12-field1-field_2bbaa-2",
	FIELD_2: "a12-field2-field_3479a",
	INLINE_REPEAT_BODY_CELL: "a12-fieldbasedrepeatoverviewcolumn-9c952-bodycell-1",
	INLINE_REPEAT_CELL: "a12-fieldbasedrepeatoverviewcolumn-9c952-cell-1",
	INLINE_REPEAT_BODY_CELL_TEXT_OUTPUT: "a12-fieldbasedrepeatoverviewcolumn_e1cd9-bodycell-1",
	INLINE_REPEAT_CELL_TEXT_OUTPUT: "a12-fieldbasedrepeatoverviewcolumn_e1cd9-cell-1",
	INLINE_REPEAT: "a12-inlinerepeat-84edf-table",
	ADD_BUTTON_DETACHED_REPEAT: "a12-add-button-inlinerepeat-84edf",
	BODY_ROW_INLINE_REPEAT: "a12-inlinerepeat-84edf-bodyrow",
	EDIT_BUTTON_DETACHED_REPEAT: "a12-edit-button-detachedrepeat-597e9",
	CORRECTION_SCREEN_MESSAGE_BOX_ID: "a12-correction-screen-bar"
};
