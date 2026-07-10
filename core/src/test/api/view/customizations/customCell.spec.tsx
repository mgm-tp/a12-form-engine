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

import { screen } from "@com.mgmtp.a12.devtools/react";

import { assertCondition } from "../../../../back-end/utils/internal/assertions.js";
import { findElementByFormModelPath } from "../../../../models/internal/findElementByFormModelPath.js";
import { isFormModelCustomCell } from "../../../../models/internal/FormModelGuards.js";
import { CustomCell } from "../../../../view/internal/components/form-engine/customizations/custom-element.js";
import { CUSTOM_CELL } from "../../../../view/internal/components/form-engine/data-roles.js";
import { rtlRenderWrapper } from "../../../rtl-utils/render-wrapper.js";
import { assertExists } from "../../../utils/assertions.js";
import { createModelPath } from "../../../utils/createModelPath.js";
import { setupRenderConfiguration } from "../../../utils/setup.js";
import { setupModelsFixture } from "../../../utils/setupFixture.js";

describe("api.view.customizations", () => {
	describe("Custom Cell", () => {
		describe("data-role", () => {
			const customCellModels = setupModelsFixture("customization.custom-cell");

			it("should render a CustomCell with data-role 'custom-cell' on the outmost div", () => {
				const { formModel } = customCellModels;

				const customCellPath = createModelPath("Screen 1", "cg", "r1", "Custom Cell");

				const customCell = findElementByFormModelPath(formModel, customCellPath);
				assertExists(customCell);
				assertCondition(isFormModelCustomCell(customCell));

				const renderConfiguration = setupRenderConfiguration({
					models: customCellModels,
					parentPath: createModelPath("Screen 1")
				});

				rtlRenderWrapper(<CustomCell modelElement={customCell} config={renderConfiguration} />);

				const customCells = screen.getAllByDataRole(CUSTOM_CELL);

				strictEqual(customCells.length, 1);
			});
		});
	});
});
