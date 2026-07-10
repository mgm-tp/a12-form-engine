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

export const EVENT_BUTTONS = {
	BUTTON_ALWAYS_SHOWN_ID: "a12-button-e665b",
	BUTTON_ALWAYS_SHOWN_NAME: "buttonAlwaysShown",
	BUTTON_HIDDEN_IN_RO_MODE_ID: "a12-button-6eddd",
	BUTTON_HIDDEN_IN_RO_MODE_NAME: "buttonHiddenInReadonlyMode",
	BUTTON_HIDDEN_IN_EDIT_MODE_ID: "a12-button-c2ab8",
	BUTTON_HIDDEN_IN_EDIT_MODE_NAME: "buttonHiddenInEditMode",
	BUTTON_DISABLED_IN_EDIT_MODE_ID: "a12-button-2588b",
	BUTTON_DISABLED_IN_EDIT_MODE_NAME: "buttonDisabledInEditMode",
	BUTTON_DISABLED_IN_RO_MODE_ID: "a12-button-6d1dc",
	BUTTON_DISABLED_IN_RO_MODE_NAME: "buttonDisabledInReadonlyMode"
} as const;

export const NAVIGATION_BUTTONS = {
	BUTTON_ALWAYS_SHOWN_ID: "a12-button-32579",
	BUTTON_ALWAYS_SHOWN_NAME: "navigationButtonAlwaysShown",
	BUTTON_HIDDEN_IN_RO_MODE_ID: "a12-button-81591",
	BUTTON_HIDDEN_IN_RO_MODE_NAME: "navigationButtonHiddenInReadonlyMode",
	BUTTON_HIDDEN_IN_EDIT_MODE_ID: "a12-button-0ea6d",
	BUTTON_HIDDEN_IN_EDIT_MODE_NAME: "navigationButtonHiddenInEditMode",
	BUTTON_DISABLED_IN_RO_MODE_ID: "a12-button-4ae55",
	BUTTON_DISABLED_IN_RO_MODE_NAME: "navigationButtonDisabledInReadonlyMode",
	BUTTON_DISABLED_IN_EDIT_MODE_ID: "a12-button-70b86",
	BUTTON_DISABLED_IN_EDIT_MODE_NAME: "navigationButtonDisabledInEditMode"
} as const;

export const MENU_ITEMS = {
	ITEM_ALWAYS_SHOWN_ID: "a12-button-0fdee",
	ITEM_ALWAYS_SHOWN_NAME: "menuItemAlwaysShown",
	ITEM_HIDDEN_IN_RO_MODE_ID: "a12-button-dc65a",
	ITEM_HIDDEN_IN_RO_MODE_NAME: "menuItemHiddenInReadonlyMode",
	ITEM_HIDDEN_IN_EDIT_MODE_ID: "a12-button-a5d68",
	ITEM_HIDDEN_IN_EDIT_MODE_NAME: "menuItemHiddenInEditMode",
	ITEM_DISABLED_IN_RO_MODE_ID: "a12-button-9a4e2",
	ITEM_DISABLED_IN_RO_MODE_NAME: "menuItemDisabledInReadonlyMode",
	ITEM_DISABLED_IN_EDIT_MODE_ID: "a12-button-79e9d",
	ITEM_DISABLED_IN_EDIT_MODE_NAME: "menuItemDisabledInEditMode"
} as const;

