// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { localizableKeyFromSegments } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

/**
 * @internal
 * @ignore
 */
export namespace DocumentModelKeyFactory {
	export function createKey(
		model: DocumentModel,
		type: string,
		path: ModelPath,
		suffix?: string
	): string {
		const segments = ["documentModel", type, model.header.id, ...path.map(e => e.elementName)];
		if (suffix) {
			segments.push(suffix);
		}
		return localizableKeyFromSegments(segments);
	}
}
