// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
