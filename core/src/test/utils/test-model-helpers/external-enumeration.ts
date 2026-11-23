// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

export namespace EXTERNAL_ENUM {
	export const ID_EXTERNAL_ENUM_COMPACT = "a12-ExternalEnumeration-field_127e7";
	export const ID_EXTERNAL_ENUM_AUTOCOMPLETE = "a12-ExternalEnumerationAllowCustom-field_78eea";
	export const ID_EXTERNAL_ENUM_FULL = "a12-ExternalEnumerationFull-field_d8403";
	export const ID_EXTERNAL_ENUM_INLINE = "a12-ExternalEnumerationInline-field_75bf2";

	export const ID_IR_EXTERNAL_ENUM_COMPACT = "a12-fieldbasedrepeatoverviewcolumn-d34a9-cell-0";
	export const ID_IR_EXTERNAL_ENUM_AUTOCOMPLETE = "a12-fieldbasedrepeatoverviewcolumn-caf88-cell-0";
	export const ID_IR_EXTERNAL_ENUM_FULL = "a12-fieldbasedrepeatoverviewcolumn-0465f-cell-0";
	export const ID_IR_EXTERNAL_ENUM_INLINE = "a12-fieldbasedrepeatoverviewcolumn-41a5a-cell-0";

	export function createDocument(values: { repeatableGroup?: GroupInstance[] }): GroupInstance {
		return {
			Root: {
				Config: {
					...(values.repeatableGroup ? { NewGroup_1: values.repeatableGroup } : {})
				}
			}
		};
	}
}
