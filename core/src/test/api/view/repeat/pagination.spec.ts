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

import { equal } from "node:assert/strict";

import { query } from "@com.mgmtp.a12.devtools/react";

import { setupFormEngineRendererWithRtlAsync } from "../../../utils/setup.js";
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
					const { widgetMap } = await setupFormEngineRendererWithRtlAsync({
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
				const { widgetMap } = await setupFormEngineRendererWithRtlAsync({
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
