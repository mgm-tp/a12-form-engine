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

import { within } from "@com.mgmtp.a12.devtools/react";

import { assertCondition } from "../../../../../back-end/utils/internal/assertions.js";
import { findElementByFormModelPath, FormModel } from "../../../../../models/index.js";
import {
	DETACHED_REPEAT,
	REPEAT_CONTENT
} from "../../../../../view/internal/components/form-engine/data-roles.js";
import { DetachedRepeat } from "../../../../../view/internal/components/form-engine/repeat/repeats.js";
import { TABLE } from "../../../../rtl-utils/data-roles.js";
import { rtlRenderWrapperAsync } from "../../../../rtl-utils/render-wrapper.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { DR } from "../../../../utils/test-model-helpers/detached.repeat.js";

export function executeRenderingTests() {
	describe("data-role", () => {
		it("renders a DetachedRepeat with data-role 'repeat-detached' on the outermost div and 'repeat-content' on the repeat container div", async () => {
			const models = SetupHelpers.loadModels("repeat", "detached");

			const detachedRepeat = findElementByFormModelPath(
				models.formModel,
				DR.SortingAndFiltering.repeatFormModelPath
			);
			assertCondition(FormModel.DetachedRepeat.isInstance(detachedRepeat));

			const renderConfiguration = SetupHelpers.setupRenderConfiguration({
				models,
				parentPath: DR.SortingAndFiltering.repeatFormModelPath.slice(0, -1)
			});

			const { baseElement } = await rtlRenderWrapperAsync(
				<DetachedRepeat modelElement={detachedRepeat} config={renderConfiguration} />
			);

			const repeat = within(baseElement).getByDataRole(DETACHED_REPEAT);
			strictEqual(repeat.id, DR.SortingAndFiltering.ID_REPEAT);

			const repeatContent = within(repeat).getByDataRole(REPEAT_CONTENT);
			strictEqual(repeatContent.parentElement, repeat);

			const repeatTable = within(repeatContent).getByRole(TABLE);
			strictEqual(repeatTable.parentElement, repeatContent);
		});
	});
}
