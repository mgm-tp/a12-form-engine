// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { strictEqual } from "node:assert/strict";

import { query } from "@com.mgmtp.a12.devtools/react";

import type { FormModel } from "../../../../../../models/index.js";
import { getInputMocks } from "../../../../../rtl-utils/getInputMocks.js";
import { SetupHelpers } from "../../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../../utils/setupFixture.js";
import { IDS } from "../../../../../utils/test-model-helpers/tooltips.js";

export function executeTestForMessageExposition(): void {
	const models = setupModelsFixture("controls.tooltips");

	function assertMessageExposition(opts: {
		elementId: string;
		messageExposition: FormModel.MessageExpositionPresentation | undefined;
	}): void {
		const { elementId, messageExposition } = opts;
		const inputMap = getInputMocks();
		SetupHelpers.setupFormEngineRendererWithRtl({
			models,
			inputMap
		});
		const props = query(inputMap.NumberInput).withProp("uiId", elementId).props();
		strictEqual(props.modelElement.messageExposition, messageExposition);
	}

	describe("given a control with no defined message exposition", () => {
		it("renders a component with prop 'messageExposition' set to undefined", () => {
			assertMessageExposition({ elementId: IDS.WARNING_INPUT, messageExposition: undefined });
		});
	});

	describe("given a control with a defined message exposition", () => {
		it("renders a component with prop 'messageExposition' with the defined message exposition", () => {
			assertMessageExposition({ elementId: IDS.NUMBER_INPUT, messageExposition: "TOOLTIP" });
		});
	});
}
