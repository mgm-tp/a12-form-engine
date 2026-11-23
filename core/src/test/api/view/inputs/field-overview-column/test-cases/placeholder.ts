// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
