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

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";

import { createModelPath } from "../../../../utils/createModelPath.js";
import { RenderGroupFixture } from "../../../../utils/rtl-render-group.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";
import { IR } from "../../../../utils/test-model-helpers/inline.repeat.js";
import {
	createDocumentForRepeat,
	createNestedL6Entry
} from "../../../../utils/test-model-helpers/repeat.js";
import { setupFormEngineRendererWithRtlAsync } from "../../../../utils/setup.js";

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
					await setupFormEngineRendererWithRtlAsync({
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
				const { widgetMap } = await setupFormEngineRendererWithRtlAsync({
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
