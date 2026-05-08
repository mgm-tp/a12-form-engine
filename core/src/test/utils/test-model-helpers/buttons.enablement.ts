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

export namespace BUTTON_ENABLEMENT {
	export namespace DIRTY_STATE {
		export const BUTTON_ALWAYS_SHOWN = "a12-button-c7ef8";
		export const BUTTON_DISABLED = "a12-button-1b609";
		export const BUTTON_HIDDEN = "a12-button-3f25e";

		export const BUTTON_ALWAYS_SHOWN_NAME = "buttonAlwaysShown";
		export const BUTTON_DISABLED_NAME = "buttonOnlyEnableWhenDocumentDirty";
		export const BUTTON_HIDDEN_NAME = "buttonOnlyShownWhenDocumentDirty";
	}

	export namespace READONLY_STATE {
		export const NAV_BUTTON_ALWAYS_SHOWN_ENABLED = "a12-button-9357e";
		export const NAV_BUTTON_HIDDEN_IN_RO_MODE = "a12-button-96af0";
		export const NAV_BUTTON_HIDDEN_IN_EDIT_MODE = "a12-button-a845c";
		export const NAV_BUTTON_DISABLED_IN_EDIT_MODE = "a12-button-f0d77";
		export const NAV_BUTTON_DISABLED_IN_RO_MODE = "a12-button-833b4";
	}
}
