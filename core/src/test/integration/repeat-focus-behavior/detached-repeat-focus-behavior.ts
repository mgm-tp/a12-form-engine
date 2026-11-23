// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { strictEqual } from "node:assert/strict";

import { within } from "@com.mgmtp.a12.devtools/react";

import { click } from "../../rtl-utils/rtl-click.js";
import { setupModelsFixture } from "../../utils/setupFixture.js";
import { IDS } from "../../utils/test-model-helpers/a11y.js";

import { createSetup, executeDeleteButtonTest, executeFocusFormTest } from "./utils.js";

export function executeTestForDetachedRepeat(): void {
	const models = setupModelsFixture("a11y", "repeat");

	describe("adding a new row", () => {
		it("focuses the form", async () => {
			await executeFocusFormTest({
				models,
				addButtonId: IDS.TabAndFocus.DETACHED_REPEAT.ADD_BUTTON
			});
		});
	});

	describe("leaving a repeat row", () => {
		describe("which was a new row", () => {
			describe("by clicking 'cancel'", () => {
				it("focuses the add button", async () => {
					const wrapper = await createSetup(models);

					await click(
						within(wrapper.baseElement).getById(IDS.TabAndFocus.DETACHED_REPEAT.ADD_BUTTON)
					);
					await click(
						within(wrapper.baseElement).getById(IDS.TabAndFocus.DETACHED_REPEAT.ADD_CANCEL_BUTTON)
					);

					strictEqual(
						document.activeElement?.id,
						IDS.TabAndFocus.DETACHED_REPEAT.ADD_BUTTON,
						"Expected that the trigger add button is focused"
					);
				});
			});

			describe("by clicking 'commit'", () => {
				it("focuses the new row", async () => {
					const wrapper = await createSetup(models);

					await click(
						within(wrapper.baseElement).getById(IDS.TabAndFocus.DETACHED_REPEAT.ADD_BUTTON)
					);
					await click(
						within(wrapper.baseElement).getById(IDS.TabAndFocus.DETACHED_REPEAT.COMMIT_BUTTON)
					);

					strictEqual(
						document.activeElement?.id,
						IDS.TabAndFocus.DETACHED_REPEAT.BODY_ROW + "-2",
						"Expected that the trigger add button is focused"
					);
				});
			});
		});

		describe("which was opened by clicking 'edit'", () => {
			describe("by clicking 'cancel'", () => {
				it("focuses the edit button", async () => {
					const wrapper = await createSetup(models);

					await click(
						within(wrapper.baseElement).getById(IDS.TabAndFocus.DETACHED_REPEAT.EDIT_BUTTON + "-1")
					);
					await click(
						within(wrapper.baseElement).getById(IDS.TabAndFocus.DETACHED_REPEAT.EDIT_CANCEL_BUTTON)
					);

					strictEqual(
						document.activeElement?.id,
						IDS.TabAndFocus.DETACHED_REPEAT.EDIT_BUTTON + "-1",
						"Expected that the trigger add button is focused"
					);
				});
			});

			describe("by clicking 'commit'", () => {
				it("focuses the row", async () => {
					const wrapper = await createSetup(models);

					await click(
						within(wrapper.baseElement).getById(IDS.TabAndFocus.DETACHED_REPEAT.EDIT_BUTTON + "-1")
					);
					await click(
						within(wrapper.baseElement).getById(IDS.TabAndFocus.DETACHED_REPEAT.APPLY_BUTTON)
					);

					strictEqual(
						document.activeElement?.id,
						IDS.TabAndFocus.DETACHED_REPEAT.BODY_ROW + "-0",
						"Expected that the trigger add button is focused"
					);
				});
			});
		});

		describe("which was opened by executing the default row action 'edit'", () => {
			describe("by clicking 'cancel'", () => {
				it("focuses the row", async () => {
					const wrapper = await createSetup(models);

					await click(
						within(wrapper.baseElement).getById(IDS.TabAndFocus.DETACHED_REPEAT.BODY_ROW + "-0")
					);

					await click(
						within(wrapper.baseElement).getById(IDS.TabAndFocus.DETACHED_REPEAT.EDIT_CANCEL_BUTTON)
					);

					strictEqual(
						document.activeElement?.id,
						IDS.TabAndFocus.DETACHED_REPEAT.BODY_ROW + "-0",
						"Expected that the trigger add button is focused"
					);
				});
			});

			describe("by clicking 'commit'", () => {
				it("focuses the row", async () => {
					const wrapper = await createSetup(models);

					await click(
						within(wrapper.baseElement).getById(IDS.TabAndFocus.DETACHED_REPEAT.BODY_ROW + "-0")
					);
					await click(
						within(wrapper.baseElement).getById(IDS.TabAndFocus.DETACHED_REPEAT.APPLY_BUTTON)
					);

					strictEqual(
						document.activeElement?.id,
						IDS.TabAndFocus.DETACHED_REPEAT.BODY_ROW + "-0",
						"Expected that the trigger add button is focused"
					);
				});
			});
		});
	});

	describe("clicking the delete button", () => {
		describe("and confirming the deletion", () => {
			it("focuses the table", () => {
				executeDeleteButtonTest({
					models,
					confirm: true,
					deleteButtonId: IDS.TabAndFocus.DETACHED_REPEAT.DELETE_BUTTON,
					expectedActiveElementId: IDS.TabAndFocus.DETACHED_REPEAT.TABLE
				});
			});
		});

		describe("and aborting the deletion", () => {
			it("focuses the delete button", () => {
				executeDeleteButtonTest({
					models,
					confirm: false,
					deleteButtonId: IDS.TabAndFocus.DETACHED_REPEAT.DELETE_BUTTON,
					expectedActiveElementId: IDS.TabAndFocus.DETACHED_REPEAT.DELETE_BUTTON
				});
			});
		});
	});
}
