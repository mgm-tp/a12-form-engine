// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { setupModelsFixture } from "../../../../../utils/setupFixture.js";
import { DEP_ELEMENT } from "../../../../../utils/test-model-helpers/dependent-element.js";
import { executeHiddenPropTest } from "../../control/executeHiddenPropTest.js";

export function executeTestForFieldOverviewColumnHidden(): void {
	const dependentElementModels = setupModelsFixture("dependencies.element");

	describe("by dependencies", () => {
		describe("Master field inside repeatable group", () => {
			it("renders a hidden component if a field dependency with case notRelevant applies", async () => {
				await executeHiddenPropTest({
					models: dependentElementModels,
					path: DEP_ELEMENT.pathToDepRepeatMasterField,
					value: "NotRelevant",
					componentId: DEP_ELEMENT.ENUMERATION.ID_IR_DEP_FIELD_MASTER_OUTSIDE,
					document: DEP_ELEMENT.createDocument(),
					shouldBeHidden: true
				});
			});
		});

		describe("Master field outside repeatable group", () => {
			it("renders a hidden component if a group dependency with case notRelevant applies", async () => {
				await executeHiddenPropTest({
					models: dependentElementModels,
					path: DEP_ELEMENT.pathToRepeatGroupMasterField,
					value: "2",
					componentId: DEP_ELEMENT.ENUMERATION.ID_IR_DEP_FIELD,
					document: DEP_ELEMENT.createDocument(),
					shouldBeHidden: true
				});
			});
		});
	});
}
