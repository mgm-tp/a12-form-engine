// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { strictEqual } from "node:assert/strict";

import { screen } from "@com.mgmtp.a12.devtools/react";

import { assertCondition } from "../../../../back-end/utils/internal/assertions.js";
import { FormModel } from "../../../../models/index.js";
import { findElementByFormModelPath } from "../../../../models/internal/findElementByFormModelPath.js";
import { CustomCell } from "../../../../view/internal/components/form-engine/customizations/custom-element.js";
import { CUSTOM_CELL } from "../../../../view/internal/components/form-engine/data-roles.js";
import { rtlRenderWrapper } from "../../../rtl-utils/render-wrapper.js";
import { assertExists } from "../../../utils/assertions.js";
import { ModelHelpers } from "../../../utils/model-helpers.js";
import { SetupHelpers } from "../../../utils/setup.js";
import { setupModelsFixture } from "../../../utils/setupFixture.js";

describe("api.view.customizations", () => {
	describe("Custom Cell", () => {
		describe("data-role", () => {
			const customCellModels = setupModelsFixture("customization.custom-cell");

			it("should render a CustomCell with data-role 'custom-cell' on the outmost div", () => {
				const { formModel } = customCellModels;

				const customCellPath = ModelHelpers.createModelPath("Screen 1", "cg", "r1", "Custom Cell");

				const customCell = findElementByFormModelPath(formModel, customCellPath);
				assertExists(customCell);
				assertCondition(FormModel.CustomCell.isInstance(customCell));

				const renderConfiguration = SetupHelpers.setupRenderConfiguration({
					models: customCellModels,
					parentPath: ModelHelpers.createModelPath("Screen 1")
				});

				rtlRenderWrapper(<CustomCell modelElement={customCell} config={renderConfiguration} />);

				const customCells = screen.getAllByDataRole(CUSTOM_CELL);

				strictEqual(customCells.length, 1);
			});
		});
	});
});
