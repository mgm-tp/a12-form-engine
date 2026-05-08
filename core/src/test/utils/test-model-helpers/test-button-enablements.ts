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

import { ModelHelpers } from "../model-helpers.js";

export namespace EVENT_BUTTONS {
	export const BUTTON_ALWAYS_SHOWN_ID = "a12-button-e665b";
	export const BUTTON_ALWAYS_SHOWN_NAME = "buttonAlwaysShown";

	export const BUTTON_HIDDEN_IN_RO_MODE_ID = "a12-button-6eddd";
	export const BUTTON_HIDDEN_IN_RO_MODE_NAME = "buttonHiddenInReadonlyMode";

	export const BUTTON_HIDDEN_IN_EDIT_MODE_ID = "a12-button-c2ab8";
	export const BUTTON_HIDDEN_IN_EDIT_MODE_NAME = "buttonHiddenInEditMode";

	export const BUTTON_DISABLED_IN_EDIT_MODE_ID = "a12-button-2588b";
	export const BUTTON_DISABLED_IN_EDIT_MODE_NAME = "buttonDisabledInEditMode";

	export const BUTTON_DISABLED_IN_RO_MODE_ID = "a12-button-6d1dc";
	export const BUTTON_DISABLED_IN_RO_MODE_NAME = "buttonDisabledInReadonlyMode";
}

export namespace NAVIGATION_BUTTONS {
	export const BUTTON_ALWAYS_SHOWN_ID = "a12-button-32579";
	export const BUTTON_ALWAYS_SHOWN_NAME = "navigationButtonAlwaysShown";

	export const BUTTON_HIDDEN_IN_RO_MODE_ID = "a12-button-81591";
	export const BUTTON_HIDDEN_IN_RO_MODE_NAME = "navigationButtonHiddenInReadonlyMode";

	export const BUTTON_HIDDEN_IN_EDIT_MODE_ID = "a12-button-0ea6d";
	export const BUTTON_HIDDEN_IN_EDIT_MODE_NAME = "navigationButtonHiddenInEditMode";

	export const BUTTON_DISABLED_IN_RO_MODE_ID = "a12-button-4ae55";
	export const BUTTON_DISABLED_IN_RO_MODE_NAME = "navigationButtonDisabledInReadonlyMode";

	export const BUTTON_DISABLED_IN_EDIT_MODE_ID = "a12-button-70b86";
	export const BUTTON_DISABLED_IN_EDIT_MODE_NAME = "navigationButtonDisabledInEditMode";
}

export namespace MENU_ITEMS {
	export const ITEM_ALWAYS_SHOWN_ID = "a12-button-0fdee";
	export const ITEM_ALWAYS_SHOWN_NAME = "menuItemAlwaysShown";

	export const ITEM_HIDDEN_IN_RO_MODE_ID = "a12-button-dc65a";
	export const ITEM_HIDDEN_IN_RO_MODE_NAME = "menuItemHiddenInReadonlyMode";

	export const ITEM_HIDDEN_IN_EDIT_MODE_ID = "a12-button-a5d68";
	export const ITEM_HIDDEN_IN_EDIT_MODE_NAME = "menuItemHiddenInEditMode";

	export const ITEM_DISABLED_IN_RO_MODE_ID = "a12-button-9a4e2";
	export const ITEM_DISABLED_IN_RO_MODE_NAME = "menuItemDisabledInReadonlyMode";

	export const ITEM_DISABLED_IN_EDIT_MODE_ID = "a12-button-79e9d";
	export const ITEM_DISABLED_IN_EDIT_MODE_NAME = "menuItemDisabledInEditMode";
}

export namespace IR_ROW_ACTIONS {
	export const ID_REPEAT = "a12-inlinerepeat-a54f9";

	export namespace BUTTONS {
		export const ID_REMOVE = "a12-remove-button-inlinerepeat-a54f9";
		export const ID_MOVE_UP = "a12-up-button-inlinerepeat-a54f9";
		export const ID_MOVE_DOWN = "a12-down-button-inlinerepeat-a54f9";
		export const ID_CLONE = "a12-copy-button-inlinerepeat-a54f9";
		export const ID_CUSTOM_ALWAYS_SHOWN_AND_ENABLED =
			"a12-custom-custom_event-button-inlinerepeat-a54f9";
		export const ID_CUSTOM_HIDDEN_IN_RO_MODE =
			"a12-custom-custom_event_hidden_in_ro_mode-button-inlinerepeat-a54f9";
		export const ID_CUSTOM_HIDDEN_IN_EDIT_MODE =
			"a12-custom-custom_event_hidden_in_edit_mode-button-inlinerepeat-a54f9";
		export const ID_CUSTOM_DISABLED_IN_EDIT_MODE =
			"a12-custom-custom_event_disabled_in_edit_mode-button-inlinerepeat-a54f9";
		export const ID_CUSTOM_DISABLED_IN_RO_MODE =
			"a12-custom-custom_event_disabled_in_ro_mode-button-inlinerepeat-a54f9";

