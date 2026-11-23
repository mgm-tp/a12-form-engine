// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { executeBlurAndFocusTest } from "./inline/blur-and-focus.js";
import { executeErrorHintTest } from "./inline/error-hint.js";
import { executeLabelTests } from "./inline/label.js";
import { executeNewRowTest } from "./inline/new-row.js";
import { executeRenderingTests } from "./inline/rendering.js";

/**
 * Note: All tests concerning input-controls in inline repeats
 * are tested in the "controls" tests outside of this section
 */
describe("api.view.repeat", () => {
	describe("Inline-Repeat", () => {
		describe("blur-and-focus", () => {
			executeBlurAndFocusTest();
		});

		describe("new row", () => {
			executeNewRowTest();
		});

		describe("error hint", () => {
			executeErrorHintTest();
		});

		describe("rendering", () => {
			executeRenderingTests();
		});

		describe("label", () => {
			executeLabelTests();
		});
	});
});
