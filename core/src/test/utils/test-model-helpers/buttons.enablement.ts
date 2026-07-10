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

export const BUTTON_ENABLEMENT = {
	DIRTY_STATE: {
		BUTTON_ALWAYS_SHOWN: "a12-button-c7ef8",
		BUTTON_DISABLED: "a12-button-1b609",
		BUTTON_HIDDEN: "a12-button-3f25e",
		BUTTON_ALWAYS_SHOWN_NAME: "buttonAlwaysShown",
		BUTTON_DISABLED_NAME: "buttonOnlyEnableWhenDocumentDirty",
		BUTTON_HIDDEN_NAME: "buttonOnlyShownWhenDocumentDirty"
	},
	READONLY_STATE: {
		NAV_BUTTON_ALWAYS_SHOWN_ENABLED: "a12-button-9357e",
		NAV_BUTTON_HIDDEN_IN_RO_MODE: "a12-button-96af0",
		NAV_BUTTON_HIDDEN_IN_EDIT_MODE: "a12-button-a845c",
		NAV_BUTTON_DISABLED_IN_EDIT_MODE: "a12-button-f0d77",
		NAV_BUTTON_DISABLED_IN_RO_MODE: "a12-button-833b4"
	}
} as const;
