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

import { initializeKeys } from "@com.mgmtp.a12.utils/utils-localization";

/**
 * This tree contains all keys of static resources that are used by the preview application notifications.
 */
export const PREVIEW_RESOURCE_KEYS = {
	preview: {
		middleware: {
			/**
			 * Available placeholders:
			 * * `$EVENT_BUTTON_NAME$` - the name of the clicked button
			 */
			eventButton: {
				/**
				 * The title of the notification that is triggered for event buttons
				 */
				title: "",
				/**
				 * The message of the notification that is triggered for event buttons
				 */
				message: ""
			},
			/**
			 * Available placeholders:
			 * * `$ROW_ACTION_NAME$` - the name of the clicked row action
			 * * `$ROW_IDX$` - the row index
			 * * `$ROW_PATH$` - the stringified path of the row
			 */
			rowAction: {
				/**
				 * The title of the notification that is triggered for row actions
				 */
				title: "",
				/**
				 * The message of the notification that is triggered for row actions
				 */
				message: ""
			},
			/**
			 * The message that is displayed if a document is saved
			 *
			 * Available placeholders:
			 * * `$DOCUMENT_NAME$` - the name of the document
			 */
			save: {
				title: "",
				message: ""
			}
		},
		modal: {
			/**
			 * Localizations for the modal that confirms you want to reset
			 */
			reset: {
				title: "",
				message: "",
				confirmLabel: ""
			}
		}
	}
};

initializeKeys(PREVIEW_RESOURCE_KEYS);
