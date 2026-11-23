// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { deepStrictEqual } from "node:assert/strict";

import { Commands, UiStateSelectors } from "../../../../../back-end/store/index.js";
import { SetupHelpers } from "../../../../utils/setup.js";

const { createTestStore } = SetupHelpers;

describe("api.back-end.store.reducers", () => {
	describe("setReadonly", () => {
		it("sets the readonly flag to true if the payload is true", () => {
			const storeConfig = {
				data: { dirty: false, document: {} },
				ui: { readonly: false, screenLocation: [] }
			};

			const store = createTestStore({ storeConfig });
			store.dispatch(Commands.setReadonly(true));

			const readOnly = UiStateSelectors.readonly()(store.getState());
			deepStrictEqual(readOnly, true);
		});

		it("sets the readonly flag to false if the payload is false", () => {
			const storeConfig = {
				data: { dirty: false, document: {} },
				ui: { readonly: true, screenLocation: [] }
			};

			const store = createTestStore({ storeConfig });
			store.dispatch(Commands.setReadonly(false));

			const readOnly = UiStateSelectors.readonly()(store.getState());
			deepStrictEqual(readOnly, false);
		});
	});
});
