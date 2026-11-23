// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
