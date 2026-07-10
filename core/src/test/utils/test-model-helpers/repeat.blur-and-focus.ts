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

import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { createModelPath } from "../createModelPath.js";

const IR_L1_DATE = "a12-fieldbasedrepeatoverviewcolumn-0bb9f-cell-0";
const ER_L1_DATE = "a12-L1_Date-field_43f56-2";

export const IDS = {
	L0_STRING: "a12-L0_String-field_30aa3",
	IR_BODY_ROW: "a12-inlinerepeat-97f35-bodyrow",
	IR_L1_STRING: "a12-fieldbasedrepeatoverviewcolumn-0d9da-cell",
	IR_L1_DATE,
	IR_L1_DATE_BUTTON: `${IR_L1_DATE}-picker`,
	IR_L1_DATE_TIME: "a12-fieldbasedrepeatoverviewcolumn-710df-cell",
	IR_L1_TIME: "a12-fieldbasedrepeatoverviewcolumn-37a66-cell",
	IR_L1_ENUMERATION: "a12-fieldbasedrepeatoverviewcolumn-42842-cell-0",
	ER_L1_STRING: "a12-L1_String-field_ea294-2",
	ER_L1_DATE,
	ER_L1_DATE_BUTTON: `${ER_L1_DATE}-picker`,
	ER_L1_ENUMERATION: "a12-L1_Enumeration-fieldimpl_6110d-2",
	ER_BODY_ROW: "a12-embeddedrepeat-6bd83-bodyrow",
	ER_EXPANDED_ROW: "a12-embeddedrepeat-6bd83-expandedrow",
	ER_REMOVE_BUTTON: "a12-remove-button-embeddedrepeat-6bd83",
	DR_BODY_ROW: "a12-detachedrepeat-d162f-bodyrow",
	DR_REMOVE_BUTTON: "a12-remove-button-detachedrepeat-d162f"
} as const;

const screenName = "Screen1";

export const FORM_MODEL = {
	screenName,
	inlineRepeatModelPath: createModelPath(screenName, "inline-repeat"),
	detachedRepeatModelPath: createModelPath(screenName, "detached-repeat"),
	embeddedRepeatModelPath: createModelPath(screenName, "embedded-repeat")
} as const;

export const DOCUMENT_MODEL = {
	rootGroup: "rootGroup",
	nestedL1: "nestedL1"
} as const;

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
