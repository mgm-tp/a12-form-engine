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

import { deepStrictEqual, strictEqual } from "node:assert/strict";

import { Commands, UiStateSelectors } from "../../../../../back-end/store/index.js";
import type { EngineStore } from "../../../../../back-end/store/internal/store.js";
import { createModelPath } from "../../../../utils/createModelPath.js";
import { createTestStore } from "../../../../utils/setup.js";

describe("api.back-end.store.reducers", () => {
	describe("focusValidationBar", () => {
		const topLevelScreen: EngineStore.ScreenState = {
			locationPath: createModelPath("My", "Top", "Level", "Screen"),
			path: []
		};

		const detailScreen: EngineStore.ScreenState = {
			locationPath: createModelPath("My", "Detail", "Screen"),
			path: []
		};

		function setup(screenLocation: EngineStore.ScreenState[]) {
			return createTestStore({
				storeConfig: { data: { dirty: false, document: {} }, ui: { screenLocation } }
			});
		}

		it("focuses the validation bar of the screen the user is on, not of a screen below it", () => {
			const store = setup([topLevelScreen, detailScreen]);

			store.dispatch(Commands.CorrectionMode.focusValidationBar());

			const screens = UiStateSelectors.screenLocationStack()(store.getState());
			deepStrictEqual(screens[1].focusedComponent, {
				formModelPath: [],
				subElement: "validation-bar"
			});
			strictEqual(screens[0].focusedComponent, undefined);
		});

		it("counts every request, so focusing the same bar again is not swallowed", () => {
			const store = setup([topLevelScreen, detailScreen]);

			store.dispatch(Commands.CorrectionMode.focusValidationBar());
			store.dispatch(Commands.CorrectionMode.focusValidationBar());

			const screens = UiStateSelectors.screenLocationStack()(store.getState());
			strictEqual(screens[1].focusedComponentRequestCount, 2);
		});

		it("leaves the state untouched when there is no screen to focus", () => {
			const store = setup([]);
			const before = store.getState().ui;

			store.dispatch(Commands.CorrectionMode.focusValidationBar());

			strictEqual(store.getState().ui, before);
		});
	});
});
