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

import { deepStrictEqual } from "node:assert/strict";

import { Commands, UiStateSelectors } from "../../../../../back-end/store/index.js";
import { createModelPath } from "../../../../utils/createModelPath.js";
import { createTestStore } from "../../../../utils/setup.js";

describe("api.back-end.store.reducers", () => {
	describe("setColumnWidth", () => {
		it("sets for the given column the width", () => {
			const initialColumnWidth = {
				["/screen1/repeat1/column1"]: 2,
				["/screen1/repeat1/column2"]: 2
			};
			const store = createTestStore({
				storeConfig: {
					data: { dirty: false, document: {} },
					ui: {
						disabled: false,
						screenLocation: [],
						columnWidths: initialColumnWidth
					}
				}
			});

			const column1Path = createModelPath("screen1", "dummyRepeat", "dummyColumn");
			const column2Path = createModelPath("screen1", "repeat1", "column2");

			store.dispatch(Commands.setColumnWidth({ columnPath: column1Path, width: 4 }));
			store.dispatch(Commands.setColumnWidth({ columnPath: column2Path, width: 3 }));

			const expectedColumnWidths = {
				...initialColumnWidth,
				["/screen1/dummyRepeat/dummyColumn"]: 4,
				["/screen1/repeat1/column2"]: 3
			};

			const actualColumnWidths = UiStateSelectors.columnWidths()(store.getState());
			deepStrictEqual(actualColumnWidths, expectedColumnWidths);
		});
	});
});
