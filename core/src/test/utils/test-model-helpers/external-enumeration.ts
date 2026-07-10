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

export const EXTERNAL_ENUM = {
	ID_EXTERNAL_ENUM_COMPACT: "a12-ExternalEnumeration-field_127e7",
	ID_EXTERNAL_ENUM_AUTOCOMPLETE: "a12-ExternalEnumerationAllowCustom-field_78eea",
	ID_EXTERNAL_ENUM_FULL: "a12-ExternalEnumerationFull-field_d8403",
	ID_EXTERNAL_ENUM_INLINE: "a12-ExternalEnumerationInline-field_75bf2",
	ID_IR_EXTERNAL_ENUM_COMPACT: "a12-fieldbasedrepeatoverviewcolumn-d34a9-cell-0",
	ID_IR_EXTERNAL_ENUM_AUTOCOMPLETE: "a12-fieldbasedrepeatoverviewcolumn-caf88-cell-0",
	ID_IR_EXTERNAL_ENUM_FULL: "a12-fieldbasedrepeatoverviewcolumn-0465f-cell-0",
	ID_IR_EXTERNAL_ENUM_INLINE: "a12-fieldbasedrepeatoverviewcolumn-41a5a-cell-0",
	createDocument(values: { repeatableGroup?: GroupInstance[] }): GroupInstance {
		return {
			Root: {
				Config: {
					...(values.repeatableGroup ? { NewGroup_1: values.repeatableGroup } : {})
				}
			}
		};
	}
} as const;
