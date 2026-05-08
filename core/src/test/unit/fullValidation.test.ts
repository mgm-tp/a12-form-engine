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

import { strictEqual } from "node:assert/strict";

import { createEngineStore } from "../../back-end/store/index.js";
import type { EngineState } from "../../back-end/store/internal/store.js";
import { fullValidation } from "../../back-end/store/internal/validation.js";

import { US_LOCALE } from "../utils/localization.js";
import { setupModelsFixture } from "../utils/setupFixture.js";

describe("unit.back-end.store.fullValidation", () => {
	const models = setupModelsFixture("dependencies.relevant");

	function setupStore(options: { document: object }): EngineState {
		const { document } = options;

		return createEngineStore({ models: models, locale: US_LOCALE, data: { document } });
	}
	describe("Validation", () => {
		it("returns messages when the document is invalid", () => {
			const state = setupStore({
				document: {
					base: {
						targets: {
							singleField: "error",
							repeatableGroup: [
								{
									repeatableField1: "error"
								},
								{
									repeatableField1: "error"
								},
								{
									repeatableField1: "error"
								},
								{
									repeatableField1: "error"
								}
							]
						}
					}
				}
			});

			const result = fullValidation(state, {
				converter: () => ({ formatValue: () => "", parseValue: () => ({}) }),
				localizer: () => () => undefined
			});

			strictEqual(result.length, 5);
		});

		it("returns no messages when the document is valid", () => {
			const state = setupStore({ document: {} });

			const result = fullValidation(state, {
				converter: () => ({ formatValue: () => "", parseValue: () => ({}) }),
				localizer: () => () => undefined
			});

			strictEqual(result.length, 0);
		});

		it("returns no messages when the document is invalid only in notRelevant fields", () => {
			const state = setupStore({
				document: {
					base: {
						targets: {
							singleField: "error",
							repeatableGroup: [
								{
									repeatableField1: "error"
								},
								{
									repeatableField1: "error"
								},
								{
									repeatableField1: "error"
								},
								{
									repeatableField1: "error"
								}
							]
						},
						disableSingleField: true,
						disableRepeatableGroup: true
					}
				}
			});

			const result = fullValidation(state, {
				converter: () => ({ formatValue: () => "", parseValue: () => ({}) }),
				localizer: () => () => undefined
			});

			strictEqual(result.length, 0);
		});
	});
});
