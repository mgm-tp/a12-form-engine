// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import {
	computeGranularity,
	granularityDistance
} from "@com.mgmtp.a12.client/client-data/lib/index.js";
import type { ValidationMessage } from "@com.mgmtp.a12.contentengine/contentengine-core";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

export function checkGranularity(options: {
	dm: DocumentModel;
	elementPath: ModelPath;
	contextPath?: ModelPath;
}): ValidationMessage[] {
	const { dm, elementPath, contextPath } = options;

	const elementGranularity = computeGranularity(dm, elementPath);
	const contextGranularity = computeGranularity(dm, contextPath ?? []);

	if (granularityDistance(contextGranularity, elementGranularity) > 0) {
		return [
			{
				severity: "Error",
				message:
					`The Document Model element at path ${ModelPath.toString(elementPath)} is not ` +
					`compatible with the current data context ${ModelPath.toString(contextPath ?? [])}.`
			}
		];
	}

	return [];
}
