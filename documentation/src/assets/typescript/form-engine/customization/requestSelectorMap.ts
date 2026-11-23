// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

// tag::requestSelectorMap[]

import { DefaultRequestSelectorMap } from "@com.mgmtp.a12.formengine/formengine-core";
import type { RequestSelectorMap } from "@com.mgmtp.a12.formengine/formengine-core";

/**
 * Here, requests for loading documents are customized with another parameter.
 * Instead of reusing the default, you could also create your own.
 */
export const CustomRequestSelectorMap: RequestSelectorMap = {
	...DefaultRequestSelectorMap,
	load(config) {
		return state => {
			const defaultRequest = DefaultRequestSelectorMap.load(config)(state);
			return {
				...defaultRequest,
				params: {
					...defaultRequest.params,
					additionalParam: "customValue"
				}
			};
		};
	}
};
// end::requestSelectorMap[]
