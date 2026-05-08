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

export namespace IDS {
	export const SCREEN1 = "Screen1";
	export const SCREEN2 = "Screen2";
	export const SCREEN3 = "Screen3";
	export const SCREEN4 = "Screen4";
}

export function createDocument(data: {
	bool_single?: boolean;
	confirm_single?: boolean | null;
	enum_single?: string;
	bool_cascade0?: boolean;
	bool_cascade1?: boolean;
	bool_combined0?: boolean;
	bool_combined1?: boolean;
	bool_numericIndex?: boolean;
	bool_semanticIndex?: boolean;
}): GroupInstance {
	return {
		root: {
			single: {
				bool_single: data.bool_single,
				confirm_single: data.confirm_single,
				enum_single: data.enum_single
			},
			cascade: {
				bool_cascade0: data.bool_cascade0,
				bool_cascade1: data.bool_cascade1
			},
			combined: {
				bool_combined0: data.bool_combined0,
				bool_combined1: data.bool_combined1
			},
			repeat: [
				...(data.bool_numericIndex ? [{ field: data.bool_numericIndex }] : []),
				...(data.bool_semanticIndex ? [{ index: 2, field: data.bool_semanticIndex }] : [])
			]
		}
	};
}
