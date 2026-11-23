// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { strictEqual } from "node:assert/strict";

import { query } from "@com.mgmtp.a12.devtools/react";

import { getInputMocks } from "../../../../../rtl-utils/getInputMocks.js";
import { SetupHelpers } from "../../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../../utils/setupFixture.js";
import { IDS } from "../../../../../utils/test-model-helpers/tooltips.js";

export function executeTestForTooltipsOnTop(): void {
	const models = setupModelsFixture("controls.tooltips");

	function assertTooltipsOnTop(opts: { elementId: string; tooltipsOnTop: true | undefined }): void {
		const { elementId, tooltipsOnTop } = opts;
		const inputMap = getInputMocks();
		SetupHelpers.setupFormEngineRendererWithRtl({
			models,
			inputMap
		});
		const props = query(inputMap.NumberInput).withProp("uiId", elementId).props();
		strictEqual(props.modelElement.tooltipsOnTop, tooltipsOnTop);
	}

	describe("given a control with tooltipsOnTop=undefined", () => {
		it("renders a component with prop 'tooltipsOnTop' set to undefined", () => {
			assertTooltipsOnTop({ elementId: IDS.WARNING_INPUT, tooltipsOnTop: undefined });
		});
	});

	describe("given a control with tooltipsOnTop=true", () => {
		it("renders a component with prop 'tooltipsOnTop' set to true", () => {
			assertTooltipsOnTop({ elementId: IDS.NUMBER_INPUT_TOOLTIP_ON_TOP, tooltipsOnTop: true });
		});
	});
}
