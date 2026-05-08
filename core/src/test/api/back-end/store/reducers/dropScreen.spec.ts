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
 * 1. Open-Source License – EUPL v1.2
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
