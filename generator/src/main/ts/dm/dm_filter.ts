// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

// transform a document model element tree using a map function
export function documentModelMap(mapFn: MapFn<DocumentModel.Element>) {
	return {
		apply
	};

	function apply(element: DocumentModel.Element): DocumentModel.Element {
		const selfMapped = mapFn(element);
		return selfMapped.type === "Group"
			? {
					...selfMapped,
					elements: selfMapped.elements.map(apply)
				}
			: selfMapped;
	}
}

export type MapFn<T> = (t: T) => T;
