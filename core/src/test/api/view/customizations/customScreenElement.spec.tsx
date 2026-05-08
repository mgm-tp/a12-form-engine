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
