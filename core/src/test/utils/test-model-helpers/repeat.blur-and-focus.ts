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

import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { createModelPath } from "./dependent-enumeration.js";

export namespace IDS {
	export const L0_STRING = "a12-L0_String-field_30aa3";
	export const IR_BODY_ROW = "a12-inlinerepeat-97f35-bodyrow";
	export const IR_L1_STRING = "a12-fieldbasedrepeatoverviewcolumn-0d9da-cell";
	export const IR_L1_DATE = "a12-fieldbasedrepeatoverviewcolumn-0bb9f-cell-0";
	export const IR_L1_DATE_BUTTON = `${IR_L1_DATE}-picker`;
	export const IR_L1_DATE_TIME = "a12-fieldbasedrepeatoverviewcolumn-710df-cell";
	export const IR_L1_TIME = "a12-fieldbasedrepeatoverviewcolumn-37a66-cell";
	export const IR_L1_ENUMERATION = "a12-fieldbasedrepeatoverviewcolumn-42842-cell-0";

	export const ER_L1_STRING = "a12-L1_String-field_ea294-2";
	export const ER_L1_DATE = "a12-L1_Date-field_43f56-2";
	export const ER_L1_DATE_BUTTON = `${ER_L1_DATE}-picker`;
	export const ER_L1_ENUMERATION = "a12-L1_Enumeration-fieldimpl_6110d-2";
	export const ER_BODY_ROW = "a12-embeddedrepeat-6bd83-bodyrow";
	export const ER_EXPANDED_ROW = "a12-embeddedrepeat-6bd83-expandedrow";
	export const ER_REMOVE_BUTTON = "a12-remove-button-embeddedrepeat-6bd83";

	export const DR_BODY_ROW = "a12-detachedrepeat-d162f-bodyrow";
	export const DR_REMOVE_BUTTON = "a12-remove-button-detachedrepeat-d162f";
}
export namespace FORM_MODEL {
	export const screenName = "Screen1";
	export const inlineRepeatModelPath = createModelPath(screenName, "inline-repeat");
	export const detachedRepeatModelPath = createModelPath(screenName, "detached-repeat");
	export const embeddedRepeatModelPath = createModelPath(screenName, "embedded-repeat");
}

export namespace DOCUMENT_MODEL {
	export const rootGroup = "rootGroup";
	export const nestedL1 = "nestedL1";
}

export function createDocumentForBlurAndFocus(
	values?: { L1_Number?: number; L1_String?: string }[]
): GroupInstance {
	return {
		rootGroup: {
			nestedL1: values
				? values.map(v => ({
						L1_Number: v.L1_Number,
						L1_String: v.L1_String,
						L1_Boolean: false,
						L1_Attachment: {}
					}))
				: [
						{ L1_Boolean: false, L1_Attachment: {} },
						{ L1_Boolean: false, L1_Attachment: {} }
					]
		}
	};
}
