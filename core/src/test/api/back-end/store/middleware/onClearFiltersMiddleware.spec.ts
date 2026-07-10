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

import { Commands, Events } from "../../../../../back-end/store/index.js";
import type { EngineStore } from "../../../../../back-end/store/internal/store.js";
import { MiddlewareHelpers } from "../../../../utils/MiddlewareHelpers.js";
import { createModelPath } from "../../../../utils/createModelPath.js";
import { US_LOCALE } from "../../../../utils/localization.js";
import { createTestStore } from "../../../../utils/setup.js";
import { setupFixture } from "../../../../utils/setupFixture.js";
import { REPEAT_MODEL_PATH } from "../../../view/repeat/filter/filter.utils.js";

describe("api.back-end.store.middleware", () => {
	describe("onClearFiltersMiddleware", () => {
		const middlewareSpy = setupFixture(() => MiddlewareHelpers.createMiddlewareSpy());

		function setupStore() {
			return createTestStore({
				storeConfig: {
					locale: US_LOCALE,
					data: { dirty: false, document: {} },
					ui: {
						screenLocation: [
							{
								path: [],
								locationPath: [{ elementName: "SortingAndFiltering" }]
							}
						] as EngineStore.ScreenState[],
						repeatStaticState: {
							"/SortingAndFiltering/sec1/inline-repeat-Nested_L1": {
								filterRowOpen: false,
								filters: {
									["fieldbasedrepeatoverviewcolumn-2c388"]: {
										columnPath: createModelPath(
											...REPEAT_MODEL_PATH,
											"fieldbasedrepeatoverviewcolumn-2c388"
										),
										filter: { filterValue: "Row 1" }
									}
								}
							}
						}
					}
				},
				middlewares: [middlewareSpy.middleware]
			});
		}

		const expectedCommand = Commands.changeRepeatStaticStateEntry({
			repeatFormModelPath: createModelPath(...REPEAT_MODEL_PATH),
			entry: {
				filterRowOpen: false,
				filters: undefined
			}
		});

		describe("handles Events.Repeat.clearFilters", () => {
			it("will dispatch a changeRepeatStaticStateEntry command without any filters", () => {
				setupStore().dispatch(
					Events.Repeat.clearFilters({ repeatFormModelPath: createModelPath(...REPEAT_MODEL_PATH) })
				);
				strictEqual(middlewareSpy.spy.mock.callCount(), 2);
				deepStrictEqual(middlewareSpy.spy.mock.calls.at(-1)?.arguments, [expectedCommand]);
			});
		});
	});
});
