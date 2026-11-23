// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { strictEqual } from "node:assert/strict";

import { screen } from "@com.mgmtp.a12.devtools/react";

import { assertCondition } from "../../../../back-end/utils/internal/assertions.js";
import { FormModel } from "../../../../models/index.js";
import { findElementByFormModelPath } from "../../../../models/internal/findElementByFormModelPath.js";
import { CustomScreenElement } from "../../../../view/internal/components/form-engine/customizations/custom-element.js";
import { CUSTOM_SCREEN_ELEMENT } from "../../../../view/internal/components/form-engine/data-roles.js";
import { rtlRenderWrapper } from "../../../rtl-utils/render-wrapper.js";
import { assertExists } from "../../../utils/assertions.js";
import { ModelHelpers } from "../../../utils/model-helpers.js";
import { SetupHelpers } from "../../../utils/setup.js";
import { setupModelsFixture } from "../../../utils/setupFixture.js";

describe("api.view.customizations", () => {
	describe("Custom Screen Element", () => {
		describe("data-role", () => {
			const customScreenElementModels = setupModelsFixture("customization.custom-screen-element");

			it("should render a CustomScreenElement with data-role 'custom-screen-element' on the outmost div", () => {
				const { formModel } = customScreenElementModels;

				const customScreenElementPath = ModelHelpers.createModelPath(
					"Screen 1",
					"customScreenElementTestName"
				);

				const customScreenElement = findElementByFormModelPath(formModel, customScreenElementPath);
				assertExists(customScreenElement);
				assertCondition(FormModel.CustomScreenElement.isInstance(customScreenElement));

				const renderConfiguration = SetupHelpers.setupRenderConfiguration({
					models: customScreenElementModels,
					parentPath: ModelHelpers.createModelPath("Screen 1")
				});

				rtlRenderWrapper(
					<CustomScreenElement modelElement={customScreenElement} config={renderConfiguration} />
				);

				const customScreenElements = screen.getAllByDataRole(CUSTOM_SCREEN_ELEMENT);

				strictEqual(customScreenElements.length, 1);
			});
		});
	});
});
