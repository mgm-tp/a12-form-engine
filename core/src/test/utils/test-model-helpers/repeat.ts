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

export namespace REPEAT {
	export const rootGroup = "Root";
	export const nestedL6 = "Nested_L6";
	export const L6_Number = "L6_Number";
	export const L6_String = "L6_String";
	export const nestedL1 = "Nested_L1";
	export const nestedGroup = "nestedGroup";
	export const L1_String = "L1_String";
	export const L1_Number = "L1_Number";
	export const L1_Time = "L1_Time";
	export const L0_Number = "L0_Number";

	export const nestedL9 = "Nested_L9";
	export const L9_String = "L9_String";
	export const L9_Number = "L9_Number";
	export const L9_Invisible = "L9_Invisible";
}

export function createDocumentForRepeat(values: {
	nestedL1?: GroupInstance[];
	nestedL3?: GroupInstance[];
	nestedL4?: GroupInstance[];
	nestedL5?: GroupInstance[];
	nestedL6?: GroupInstance[];
	nestedL7?: GroupInstance[];
	nestedL8?: GroupInstance[];
	nestedL10?: GroupInstance[];
}): GroupInstance {
	return {
		Root: {
			// Calculate L6_Number_Sum from the given values of nestedL6
			L6_Number_Sum: values.nestedL6
				? values.nestedL6.reduce((acc, value) => {
						const v = value.L6_Number;
						if (v && typeof v === "number") {
							return acc + v;
						}
						return acc + 0;
					}, 0)
				: 0,
			...(values.nestedL1 ? { Nested_L1: values.nestedL1 } : {}),
			...(values.nestedL3 ? { Nested_L3: values.nestedL3 } : {}),
			...(values.nestedL4 ? { Nested_L4: values.nestedL4 } : {}),
			...(values.nestedL5 ? { Nested_L5: values.nestedL5 } : {}),
			...(values.nestedL6 ? { Nested_L6: values.nestedL6.map(v => ({ nestedGroup: v })) } : {}),
			...(values.nestedL7 ? { Nested_L7: values.nestedL7 } : {}),
			...(values.nestedL8 ? { Nested_L8: values.nestedL8.map(v => ({ nestedGroup: v })) } : {}),
			...(values.nestedL10 ? { Nested_L10: values.nestedL10 } : {})
		}
	};
}

export function createNestedL1Entry(values: {
	L1_String?: string;
	L1_Number?: number;
	L1_Date?: Date;
	L2_Number?: number;
	L1_ExternalEnumeration?: string;
}): GroupInstance {
	const nestedL2 = values.L2_Number ? { Nested_L2: [{ L2_Number: values.L2_Number }] } : {};
	return values.L1_Number
		? {
				L1_String: values.L1_String,
				L1_Number: values.L1_Number,
				L1_Boolean: false,
				L1_Date: values.L1_Date,
				L1_ExternalEnumeration: values.L1_ExternalEnumeration,
				...nestedL2
			}
		: {
				L1_Boolean: false,
				...nestedL2
			};
}

export function createNestedL6Entry(values: { L6_Number?: number }): GroupInstance {
	return values.L6_Number
		? {
				L6_Number: values.L6_Number
			}
		: {};
}
