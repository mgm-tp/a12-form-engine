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

import type {
	EntityInstancePath,
	GroupInstance
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { DocumentHelpers } from "../document-helpers.js";
import { ModelHelpers } from "../model-helpers.js";

import { createModelPath } from "./dependent-enumeration.js";

export namespace IDS {
	export namespace DEFAULT_ROW_ACTIONS {
		export const repeatEdit = "detachedrepeat-0e8f9";
		export const repeatEventAlwaysShownAndEnabled = "detachedrepeat-5068f";
		export const repeatEventHiddenInReadonlyMode = "detachedrepeat-500d1";
		export const repeatEventHiddenInEditMode = "detachedrepeat-87408";
		export const repeatEventDisabledInEditMode = "detachedrepeat-3191f";
		export const repeatEventDisabledInReadonlyMode = "detachedrepeat-6f697";
		export const repeatRemove = "detachedrepeat-8cccb";
		export const repeatMove = "detachedrepeat-e911c";
		export const repeatClone = "detachedrepeat-4fb5a";
		export const repeatDownload = "embeddedrepeat-df33b";
		export const repeatNoDefaultRowAction = "detachedrepeat-fd08f";

		export const removeButton = "a12-remove-button-detachedrepeat-8cccb-1";
		export const moveUpButton = "a12-up-button-detachedrepeat-e911c-2";
		export const moveDownButton = "a12-down-button-detachedrepeat-e911c-1";
		export const cloneButton = "a12-copy-button-detachedrepeat-4fb5a-1";
		export const editButton = "a12-edit-button-detachedrepeat-5068f-1";
		export const downloadButton = "a12-download-button-embeddedrepeat-79d3c-1";
		export const addButton = "a12-add-button-detachedrepeat-8cccb";
	}

	export namespace ROW_ACTIONS {
		export const repeatAllFalse = "a12-detachedrepeat-ba430";
		export const repeatOnlyAddTrue = "a12-detachedrepeat-981d9";
		export const repeatOnlyRemoveTrue = "a12-detachedrepeat-5a779";
		export const repeatOnlyMoveTrue = "a12-detachedrepeat-1a9f9";
		export const repeatOnlyCloneTrue = "a12-detachedrepeat-d910e";
		export const repeatOnlyDownloadTrue = "a12-embeddedrepeat-5ca73";
		export const repeatCustomRowActions = "a12-detachedrepeat-622e6";

		export namespace BUTTONS {
			export const remove = "a12-remove-button-detachedrepeat-5a779-1";
			export const moveUp = "a12-up-button-detachedrepeat-1a9f9-2";
			export const moveDown = "a12-down-button-detachedrepeat-1a9f9-1";
			export const clone = "a12-copy-button-detachedrepeat-d910e-1";
			export const download = "a12-download-button-embeddedrepeat-5ca73-1";
			export const editInRepeatAllFalse = "a12-edit-button-detachedrepeat-ba430-1";
			export const eventAlwaysShownAndEnabledWithConfirmation =
				"a12-custom-always-shown-and-enabled-button-detachedrepeat-ba430-1";

			export const viewInRepeatAllFalse = "a12-view-button-detachedrepeat-ba430-1";

			export const eventAlwaysShownAndEnabled =
				"a12-custom-always-shown-and-enabled-button-detachedrepeat-622e6-1";
			export const eventHiddenInReadonlyMode =
				"a12-custom-hidden-in-ro-mode-button-detachedrepeat-622e6-1";
			export const eventHiddenInEditMode =
				"a12-custom-hidden-in-edit-mode-button-detachedrepeat-622e6-1";
			export const eventDisabledInEditMode =
				"a12-custom-disabled-in-edit-mode-button-detachedrepeat-622e6-1";
			export const eventDisabledInReadonlyMode =
				"a12-custom-disabled-in-ro-mode-button-detachedrepeat-622e6-1";
		}

		export namespace LIST_ITEMS {
			export const remove = "a12-remove-list-item-detachedrepeat-5a779-1";
			export const moveUp = "a12-up-list-item-detachedrepeat-1a9f9-2";
			export const moveDown = "a12-down-list-item-detachedrepeat-1a9f9-1";
			export const clone = "a12-copy-list-item-detachedrepeat-d910e-1";
			export const download = "a12-download-list-item-embeddedrepeat-5ca73-1";
			export const editInRepeatAllFalse = "a12-edit-list-item-detachedrepeat-ba430-1";
			export const eventAlwaysShownAndEnabledWithConfirmation =
				"a12-custom-always-shown-and-enabled-list-item-detachedrepeat-ba430-1";

			export const viewInRepeatAllFalse = "a12-view-list-item-detachedrepeat-ba430-1";

			export const eventAlwaysShownAndEnabled =
				"a12-custom-always-shown-and-enabled-list-item-detachedrepeat-622e6-1";
			export const eventHiddenInReadonlyMode =
				"a12-custom-hidden-in-ro-mode-list-item-detachedrepeat-622e6-1";
			export const eventHiddenInEditMode =
				"a12-custom-hidden-in-edit-mode-list-item-detachedrepeat-622e6-1";
			export const eventDisabledInEditMode =
				"a12-custom-disabled-in-edit-mode-list-item-detachedrepeat-622e6-1";
			export const eventDisabledInReadonlyMode =
				"a12-custom-disabled-in-ro-mode-list-item-detachedrepeat-622e6-1";
		}
	}

	export namespace EMBEDDED_REPEAT {
		export namespace EXPANDED_ROW {
			export const editFooterButton = "a12-edit-button-embeddedrepeat-bb6d0-1";
			export const viewFooterButton = "a12-view-button-embeddedrepeat-bb6d0-1";
		}
	}

	export namespace INLINE_REPEAT {
		export const repeatAllFalse = "a12-inlinerepeat-9446b";
		export const repeatOnlyOnlyRemoveTrue = "a12-inlinerepeat-ded75";

		export namespace ALL_FALSE {
			export const firstCell = "a12-fieldbasedrepeatoverviewcolumn-455a5-bodycell";
		}

		export namespace ONLY_REMOVE {
			export const firstCell = "a12-fieldbasedrepeatoverviewcolumn-29575-bodycell";
		}

		export namespace ONLY_CLONE {
			export const firstCell = "a12-fieldbasedrepeatoverviewcolumn-91de5-bodycell";
		}

		export namespace ONLY_MOVE {
			export const firstCell = "a12-fieldbasedrepeatoverviewcolumn-1ae96-bodycell";
		}

		export namespace ONLY_DOWNLOAD {
			export const firstCell = "a12-fieldbasedrepeatoverviewcolumn-d51d6-bodycell";
		}

		export namespace CUSTOM_ROW_ACTIONS {
			export const firstCell = "a12-fieldbasedrepeatoverviewcolumn-0d42e-bodycell";
		}
	}

	export namespace CUSTOM_ROW_ACTIONS {
		export const labelRow = "a12-inlinerepeat-992fa-bodyrow-0";
		export const iconRow = "a12-inlinerepeat-180a0-bodyrow-0";
		export const descriptionRow = "a12-inlinerepeat_a09ed-bodyrow-0";
		export const labelAndDescriptionRow = "a12-inlinerepeat_44060-bodyrow-0";
		export const labelAndIconRow = "a12-inlinerepeat-c8984-bodyrow-0";
		export const labelHiddenRow = "a12-inlinerepeat-a7e76-bodyrow-0";
		export const descriptionAndIconRow = "a12-inlinerepeat_66dae-bodyrow-0";
		export const labelAndDescriptionAndIconRow = "a12-inlinerepeat_e6f2a-bodyrow-0";
		export const labelAndDescriptionLabelHiddenRow = "a12-inlinerepeat_aa7de-bodyrow-0";

		export namespace BUTTONS {
			export const label = "a12-custom-event-button-inlinerepeat-992fa-1";
			export const icon = "a12-custom-event-button-inlinerepeat-180a0-1";
			export const description = "a12-custom-event-button-inlinerepeat_a09ed-1";
			export const labelAndDescription = "a12-custom-event-button-inlinerepeat_44060-1";
			export const labelAndIcon = "a12-custom-event-button-inlinerepeat-c8984-1";
			export const labelAndIconWithLabelHidden = "a12-custom-event-button-inlinerepeat-a7e76-1";
			export const descriptionAndIcon = "a12-custom-event-button-inlinerepeat_66dae-1";
			export const labelAndDescriptionAndIcon = "a12-custom-event-button-inlinerepeat_e6f2a-1";
			export const labelAndDescriptionLabelHidden = "a12-custom-event-button-inlinerepeat_aa7de-1";

			export const confirmationLabel = "a12-custom-event-confirmation-button-inlinerepeat-992fa-1";
			export const confirmationIcon = "a12-custom-event-confirmation-button-inlinerepeat-180a0-1";
			export const confirmationDescription =
				"a12-custom-event-confirmation-button-inlinerepeat_a09ed-1";
			export const confirmationLabelAndDescription =
				"a12-custom-event-confirmation-button-inlinerepeat_44060-1";
			export const confirmationLabelAndIcon =
				"a12-custom-event-confirmation-button-inlinerepeat-c8984-1";
			export const confirmationLabelAndIconWithLabelHidden =
				"a12-custom-event-confirmation-button-inlinerepeat-a7e76-1";
			export const confirmationDescriptionAndIcon =
				"a12-custom-event-confirmation-button-inlinerepeat_66dae-1";
			export const confirmationLabelAndDescriptionAndIcon =
				"a12-custom-event-confirmation-button-inlinerepeat_e6f2a-1";
			export const confirmationLabelAndDescriptionLabelHidden =
				"a12-custom-event-confirmation-button-inlinerepeat_aa7de-1";

			export const secondary = "a12-custom-event-button-inlinerepeat-ac321-1";
			export const primary = "a12-custom-event-button-inlinerepeat-8f61c-1";
			export const notDestructive = "a12-custom-event-button-inlinerepeat-50d47-1";
			export const destructive = "a12-custom-event-button-inlinerepeat-aa584-1";

			export const confirmationSecondary =
				"a12-custom-event-confirmation-button-inlinerepeat-ac321-1";
			export const confirmationPrimary =
				"a12-custom-event-confirmation-button-inlinerepeat-8f61c-1";
			export const confirmationNotDestructive =
				"a12-custom-event-confirmation-button-inlinerepeat-50d47-1";
			export const confirmationDestructive =
				"a12-custom-event-confirmation-button-inlinerepeat-aa584-1";
		}

		export namespace LIST_ITEMS {
			export const label = "a12-custom-event-list-item-inlinerepeat-992fa-1";
			export const icon = "a12-custom-event-list-item-inlinerepeat-180a0-1";
			export const description = "a12-custom-event-list-item-inlinerepeat_a09ed-1";
			export const labelAndDescription = "a12-custom-event-list-item-inlinerepeat_44060-1";
			export const labelAndIcon = "a12-custom-event-list-item-inlinerepeat-c8984-1";
			export const labelAndIconWithLabelHidden = "a12-custom-event-list-item-inlinerepeat-a7e76-1";
			export const descriptionAndIcon = "a12-custom-event-list-item-inlinerepeat_66dae-1";
			export const labelAndDescriptionAndIcon = "a12-custom-event-list-item-inlinerepeat_e6f2a-1";
			export const labelAndDescriptionLabelHidden =
				"a12-custom-event-list-item-inlinerepeat_aa7de-1";

			export const confirmationLabel =
				"a12-custom-event-confirmation-list-item-inlinerepeat-992fa-1";
			export const confirmationIcon =
				"a12-custom-event-confirmation-list-item-inlinerepeat-180a0-1";
			export const confirmationDescription =
				"a12-custom-event-confirmation-list-item-inlinerepeat_a09ed-1";
			export const confirmationLabelAndDescription =
				"a12-custom-event-confirmation-list-item-inlinerepeat_44060-1";
			export const confirmationLabelAndIcon =
				"a12-custom-event-confirmation-list-item-inlinerepeat-c8984-1";
			export const confirmationLabelAndIconWithLabelHidden =
				"a12-custom-event-confirmation-list-item-inlinerepeat-a7e76-1";
			export const confirmationDescriptionAndIcon =
				"a12-custom-event-confirmation-list-item-inlinerepeat_66dae-1";
			export const confirmationLabelAndDescriptionAndIcon =
				"a12-custom-event-confirmation-list-item-inlinerepeat_e6f2a-1";
			export const confirmationLabelAndDescriptionLabelHidden =
				"a12-custom-event-confirmation-list-item-inlinerepeat_aa7de-1";
		}

		export namespace CELLS {
			export const iconRow = "a12-fieldbasedrepeatoverviewcolumn-6a741-bodycell-0";
			export const labelRow = "a12-fieldbasedrepeatoverviewcolumn-23851-bodycell-0";
			export const descriptionRow = "a12-fieldbasedrepeatoverviewcolumn_7e8c8-bodycell-0";
			export const labelAndDescriptionRow = "a12-fieldbasedrepeatoverviewcolumn_6f833-bodycell-0";
			export const labelAndIconRow = "a12-fieldbasedrepeatoverviewcolumn-fecd5-bodycell-0";
			export const labelHiddenRow = "a12-fieldbasedrepeatoverviewcolumn-211e8-bodycell-0";
			export const descriptionAndIconRow = "a12-fieldbasedrepeatoverviewcolumn_3c26d-bodycell-0";
			export const labelAndDescriptionAndIconRow =
				"a12-fieldbasedrepeatoverviewcolumn_aeb99-bodycell-0";
			export const labelAndDescriptionLabelHiddenRow =
				"a12-fieldbasedrepeatoverviewcolumn_bd410-bodycell-0";
		}

		export namespace ARIA_LABEL {
			export namespace BUTTONS {
				export const labelDescription = "a12-custom-e1-button-inlinerepeat_6ed3a-1";
				export const label = "a12-custom-e1-button-inlinerepeat_9bfd9-1";
				export const description = "a12-custom-e1-button-inlinerepeat_89513-1";

				export const confirmationLabelDescription = "a12-custom-e1c-button-inlinerepeat_6ed3a-1";
				export const confirmationLabel = "a12-custom-e1c-button-inlinerepeat_9bfd9-1";
				export const confirmationDescription = "a12-custom-e1c-button-inlinerepeat_89513-1";
			}

			export namespace LIST_ITEMS {
				export const labelDescription = "a12-custom-e1-list-item-inlinerepeat_6ed3a-1";
				export const label = "a12-custom-e1-list-item-inlinerepeat_9bfd9-1";
				export const description = "a12-custom-e1-list-item-inlinerepeat_89513-1";

				export const confirmationLabelDescription = "a12-custom-e1c-list-item-inlinerepeat_6ed3a-1";
				export const confirmationLabel = "a12-custom-e1c-list-item-inlinerepeat_9bfd9-1";
				export const confirmationDescription = "a12-custom-e1c-list-item-inlinerepeat_89513-1";
			}

			export namespace CELLS {
				export const labelDescription = "a12-fieldbasedrepeatoverviewcolumn_7cee1-bodycell-0";
				export const label = "a12-fieldbasedrepeatoverviewcolumn_f4e1d-bodycell-0";
				export const description = "a12-fieldbasedrepeatoverviewcolumn_2ae2c-bodycell-0";
			}
		}
	}

	export namespace SCREEN_READER_COLUMN_TEST {
		export namespace IR_WITH_SCREEN_READER_COLUMN {
			export const checkboxColumnModelPath = ModelHelpers.createModelPath(
				"ScreenReaderColumn",
				"mfa",
				"fieldbasedrepeatoverviewcolumn_87d0c"
			);

			export const repeat = "inlinerepeat_4ecb2";
			export const columnRef = "a12-fieldbasedrepeatoverviewcolumn_d7b35-cell-0";

			export const customButton = `a12-custom-custom-button-${repeat}-1`;
			export const customConfirmButton = `a12-custom-customConfirm-button-${repeat}-1`;
			export const downloadButton = `a12-download-button-${repeat}-1`;
			export const upButton = `a12-up-button-${repeat}-1`;
			export const downButton = `a12-down-button-${repeat}-1`;
			export const copyButton = `a12-copy-button-${repeat}-1`;
			export const removeButton = `a12-remove-button-${repeat}-1`;
		}

		export namespace ER_WITH_SCREEN_READER_COLUMN {
			export const repeat = "embeddedrepeat_99e5c";
			export const columnRef = "a12-fieldbasedrepeatoverviewcolumn_6f096-bodycell-0";

			export const editButton = `a12-edit-button-${repeat}-1`;
			export const viewButton = `a12-view-button-${repeat}-1`;
		}

		export namespace IR_WITHOUT_SCREEN_READER_COLUMN {
			export const checkboxColumnModelPath = ModelHelpers.createModelPath(
				"ScreenReaderColumn",
				"other",
				"fieldbasedrepeatoverviewcolumn_87d0d"
			);
		}
	}
}

export namespace VISIBILITY {
	export namespace NOT_RO {
		export const REPEAT_PATH = ModelHelpers.createModelPath("Enablement", "secGeneral", "DR");
		export const REPEAT_ID = "a12-detachedrepeat-84a02";

		export const REPEAT_ATTACHMENT_COLLECTION_PATH = ModelHelpers.createModelPath(
			"Enablement",
			"SecMultiFileUpload",
			"ER"
		);
		export const REPEAT_ATTACHMENT_COLLECTION_ID = "a12-embeddedrepeat-ae0d8";

		export namespace BUTTONS {
			export const ID_EDIT = "a12-edit-button-detachedrepeat-84a02";
			export const ID_VIEW = "a12-view-button-detachedrepeat-84a02";
			export const ID_HIDDEN_IN_RO_MODE =
				"a12-custom-hidden-in-ro-mode-button-detachedrepeat-84a02";
			export const ID_HIDDEN_IN_EDIT_MODE =
				"a12-custom-hidden-in-edit-mode-button-detachedrepeat-84a02";
			export const ID_DISABLED_IN_EDIT_MODE =
				"a12-custom-disabled-in-edit-mode-button-detachedrepeat-84a02";
			export const ID_DISABLED_IN_RO_MODE =
				"a12-custom-disabled-in-ro-mode-button-detachedrepeat-84a02";
			export const ID_ALWAYS_SHOWN_AND_ENABLED =
				"a12-custom-always-shown-and-enabled-button-detachedrepeat-84a02";
			export const ID_CLONE = "a12-copy-button-detachedrepeat-84a02";
			export const ID_MOVE_UP = "a12-up-button-detachedrepeat-84a02";
			export const ID_MOVE_DOWN = "a12-down-button-detachedrepeat-84a02";
			export const ID_DELETE = "a12-remove-button-detachedrepeat-84a02";
			export const ID_COMMIT = "a12-edit-apply-button-detachedrepeat-84a02";
			export const ID_CANCEL = "a12-edit-cancel-button-detachedrepeat-84a02";
			export const ID_RETURN = "a12-return-button-detachedrepeat-84a02";
			export const ID_DOWNLOAD = "a12-download-button-embeddedrepeat-ae0d8";
		}

		export namespace LIST_ITEMS {
			export const ID_EDIT = "a12-edit-list-item-detachedrepeat-84a02";
			export const ID_VIEW = "a12-view-list-item-detachedrepeat-84a02";
			export const ID_HIDDEN_IN_RO_MODE =
				"a12-custom-hidden-in-ro-mode-list-item-detachedrepeat-84a02";
			export const ID_HIDDEN_IN_EDIT_MODE =
				"a12-custom-hidden-in-edit-mode-list-item-detachedrepeat-84a02";
			export const ID_DISABLED_IN_EDIT_MODE =
				"a12-custom-disabled-in-edit-mode-list-item-detachedrepeat-84a02";
			export const ID_DISABLED_IN_RO_MODE =
				"a12-custom-disabled-in-ro-mode-list-item-detachedrepeat-84a02";
			export const ID_ALWAYS_SHOWN_AND_ENABLED =
				"a12-custom-always-shown-and-enabled-list-item-detachedrepeat-84a02";
			export const ID_CLONE = "a12-copy-list-item-detachedrepeat-84a02";
			export const ID_MOVE_UP = "a12-up-list-item-detachedrepeat-84a02";
			export const ID_MOVE_DOWN = "a12-down-list-item-detachedrepeat-84a02";
			export const ID_DELETE = "a12-remove-list-item-detachedrepeat-84a02";
			export const ID_DOWNLOAD = "a12-download-list-item-embeddedrepeat-ae0d8";
		}

		export namespace COLUMNS {
			/**
			 * All row actions except "download" share the same column for tests
			 */
			export const ID = "a12-fieldbasedrepeatoverviewcolumn-2d732";
			export const ID_DOWNLOAD = "a12-fieldbasedrepeatoverviewcolumn-b5de3";
		}

		export const DR_LOCATION_PATH = ModelHelpers.createModelPath(
			"Enablement",
			"secGeneral",
			"DR",
			"DR-detail-screen"
		);
		export const DR_PATH = DocumentHelpers.createDocumentPath(
			["Root"],
			["repeatReadonlyByDependency"]
		);
	}

	export namespace BY_MODEL {
		export namespace BUTTONS {
			export const ID_VIEW = "a12-view-button-detachedrepeat-17573";
			export const ID_HIDDEN_IN_RO_MODE =
				"a12-custom-hidden-in-ro-mode-button-detachedrepeat-17573";
			export const ID_HIDDEN_IN_EDIT_MODE =
				"a12-custom-hidden-in-edit-mode-button-detachedrepeat-17573";
			export const ID_DISABLED_IN_EDIT_MODE =
				"a12-custom-disabled-in-edit-mode-button-detachedrepeat-17573";
			export const ID_DISABLED_IN_RO_MODE =
				"a12-custom-disabled-in-ro-mode-button-detachedrepeat-17573";
			export const ID_ALWAYS_SHOWN_AND_ENABLED =
				"a12-custom-always-shown-and-enabled-button-detachedrepeat-17573";
			export const ID_RETURN = "a12-return-button-detachedrepeat-17573";
			export const ID_DOWNLOAD = "a12-download-button-embeddedrepeat-f022b";
		}

		export namespace LIST_ITEMS {
			export const ID_VIEW = "a12-view-list-item-detachedrepeat-17573";
			export const ID_HIDDEN_IN_RO_MODE =
				"a12-custom-hidden-in-ro-mode-list-item-detachedrepeat-17573";
			export const ID_HIDDEN_IN_EDIT_MODE =
				"a12-custom-hidden-in-edit-mode-list-item-detachedrepeat-17573";
			export const ID_DISABLED_IN_EDIT_MODE =
				"a12-custom-disabled-in-edit-mode-list-item-detachedrepeat-17573";
			export const ID_DISABLED_IN_RO_MODE =
				"a12-custom-disabled-in-ro-mode-list-item-detachedrepeat-17573";
			export const ID_ALWAYS_SHOWN_AND_ENABLED =
				"a12-custom-always-shown-and-enabled-list-item-detachedrepeat-17573";
			export const ID_RETURN = "a12-return-list-item-detachedrepeat-17573";
			export const ID_DOWNLOAD = "a12-download-list-item-embeddedrepeat-f022b";
		}

		export namespace COLUMNS {
			/**
			 * All row actions except "download" share the same column for tests
			 */
			export const ID = "a12-fieldbasedrepeatoverviewcolumn-9e89e";
			export const ID_DOWNLOAD = "a12-fieldbasedrepeatoverviewcolumn-98b51";
		}

		export const REPEAT_ID = "a12-detachedrepeat-17573";
		export const DR_LOCATION_PATH = ModelHelpers.createModelPath(
			"Enablement",
			"secGeneral",
			"DR-ro",
			"DR-detail-screen"
		);
		export const DR_PATH = DocumentHelpers.createDocumentPath(["Root"], ["repeat"]);

		export const REPEAT_ATTACHMENT_COLLECTION_PATH = ModelHelpers.createModelPath(
			"Enablement",
			"SecMultiFileUpload",
			"ER-ro"
		);
		export const REPEAT_ATTACHMENT_COLLECTION_ID = "a12-embeddedrepeat-f022b";
	}

	export namespace BY_DEP {
		export const BODY_ROW = "a12-detachedrepeat-973b2-bodyrow-0";

		export namespace BUTTONS {
			export const ID_EDIT = "a12-edit-button-detachedrepeat-973b2";
			export const ID_HIDDEN_IN_RO_MODE =
				"a12-custom-hidden-in-ro-mode-button-detachedrepeat-973b2";
			export const ID_HIDDEN_IN_EDIT_MODE =
				"a12-custom-hidden-in-edit-mode-button-detachedrepeat-973b2";
			export const ID_DISABLED_IN_EDIT_MODE =
				"a12-custom-disabled-in-edit-mode-button-detachedrepeat-973b2";
			export const ID_DISABLED_IN_RO_MODE =
				"a12-custom-disabled-in-ro-mode-button-detachedrepeat-973b2";
			export const ID_ALWAYS_SHOWN_AND_ENABLED =
				"a12-custom-always-shown-and-enabled-button-detachedrepeat-973b2";
			export const ID_CLONE = "a12-copy-button-detachedrepeat-973b2";
			export const ID_MOVE_UP = "a12-up-button-detachedrepeat-973b2";
			export const ID_MOVE_DOWN = "a12-down-button-detachedrepeat-973b2";
			export const ID_DELETE = "a12-remove-button-detachedrepeat-973b2";
			export const ID_VIEW = "a12-view-button-detachedrepeat-973b2";
			export const ID_RETURN = "a12-return-button-detachedrepeat-973b2";
			export const ID_COMMIT = "a12-edit-apply-button-detachedrepeat-973b2";
			export const ID_CANCEL = "a12-edit-cancel-button-detachedrepeat-973b2";
			export const ID_DOWNLOAD = "a12-download-button-embeddedrepeat-d48bd";
		}

		export namespace LIST_ITEMS {
			export const ID_EDIT = "a12-edit-list-item-detachedrepeat-973b2";
			export const ID_HIDDEN_IN_RO_MODE =
				"a12-custom-hidden-in-ro-mode-list-item-detachedrepeat-973b2";
			export const ID_HIDDEN_IN_EDIT_MODE =
				"a12-custom-hidden-in-edit-mode-list-item-detachedrepeat-973b2";
			export const ID_DISABLED_IN_EDIT_MODE =
				"a12-custom-disabled-in-edit-mode-list-item-detachedrepeat-973b2";
			export const ID_DISABLED_IN_RO_MODE =
				"a12-custom-disabled-in-ro-mode-list-item-detachedrepeat-973b2";
			export const ID_ALWAYS_SHOWN_AND_ENABLED =
				"a12-custom-always-shown-and-enabled-list-item-detachedrepeat-973b2";
			export const ID_CLONE = "a12-copy-list-item-detachedrepeat-973b2";
			export const ID_MOVE_UP = "a12-up-list-item-detachedrepeat-973b2";
			export const ID_MOVE_DOWN = "a12-down-list-item-detachedrepeat-973b2";
			export const ID_DELETE = "a12-remove-list-item-detachedrepeat-973b2";
			export const ID_VIEW = "a12-view-list-item-detachedrepeat-973b2";
			export const ID_RETURN = "a12-return-list-item-detachedrepeat-973b2";
			export const ID_COMMIT = "a12-edit-apply-list-item-detachedrepeat-973b2";
			export const ID_CANCEL = "a12-edit-cancel-list-item-detachedrepeat-973b2";
			export const ID_DOWNLOAD = "a12-download-list-item-embeddedrepeat-d48bd";
		}

		export namespace COLUMNS {
			/**
			 * All row actions except "download" share the same column for tests
			 */
			export const ID = "a12-fieldbasedrepeatoverviewcolumn-0ac9d";
			export const ID_DOWNLOAD = "a12-fieldbasedrepeatoverviewcolumn-b1827";
		}

		export const REPEAT_ID = "a12-detachedrepeat-973b2";
		export const DR_LOCATION_PATH = ModelHelpers.createModelPath(
			"Enablement",
			"secGeneral",
			"sec1",
			"DRReadonlyByDependency",
			"DRReadonlyByDependency-detail-screen"
		);
		export const DR_PATH = DocumentHelpers.createDocumentPath(
			["Root"],
			["repeatReadonlyByDependency"]
		);

		export const REPEAT_ATTACHMENT_COLLECTION_PATH = ModelHelpers.createModelPath(
			"Enablement",
			"SecMultiFileUpload",
			"sec1",
			"ERReadonlyByDependency"
		);
		export const REPEAT_ATTACHMENT_COLLECTION_ID = "a12-embeddedrepeat-d48bd";
	}

	export namespace ALL_ROW_ACTIONS_UNDEFINED {
		export const REPEAT_PATH = ModelHelpers.createModelPath(
			"Enablement",
			"secGeneral",
			"DR-all-row-actions-undefined"
		);
		export const REPEAT_ID = "a12-detachedrepeat-cc849";

		export const REPEAT_ATTACHMENT_COLLECTION_PATH = ModelHelpers.createModelPath(
			"Enablement",
			"SecMultiFileUpload",
			"ER-all-row-actions-undefined"
		);
		export const REPEAT_ATTACHMENT_COLLECTION_ID = "a12-embeddedrepeat-27487";

		export namespace BUTTONS {
			export const ID_EDIT = "a12-edit-button-detachedrepeat-72c88";
			export const ID_VIEW = "a12-view-button-detachedrepeat-72c88";
			export const ID_CLONE = "a12-copy-button-detachedrepeat-72c88";
			export const ID_MOVE_UP = "a12-up-button-detachedrepeat-72c88";
			export const ID_MOVE_DOWN = "a12-down-button-detachedrepeat-72c88";
			export const ID_DELETE = "a12-remove-button-detachedrepeat-72c88";
			export const ID_DOWNLOAD = "a12-download-button-embeddedrepeat-27487";
		}

		export namespace LIST_ITEMS {
			export const ID_EDIT = "a12-edit-list-item-detachedrepeat-72c88";
			export const ID_VIEW = "a12-view-list-item-detachedrepeat-72c88";
			export const ID_CLONE = "a12-copy-list-item-detachedrepeat-72c88";
			export const ID_MOVE_UP = "a12-up-list-item-detachedrepeat-72c88";
			export const ID_MOVE_DOWN = "a12-down-list-item-detachedrepeat-72c88";
			export const ID_DELETE = "a12-remove-list-item-detachedrepeat-72c88";
			export const ID_DOWNLOAD = "a12-download-list-item-embeddedrepeat-27487";
		}

		export namespace COLUMNS {
			/**
			 * All row actions except "download" share the same column for tests
			 */
			export const ID = "a12-fieldbasedrepeatoverviewcolumn-2d732";
			export const ID_DOWNLOAD = "a12-fieldbasedrepeatoverviewcolumn-b5de3";
		}
	}

	export namespace ALL_ROW_ACTIONS_DISABLED {
		export const REPEAT_PATH = ModelHelpers.createModelPath(
			"Enablement",
			"secGeneral",
			"DR-all-row-actions-false"
		);
		export const REPEAT_ID = "a12-detachedrepeat-cc849";

		export const REPEAT_ATTACHMENT_COLLECTION_PATH = ModelHelpers.createModelPath(
			"Enablement",
			"SecMultiFileUpload",
			"ER-all-row-actions-false"
		);
		export const REPEAT_ATTACHMENT_COLLECTION_ID = "a12-embeddedrepeat-5236d";

		export namespace BUTTONS {
			export const ID_EDIT = "a12-edit-button-detachedrepeat-cc849";
			export const ID_VIEW = "a12-view-button-detachedrepeat-cc849";
			export const ID_CLONE = "a12-copy-button-detachedrepeat-cc849";
			export const ID_MOVE_UP = "a12-up-button-detachedrepeat-cc849";
			export const ID_MOVE_DOWN = "a12-down-button-detachedrepeat-cc849";
			export const ID_DELETE = "a12-remove-button-detachedrepeat-cc849";
			export const ID_DOWNLOAD = "a12-download-button-embeddedrepeat-5236d";
		}

		export namespace LIST_ITEMS {
			export const ID_EDIT = "a12-edit-list-item-detachedrepeat-cc849";
			export const ID_VIEW = "a12-view-list-item-detachedrepeat-cc849";
			export const ID_CLONE = "a12-copy-list-item-detachedrepeat-cc849";
			export const ID_MOVE_UP = "a12-up-list-item-detachedrepeat-cc849";
			export const ID_MOVE_DOWN = "a12-down-list-item-detachedrepeat-cc849";
			export const ID_DELETE = "a12-remove-list-item-detachedrepeat-cc849";
			export const ID_DOWNLOAD = "a12-download-list-item-embeddedrepeat-5236d";
		}

		export namespace COLUMNS {
			/**
			 * All row actions except "download" share the same column for tests
			 */
			export const ID = "a12-fieldbasedrepeatoverviewcolumn-2d732";
			export const ID_DOWNLOAD = "a12-fieldbasedrepeatoverviewcolumn-b5de3";
		}
	}
}

export namespace DEFAULT_ROW_ACTION_VISIBILITY {
	export namespace EDIT_SHOWN {
		export const REPEAT_ID = "embeddedrepeat-97aae";
		export const REPEAT_PATH = ModelHelpers.createModelPath(
			"Enablement",
			"SecDefaultRowAction",
			"ER-edit"
		);

		export const COLUMN_ID = "a12-fieldbasedrepeatoverviewcolumn-a5953";
	}

	export namespace EDIT_HIDDEN {
		export const REPEAT_ID = "embeddedrepeat-4be22";
		export const REPEAT_NAME = "ER-edit-hideButton";
		export const REPEAT_PATH = ModelHelpers.createModelPath(
			"Enablement",
			"SecDefaultRowAction",
			REPEAT_NAME
		);

		export const COLUMN_ID = "a12-fieldbasedrepeatoverviewcolumn-b773a";
	}

	export namespace CUSTOM_SHOWN {
		export const REPEAT_ID = "embeddedrepeat-d0c32";
		export const REPEAT_PATH = ModelHelpers.createModelPath(
			"Enablement",
			"SecDefaultRowAction",
			"ER-custom"
		);

		export const COLUMN_ID = "a12-fieldbasedrepeatoverviewcolumn-e1937";
	}

	export namespace CUSTOM_HIDDEN {
		export const REPEAT_ID = "embeddedrepeat-8c7eb";
		export const REPEAT_NAME = "ER-custom-hideButton";
		export const REPEAT_PATH = ModelHelpers.createModelPath(
			"Enablement",
			"SecDefaultRowAction",
			REPEAT_NAME
		);

		export const COLUMN_ID = "a12-fieldbasedrepeatoverviewcolumn-31382";
	}

	export namespace DOWNLOAD_SHOWN {
		export const REPEAT_ID = "embeddedrepeat-d4f23";
		export const REPEAT_PATH = ModelHelpers.createModelPath(
			"Enablement",
			"SecDefaultRowAction",
			"ER_AttachmentCollection-download"
		);

		export const COLUMN_ID = "a12-fieldbasedrepeatoverviewcolumn-9fe00";
	}

	export namespace DOWNLOAD_HIDDEN {
		export const REPEAT_ID = "embeddedrepeat-d7b6d";
		export const REPEAT_NAME = "ER_AttachmentCollection-download-hideButton";
		export const REPEAT_PATH = ModelHelpers.createModelPath(
			"Enablement",
			"SecDefaultRowAction",
			REPEAT_NAME
		);

		export const COLUMN_ID = "a12-fieldbasedrepeatoverviewcolumn-8cc0c";
	}
}

export namespace FORM_MODEL {
	export const rowActionScreen = "Screen1";
	export const embeddedRepeatScreen = "EmbeddedRepeat";
	export const inlineRepeatScreen = "InlineRepeat";
	export const defaultRowActionScreen = "DefaultRowActionsScreen";
	export const rowActionButtonsScreen = "RowActionButtons";
	export const screenReaderColumnScreen = "ScreenReaderColumn";

	export const nestedL6RowActions = "DR_nestedActions";

	export const repeatFormModelPath = createModelPath(
		embeddedRepeatScreen,
		"ER_Nested_Only_Add_True"
	);

	export const embeddedRepeatAllFalseFormModelPath = createModelPath(
		embeddedRepeatScreen,
		"ER_Nested_All_False"
	);

	export const repeatWithMove = createModelPath(rowActionScreen, "DR_onlyMove");

	export const repeatWithMoveFirstColumn = [
		...repeatWithMove,
		...createModelPath("fieldbasedrepeatoverviewcolumn-1ae96")
	];

	export const repeatAllFalse = createModelPath(rowActionScreen, "DR_allFalse");

	export const repeatWithFilterExpression = createModelPath(
		rowActionScreen,
		"DR_onlyMove_filter_expression"
	);

	export const erDetailControlGridPath = [...repeatFormModelPath, ...createModelPath("cg")];
}

export namespace ICON_NAMES {
	export const star = "grade";
	export const bookmark = "bookmark";
	export const cloud = "cloud";
}

export const ROW_DOCUMENT_PATH: EntityInstancePath = [
	{ elementName: "Root", index: 1 },
	{ elementName: "repeat", index: 1 }
];

export function createDocument(options: {
	repeat: GroupInstance[];
	repeat_AttachmentCollection?: GroupInstance[];
}): GroupInstance {
	return {
		Root: {
			repeat: options.repeat,
			repeat_AttachmentCollection: options.repeat_AttachmentCollection
		}
	};
}
