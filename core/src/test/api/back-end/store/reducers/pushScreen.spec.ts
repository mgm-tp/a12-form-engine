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
 * 1. Open-Source License - EUPL v1.2
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
import { createDocumentPath } from "../../../../utils/createDocumentPath.js";
import { createModelPath } from "../../../../utils/createModelPath.js";
import { createTestStore } from "../../../../utils/setup.js";

describe("api.back-end.store.reducers", () => {
	describe("pushScreen", () => {
		it("creates a new screen with the parameters from the payload and adds it to the end of the screen location stack", () => {
			const firstLocationPath = createModelPath("First", "Location", "Path");
			const secondLocationPath = createModelPath("Second", "Location", "Path");

			const screens: ReadonlyArray<EngineStore.ScreenState> = [
				{ locationPath: firstLocationPath, path: [] },
				{ locationPath: secondLocationPath, path: [] }
			];
			const storeConfig = {
				data: { dirty: false, document: {} },
				ui: { screenLocation: screens }
			};

			const store = createTestStore({ storeConfig });

			const newLocationPath = createModelPath("Third", "Location", "Path");
			const newPath = createDocumentPath(["root"], ["group1"]);
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