export const IR_ROW_ACTIONS = {
	ID_REPEAT: "a12-inlinerepeat-a54f9",
	BUTTONS: {
		ID_REMOVE: "a12-remove-button-inlinerepeat-a54f9",
		ID_MOVE_UP: "a12-up-button-inlinerepeat-a54f9",
		ID_MOVE_DOWN: "a12-down-button-inlinerepeat-a54f9",
		ID_CLONE: "a12-copy-button-inlinerepeat-a54f9",
		ID_CUSTOM_ALWAYS_SHOWN_AND_ENABLED: "a12-custom-custom_event-button-inlinerepeat-a54f9",
		ID_CUSTOM_HIDDEN_IN_RO_MODE:
			"a12-custom-custom_event_hidden_in_ro_mode-button-inlinerepeat-a54f9",
		ID_CUSTOM_HIDDEN_IN_EDIT_MODE:
			"a12-custom-custom_event_hidden_in_edit_mode-button-inlinerepeat-a54f9",
		ID_CUSTOM_DISABLED_IN_EDIT_MODE:
			"a12-custom-custom_event_disabled_in_edit_mode-button-inlinerepeat-a54f9",
		ID_CUSTOM_DISABLED_IN_RO_MODE:
			"a12-custom-custom_event_disabled_in_ro_mode-button-inlinerepeat-a54f9",
		NAME_CUSTOM_ALWAYS_SHOWN_AND_ENABLED: "custom_event",
		NAME_CUSTOM_HIDDEN_IN_RO_MODE: "custom_event_hidden_in_ro_mode",
		NAME_CUSTOM_HIDDEN_IN_EDIT_MODE: "custom_event_hidden_in_edit_mode",
		NAME_CUSTOM_DISABLED_IN_EDIT_MODE: "custom_event_disabled_in_edit_mode",
		NAME_CUSTOM_DISABLED_IN_RO_MODE: "custom_event_disabled_in_ro_mode"
	},
	LIST_ITEMS: {
		ID_REMOVE: "a12-remove-list-item-inlinerepeat-a54f9",
		ID_MOVE_UP: "a12-up-list-item-inlinerepeat-a54f9",
		ID_MOVE_DOWN: "a12-down-list-item-inlinerepeat-a54f9",
		ID_CLONE: "a12-copy-list-item-inlinerepeat-a54f9",
		ID_CUSTOM_ALWAYS_SHOWN_AND_ENABLED: "a12-custom-custom_event-list-item-inlinerepeat-a54f9",
		ID_CUSTOM_HIDDEN_IN_RO_MODE:
			"a12-custom-custom_event_hidden_in_ro_mode-list-item-inlinerepeat-a54f9",
		ID_CUSTOM_HIDDEN_IN_EDIT_MODE:
			"a12-custom-custom_event_hidden_in_edit_mode-list-item-inlinerepeat-a54f9",
		ID_CUSTOM_DISABLED_IN_EDIT_MODE:
			"a12-custom-custom_event_disabled_in_edit_mode-list-item-inlinerepeat-a54f9",
		ID_CUSTOM_DISABLED_IN_RO_MODE:
			"a12-custom-custom_event_disabled_in_ro_mode-list-item-inlinerepeat-a54f9"
	},
	COLUMNS: {
		ID: "a12-fieldbasedrepeatoverviewcolumn-e1311"
	}
} as const;

export const DR_ROW_ACTIONS = {
	ID_REPEAT: "a12-detachedrepeat-7a0db",
	BUTTONS: {
		ID_EDIT: "a12-edit-button-detachedrepeat-7a0db",
		ID_VIEW: "a12-view-button-detachedrepeat-7a0db",
		ID_RETURN: "a12-return-button-detachedrepeat-7a0db",
		ID_COMMIT: "a12-edit-apply-button-detachedrepeat-7a0db",
		ID_CANCEL: "a12-edit-cancel-button-detachedrepeat-7a0db"
	},
	LIST_ITEMS: {
		ID_EDIT: "a12-edit-list-item-detachedrepeat-7a0db",
		ID_VIEW: "a12-view-list-item-detachedrepeat-7a0db"
	},
	COLUMNS: {
		ID: "a12-fieldbasedrepeatoverviewcolumn-a77be"
	}
} as const;

export const ER_EXPANDED_ROW = {
	BUTTONS: {
		ID_EDIT: "a12-edit-button-embeddedrepeat-7c6b8",
		ID_VIEW: "a12-view-button-embeddedrepeat-7c6b8"
	}
} as const;

export const IR_ATTACHMENT_COLLECTION = {
	ID_REPEAT: "a12-inlinerepeat-30b69",
	BUTTONS: {
		ID_DOWNLOAD: "a12-download-button-inlinerepeat-30b69"
	},
	LIST_ITEMS: {
		ID_DOWNLOAD: "a12-download-list-item-inlinerepeat-30b69"
	},
	COLUMNS: {
		ID_DOWNLOAD: "a12-fieldbasedrepeatoverviewcolumn-982c0"
	}
} as const;

export const FORM_MODEL = {
	inlineRepeatPath: createModelPath("rowActionButtons", "sec1", "inline-repeat"),
	detachedRepeatPath: createModelPath("rowActionButtons", "sec1", "detached-repeat"),
	embeddedRepeatPath: createModelPath("rowActionButtons", "sec1", "embedded-repeat")
} as const;
