// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { deepStrictEqual } from "node:assert/strict";

import { Commands, UiStateSelectors } from "../../../../../back-end/store/index.js";
import { ModelHelpers } from "../../../../utils/model-helpers.js";
import { SetupHelpers } from "../../../../utils/setup.js";

const { createTestStore } = SetupHelpers;

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

			const column1Path = ModelHelpers.createModelPath("screen1", "dummyRepeat", "dummyColumn");
			const column2Path = ModelHelpers.createModelPath("screen1", "repeat1", "column2");

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
