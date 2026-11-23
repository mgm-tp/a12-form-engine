// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { deepStrictEqual } from "node:assert/strict";

import { Commands, UiStateSelectors } from "../../../../../back-end/store/index.js";
import { SetupHelpers } from "../../../../utils/setup.js";

const { createTestStore } = SetupHelpers;

describe("api.back-end.store.reducers", () => {
	describe("setValidationBarState", () => {
		it("will set the given payload in the store", () => {
			const storeConfig = {
				data: { dirty: false, document: {} },
				ui: {
					screenLocation: [{ locationPath: [], path: [] }],
					validationBar: {
						visible: false,
						expanded: false,
						currentMessageKey: undefined
					}
				}
			};

			const validationBarState = {
				visible: true,
				expanded: true,
				currentMessageKey: "My-Key"
			};

			const store = createTestStore({ storeConfig });
			store.dispatch(
				Commands.CorrectionMode.setValidationBarState({
					validationBar: validationBarState
				})
			);

			const actualSectionState = UiStateSelectors.validationBarState()(store.getState());
			deepStrictEqual(actualSectionState, validationBarState);
		});
	});
});
