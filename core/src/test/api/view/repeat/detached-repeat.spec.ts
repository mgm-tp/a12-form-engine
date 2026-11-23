// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
