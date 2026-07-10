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

export function executeTestForMessageExposition(): void {
	const models = setupModelsFixture("controls.tooltips");

	function assertMessageExposition(opts: {
		elementId: string;
		messageExposition: FormModel.MessageExpositionPresentation | undefined;
	}): void {
		const { elementId, messageExposition } = opts;
		const inputMap = getInputMocks();
		setupFormEngineRendererWithRtl({
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