		export const NAME_CUSTOM_ALWAYS_SHOWN_AND_ENABLED = "custom_event";
		export const NAME_CUSTOM_HIDDEN_IN_RO_MODE = "custom_event_hidden_in_ro_mode";
		export const NAME_CUSTOM_HIDDEN_IN_EDIT_MODE = "custom_event_hidden_in_edit_mode";
		export const NAME_CUSTOM_DISABLED_IN_EDIT_MODE = "custom_event_disabled_in_edit_mode";
		export const NAME_CUSTOM_DISABLED_IN_RO_MODE = "custom_event_disabled_in_ro_mode";
	}

	export namespace LIST_ITEMS {
		export const ID_REMOVE = "a12-remove-list-item-inlinerepeat-a54f9";
		export const ID_MOVE_UP = "a12-up-list-item-inlinerepeat-a54f9";
		export const ID_MOVE_DOWN = "a12-down-list-item-inlinerepeat-a54f9";
		export const ID_CLONE = "a12-copy-list-item-inlinerepeat-a54f9";
		export const ID_CUSTOM_ALWAYS_SHOWN_AND_ENABLED =
			"a12-custom-custom_event-list-item-inlinerepeat-a54f9";
		export const ID_CUSTOM_HIDDEN_IN_RO_MODE =
			"a12-custom-custom_event_hidden_in_ro_mode-list-item-inlinerepeat-a54f9";
		export const ID_CUSTOM_HIDDEN_IN_EDIT_MODE =
			"a12-custom-custom_event_hidden_in_edit_mode-list-item-inlinerepeat-a54f9";
		export const ID_CUSTOM_DISABLED_IN_EDIT_MODE =
			"a12-custom-custom_event_disabled_in_edit_mode-list-item-inlinerepeat-a54f9";
		export const ID_CUSTOM_DISABLED_IN_RO_MODE =
			"a12-custom-custom_event_disabled_in_ro_mode-list-item-inlinerepeat-a54f9";
	}

	export namespace COLUMNS {
		/**
		 * All enablements share the same column for tests
		 */
		export const ID = "a12-fieldbasedrepeatoverviewcolumn-e1311";
	}
}

export namespace DR_ROW_ACTIONS {
	export const ID_REPEAT = "a12-detachedrepeat-7a0db";

	export namespace BUTTONS {
		export const ID_EDIT = "a12-edit-button-detachedrepeat-7a0db";
		export const ID_VIEW = "a12-view-button-detachedrepeat-7a0db";
		export const ID_RETURN = "a12-return-button-detachedrepeat-7a0db";
		export const ID_COMMIT = "a12-edit-apply-button-detachedrepeat-7a0db";
		export const ID_CANCEL = "a12-edit-cancel-button-detachedrepeat-7a0db";
	}

	export namespace LIST_ITEMS {
		export const ID_EDIT = "a12-edit-list-item-detachedrepeat-7a0db";
		export const ID_VIEW = "a12-view-list-item-detachedrepeat-7a0db";
	}

	export namespace COLUMNS {
		/**
		 * All enablements share the same column for tests
		 */
		export const ID = "a12-fieldbasedrepeatoverviewcolumn-a77be";
	}
}

export namespace ER_EXPANDED_ROW {
	export namespace BUTTONS {
		export const ID_EDIT = "a12-edit-button-embeddedrepeat-7c6b8";
		export const ID_VIEW = "a12-view-button-embeddedrepeat-7c6b8";
	}
}

export namespace IR_ATTACHMENT_COLLECTION {
	export const ID_REPEAT = "a12-inlinerepeat-30b69";

	export namespace BUTTONS {
		export const ID_DOWNLOAD = "a12-download-button-inlinerepeat-30b69";
	}

	export namespace LIST_ITEMS {
		export const ID_DOWNLOAD = "a12-download-list-item-inlinerepeat-30b69";
	}

	export namespace COLUMNS {
		export const ID_DOWNLOAD = "a12-fieldbasedrepeatoverviewcolumn-982c0";
	}
}

export namespace FORM_MODEL {
	export const inlineRepeatPath = ModelHelpers.createModelPath(
		"rowActionButtons",
		"sec1",
		"inline-repeat"
	);

	export const detachedRepeatPath = ModelHelpers.createModelPath(
		"rowActionButtons",
		"sec1",
		"detached-repeat"
	);

	export const embeddedRepeatPath = ModelHelpers.createModelPath(
		"rowActionButtons",
		"sec1",
		"embedded-repeat"
	);
}
