// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { deepStrictEqual } from "node:assert/strict";

import { Commands, UiStateSelectors } from "../../../../../back-end/store/index.js";
import { SetupHelpers } from "../../../../utils/setup.js";

const { createTestStore } = SetupHelpers;

describe("api.back-end.store.reducers", () => {
	describe("setDisabled", () => {
		it("sets the dirty flag to true if the payload is true", () => {
			const storeConfig = {
				data: { dirty: false, document: {} },
				ui: { disabled: false, screenLocation: [] }
			};

			const store = createTestStore({ storeConfig });
			store.dispatch(Commands.setDisabled(true));

			const disabled = UiStateSelectors.disabled()(store.getState());
			deepStrictEqual(disabled, true);
		});

		it("sets the dirty flag to false if the payload is false", () => {
			const storeConfig = {
				data: { dirty: false, document: {} },
				ui: { disabled: true, screenLocation: [] }
			};

			const store = createTestStore({ storeConfig });
			store.dispatch(Commands.setDisabled(false));

			const disabled = UiStateSelectors.disabled()(store.getState());
			deepStrictEqual(disabled, false);
		});
	});
});
