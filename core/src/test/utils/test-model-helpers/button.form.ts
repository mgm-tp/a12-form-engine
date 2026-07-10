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

import { DocumentPath } from "../../../models/internal/utils/document-utils.js";

import { createDocumentPath } from "../createDocumentPath.js";
import { createModelPath } from "../createModelPath.js";

const detachedRepeatDetailScreen = createModelPath("Screen1", "Repeat", "Details");

export const BUTTONS = {
	screen1: "Screen1",
	iconThemes: "IconThemes",
	ariaLabel: "AriaLabel",
	labelHidden: "IconButtons",
	groupDocumentPath: createDocumentPath(["A12T_Buttons"], ["Group"]),
	detachedRepeatDetailScreen,
	buttonPanel: createModelPath("Screen1", "bp"),
	embeddedRepeat: createModelPath("Screen1", "Embedded-Repeat"),
	nestedEmbeddedRepeatDetailControlGrid: [
		...detachedRepeatDetailScreen,
		...createModelPath("embedded-repeat-Group2", "embedded-repeat-Group2-control-grid")
	],
	EVENT_1_BUTTON: "a12-button-3f18e",
	EVENT_1_BUTTON_PATH: createModelPath("subHeaderBox", "Event 1"),
	EVENT_2_BUTTON: "a12-button-35e02",
	EVENT_2_BUTTON_PATH: createModelPath("subHeaderBox", "Event 2"),
	EVENT_3_BUTTON: "a12-button-a39c3",
	EVENT_3_BUTTON_PATH: createModelPath("subHeaderBox", "Event 3"),
	EVENT_4_BUTTON: "a12-button-689b8",
	EVENT_5_BUTTON: "a12-button-18526",
	NAVIGATION_BUTTON: "a12-button-4516a",
	NAVIGATION_BUTTON_IN_DR: "a12-button-6e890",
	NAVIGATION_BUTTON_NEXT: "a12-screen-1-next",
	NAVIGATION_BUTTON_NEXT_VALIDATE: "a12-screen-1-next-validate",
	NAVIGATION_BUTTON_NEXT_FULL_VALIDATE: "a12-button-f8216",
	MENU_ITEM: "a12-button-8665a",
	DETACHED_REPEAT_BUTTON_ADD_APPLY: "a12-add-apply-button-detachedrepeat-f7f50",
	DETACHED_REPEAT_BUTTON_ADD_CANCEL: "a12-add-cancel-button-detachedrepeat-f7f50",
	DETACHED_REPEAT_BUTTON_EDIT_APPLY: "a12-edit-apply-button-detachedrepeat-f7f50",
	DETACHED_REPEAT_BUTTON_EDIT_CANCEL: "a12-edit-cancel-button-detachedrepeat-f7f50",
	DETACHED_REPEAT_BUTTON_RETURN: "a12-return-button-detachedrepeat-f7f50",
	DETACHED_REPEAT_CONFIRMATION_BUTTON_CONFIRM:
		"a12-edit-cancel-button-detachedrepeat-f7f50-confirm",
	DETACHED_REPEAT_CONFIRMATION_BUTTON_CANCEL: "a12-edit-cancel-button-detachedrepeat-f7f50-cancel",
	NUMBER_FIELD_DOCUMENT_PATH: DocumentPath.fromString("/A12T_Buttons[1]/NumberField[1]"),
	NUMBER_FIELD_MODEL_PATH: createModelPath("Screen1", "CG1", "cg1-r1", "c1"),
	REQUIRED_FIELD_DOCUMENT_PATH: DocumentPath.fromString("/A12T_Buttons[1]/RequiredField[1]"),
	ICON_THEMES: {
		MENU_ITEM: {
			filled: "a12-button_a5ffe",
			outlined: "a12-button_eb240",
			custom: "a12-button_69df1"
		},
		NAVIGATION: {
			filled: "a12-button_05397",
			outlined: "a12-button_8ce0c",
			custom: "a12-button_90758"
		},
		EVENT: {
			filled: "a12-button_78770",
			outlined: "a12-button_bb73c",
			custom: "a12-button_d582c"
		}
	},
	ARIA_LABEL: {
		MENU_ITEM: {
			labelDescription: "a12-button_72be1",
			label: "a12-button_345b1",
			description: "a12-button_08119",
			fallbackDescription: "a12-button_281ae",
			fallback: "a12-button_8b2e4"
		},
		NAVIGATION: {
			labelDescription: "a12-button_62be1",
			label: "a12-button_a45b1",
			description: "a12-button_b8119",
			fallbackDescription: "a12-button_181ae",
			fallback: "a12-button_eb2e4"
		},
		EVENT: {
			labelDescription: "a12-button_6c961",
			label: "a12-button_df0d8",
			description: "a12-button_b0e19"
		}
	},
	LABEL_HIDDEN: {
		MENU_ITEM: {
			withLabel: "a12-button-f5eef",
			withFallbackLabel: "a12-button_591c1"
		},
		NAVIGATION: {
			withLabel: "a12-button-9599d",
			withFallbackLabel: "a12-button_610e4"
		},
		EVENT: {
			withLabel: "a12-button-890bf"
		}
	}
} as const;
