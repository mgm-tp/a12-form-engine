// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { setupModelsFixture } from "../../utils/setupFixture.js";
import { IDS } from "../../utils/test-model-helpers/a11y.js";

import { executeAddButtonTest, executeDeleteButtonTest } from "./utils.js";

export function executeTestForInlineRepeat(): void {
	const models = setupModelsFixture("a11y", "repeat");

	describe("adding a new row", () => {
		it("focuses the new row", async () => {
			await executeAddButtonTest({
				models,
				addButtonId: IDS.TabAndFocus.INLINE_REPEAT.ADD_BUTTON,
				expectedActiveElementId: IDS.TabAndFocus.INLINE_REPEAT.BODY_ROW
			});
		});
	});

	describe("clicking the delete button", () => {
		describe("and confirming the deletion", () => {
			it("focuses the table", () => {
				executeDeleteButtonTest({
					models,
					confirm: true,
					deleteButtonId: IDS.TabAndFocus.INLINE_REPEAT.DELETE_BUTTON,
					expectedActiveElementId: IDS.TabAndFocus.INLINE_REPEAT.TABLE
				});
			});
		});

		describe("and aborting the deletion", () => {
			it("focuses the delete button", () => {
				executeDeleteButtonTest({
					models,
					confirm: false,
					deleteButtonId: IDS.TabAndFocus.INLINE_REPEAT.DELETE_BUTTON,
					expectedActiveElementId: IDS.TabAndFocus.INLINE_REPEAT.DELETE_BUTTON
				});
			});
		});
	});
}
