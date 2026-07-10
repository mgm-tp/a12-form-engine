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

import type { EntityInstancePath, GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { createDocumentPath } from "../createDocumentPath.js";
import { createModelPath } from "../createModelPath.js";

export const IDS = {
	DEFAULT_ROW_ACTIONS: {
		repeatEdit: "detachedrepeat-0e8f9",
		repeatEventAlwaysShownAndEnabled: "detachedrepeat-5068f",
		repeatEventHiddenInReadonlyMode: "detachedrepeat-500d1",
		repeatEventHiddenInEditMode: "detachedrepeat-87408",
		repeatEventDisabledInEditMode: "detachedrepeat-3191f",
		repeatEventDisabledInReadonlyMode: "detachedrepeat-6f697",
		repeatRemove: "detachedrepeat-8cccb",
		repeatMove: "detachedrepeat-e911c",
		repeatClone: "detachedrepeat-4fb5a",
		repeatDownload: "embeddedrepeat-df33b",
		repeatNoDefaultRowAction: "detachedrepeat-fd08f",
		removeButton: "a12-remove-button-detachedrepeat-8cccb-1",
		moveUpButton: "a12-up-button-detachedrepeat-e911c-2",
		moveDownButton: "a12-down-button-detachedrepeat-e911c-1",
		cloneButton: "a12-copy-button-detachedrepeat-4fb5a-1",
		editButton: "a12-edit-button-detachedrepeat-5068f-1",
		downloadButton: "a12-download-button-embeddedrepeat-79d3c-1",
		addButton: "a12-add-button-detachedrepeat-8cccb"
	},
	ROW_ACTIONS: {
		repeatAllFalse: "a12-detachedrepeat-ba430",
		repeatOnlyAddTrue: "a12-detachedrepeat-981d9",
		repeatOnlyRemoveTrue: "a12-detachedrepeat-5a779",
		repeatOnlyMoveTrue: "a12-detachedrepeat-1a9f9",
		repeatOnlyCloneTrue: "a12-detachedrepeat-d910e",
		repeatOnlyDownloadTrue: "a12-embeddedrepeat-5ca73",
		repeatCustomRowActions: "a12-detachedrepeat-622e6",
		BUTTONS: {
			remove: "a12-remove-button-detachedrepeat-5a779-1",
			moveUp: "a12-up-button-detachedrepeat-1a9f9-2",
			moveDown: "a12-down-button-detachedrepeat-1a9f9-1",
			clone: "a12-copy-button-detachedrepeat-d910e-1",
			download: "a12-download-button-embeddedrepeat-5ca73-1",
			editInRepeatAllFalse: "a12-edit-button-detachedrepeat-ba430-1",
			eventAlwaysShownAndEnabledWithConfirmation:
				"a12-custom-always-shown-and-enabled-button-detachedrepeat-ba430-1",
			viewInRepeatAllFalse: "a12-view-button-detachedrepeat-ba430-1",
			eventAlwaysShownAndEnabled:
				"a12-custom-always-shown-and-enabled-button-detachedrepeat-622e6-1",
			eventHiddenInReadonlyMode: "a12-custom-hidden-in-ro-mode-button-detachedrepeat-622e6-1",
			eventHiddenInEditMode: "a12-custom-hidden-in-edit-mode-button-detachedrepeat-622e6-1",
			eventDisabledInEditMode: "a12-custom-disabled-in-edit-mode-button-detachedrepeat-622e6-1",
			eventDisabledInReadonlyMode: "a12-custom-disabled-in-ro-mode-button-detachedrepeat-622e6-1"
		},
		LIST_ITEMS: {
			remove: "a12-remove-list-item-detachedrepeat-5a779-1",
			moveUp: "a12-up-list-item-detachedrepeat-1a9f9-2",
			moveDown: "a12-down-list-item-detachedrepeat-1a9f9-1",
			clone: "a12-copy-list-item-detachedrepeat-d910e-1",
			download: "a12-download-list-item-embeddedrepeat-5ca73-1",
			editInRepeatAllFalse: "a12-edit-list-item-detachedrepeat-ba430-1",
			eventAlwaysShownAndEnabledWithConfirmation:
				"a12-custom-always-shown-and-enabled-list-item-detachedrepeat-ba430-1",
			viewInRepeatAllFalse: "a12-view-list-item-detachedrepeat-ba430-1",
			eventAlwaysShownAndEnabled:
				"a12-custom-always-shown-and-enabled-list-item-detachedrepeat-622e6-1",
			eventHiddenInReadonlyMode: "a12-custom-hidden-in-ro-mode-list-item-detachedrepeat-622e6-1",
			eventHiddenInEditMode: "a12-custom-hidden-in-edit-mode-list-item-detachedrepeat-622e6-1",
			eventDisabledInEditMode: "a12-custom-disabled-in-edit-mode-list-item-detachedrepeat-622e6-1",
			eventDisabledInReadonlyMode: "a12-custom-disabled-in-ro-mode-list-item-detachedrepeat-622e6-1"
		}
	},
	EMBEDDED_REPEAT: {
		EXPANDED_ROW: {
			editFooterButton: "a12-edit-button-embeddedrepeat-bb6d0-1",
			viewFooterButton: "a12-view-button-embeddedrepeat-bb6d0-1"
		}
	},
	INLINE_REPEAT: {
		repeatAllFalse: "a12-inlinerepeat-9446b",
		repeatOnlyOnlyRemoveTrue: "a12-inlinerepeat-ded75",
		ALL_FALSE: {
			firstCell: "a12-fieldbasedrepeatoverviewcolumn-455a5-bodycell"
		},
		ONLY_REMOVE: {
			firstCell: "a12-fieldbasedrepeatoverviewcolumn-29575-bodycell"
		},
		ONLY_CLONE: {
			firstCell: "a12-fieldbasedrepeatoverviewcolumn-91de5-bodycell"
		},
		ONLY_MOVE: {
			firstCell: "a12-fieldbasedrepeatoverviewcolumn-1ae96-bodycell"
		},
		ONLY_DOWNLOAD: {
			firstCell: "a12-fieldbasedrepeatoverviewcolumn-d51d6-bodycell"
		},
		CUSTOM_ROW_ACTIONS: {
			firstCell: "a12-fieldbasedrepeatoverviewcolumn-0d42e-bodycell"
		}
	},
	CUSTOM_ROW_ACTIONS: {
		labelRow: "a12-inlinerepeat-992fa-bodyrow-0",
		iconRow: "a12-inlinerepeat-180a0-bodyrow-0",
		descriptionRow: "a12-inlinerepeat_a09ed-bodyrow-0",
		labelAndDescriptionRow: "a12-inlinerepeat_44060-bodyrow-0",
		labelAndIconRow: "a12-inlinerepeat-c8984-bodyrow-0",
		labelHiddenRow: "a12-inlinerepeat-a7e76-bodyrow-0",
		descriptionAndIconRow: "a12-inlinerepeat_66dae-bodyrow-0",
		labelAndDescriptionAndIconRow: "a12-inlinerepeat_e6f2a-bodyrow-0",
		labelAndDescriptionLabelHiddenRow: "a12-inlinerepeat_aa7de-bodyrow-0",
		BUTTONS: {
			label: "a12-custom-event-button-inlinerepeat-992fa-1",
			icon: "a12-custom-event-button-inlinerepeat-180a0-1",
			description: "a12-custom-event-button-inlinerepeat_a09ed-1",
			labelAndDescription: "a12-custom-event-button-inlinerepeat_44060-1",
			labelAndIcon: "a12-custom-event-button-inlinerepeat-c8984-1",
			labelAndIconWithLabelHidden: "a12-custom-event-button-inlinerepeat-a7e76-1",
			descriptionAndIcon: "a12-custom-event-button-inlinerepeat_66dae-1",
			labelAndDescriptionAndIcon: "a12-custom-event-button-inlinerepeat_e6f2a-1",
			labelAndDescriptionLabelHidden: "a12-custom-event-button-inlinerepeat_aa7de-1",
			confirmationLabel: "a12-custom-event-confirmation-button-inlinerepeat-992fa-1",
			confirmationIcon: "a12-custom-event-confirmation-button-inlinerepeat-180a0-1",
			confirmationDescription: "a12-custom-event-confirmation-button-inlinerepeat_a09ed-1",
			confirmationLabelAndDescription: "a12-custom-event-confirmation-button-inlinerepeat_44060-1",
			confirmationLabelAndIcon: "a12-custom-event-confirmation-button-inlinerepeat-c8984-1",
			confirmationLabelAndIconWithLabelHidden:
				"a12-custom-event-confirmation-button-inlinerepeat-a7e76-1",
			confirmationDescriptionAndIcon: "a12-custom-event-confirmation-button-inlinerepeat_66dae-1",
			confirmationLabelAndDescriptionAndIcon:
				"a12-custom-event-confirmation-button-inlinerepeat_e6f2a-1",
			confirmationLabelAndDescriptionLabelHidden:
				"a12-custom-event-confirmation-button-inlinerepeat_aa7de-1",
			secondary: "a12-custom-event-button-inlinerepeat-ac321-1",
			primary: "a12-custom-event-button-inlinerepeat-8f61c-1",
			notDestructive: "a12-custom-event-button-inlinerepeat-50d47-1",
			destructive: "a12-custom-event-button-inlinerepeat-aa584-1",
			confirmationSecondary: "a12-custom-event-confirmation-button-inlinerepeat-ac321-1",
			confirmationPrimary: "a12-custom-event-confirmation-button-inlinerepeat-8f61c-1",
			confirmationNotDestructive: "a12-custom-event-confirmation-button-inlinerepeat-50d47-1",
			confirmationDestructive: "a12-custom-event-confirmation-button-inlinerepeat-aa584-1"
		},
		LIST_ITEMS: {
			label: "a12-custom-event-list-item-inlinerepeat-992fa-1",
			icon: "a12-custom-event-list-item-inlinerepeat-180a0-1",
			description: "a12-custom-event-list-item-inlinerepeat_a09ed-1",
			labelAndDescription: "a12-custom-event-list-item-inlinerepeat_44060-1",
			labelAndIcon: "a12-custom-event-list-item-inlinerepeat-c8984-1",
			labelAndIconWithLabelHidden: "a12-custom-event-list-item-inlinerepeat-a7e76-1",
			descriptionAndIcon: "a12-custom-event-list-item-inlinerepeat_66dae-1",
			labelAndDescriptionAndIcon: "a12-custom-event-list-item-inlinerepeat_e6f2a-1",
			labelAndDescriptionLabelHidden: "a12-custom-event-list-item-inlinerepeat_aa7de-1",
			confirmationLabel: "a12-custom-event-confirmation-list-item-inlinerepeat-992fa-1",
			confirmationIcon: "a12-custom-event-confirmation-list-item-inlinerepeat-180a0-1",
			confirmationDescription: "a12-custom-event-confirmation-list-item-inlinerepeat_a09ed-1",
			confirmationLabelAndDescription:
				"a12-custom-event-confirmation-list-item-inlinerepeat_44060-1",
			confirmationLabelAndIcon: "a12-custom-event-confirmation-list-item-inlinerepeat-c8984-1",
			confirmationLabelAndIconWithLabelHidden:
				"a12-custom-event-confirmation-list-item-inlinerepeat-a7e76-1",
			confirmationDescriptionAndIcon:
				"a12-custom-event-confirmation-list-item-inlinerepeat_66dae-1",
			confirmationLabelAndDescriptionAndIcon:
				"a12-custom-event-confirmation-list-item-inlinerepeat_e6f2a-1",
			confirmationLabelAndDescriptionLabelHidden:
				"a12-custom-event-confirmation-list-item-inlinerepeat_aa7de-1"
		},
		CELLS: {
			iconRow: "a12-fieldbasedrepeatoverviewcolumn-6a741-bodycell-0",
			labelRow: "a12-fieldbasedrepeatoverviewcolumn-23851-bodycell-0",
			descriptionRow: "a12-fieldbasedrepeatoverviewcolumn_7e8c8-bodycell-0",
			labelAndDescriptionRow: "a12-fieldbasedrepeatoverviewcolumn_6f833-bodycell-0",
			labelAndIconRow: "a12-fieldbasedrepeatoverviewcolumn-fecd5-bodycell-0",
			labelHiddenRow: "a12-fieldbasedrepeatoverviewcolumn-211e8-bodycell-0",
			descriptionAndIconRow: "a12-fieldbasedrepeatoverviewcolumn_3c26d-bodycell-0",
			labelAndDescriptionAndIconRow: "a12-fieldbasedrepeatoverviewcolumn_aeb99-bodycell-0",
			labelAndDescriptionLabelHiddenRow: "a12-fieldbasedrepeatoverviewcolumn_bd410-bodycell-0"
		},
		ARIA_LABEL: {
			BUTTONS: {
				labelDescription: "a12-custom-e1-button-inlinerepeat_6ed3a-1",
				label: "a12-custom-e1-button-inlinerepeat_9bfd9-1",
				description: "a12-custom-e1-button-inlinerepeat_89513-1",
				confirmationLabelDescription: "a12-custom-e1c-button-inlinerepeat_6ed3a-1",
				confirmationLabel: "a12-custom-e1c-button-inlinerepeat_9bfd9-1",
				confirmationDescription: "a12-custom-e1c-button-inlinerepeat_89513-1"
			},
			LIST_ITEMS: {
				labelDescription: "a12-custom-e1-list-item-inlinerepeat_6ed3a-1",
				label: "a12-custom-e1-list-item-inlinerepeat_9bfd9-1",
				description: "a12-custom-e1-list-item-inlinerepeat_89513-1",
				confirmationLabelDescription: "a12-custom-e1c-list-item-inlinerepeat_6ed3a-1",
				confirmationLabel: "a12-custom-e1c-list-item-inlinerepeat_9bfd9-1",
				confirmationDescription: "a12-custom-e1c-list-item-inlinerepeat_89513-1"
			},
			CELLS: {
				labelDescription: "a12-fieldbasedrepeatoverviewcolumn_7cee1-bodycell-0",
				label: "a12-fieldbasedrepeatoverviewcolumn_f4e1d-bodycell-0",
				description: "a12-fieldbasedrepeatoverviewcolumn_2ae2c-bodycell-0"
			}
		}
	},

	SCREEN_READER_COLUMN_TEST: {
		IR_WITH_SCREEN_READER_COLUMN: {
			checkboxColumnModelPath: createModelPath(
				"ScreenReaderColumn",
				"mfa",
				"fieldbasedrepeatoverviewcolumn_87d0c"
			),

			repeat: "inlinerepeat_4ecb2",
			columnRef: "a12-fieldbasedrepeatoverviewcolumn_d7b35-cell-0",

			customButton: `a12-custom-custom-button-inlinerepeat_4ecb2-1`,
			customConfirmButton: `a12-custom-customConfirm-button-inlinerepeat_4ecb2-1`,
			downloadButton: `a12-download-button-inlinerepeat_4ecb2-1`,
			upButton: `a12-up-button-inlinerepeat_4ecb2-1`,
			downButton: `a12-down-button-inlinerepeat_4ecb2-1`,
			copyButton: `a12-copy-button-inlinerepeat_4ecb2-1`,
			removeButton: `a12-remove-button-inlinerepeat_4ecb2-1`
		},

		ER_WITH_SCREEN_READER_COLUMN: {
			repeat: "embeddedrepeat_99e5c",
			columnRef: "a12-fieldbasedrepeatoverviewcolumn_6f096-bodycell-0",

			editButton: `a12-edit-button-embeddedrepeat_99e5c-1`,
			viewButton: `a12-view-button-embeddedrepeat_99e5c-1`
		},

		IR_WITHOUT_SCREEN_READER_COLUMN: {
			checkboxColumnModelPath: createModelPath(
				"ScreenReaderColumn",
				"other",
				"fieldbasedrepeatoverviewcolumn_87d0d"
			)
		}
	}
} as const;

export const VISIBILITY = {
	NOT_RO: {
		REPEAT_PATH: createModelPath("Enablement", "secGeneral", "DR"),
		REPEAT_ID: "a12-detachedrepeat-84a02",
		REPEAT_ATTACHMENT_COLLECTION_PATH: createModelPath("Enablement", "SecMultiFileUpload", "ER"),
		REPEAT_ATTACHMENT_COLLECTION_ID: "a12-embeddedrepeat-ae0d8",
		BUTTONS: {
			ID_EDIT: "a12-edit-button-detachedrepeat-84a02",
			ID_VIEW: "a12-view-button-detachedrepeat-84a02",
			ID_HIDDEN_IN_RO_MODE: "a12-custom-hidden-in-ro-mode-button-detachedrepeat-84a02",
			ID_HIDDEN_IN_EDIT_MODE: "a12-custom-hidden-in-edit-mode-button-detachedrepeat-84a02",
			ID_DISABLED_IN_EDIT_MODE: "a12-custom-disabled-in-edit-mode-button-detachedrepeat-84a02",
			ID_DISABLED_IN_RO_MODE: "a12-custom-disabled-in-ro-mode-button-detachedrepeat-84a02",
			ID_ALWAYS_SHOWN_AND_ENABLED:
				"a12-custom-always-shown-and-enabled-button-detachedrepeat-84a02",
			ID_CLONE: "a12-copy-button-detachedrepeat-84a02",
			ID_MOVE_UP: "a12-up-button-detachedrepeat-84a02",
			ID_MOVE_DOWN: "a12-down-button-detachedrepeat-84a02",
			ID_DELETE: "a12-remove-button-detachedrepeat-84a02",
			ID_COMMIT: "a12-edit-apply-button-detachedrepeat-84a02",
			ID_CANCEL: "a12-edit-cancel-button-detachedrepeat-84a02",
			ID_RETURN: "a12-return-button-detachedrepeat-84a02",
			ID_DOWNLOAD: "a12-download-button-embeddedrepeat-ae0d8"
		},
		LIST_ITEMS: {
			ID_EDIT: "a12-edit-list-item-detachedrepeat-84a02",
			ID_VIEW: "a12-view-list-item-detachedrepeat-84a02",
			ID_HIDDEN_IN_RO_MODE: "a12-custom-hidden-in-ro-mode-list-item-detachedrepeat-84a02",
			ID_HIDDEN_IN_EDIT_MODE: "a12-custom-hidden-in-edit-mode-list-item-detachedrepeat-84a02",
			ID_DISABLED_IN_EDIT_MODE: "a12-custom-disabled-in-edit-mode-list-item-detachedrepeat-84a02",
			ID_DISABLED_IN_RO_MODE: "a12-custom-disabled-in-ro-mode-list-item-detachedrepeat-84a02",
			ID_ALWAYS_SHOWN_AND_ENABLED:
				"a12-custom-always-shown-and-enabled-list-item-detachedrepeat-84a02",
			ID_CLONE: "a12-copy-list-item-detachedrepeat-84a02",
			ID_MOVE_UP: "a12-up-list-item-detachedrepeat-84a02",
			ID_MOVE_DOWN: "a12-down-list-item-detachedrepeat-84a02",
			ID_DELETE: "a12-remove-list-item-detachedrepeat-84a02",
			ID_DOWNLOAD: "a12-download-list-item-embeddedrepeat-ae0d8"
		},
		COLUMNS: {
			ID: "a12-fieldbasedrepeatoverviewcolumn-2d732",
			ID_DOWNLOAD: "a12-fieldbasedrepeatoverviewcolumn-b5de3"
		},
		DR_LOCATION_PATH: createModelPath("Enablement", "secGeneral", "DR", "DR-detail-screen"),
		DR_PATH: createDocumentPath(["Root"], ["repeatReadonlyByDependency"])
	},
	BY_MODEL: {
		BUTTONS: {
			ID_VIEW: "a12-view-button-detachedrepeat-17573",
			ID_HIDDEN_IN_RO_MODE: "a12-custom-hidden-in-ro-mode-button-detachedrepeat-17573",
			ID_HIDDEN_IN_EDIT_MODE: "a12-custom-hidden-in-edit-mode-button-detachedrepeat-17573",
			ID_DISABLED_IN_EDIT_MODE: "a12-custom-disabled-in-edit-mode-button-detachedrepeat-17573",
			ID_DISABLED_IN_RO_MODE: "a12-custom-disabled-in-ro-mode-button-detachedrepeat-17573",
			ID_ALWAYS_SHOWN_AND_ENABLED:
				"a12-custom-always-shown-and-enabled-button-detachedrepeat-17573",
			ID_RETURN: "a12-return-button-detachedrepeat-17573",
			ID_DOWNLOAD: "a12-download-button-embeddedrepeat-f022b"
		},
		LIST_ITEMS: {
			ID_VIEW: "a12-view-list-item-detachedrepeat-17573",
			ID_HIDDEN_IN_RO_MODE: "a12-custom-hidden-in-ro-mode-list-item-detachedrepeat-17573",
			ID_HIDDEN_IN_EDIT_MODE: "a12-custom-hidden-in-edit-mode-list-item-detachedrepeat-17573",
			ID_DISABLED_IN_EDIT_MODE: "a12-custom-disabled-in-edit-mode-list-item-detachedrepeat-17573",
			ID_DISABLED_IN_RO_MODE: "a12-custom-disabled-in-ro-mode-list-item-detachedrepeat-17573",
			ID_ALWAYS_SHOWN_AND_ENABLED:
				"a12-custom-always-shown-and-enabled-list-item-detachedrepeat-17573",
			ID_RETURN: "a12-return-list-item-detachedrepeat-17573",
			ID_DOWNLOAD: "a12-download-list-item-embeddedrepeat-f022b"
		},
		COLUMNS: {
			ID: "a12-fieldbasedrepeatoverviewcolumn-9e89e",
			ID_DOWNLOAD: "a12-fieldbasedrepeatoverviewcolumn-98b51"
		},
		REPEAT_ID: "a12-detachedrepeat-17573",
		DR_LOCATION_PATH: createModelPath("Enablement", "secGeneral", "DR-ro", "DR-detail-screen"),
		DR_PATH: createDocumentPath(["Root"], ["repeat"]),
		REPEAT_ATTACHMENT_COLLECTION_PATH: createModelPath("Enablement", "SecMultiFileUpload", "ER-ro"),
		REPEAT_ATTACHMENT_COLLECTION_ID: "a12-embeddedrepeat-f022b"
	},
	BY_DEP: {
		BODY_ROW: "a12-detachedrepeat-973b2-bodyrow-0",
		BUTTONS: {
			ID_EDIT: "a12-edit-button-detachedrepeat-973b2",
			ID_HIDDEN_IN_RO_MODE: "a12-custom-hidden-in-ro-mode-button-detachedrepeat-973b2",
			ID_HIDDEN_IN_EDIT_MODE: "a12-custom-hidden-in-edit-mode-button-detachedrepeat-973b2",
			ID_DISABLED_IN_EDIT_MODE: "a12-custom-disabled-in-edit-mode-button-detachedrepeat-973b2",
			ID_DISABLED_IN_RO_MODE: "a12-custom-disabled-in-ro-mode-button-detachedrepeat-973b2",
			ID_ALWAYS_SHOWN_AND_ENABLED:
				"a12-custom-always-shown-and-enabled-button-detachedrepeat-973b2",
			ID_CLONE: "a12-copy-button-detachedrepeat-973b2",
			ID_MOVE_UP: "a12-up-button-detachedrepeat-973b2",
			ID_MOVE_DOWN: "a12-down-button-detachedrepeat-973b2",
			ID_DELETE: "a12-remove-button-detachedrepeat-973b2",
			ID_VIEW: "a12-view-button-detachedrepeat-973b2",
			ID_RETURN: "a12-return-button-detachedrepeat-973b2",
			ID_COMMIT: "a12-edit-apply-button-detachedrepeat-973b2",
			ID_CANCEL: "a12-edit-cancel-button-detachedrepeat-973b2",
			ID_DOWNLOAD: "a12-download-button-embeddedrepeat-d48bd"
		},
		LIST_ITEMS: {
			ID_EDIT: "a12-edit-list-item-detachedrepeat-973b2",
			ID_HIDDEN_IN_RO_MODE: "a12-custom-hidden-in-ro-mode-list-item-detachedrepeat-973b2",
			ID_HIDDEN_IN_EDIT_MODE: "a12-custom-hidden-in-edit-mode-list-item-detachedrepeat-973b2",
			ID_DISABLED_IN_EDIT_MODE: "a12-custom-disabled-in-edit-mode-list-item-detachedrepeat-973b2",
			ID_DISABLED_IN_RO_MODE: "a12-custom-disabled-in-ro-mode-list-item-detachedrepeat-973b2",
			ID_ALWAYS_SHOWN_AND_ENABLED:
				"a12-custom-always-shown-and-enabled-list-item-detachedrepeat-973b2",
			ID_CLONE: "a12-copy-list-item-detachedrepeat-973b2",
			ID_MOVE_UP: "a12-up-list-item-detachedrepeat-973b2",
			ID_MOVE_DOWN: "a12-down-list-item-detachedrepeat-973b2",
			ID_DELETE: "a12-remove-list-item-detachedrepeat-973b2",
			ID_VIEW: "a12-view-list-item-detachedrepeat-973b2",
			ID_RETURN: "a12-return-list-item-detachedrepeat-973b2",
			ID_COMMIT: "a12-edit-apply-list-item-detachedrepeat-973b2",
			ID_CANCEL: "a12-edit-cancel-list-item-detachedrepeat-973b2",
			ID_DOWNLOAD: "a12-download-list-item-embeddedrepeat-d48bd"
		},
		COLUMNS: {
			ID: "a12-fieldbasedrepeatoverviewcolumn-0ac9d",
			ID_DOWNLOAD: "a12-fieldbasedrepeatoverviewcolumn-b1827"
		},
		REPEAT_ID: "a12-detachedrepeat-973b2",
		DR_LOCATION_PATH: createModelPath(
			"Enablement",
			"secGeneral",
			"sec1",
			"DRReadonlyByDependency",
			"DRReadonlyByDependency-detail-screen"
		),
		DR_PATH: createDocumentPath(["Root"], ["repeatReadonlyByDependency"]),
		REPEAT_ATTACHMENT_COLLECTION_PATH: createModelPath(
			"Enablement",
			"SecMultiFileUpload",
			"sec1",
			"ERReadonlyByDependency"
		),
		REPEAT_ATTACHMENT_COLLECTION_ID: "a12-embeddedrepeat-d48bd"
	},
	ALL_ROW_ACTIONS_UNDEFINED: {
		REPEAT_PATH: createModelPath("Enablement", "secGeneral", "DR-all-row-actions-undefined"),
		REPEAT_ID: "a12-detachedrepeat-cc849",
		REPEAT_ATTACHMENT_COLLECTION_PATH: createModelPath(
			"Enablement",
			"SecMultiFileUpload",
			"ER-all-row-actions-undefined"
		),
		REPEAT_ATTACHMENT_COLLECTION_ID: "a12-embeddedrepeat-27487",
		BUTTONS: {
			ID_EDIT: "a12-edit-button-detachedrepeat-72c88",
			ID_VIEW: "a12-view-button-detachedrepeat-72c88",
			ID_CLONE: "a12-copy-button-detachedrepeat-72c88",
			ID_MOVE_UP: "a12-up-button-detachedrepeat-72c88",
			ID_MOVE_DOWN: "a12-down-button-detachedrepeat-72c88",
			ID_DELETE: "a12-remove-button-detachedrepeat-72c88",
			ID_DOWNLOAD: "a12-download-button-embeddedrepeat-27487"
		},
		LIST_ITEMS: {
			ID_EDIT: "a12-edit-list-item-detachedrepeat-72c88",
			ID_VIEW: "a12-view-list-item-detachedrepeat-72c88",
			ID_CLONE: "a12-copy-list-item-detachedrepeat-72c88",
			ID_MOVE_UP: "a12-up-list-item-detachedrepeat-72c88",
			ID_MOVE_DOWN: "a12-down-list-item-detachedrepeat-72c88",
			ID_DELETE: "a12-remove-list-item-detachedrepeat-72c88",
			ID_DOWNLOAD: "a12-download-list-item-embeddedrepeat-27487"
		},
		COLUMNS: {
			ID: "a12-fieldbasedrepeatoverviewcolumn-2d732",
			ID_DOWNLOAD: "a12-fieldbasedrepeatoverviewcolumn-b5de3"
		}
	},
	ALL_ROW_ACTIONS_DISABLED: {
		REPEAT_PATH: createModelPath("Enablement", "secGeneral", "DR-all-row-actions-false"),
		REPEAT_ID: "a12-detachedrepeat-cc849",
		REPEAT_ATTACHMENT_COLLECTION_PATH: createModelPath(
			"Enablement",
			"SecMultiFileUpload",
			"ER-all-row-actions-false"
		),
		REPEAT_ATTACHMENT_COLLECTION_ID: "a12-embeddedrepeat-5236d",
		BUTTONS: {
			ID_EDIT: "a12-edit-button-detachedrepeat-cc849",
			ID_VIEW: "a12-view-button-detachedrepeat-cc849",
			ID_CLONE: "a12-copy-button-detachedrepeat-cc849",
			ID_MOVE_UP: "a12-up-button-detachedrepeat-cc849",
			ID_MOVE_DOWN: "a12-down-button-detachedrepeat-cc849",
			ID_DELETE: "a12-remove-button-detachedrepeat-cc849",
			ID_DOWNLOAD: "a12-download-button-embeddedrepeat-5236d"
		},
		LIST_ITEMS: {
			ID_EDIT: "a12-edit-list-item-detachedrepeat-cc849",
			ID_VIEW: "a12-view-list-item-detachedrepeat-cc849",
			ID_CLONE: "a12-copy-list-item-detachedrepeat-cc849",
			ID_MOVE_UP: "a12-up-list-item-detachedrepeat-cc849",
			ID_MOVE_DOWN: "a12-down-list-item-detachedrepeat-cc849",
			ID_DELETE: "a12-remove-list-item-detachedrepeat-cc849",
			ID_DOWNLOAD: "a12-download-list-item-embeddedrepeat-5236d"
		},
		COLUMNS: {
			ID: "a12-fieldbasedrepeatoverviewcolumn-2d732",
			ID_DOWNLOAD: "a12-fieldbasedrepeatoverviewcolumn-b5de3"
		}
	}
} as const;

export const DEFAULT_ROW_ACTION_VISIBILITY = {
	EDIT_SHOWN: {
		REPEAT_ID: "embeddedrepeat-97aae",
		REPEAT_PATH: createModelPath("Enablement", "SecDefaultRowAction", "ER-edit"),
		COLUMN_ID: "a12-fieldbasedrepeatoverviewcolumn-a5953"
	},
	EDIT_HIDDEN: {
		REPEAT_ID: "embeddedrepeat-4be22",
		REPEAT_NAME: "ER-edit-hideButton",
		REPEAT_PATH: createModelPath("Enablement", "SecDefaultRowAction", "ER-edit-hideButton"),
		COLUMN_ID: "a12-fieldbasedrepeatoverviewcolumn-b773a"
	},
	CUSTOM_SHOWN: {
		REPEAT_ID: "embeddedrepeat-d0c32",
		REPEAT_PATH: createModelPath("Enablement", "SecDefaultRowAction", "ER-custom"),
		COLUMN_ID: "a12-fieldbasedrepeatoverviewcolumn-e1937"
	},
	CUSTOM_HIDDEN: {
		REPEAT_ID: "embeddedrepeat-8c7eb",
		REPEAT_NAME: "ER-custom-hideButton",
		REPEAT_PATH: createModelPath("Enablement", "SecDefaultRowAction", "ER-custom-hideButton"),
		COLUMN_ID: "a12-fieldbasedrepeatoverviewcolumn-31382"
	},
	DOWNLOAD_SHOWN: {
		REPEAT_ID: "embeddedrepeat-d4f23",
		REPEAT_PATH: createModelPath(
			"Enablement",
			"SecDefaultRowAction",
			"ER_AttachmentCollection-download"
		),
		COLUMN_ID: "a12-fieldbasedrepeatoverviewcolumn-9fe00"
	},
	DOWNLOAD_HIDDEN: {
		REPEAT_ID: "embeddedrepeat-d7b6d",
		REPEAT_NAME: "ER_AttachmentCollection-download-hideButton",
		REPEAT_PATH: createModelPath(
			"Enablement",
			"SecDefaultRowAction",
			"ER_AttachmentCollection-download-hideButton"
		),
		COLUMN_ID: "a12-fieldbasedrepeatoverviewcolumn-8cc0c"
	}
} as const;

const embeddedRepeatScreen = "EmbeddedRepeat";
const rowActionScreen = "Screen1";
const repeatFormModelPath = createModelPath(embeddedRepeatScreen, "ER_Nested_Only_Add_True");
const repeatWithMove = createModelPath(rowActionScreen, "DR_onlyMove");

export const FORM_MODEL = {
	rowActionScreen,
	embeddedRepeatScreen,
	inlineRepeatScreen: "InlineRepeat",
	defaultRowActionScreen: "DefaultRowActionsScreen",
	rowActionButtonsScreen: "RowActionButtons",
	screenReaderColumnScreen: "ScreenReaderColumn",
	nestedL6RowActions: "DR_nestedActions",
	repeatFormModelPath: createModelPath(embeddedRepeatScreen, "ER_Nested_Only_Add_True"),
	embeddedRepeatAllFalseFormModelPath: createModelPath(embeddedRepeatScreen, "ER_Nested_All_False"),
	repeatWithMove,
	repeatWithMoveFirstColumn: [
		...repeatWithMove,
		...createModelPath("fieldbasedrepeatoverviewcolumn-1ae96")
	],
	repeatAllFalse: createModelPath(rowActionScreen, "DR_allFalse"),
	repeatWithFilterExpression: createModelPath(rowActionScreen, "DR_onlyMove_filter_expression"),
	erDetailControlGridPath: [...repeatFormModelPath, ...createModelPath("cg")]
};

export const ICON_NAMES = {
	star: "grade",
	bookmark: "bookmark",
	cloud: "cloud"
} as const;

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
