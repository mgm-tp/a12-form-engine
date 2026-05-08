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

import type { EngineStore } from "../../../../../../back-end/store/index.js";
import { setupModelsFixture } from "../../../../../utils/setupFixture.js";
import {
	CONTROLS,
	createDocumentForControlsModels
} from "../../../../../utils/test-model-helpers/controls.js";
import type { RenderWithInputMap } from "../../../../../utils/test-model-helpers/render-with-inputmocks.js";
import { renderWithInputMocks } from "../../../../../utils/test-model-helpers/render-with-inputmocks.js";

export function executeTestForFieldOverviewColumnDisabled(): void {
	const controls = setupModelsFixture("controls");

	const value_L0_document = 200;
	const value_L1 = 300;

	const document = createDocumentForControlsModels({
		L0_Number: value_L0_document,
		L1_Number: value_L1
	});

	function setup(disabled: boolean): Promise<RenderWithInputMap> {
		const screenLocation: EngineStore.ScreenState[] = [
			{
				locationPath: [{ elementName: CONTROLS.screenName }],
				path: [],
				repeatInstanceState: {}
			}
		];

		return renderWithInputMocks({
			models: controls,
			data: { document },
			ui: { screenLocation, disabled }
		});
	}

	it("is disabled if the engine is disabled", async () => {
		const wrapper = await setup(true);
		const input = query(wrapper.inputMap.NumberInput)
			.withProp("uiId", CONTROLS.ID_IR_L0_NUMBER)
			.props();
		equal(input.modelElement.disabled, true);
	});

	it("is not disabled if the engine is not disabled", async () => {
		const wrapper = await setup(false);
		const input = query(wrapper.inputMap.NumberInput)
			.withProp("uiId", CONTROLS.ID_IR_L0_NUMBER)
			.props();
		equal(input.modelElement.disabled, false);
	});
}
