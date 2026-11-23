// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { strictEqual } from "node:assert/strict";

import { within } from "@com.mgmtp.a12.devtools/react";

import { click } from "../../rtl-utils/rtl-click.js";
import { setupModelsFixture } from "../../utils/setupFixture.js";
import { IDS } from "../../utils/test-model-helpers/a11y.js";

import { createSetup, executeAddButtonTest, executeDeleteButtonTest } from "./utils.js";

export function executeTestForEmbeddedRepeat(): void {
	const models = setupModelsFixture("a11y", "repeat");

	describe("adding a new row", () => {
		it("focuses the expanded new row", async () => {
			await executeAddButtonTest({
				models,
				addButtonId: IDS.TabAndFocus.EMBEDDED_REPEAT.ADD_BUTTON,
				expectedActiveElementId: IDS.TabAndFocus.EMBEDDED_REPEAT.EXPANDED_ROW
			});
		});
	});

	describe("opening a row", () => {
		it("focuses the expanded row", async () => {
			const wrapper = await createSetup(models);

			await click(
				within(wrapper.baseElement).getById(IDS.TabAndFocus.EMBEDDED_REPEAT.EDIT_BUTTON + "-1")
			);

			strictEqual(
				document.activeElement?.id,
				IDS.TabAndFocus.EMBEDDED_REPEAT.EXPANDED_ROW + "-0",
				"Expected that the expanded row is focused"
			);
		});
	});

	describe("closing a repeat row", () => {
		describe("which was opened by clicking 'edit'", () => {
			it("focuses the row", async () => {
				const wrapper = await createSetup(models);

				await click(
					within(wrapper.baseElement).getById(IDS.TabAndFocus.EMBEDDED_REPEAT.EDIT_BUTTON + "-1")
				);

				await click(
					within(wrapper.baseElement).getById(IDS.TabAndFocus.EMBEDDED_REPEAT.CLOSE_BUTTON)
				);

				within(wrapper.baseElement).getById(IDS.TabAndFocus.DETACHED_REPEAT.ADD_BUTTON);
				strictEqual(
					document.activeElement?.id,
					IDS.TabAndFocus.EMBEDDED_REPEAT.BODY_ROW + "-0",
					"Expected that the trigger edit button is focused"
				);
			});
		});

		describe("which was opened by executing the default row action 'edit'", () => {
			it("focuses the row", async () => {
				const wrapper = await createSetup(models);

				await click(
					within(wrapper.baseElement).getById(IDS.TabAndFocus.EMBEDDED_REPEAT.BODY_ROW + "-0")
				);

				await click(
					within(wrapper.baseElement).getById(IDS.TabAndFocus.EMBEDDED_REPEAT.CLOSE_BUTTON)
				);

				strictEqual(
					document.activeElement?.id,
					IDS.TabAndFocus.EMBEDDED_REPEAT.BODY_ROW + "-0",
					"Expected that the trigger row is focused"
				);
			});
		});
	});

	describe("clicking the delete button", () => {
		describe("and confirming the deletion", () => {
			it("focuses the table", () => {
				executeDeleteButtonTest({
					models,
					confirm: true,
					deleteButtonId: IDS.TabAndFocus.EMBEDDED_REPEAT.DELETE_BUTTON,
					expectedActiveElementId: IDS.TabAndFocus.EMBEDDED_REPEAT.TABLE
				});
			});
		});

		describe("and aborting the deletion", () => {
			it("focuses the delete button", () => {
				executeDeleteButtonTest({
					models,
					confirm: false,
					deleteButtonId: IDS.TabAndFocus.EMBEDDED_REPEAT.DELETE_BUTTON,
					expectedActiveElementId: IDS.TabAndFocus.EMBEDDED_REPEAT.DELETE_BUTTON
				});
			});
		});
	});
}
