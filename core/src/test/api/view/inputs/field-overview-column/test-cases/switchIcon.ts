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

import { deepStrictEqual, equal } from "node:assert/strict";

import { query } from "@com.mgmtp.a12.devtools/react";

import { RenderGroupFixture } from "../../../../../utils/rtl-render-group.js";
import { setupModelsFixture } from "../../../../../utils/setupFixture.js";
import { IR } from "../../../../../utils/test-model-helpers/inline.repeat.js";
import type { RenderWithInputMap } from "../../../../../utils/test-model-helpers/render-with-inputmocks.js";
import { renderWithInputMocks } from "../../../../../utils/test-model-helpers/render-with-inputmocks.js";
import { createDocumentForRepeat } from "../../../../../utils/test-model-helpers/repeat.js";

export function executeTestForFieldOverviewColumnSwitchIcon(): void {
	const inlineRepeatModels = setupModelsFixture("repeat", "inline");

	const { it, render } = RenderGroupFixture<RenderWithInputMap>(() =>
		renderWithInputMocks({
			models: inlineRepeatModels,
			data: {
				document: createDocumentForRepeat({
					nestedL1: [{}],
					nestedL3: [{}],
					nestedL4: [{}],
					nestedL5: [{}],
					nestedL6: [{}],
					nestedL8: [{}],
					nestedL10: [{}]
				})
			},
			ui: {
				screenLocation: [{ locationPath: [{ elementName: IR.FieldExpositions.screen }], path: [] }]
			}
		})
	);

	describe("if an icon is defined in the fieldConfigurationEntry for a switch field", () => {
		it("passes the icon to the SwitchInput", () => {
			const input = query(render.wrapper.inputMap.SwitchInput)
				.withProp("uiId", IR.FieldExpositions.ID_L5_BOOLEAN_SWITCH)
				.props();
			deepStrictEqual(input.modelElement.icon, { name: "star" });
		});
	});

	describe("if no icon is defined in the fieldConfigurationEntry for a switch field", () => {
		it("does not pass an icon to the SwitchInput", () => {
			const input = query(render.wrapper.inputMap.SwitchInput)
				.withProp("uiId", IR.FieldExpositions.ID_L5_BOOLEAN_SWITCH_WITH_VALUES)
				.props();
			equal(input.modelElement.icon, undefined);
		});
	});
}
