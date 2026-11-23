// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { registerHooks } from "node:module";

/**
 * Synchronous, in-thread Node.js module hook to mock SVG imports.
 */
registerHooks({
	load(url, context, nextLoad) {
		if (url.endsWith(".svg")) {
			return {
				format: "module",
				shortCircuit: true,
				source: 'export default "mocked-svg-path";'
			};
		}
		return nextLoad(url, context);
	}
});
