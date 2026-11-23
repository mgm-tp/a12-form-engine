// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type {
	ContentModel,
	ValidationMessage
} from "@com.mgmtp.a12.contentengine/contentengine-core";

/** @internal */
export function checkNoChildren(node: ContentModel.Node): ValidationMessage[] {
	if (node.children?.length) {
		return [
			{
				severity: "Warning",
				message: "Child elements are not supported for this element."
			}
		];
	}

	return [];
}
