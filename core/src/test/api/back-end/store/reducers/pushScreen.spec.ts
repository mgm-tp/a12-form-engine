// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { deepStrictEqual } from "node:assert/strict";

import { Commands, UiStateSelectors } from "../../../../../back-end/store/index.js";
import type { EngineStore } from "../../../../../back-end/store/internal/store.js";
import { DocumentHelpers } from "../../../../utils/document-helpers.js";
import { ModelHelpers } from "../../../../utils/model-helpers.js";
import { SetupHelpers } from "../../../../utils/setup.js";

const { createTestStore } = SetupHelpers;

describe("api.back-end.store.reducers", () => {
	describe("pushScreen", () => {
		it("creates a new screen with the parameters from the payload and adds it to the end of the screen location stack", () => {
			const firstLocationPath = ModelHelpers.createModelPath("First", "Location", "Path");
			const secondLocationPath = ModelHelpers.createModelPath("Second", "Location", "Path");

			const screens: ReadonlyArray<EngineStore.ScreenState> = [
				{ locationPath: firstLocationPath, path: [] },
				{ locationPath: secondLocationPath, path: [] }
			];
			const storeConfig = {
				data: { dirty: false, document: {} },
				ui: { screenLocation: screens }
			};

			const store = createTestStore({ storeConfig });

			const newLocationPath = ModelHelpers.createModelPath("Third", "Location", "Path");
			const newPath = DocumentHelpers.createDocumentPath(["root"], ["group1"]);
			const repeatState = {
				repeat1: { filterRowOpen: false }
			};

			store.dispatch(
				Commands.pushScreen({
					locationPath: newLocationPath,
					path: newPath,
					repeatState: repeatState
				})
			);

			const currentScreenState = UiStateSelectors.screenLocationStack()(store.getState());
			const currentRepeatStaticState = UiStateSelectors.repeatStaticState()(store.getState());
			deepStrictEqual(currentScreenState.length, 3);
			deepStrictEqual(currentScreenState[2].locationPath, newLocationPath);
			deepStrictEqual(currentScreenState[2].path, newPath);
			deepStrictEqual(currentRepeatStaticState, repeatState);
		});
	});
});
