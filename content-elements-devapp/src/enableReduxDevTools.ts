// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { composeWithDevTools } from "@redux-devtools/extension";

import type { ComposeEnhancer } from "@com.mgmtp.a12.client/client-core/lib/core/application/index.js";

export function enableReduxDevTools(): ComposeEnhancer {
	return composeWithDevTools({
		name: "Content Elements Devapp",
		serialize: {
			replacer: (key, value) =>
				key === "generatedCodeAccessor" || key === "validatorProvider" ? "" : value
		}
	}) as ComposeEnhancer;
}
