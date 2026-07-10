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
 * 1. Open-Source License - EUPL v1.2
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

import { DR } from "../../../utils/test-model-helpers/detached.repeat.js";
import { IDS } from "../../../utils/test-model-helpers/suffix.js";

import { executeSuffixTests } from "./detached-and-embedded/suffix.js";
import { executeValueTests } from "./detached-and-embedded/value.js";
import { executeBlurAndFocusTest } from "./detached/blur-and-focus.js";
import { executeFilterExpressionTests } from "./detached/executeFilterExpressionTests.js";
import { executeFooterTests } from "./detached/footer.js";
import { executeRenderingTests } from "./detached/rendering.js";

/**
 * Note: All tests concerning input-controls in detached repeat screens
 * are tested in the "controls" tests outside of this section
 */
describe("api.view.repeat", () => {
	describe("Detached-Repeat", () => {
		describe("suffix", () => {
			executeSuffixTests({ bodyCellId: IDS.DR_COLUMN_SUFFIX });
		});

		describe("Filter Expressions", () => {
			executeFilterExpressionTests();
		});

		describe("value", () => {
			executeValueTests({
				repeatForm: "detached",
				cellIds: {
					string: DR.SortingAndFiltering.ID_COLUMN_L1_STRING,
					boolean: DR.SortingAndFiltering.ID_COLUMN_L1_BOOLEAN,
					confirm: DR.SortingAndFiltering.ID_COLUMN_L1_CONFIRM,
					number: DR.SortingAndFiltering.ID_COLUMN_L1_NUMBER,
					enumeration: DR.SortingAndFiltering.ID_COLUMN_L1_ENUMERATION,
					date: DR.SortingAndFiltering.ID_COLUMN_L1_DATE,
					dateTime: DR.SortingAndFiltering.ID_COLUMN_L1_DATETIME,
					time: DR.SortingAndFiltering.ID_COLUMN_L1_TIME,
					multiSelect: DR.SortingAndFiltering.ID_COLUMN_L1_MULTI_SELECT
				}
			});
		});

		describe("blur-and-focus", () => {
			executeBlurAndFocusTest();
		});

		describe("footer", () => {
			executeFooterTests();
		});

		describe("rendering", () => {
			executeRenderingTests();
		});
	});
});
