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

import { deepEqual, equal, notEqual } from "node:assert/strict";

import { query, within } from "@com.mgmtp.a12.devtools/react";

import { EXPANDED_ROW } from "../../../../rtl-utils/data-roles.js";
import { mouseEventMock } from "../../../../rtl-utils/mock-utils.js";
import { DocumentHelpers } from "../../../../utils/document-helpers.js";
import { ER } from "../../../../utils/test-model-helpers/embedded.repeat.js";

import type { EmbeddedRepeatTestEnv } from "./utils.js";
import { setup } from "./utils.js";

export function expandedRowTest(testEnv: EmbeddedRepeatTestEnv): void {
	const onCloseEmbeddedRepeatRowStub = testEnv.stubs.onCloseEmbeddedRepeatRow;

	describe("given a state where a row for the embedded repeat is expanded", () => {
		it("renders the referenced row as an expanded row with a control-grid", async () => {
			const wrapper = await setup({
				testEnv,
				expandedRowPath: DocumentHelpers.createDocumentPath(["Root"], ["Nested_L1", 2])
			});

			const expandedRow = within(wrapper.baseElement).getById(
				ER.SortingAndFiltering.ID_EXPANDED_ROW + "-1"
			);
			within(expandedRow).getById(ER.SortingAndFiltering.ID_EXPANDED_ROW_CONTROL_GRID);
		});

		it("renders the expanded row with highlightVariant=info", async () => {
			const { tableMap } = await setup({
				testEnv,
				expandedRowPath: DocumentHelpers.createDocumentPath(["Root"], ["Nested_L1", 2])
			});

			const bodyRowProps = query(tableMap.TableTemplate.BodyRow)
				.propsHistory()
				.find(props => props.selected === true);

			equal(bodyRowProps?.highlightVariant, "info");
		});

		it("renders the expanded row with a footer containing a close button and the row action buttons", async () => {
			const { baseElement, widgetMap } = await setup({
				testEnv,
				expandedRowPath: DocumentHelpers.createDocumentPath(["Root"], ["Nested_L1", 2])
			});

			const expandedRowFooter = within(baseElement).getByTestId(
				`${ER.SortingAndFiltering.ID_EXPANDED_ROW}-1-footer`
			);

			const buttonIds = {
				close: ER.SortingAndFiltering.ID_CLOSE_BUTTON,
				edit: `${ER.SortingAndFiltering.ID_EDIT_BUTTON}-2`,
				remove: `${ER.SortingAndFiltering.ID_REMOVE_BUTTON}-2`,
				custom: `${ER.SortingAndFiltering.ID_CUSTOM_BUTTON}-2`
			};

			// assert all buttons are rendered into footer of expanded row
			for (const buttonId of Object.values(buttonIds)) {
				within(expandedRowFooter).getById(buttonId);
			}

			const closeButton = query(widgetMap.Button).withId(buttonIds.close).props();
			notEqual(closeButton?.disabled, true, "Expected that the close button is not disabled");

			const editButton = query(widgetMap.Button).withId(buttonIds.edit).props();
			equal(editButton?.disabled, true, "Expected that the edit button is disabled");
			equal(editButton.title, "Edit", "Expected that the edit button has the correct title");

			const removeButton = query(widgetMap.Button).withId(buttonIds.remove).props();

			notEqual(removeButton?.disabled, true, "Expected that the remove button is not disabled");
			equal(removeButton?.title, "Delete", "Expected that the remove button has the correct title");

			const customButton = query(widgetMap.Button).withId(buttonIds.custom).props();
			notEqual(customButton?.disabled, true, "Expected that the custom button is not disabled");
			notEqual(customButton?.title, undefined, "Expected that the custom button has a title");
		});

		describe("and close is clicked", () => {
			it("triggers 'onCloseEmbeddedRepeatRow'", async () => {
				const { widgetMap } = await setup({
					testEnv,
					expandedRowPath: DocumentHelpers.createDocumentPath(["Root"], ["Nested_L1", 2])
				});

				const closeButtonProps = query(widgetMap.Button)
					.withId(ER.SortingAndFiltering.ID_CLOSE_BUTTON)
					.props();

				closeButtonProps?.onClick?.(mouseEventMock);

				equal(
					onCloseEmbeddedRepeatRowStub.mock.callCount(),
					1,
					`Dispatch function was called
					${onCloseEmbeddedRepeatRowStub.mock.callCount()} time(s). Expected call count: 1`
				);

				deepEqual(
					onCloseEmbeddedRepeatRowStub.mock.calls[0].arguments[0],
					ER.SortingAndFiltering.repeatFormModelPath
				);
			});
		});
	});

	describe("given a state where no row for the embedded repeat is expanded", () => {
		it("renders no expanded row for the repeat", async () => {
			// Setup set an expanded row for another repeat
			const { baseElement } = await setup({
				testEnv,
				expandedRowPath: DocumentHelpers.createDocumentPath(["Root"], ["Nested_L1", 2])
			});

			const roRepeat = within(baseElement).getById(`${ER.SortingAndFiltering.ID_ER_RO}-table`);
			const expandedRow = within(roRepeat).queryAllByDataRole(EXPANDED_ROW);

			equal(
				expandedRow.length,
				0,
				`Expected to find no expandable row for repeat ${ER.SortingAndFiltering.ID_ER_RO}`
			);
		});
	});
}
