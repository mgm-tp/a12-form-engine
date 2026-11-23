// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
