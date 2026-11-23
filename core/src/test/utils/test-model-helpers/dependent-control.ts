// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
