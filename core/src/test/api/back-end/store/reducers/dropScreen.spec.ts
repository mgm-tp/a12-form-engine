// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { deepStrictEqual } from "node:assert/strict";

import { Commands, UiStateSelectors } from "../../../../../back-end/store/index.js";
import type { EngineStore } from "../../../../../back-end/store/internal/store.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { createModelPath } from "../../../../utils/test-model-helpers/dependent-enumeration.js";

const { createTestStore } = SetupHelpers;
describe("api.back-end.store.reducers", () => {
	describe("dropScreen", () => {
		it("removes the last screen of the screen location stack slice", () => {
			const firstLocationPath = createModelPath("First", "Location", "Path");
			const secondLocationPath = createModelPath("Second", "Location", "Path");
			const thirdLocationPath = createModelPath("Third", "Location", "Path");

			const screens: ReadonlyArray<EngineStore.ScreenState> = [
				{ locationPath: firstLocationPath, path: [] },
				{ locationPath: secondLocationPath, path: [] },
				{ locationPath: thirdLocationPath, path: [] }
			];
			const storeConfig = {
				data: { dirty: false, document: {} },
				ui: {
					screenLocation: screens
				}
			};

			const store = createTestStore({ storeConfig });
			store.dispatch(Commands.dropScreen());

			const currentScreenState = UiStateSelectors.screenLocationStack()(store.getState());
			deepStrictEqual(currentScreenState.length, 2);
			deepStrictEqual(currentScreenState[0].locationPath, firstLocationPath);
			deepStrictEqual(currentScreenState[1].locationPath, secondLocationPath);
		});
	});
});
