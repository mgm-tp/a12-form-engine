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
	createDocument,
	IDS
} from "../../../../../utils/test-model-helpers/controls.placeholder.js";
import { renderWithInputMocks } from "../../../../../utils/test-model-helpers/render-with-inputmocks.js";

export function executeTestsForFieldOverviewColumnPlaceholder(): void {
	const models = setupModelsFixture("controls.placeholder");

	describe("given a form-model", () => {
		describe("and a placeholder text defined for a control", () => {
			it("renders a component with prop 'placeholder' which is set to the placeholder text", async () => {
				const wrapper = await renderWithInputMocks({
					models,
					data: { document: createDocument() }
				});

				const input = query(wrapper.inputMap.StringInput)
					.withProp("uiId", IDS.ID_STRING_FIELD_IN_REPEAT)
					.props();
				equal(input.modelElement.placeholder, "Please insert a text");
			});
		});
	});
}
