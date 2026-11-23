// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

export namespace IDS {
	export const ID_STRING_FIELD = "a12-stringField-field_ac7ba";
	export const ID_STRING_FIELD_IN_REPEAT = "a12-fieldbasedrepeatoverviewcolumn-b6432-cell-0";
}

export function createDocument(): GroupInstance {
	return { rootGroup: { repeatableGroup: [{}] } };
}
