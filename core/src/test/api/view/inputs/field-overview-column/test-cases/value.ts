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

import { setupModelsFixture } from "../../../../../utils/setupFixture.js";
import {
	CONTROLS,
	createDocumentForControlsModels,
	setupForControlsModel
} from "../../../../../utils/test-model-helpers/controls.js";

export function executeTestForFieldOverviewColumnValue(): void {
	const controls = setupModelsFixture("controls");

	const document = createDocumentForControlsModels({
		L0_Number: CONTROLS.L0_NUMBER_VALUE,
		L1_Number: CONTROLS.L1_NUMBER_VALUE
	});
	const backupDocument = createDocumentForControlsModels({
		L0_Number: CONTROLS.L0_NUMBER_VALUE_BACKUP
	});
	describe("when the control is located in a top-level screen", () => {
		describe("and the referenced field is inside the repeatable group", () => {
			it("reads the value correctly from the document", async () => {
				const wrapper = await setupForControlsModel({ models: controls, document, backupDocument });
				const input = query(wrapper.inputMap.NumberInput)
					.withProp("uiId", CONTROLS.ID_IR_L1_NUMBER)
					.props();
				equal(input.value.data, CONTROLS.L1_NUMBER_VALUE);
			});
		});

		describe("and the referenced field is outside the repeatable group", () => {
			it("reads the value correctly from the document", async () => {
				const wrapper = await setupForControlsModel({ models: controls, document, backupDocument });

				const input = query(wrapper.inputMap.NumberInput)
					.withProp("uiId", CONTROLS.ID_IR_L0_NUMBER)
					.props();
				equal(input.value.data, CONTROLS.L0_NUMBER_VALUE);
			});
		});
	});
}
