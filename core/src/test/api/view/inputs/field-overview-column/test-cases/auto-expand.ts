// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
