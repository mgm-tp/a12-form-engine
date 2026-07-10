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

import { Commands, Events } from "../../../../../back-end/store/index.js";
import { createModelPath } from "../../../../utils/createModelPath.js";
import { MiddlewareHelpers } from "../../../../utils/MiddlewareHelpers.js";
import { createTestStore } from "../../../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../../../utils/setupFixture.js";
import { IR } from "../../../../utils/test-model-helpers/inline.repeat.js";

describe("api.back-end.store.middleware", () => {
	describe("onPageChangeMiddleware", () => {
		describe("handles Events.changePage", () => {
			const middlewareSpy = setupFixture(() => MiddlewareHelpers.createMiddlewareSpy());
			const models = setupModelsFixture("repeat", "inline");

			const repeatFormModelPath = createModelPath(IR.SortingAndFiltering.screen, "Repeat");
			it("dispatches a Commands.changeRepeatInstanceStateEntry action with the page from the payload", () => {
				setupStore().dispatch(
					Events.Repeat.changePage({
						page: 5,
						repeatFormModelPath
					})
				);

				const expectedCommand = Commands.changeRepeatInstanceStateEntry({
					locationPath: createModelPath(IR.SortingAndFiltering.screen),
					entry: {
						page: 5,
						newRow: undefined,
						expandedRowPath: undefined
					},
					repeatFormModelPath
				});

				MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
			});

			it("dispatches a Commands.changeScreenState action with the focusedComponent containing the repeat path", () => {
				setupStore().dispatch(
					Events.Repeat.changePage({
						page: 5,
						repeatFormModelPath
					})
				);

				const expectedCommand = Commands.changeScreenState({
					index: 0,
					focusedComponent: {
						formModelPath: repeatFormModelPath
					}
				});

				MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
			});

			function setupStore() {
				return createTestStore({
					storeConfig: { models: models },
					middlewares: [middlewareSpy.middleware]
				});
			}
		});
	});
});
