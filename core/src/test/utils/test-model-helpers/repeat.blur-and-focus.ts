// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
