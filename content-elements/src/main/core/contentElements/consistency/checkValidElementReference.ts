// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ValidationMessage } from "@com.mgmtp.a12.contentengine/contentengine-core";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

/** @internal */
export function checkValidElementReference(options: {
	elementId: string;
	element?: DocumentModel.Element;
}): ValidationMessage[] {
	const { elementId, element } = options;

	if (!element) {
		return [
			{
				severity: "Error",
				message: `No Document Model element found for id "${elementId}".`
			}
		];
	}

	return [];
}
