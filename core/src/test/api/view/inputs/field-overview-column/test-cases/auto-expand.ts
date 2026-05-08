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

import { equal } from "node:assert/strict";

import { query } from "@com.mgmtp.a12.devtools/react";

import { RenderGroupFixture } from "../../../../../utils/rtl-render-group.js";
import { setupModelsFixture } from "../../../../../utils/setupFixture.js";
import type { RenderWithInputMap } from "../../../../../utils/test-model-helpers/render-with-inputmocks.js";
import { renderWithInputMocks } from "../../../../../utils/test-model-helpers/render-with-inputmocks.js";

export function executeTestForFieldOverviewColumnAutoExpand(): void {
	const inlineRepeatModels = setupModelsFixture("repeat", "inline");

	function setup(): Promise<RenderWithInputMap> {
		return renderWithInputMocks({
			models: inlineRepeatModels,
			data: {
				document: { Root: { Nested_L3: [{ L3_String: "TextArea" }] } }
			},
			ui: {
				screenLocation: [
					{
						locationPath: [{ elementName: "FieldExpositions" }],
						path: [],
						repeatInstanceState: {
							"/FieldExpositions/sec1/inline-repeat-Nested_L3": {
								page: 1,
								newRow: {
									rowPath: [
										{ elementName: "Root", index: 1 },
										{ elementName: "Nested_L3", index: 1 }
									],
									rowState: "workingOn"
								}
							}
						}
					}
				]
			}
		});
	}

	const { it, render } = RenderGroupFixture<RenderWithInputMap>(setup);

	describe("true", () => {
		it("renders a component with prop 'autoExpand=true' if 'autoExpand' is set in the model", () => {
			const input = query(render.wrapper.inputMap.MultilineInput)
				.withProp("uiId", "a12-fieldbasedrepeatoverviewcolumn-1558f-cell-0")
				.props();
			equal(input.modelElement.autoExpand, true);
		});
	});

	describe("false", () => {
		it("renders a component with prop 'autoExpand=false' if 'autoExpand' is not set in the model", () => {
			const input = query(render.wrapper.inputMap.MultilineInput)
				.withProp("uiId", "a12-fieldbasedrepeatoverviewcolumn-94400-cell-0")
				.props();
			equal(input.modelElement.autoExpand, undefined);
		});
	});
}
