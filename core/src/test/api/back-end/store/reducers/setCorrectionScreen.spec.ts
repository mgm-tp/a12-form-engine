// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { deepStrictEqual } from "node:assert/strict";

import { Commands, UiStateSelectors } from "../../../../../back-end/store/index.js";
import type { EngineStore } from "../../../../../back-end/store/internal/store.js";
import { SetupHelpers } from "../../../../utils/setup.js";

const { createTestStore } = SetupHelpers;

describe("api.back-end.store.reducers", () => {
	describe("setCorrectionScreen", () => {
		it("sets the correction screen using the given payload", () => {
			const correctionScreenState: EngineStore.CorrectionScreenState = {
				showDetailsState: {
					key1: false
				},
				visible: true
			};

			const storeConfig = {
				data: { dirty: false, document: {} },
				ui: { correctionScreen: undefined, screenLocation: [] }
			};

			const store = createTestStore({ storeConfig });
			store.dispatch(
				Commands.CorrectionMode.setCorrectionScreenState({
					correctionScreen: correctionScreenState
				})
			);

			const currentCorrectionScreenState = UiStateSelectors.correctionScreenState()(
				store.getState()
			);
			deepStrictEqual(currentCorrectionScreenState, correctionScreenState);
		});
	});
});
