// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { deepStrictEqual } from "node:assert/strict";

import { Commands, UiStateSelectors } from "../../../../../back-end/store/index.js";
import { SetupHelpers } from "../../../../utils/setup.js";

const { createTestStore } = SetupHelpers;

describe("api.back-end.store.reducers", () => {
	describe("setUIDirty", () => {
		it("sets the ui dirty flag to true if the payload is true", () => {
			const storeConfig = {
				data: { dirty: false, document: {} },
				ui: { dirty: false, screenLocation: [] }
			};

			const store = createTestStore({ storeConfig });
			store.dispatch(Commands.setUIDirty(true));

			const dirty = UiStateSelectors.dirty()(store.getState());
			deepStrictEqual(dirty, true);
		});

		it("sets the ui dirty flag to false if the payload is false", () => {
			const storeConfig = {
				data: { dirty: false, document: {} },
				ui: { dirty: true, screenLocation: [] }
			};

			const store = createTestStore({ storeConfig });
			store.dispatch(Commands.setUIDirty(false));

			const dirty = UiStateSelectors.dirty()(store.getState());
			deepStrictEqual(dirty, false);
		});
	});
});
