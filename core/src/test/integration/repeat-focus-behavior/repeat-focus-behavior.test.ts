// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { executeTestForDetachedRepeat } from "./detached-repeat-focus-behavior.js";
import { executeTestForEmbeddedRepeat } from "./embedded-repeat-focus-behavior.js";
import { executeTestForInlineRepeat } from "./inline-repeat-focus-behavior.js";

describe("api.view.Repeat-focus-behavior", () => {
	describe("Inline Repeat", () => {
		executeTestForInlineRepeat();
	});

	describe("Detached Repeat", () => {
		executeTestForDetachedRepeat();
	});

	describe("Embedded Repeat", () => {
		executeTestForEmbeddedRepeat();
	});
});
