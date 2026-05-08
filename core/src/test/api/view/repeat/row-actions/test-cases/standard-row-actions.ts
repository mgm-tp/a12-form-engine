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

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";

import type { RtlRenderWrapper } from "../../../../../rtl-utils/render-wrapper.js";
import { SetupHelpers } from "../../../../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../../../../utils/setupFixture.js";
import {
	FORM_MODEL,
	IDS,
	createDocument
} from "../../../../../utils/test-model-helpers/repeat.row-actions.js";

import {
	assertAriaLabelledBy,
	findAndAssertButtonProps,
	findAndAssertListItemProps
} from "../row-action-utils.js";

export function executeTestForStandardRowActions(): void {
	describe("given a row in a repeat table", () => {
		const models = setupModelsFixture("repeat.row-actions");
		const fixture = setupFixture(() => {
			const document = createDocument({
				repeat: [{}, {}],
				repeat_AttachmentCollection: [{ Attachment: {}, stringField: "Paul" }, { Attachment: {} }]
			});
			return {
				document
			};
		});

		function setup(): Promise<RtlRenderWrapper> {
			return SetupHelpers.setupFormEngineRendererWithRtlAsync({
				models,
				data: { document: fixture.document }
			});
		}

		describe("the edit button", () => {
			it("is rendered with the correct icon and title in the action column", async () => {
				const wrapper = await setup();

				await findAndAssertButtonProps({
					wrapper,
					buttonId: IDS.ROW_ACTIONS.BUTTONS.editInRepeatAllFalse,
					expectedTitle: "edit the row",
					expectedIcon: "edit"
				});
			});

			it("is rendered with the correct graphic and text in the context menu, when the row is right-clicked", async () => {
				const wrapper = await setup();

				await findAndAssertListItemProps({
					wrapper,
					cellId: IDS.INLINE_REPEAT.ALL_FALSE.firstCell + "-0",
					itemId: IDS.ROW_ACTIONS.LIST_ITEMS.editInRepeatAllFalse,
					expectedGraphic: "edit",
					expectedText: "edit the row"
				});
			});

			it("is rendered as a disabled edit button in the expanded embedded repeat row", async () => {
				const document = createDocument({
					repeat: [{}, {}],
					repeat_AttachmentCollection: [{ Attachment: {} }, { Attachment: {} }]
				});

				const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
					models,
					data: { document },
					ui: {
						screenLocation: [
							{
								locationPath: [{ elementName: FORM_MODEL.embeddedRepeatScreen }],
								path: [],
								repeatInstanceState: {
									[ModelPath.toString(FORM_MODEL.embeddedRepeatAllFalseFormModelPath)]: {
										expandedRowPath: [
											{ elementName: "Root", index: 1 },
											{ elementName: "repeat", index: 1 }
										]
									}
								}
							}
						]
					}
				});

				await findAndAssertButtonProps({
					wrapper,
					buttonId: IDS.EMBEDDED_REPEAT.EXPANDED_ROW.editFooterButton,
					expectedTitle: "edit the row",
					expectedIcon: "edit",
					expectedDisabled: true
				});
			});

			it("is rendered with correct aria-labelledby when repeat has a screenReaderColumnRef", async () => {
				const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
					models,
					data: { document: fixture.document },
					ui: {
						screenLocation: [
							{
								locationPath: [{ elementName: FORM_MODEL.screenReaderColumnScreen }],
								path: []
							}
						]
					}
				});

				assertAriaLabelledBy(
					wrapper,
					IDS.SCREEN_READER_COLUMN_TEST.ER_WITH_SCREEN_READER_COLUMN.editButton,
					IDS.SCREEN_READER_COLUMN_TEST.ER_WITH_SCREEN_READER_COLUMN.columnRef
				);
			});
		});

		describe("the view button", () => {
			it("is rendered with the correct icon and title in the action column", async () => {
				const readonlyWrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
					models,
					data: { document: fixture.document },
					ui: { readonly: true }
				});

				await findAndAssertButtonProps({
					wrapper: readonlyWrapper,
					buttonId: IDS.ROW_ACTIONS.BUTTONS.viewInRepeatAllFalse,
					expectedTitle: "view the row",
					expectedIcon: "launch"
				});
			});

			it("is rendered with the correct graphic and text in the context menu, when the row is right-clicked", async () => {
				const readonlyWrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
					models,
					data: { document: fixture.document },
					ui: { readonly: true }
				});

				await findAndAssertListItemProps({
					wrapper: readonlyWrapper,
					cellId: IDS.INLINE_REPEAT.ALL_FALSE.firstCell + "-0",
					itemId: IDS.ROW_ACTIONS.LIST_ITEMS.viewInRepeatAllFalse,
					expectedGraphic: "launch",
					expectedText: "view the row"
				});
			});

			it("is rendered as a disabled view button in the expanded embedded repeat row", async () => {
				const document = createDocument({
					repeat: [{}, {}],
					repeat_AttachmentCollection: [{ Attachment: {} }, { Attachment: {} }]
				});

				const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
					withWidgets: true,
					models,
					data: { document },
					ui: {
						screenLocation: [
							{
								locationPath: [{ elementName: FORM_MODEL.embeddedRepeatScreen }],
								path: [],
								repeatInstanceState: {
									[ModelPath.toString(FORM_MODEL.embeddedRepeatAllFalseFormModelPath)]: {
										expandedRowPath: [
											{ elementName: "Root", index: 1 },
											{ elementName: "repeat", index: 1 }
										]
									}
								}
							}
						],
						readonly: true
					}
				});

				await findAndAssertButtonProps({
					wrapper,
					buttonId: IDS.EMBEDDED_REPEAT.EXPANDED_ROW.viewFooterButton,
					expectedTitle: "view the row",
					expectedIcon: "launch",
					expectedDisabled: true
				});
			});

			it("is rendered with correct aria-labelledby when repeat has a screenReaderColumnRef", async () => {
				const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
					models,
					data: { document: fixture.document },
					ui: {
						readonly: true, // render "edit" as "view"
						screenLocation: [
							{
								locationPath: [{ elementName: FORM_MODEL.screenReaderColumnScreen }],
								path: []
							}
						]
					}
				});

				assertAriaLabelledBy(
					wrapper,
					IDS.SCREEN_READER_COLUMN_TEST.ER_WITH_SCREEN_READER_COLUMN.viewButton,
					IDS.SCREEN_READER_COLUMN_TEST.ER_WITH_SCREEN_READER_COLUMN.columnRef
				);
			});
		});

		describe("the remove button", () => {
			it("is rendered with the correct icon and title in the action column", async () => {
				const wrapper = await setup();

				await findAndAssertButtonProps({
					wrapper,
					buttonId: IDS.ROW_ACTIONS.BUTTONS.remove,
					expectedTitle: "remove the row",
					expectedIcon: "delete"
				});
			});

			it("is rendered with the correct graphic and text in the context menu, when the row is right-clicked", async () => {
				const wrapper = await setup();

				await findAndAssertListItemProps({
					wrapper,
					cellId: IDS.INLINE_REPEAT.ONLY_REMOVE.firstCell + "-0",
					itemId: IDS.ROW_ACTIONS.LIST_ITEMS.remove,
					expectedGraphic: "delete",
					expectedText: "remove the row"
				});
			});

			it("is rendered with correct aria-labelledby when repeat has a screenReaderColumnRef", async () => {
				const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
					models,
					data: { document: fixture.document },
					ui: {
						screenLocation: [
							{
								locationPath: [{ elementName: FORM_MODEL.screenReaderColumnScreen }],
								path: []
							}
						]
					}
				});

				assertAriaLabelledBy(
					wrapper,
					IDS.SCREEN_READER_COLUMN_TEST.IR_WITH_SCREEN_READER_COLUMN.removeButton,
					IDS.SCREEN_READER_COLUMN_TEST.IR_WITH_SCREEN_READER_COLUMN.columnRef
				);
			});
		});

		describe("the clone button", () => {
			it("is rendered with the correct icon and title in the action column", async () => {
				const wrapper = await setup();

				await findAndAssertButtonProps({
					wrapper,
					buttonId: IDS.ROW_ACTIONS.BUTTONS.clone,
					expectedTitle: "copy the row",
					expectedIcon: "content_copy"
				});
			});

			it("is rendered with the correct graphic and text in the context menu, when the row is right-clicked", async () => {
				const wrapper = await setup();

				await findAndAssertListItemProps({
					wrapper,
					cellId: IDS.INLINE_REPEAT.ONLY_CLONE.firstCell + "-0",
					itemId: IDS.ROW_ACTIONS.LIST_ITEMS.clone,
					expectedGraphic: "content_copy",
					expectedText: "copy the row"
				});
			});

			it("is rendered with correct aria-labelledby when repeat has a screenReaderColumnRef", async () => {
				const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
					models,
					data: { document: fixture.document },
					ui: {
						screenLocation: [
							{
								locationPath: [{ elementName: FORM_MODEL.screenReaderColumnScreen }],
								path: []
							}
						]
					}
				});

				assertAriaLabelledBy(
					wrapper,
					IDS.SCREEN_READER_COLUMN_TEST.IR_WITH_SCREEN_READER_COLUMN.copyButton,
					IDS.SCREEN_READER_COLUMN_TEST.IR_WITH_SCREEN_READER_COLUMN.columnRef
				);
			});
		});

		describe("the move up button", () => {
			it("is rendered with the correct icon and title in the action column", async () => {
				const wrapper = await setup();

				await findAndAssertButtonProps({
					wrapper,
					buttonId: IDS.ROW_ACTIONS.BUTTONS.moveUp,
					expectedTitle: "move the row up",
					expectedIcon: "keyboard_arrow_up"
				});
			});

			it("is rendered with the correct graphic and text in the context menu, when the row is right-clicked", async () => {
				const wrapper = await setup();

				await findAndAssertListItemProps({
					wrapper,
					cellId: IDS.INLINE_REPEAT.ONLY_MOVE.firstCell + "-1",
					itemId: IDS.ROW_ACTIONS.LIST_ITEMS.moveUp,
					expectedGraphic: "keyboard_arrow_up",
					expectedText: "move the row up"
				});
			});

			it("is rendered with correct aria-labelledby when repeat has a screenReaderColumnRef", async () => {
				const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
					models,
					data: { document: fixture.document },
					ui: {
						screenLocation: [
							{
								locationPath: [{ elementName: FORM_MODEL.screenReaderColumnScreen }],
								path: []
							}
						]
					}
				});

				assertAriaLabelledBy(
					wrapper,
					IDS.SCREEN_READER_COLUMN_TEST.IR_WITH_SCREEN_READER_COLUMN.upButton,
					IDS.SCREEN_READER_COLUMN_TEST.IR_WITH_SCREEN_READER_COLUMN.columnRef
				);
			});
		});

		describe("the move down button", () => {
			it("is rendered with the correct icon and title in the action column", async () => {
				const wrapper = await setup();

				await findAndAssertButtonProps({
					wrapper,
					buttonId: IDS.ROW_ACTIONS.BUTTONS.moveDown,
					expectedTitle: "move the row down",
					expectedIcon: "keyboard_arrow_down"
				});
			});

			it("is rendered with the correct graphic and text in the context menu, when the row is right-clicked", async () => {
				const wrapper = await setup();

				await findAndAssertListItemProps({
					wrapper,
					cellId: IDS.INLINE_REPEAT.ONLY_MOVE.firstCell + "-0",
					itemId: IDS.ROW_ACTIONS.LIST_ITEMS.moveDown,
					expectedGraphic: "keyboard_arrow_down",
					expectedText: "move the row down"
				});
			});

			it("is rendered with correct aria-labelledby when repeat has a screenReaderColumnRef", async () => {
				const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
					models,
					data: { document: fixture.document },
					ui: {
						screenLocation: [
							{
								locationPath: [{ elementName: FORM_MODEL.screenReaderColumnScreen }],
								path: []
							}
						]
					}
				});

				assertAriaLabelledBy(
					wrapper,
					IDS.SCREEN_READER_COLUMN_TEST.IR_WITH_SCREEN_READER_COLUMN.downButton,
					IDS.SCREEN_READER_COLUMN_TEST.IR_WITH_SCREEN_READER_COLUMN.columnRef
				);
			});
		});

		describe("the download button", () => {
			it("is rendered with the correct icon and title in the action column", async () => {
				const wrapper = await setup();

				await findAndAssertButtonProps({
					wrapper,
					buttonId: IDS.ROW_ACTIONS.BUTTONS.download,
					expectedTitle: "download file",
					expectedIcon: "file_download",
					expectedDisabled: true
				});
			});

			it("is rendered with the correct graphic and text in the context menu, when the row is right-clicked", async () => {
				const wrapper = await setup();

				await findAndAssertListItemProps({
					wrapper,
					cellId: IDS.INLINE_REPEAT.ONLY_DOWNLOAD.firstCell + "-0",
					itemId: IDS.ROW_ACTIONS.LIST_ITEMS.download,
					expectedGraphic: "file_download",
					expectedText: "download file"
				});
			});

			it("is rendered with correct aria-labelledby when repeat has a screenReaderColumnRef", async () => {
				const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
					models,
					data: { document: fixture.document },
					ui: {
						screenLocation: [
							{
								locationPath: [{ elementName: FORM_MODEL.screenReaderColumnScreen }],
								path: []
							}
						]
					}
				});

				assertAriaLabelledBy(
					wrapper,
					IDS.SCREEN_READER_COLUMN_TEST.IR_WITH_SCREEN_READER_COLUMN.downloadButton,
					IDS.SCREEN_READER_COLUMN_TEST.IR_WITH_SCREEN_READER_COLUMN.columnRef
				);
			});
		});
	});
}
