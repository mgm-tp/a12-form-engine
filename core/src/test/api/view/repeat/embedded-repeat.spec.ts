/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * Dual License
 * ------------
 * This source file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License – EUPL v1.2
 *    You may redistribute and/or modify this file under the terms of the
 *    European Union Public License, version 1.2 - see https://eupl.eu/.
 *
 * 2. Commercial License
 *    Alternatively, you may obtain a commercial license from
 *    mgm technology partners GmbH, that permits use of this software
 *    under different terms (including support and maintenance services).
 *
 *    Please contact a12-license@mgm-tp.com for more information.
 *
 * You must select and comply with exactly one of the above license options.
 *
 * Warranty Disclaimer (applies to either option)
 * ----------------------------------------------
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */

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
