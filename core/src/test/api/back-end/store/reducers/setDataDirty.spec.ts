// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { deepStrictEqual } from "node:assert/strict";

import { Commands, DataSelectors } from "../../../../../back-end/store/index.js";
import { SetupHelpers } from "../../../../utils/setup.js";

const { createTestStore } = SetupHelpers;

describe("api.back-end.store.reducers", () => {
	describe("setDataDirty", () => {
		it("sets the dirty flag to true if the payload is true", () => {
			const storeConfig = {
				data: { dirty: false, document: {} },
				ui: { screenLocation: [] }
			};

			const store = createTestStore({ storeConfig });
			store.dispatch(Commands.setDataDirty(true));

			const dirty = DataSelectors.dirty()(store.getState());
			deepStrictEqual(dirty, true);
		});

		it("sets the dirty flag to false if the payload is false", () => {
			const storeConfig = {
				data: { dirty: true, document: {} },
				ui: { screenLocation: [] }
			};

			const store = createTestStore({ storeConfig });
			store.dispatch(Commands.setDataDirty(false));

			const dirty = DataSelectors.dirty()(store.getState());
			deepStrictEqual(dirty, false);
		});
	});
});
