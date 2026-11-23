// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";

import { RenderGroupFixture } from "../../../../utils/rtl-render-group.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";
import { createModelPath } from "../../../../utils/test-model-helpers/dependent-enumeration.js";
import { IR } from "../../../../utils/test-model-helpers/inline.repeat.js";
import {
	createDocumentForRepeat,
	createNestedL6Entry
} from "../../../../utils/test-model-helpers/repeat.js";

import { assertButtonEnablement } from "./assertButtonEnablement.js";

/**
 * Note: The triggering of the correct event is tested in row-action.spec.ts
 */
describe("api.view.repeat", () => {
	describe("Move button", () => {
		const models = setupModelsFixture("repeat", "inline");

		const document = createDocumentForRepeat({
			nestedL6: [
				createNestedL6Entry({ L6_Number: 42 }),
				createNestedL6Entry({ L6_Number: 42 }),
				createNestedL6Entry({ L6_Number: 42 })
			]
		});

		describe("enable-disabled", async () => {
			const { it, render } = RenderGroupFixture(
				async () =>
					await SetupHelpers.setupFormEngineRendererWithRtlAsync({
						models,
						data: { document }
					})
			);

			it("disabled the move-up button when it is the first row", () => {
				assertButtonEnablement(
					render.wrapper.widgetMap,
					`${IR.SortingAndFiltering.ID_MOVE_UP}-1`,
					true
				);
			});

			it("enables the move-up button when it is not the first row", () => {
				assertButtonEnablement(
					render.wrapper.widgetMap,
					`${IR.SortingAndFiltering.ID_MOVE_UP}-2`,
					false
				);
			});

			it("enables the move-down button when it is not the last row", () => {
				assertButtonEnablement(
					render.wrapper.widgetMap,
					`${IR.SortingAndFiltering.ID_MOVE_DOWN}-1`,
					false
				);
			});
		});

		describe("enable-disabled", () => {
			it("disabled the move-down button when it is the last row", async () => {
				const { widgetMap } = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
					models,
					data: { document },
					ui: {
						screenLocation: [
							{
								locationPath: createModelPath(IR.SortingAndFiltering.screen),
								path: [],
								repeatInstanceState: {
									[ModelPath.toString(IR.SortingAndFiltering.repeatFormModelPathSec4)]: {
										page: 2
									}
								}
							}
						]
					}
				});

				assertButtonEnablement(widgetMap, `${IR.SortingAndFiltering.ID_MOVE_DOWN}-3`, true);
			});
		});
	});
});
