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
