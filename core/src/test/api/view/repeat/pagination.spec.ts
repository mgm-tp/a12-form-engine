// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { equal } from "node:assert/strict";

import { query } from "@com.mgmtp.a12.devtools/react";

import { SetupHelpers } from "../../../utils/setup.js";
import { setupModelsFixture } from "../../../utils/setupFixture.js";
import {
	createDocumentForRepeat,
	createNestedL6Entry
} from "../../../utils/test-model-helpers/repeat.js";

describe("api.view.repeat", () => {
	describe("Pagination", () => {
		const models = setupModelsFixture("repeat", "inline");

		describe("enabled-disabled", () => {
			for (const disabled of [true, false]) {
				it(`is ${disabled ? "disabled" : "enabled"} when the Form-Engine is ${disabled ? "disabled" : "enabled"}`, async () => {
					const { widgetMap } = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
						models,
						ui: { disabled },
						data: {
							document: createDocumentForRepeat({
								nestedL6: [
									createNestedL6Entry({ L6_Number: 42 }),
									createNestedL6Entry({ L6_Number: 42 }),
									createNestedL6Entry({ L6_Number: 42 })
								]
							})
						}
					});

					const pagination = query(widgetMap.Pagination).props();
					equal(pagination.disabled, disabled);
				});
			}
		});

		describe("Count of document <= PageSize", () => {
			it("does not show a Pagination", async () => {
				const { widgetMap } = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
					models,
					data: {
						document: createDocumentForRepeat({
							nestedL6: [createNestedL6Entry({ L6_Number: 42 })]
						})
					}
				});

				query(widgetMap.Pagination).assertNotRendered();
			});
		});
	});
});
