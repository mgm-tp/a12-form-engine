// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ValidationMessage } from "@com.mgmtp.a12.contentengine/contentengine-core";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

/** @internal */
export function checkDmReference(dm?: DocumentModel): ValidationMessage[] {
	return !dm
		? [
				{
					severity: "Error",
					message: `This element requires a Document Model.`
				}
			]
		: [];
}
