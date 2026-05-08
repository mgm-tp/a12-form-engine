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

import type { LocalizationTreeMap } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type { PREVIEW_RESOURCE_KEYS } from "./keys.js";

const en: typeof PREVIEW_RESOURCE_KEYS = {
	preview: {
		middleware: {
			eventButton: {
				title: "Event button clicked",
				message: "Event: $EVENT_BUTTON_NAME$"
			},
			rowAction: {
				title: "Row action button clicked",
				message:
					"Custom Row Event: Event $ROW_ACTION_NAME$ triggered on row $ROW_IDX$ of $ROW_PATH$"
			},
			save: {
				title: "Document saved",
				message: "Document $DOCUMENT_NAME$ was saved successfully."
			}
		},
		modal: {
			reset: {
				title: "Reset your data",
				message:
					"Current data will be reset to the initial state. Are you sure you want to continue?",
				confirmLabel: "Reset"
			}
		}
	}
};

export const DEFAULT_PREVIEW_TRANSLATIONS: LocalizationTreeMap = { en };
