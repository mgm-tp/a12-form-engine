// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

export namespace DocumentHelpers {
	export function createDocumentPath(...elements: [string, number?][]): EntityInstancePath {
		return elements.map(([elementName, index = 1]) => ({ elementName, index }));
	}
}
