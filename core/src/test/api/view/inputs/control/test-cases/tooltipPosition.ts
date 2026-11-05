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

import { strictEqual } from "node:assert/strict";

import { query } from "@com.mgmtp.a12.devtools/react";

import type { FormModel } from "../../../../../../models/index.js";
import { getInputMocks } from "../../../../../rtl-utils/getInputMocks.js";
import { setupFormEngineRendererWithRtl } from "../../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../../utils/setupFixture.js";
import { IDS } from "../../../../../utils/test-model-helpers/tooltips.js";

function assertTooltipPosition(
	models: ReturnType<typeof setupModelsFixture>,
	elementId: string,
	tooltipPosition: FormModel.TooltipPosition
): void {
	const inputMap = getInputMocks();
	setupFormEngineRendererWithRtl({
		models,
		inputMap
	});
	const props = query(inputMap.NumberInput).withProp("uiId", elementId).props();
	strictEqual(props.modelElement.tooltipPosition, tooltipPosition);
}

export function executeTestForTooltipPosition(): void {
	describe("given the deprecated tooltipsOnTop as a fallback", () => {
		const models = setupModelsFixture("controls.tooltips");

		it("falls back to BESIDE when neither tooltipsOnTop nor tooltipPosition is set", () => {
			assertTooltipPosition(models, IDS.WARNING_INPUT, "BESIDE");
		});

		it("falls back to ABOVE when the deprecated tooltipsOnTop=true is set", () => {
			assertTooltipPosition(models, IDS.NUMBER_INPUT_TOOLTIP_ON_TOP, "ABOVE");
		});
	});

	describe("given an explicit tooltipPosition", () => {
		const models = setupModelsFixture("controls.tooltips");

		it("is used as-is, without a deprecated tooltipsOnTop alongside it", () => {
			assertTooltipPosition(models, IDS.WARNING_INPUT_TOOLTIP_POSITION_BELOW, "BELOW");
		});
	});
}
