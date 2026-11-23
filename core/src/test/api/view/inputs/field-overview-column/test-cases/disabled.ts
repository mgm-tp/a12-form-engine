// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
