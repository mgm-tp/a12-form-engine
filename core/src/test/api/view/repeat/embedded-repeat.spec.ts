// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { executeAddButtonTests } from "./embedded/addButton.js";
import { executeBlurAndFocusTest } from "./embedded/blur-and-focus.js";
import { executeErrorHintTest } from "./embedded/error-hint.js";
import { expandedRowTest } from "./embedded/expandedRow.js";
import { executeRenderingTests } from "./embedded/rendering.js";
import { initEmbeddedRepeatTests } from "./embedded/utils.js";

/**
 * Note: All tests concerning input-controls in embedded repeat detail control
 * grids are tested in the "controls" tests outside of this section
 *
 * The following common features are tested in detached-repeat.spec.ts:
 * - Filter expression
 * - suffix
 * - value formatting
 */
describe("api.view.repeat", () => {
	describe("Embedded-Repeat", () => {
		const testEnv = initEmbeddedRepeatTests();

		describe("click on an add button", () => {
			executeAddButtonTests(testEnv);
		});

		describe("expanded row", () => {
			expandedRowTest(testEnv);
		});

		describe("rendering", () => {
			executeRenderingTests(testEnv);
		});

		describe("blur-and-focus", () => {
			executeBlurAndFocusTest();
		});

		describe("error hint", () => {
			executeErrorHintTest();
		});
	});
});
