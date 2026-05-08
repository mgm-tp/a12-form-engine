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

import { DocumentPath } from "../../../../../../models/index.js";
import {
	findClickAndAssert,
	findClickAndAssertInContextMenu,
	findClickCancelAndAssert,
	findClickCancelAndAssertInContextMenu,
	findClickConfirmAndAssert,
	findClickConfirmAndAssertInContextMenu
} from "../../../../../utils/row-action-buttons.js";
import { SetupHelpers } from "../../../../../utils/setup.js";
import { setupFixtureObject, setupModelsFixture } from "../../../../../utils/setupFixture.js";
import {
	FORM_MODEL,
	IDS,
	ROW_DOCUMENT_PATH
} from "../../../../../utils/test-model-helpers/repeat.row-actions.js";

import {
	createRepeatModelPath,
	stubbedDispatchConfig as dispatchConfig,
	openRowActionContextMenu,
	resetStubbedDispatchConfig,
	rowActionDisabledInActionColumn,
	rowActionDisabledInContextMenu,
	rowActionNotAvailableInActionColumn,
	rowActionNotAvailableInContextMenu,
	setupFormEngineRendererForVisibilityTests
} from "../row-action-utils.js";

export function executeTestForEditable(): void {
	describe("if the form is neither readonly nor disabled, a click on", () => {
		const { loadData } = SetupHelpers;

		const models = setupModelsFixture("repeat.row-actions");

		const document = setupFixtureObject(() =>
			loadData("repeat.row-actions", "data-repeat-options", models.documentModel)
		);

		const render = () =>
			setupFormEngineRendererForVisibilityTests(models, document, false, false, dispatchConfig);

		afterEach(() => {
			resetStubbedDispatchConfig(dispatchConfig);
		});

		describe("the edit row action", () => {
			describe("in the action column", () => {
				it("triggers a call to dispatchConfiguration.repeat.enterRow with the respective parameters", async () => {
					await findClickAndAssert(
						await render(),
						IDS.ROW_ACTIONS.BUTTONS.editInRepeatAllFalse,
						dispatchConfig.repeat.enterRow,
						[ROW_DOCUMENT_PATH, createRepeatModelPath("DR_allFalse"), "edit-button"]
					);
				});
			});

			describe("in the context menu", () => {
				it("triggers a call to dispatchConfiguration.repeat.enterRow with the respective parameters", async () => {
					await findClickAndAssertInContextMenu(
						await render(),
						IDS.INLINE_REPEAT.ALL_FALSE.firstCell + "-0",
						IDS.ROW_ACTIONS.LIST_ITEMS.editInRepeatAllFalse,
						dispatchConfig.repeat.enterRow,
						[ROW_DOCUMENT_PATH, createRepeatModelPath("DR_allFalse"), "edit-button"]
					);
				});
			});
		});

		describe("the view row action", () => {
			describe("in the action column", () => {
				it("is not possible because the button is invisible", async () => {
					rowActionNotAvailableInActionColumn(
						await render(),
						IDS.ROW_ACTIONS.BUTTONS.viewInRepeatAllFalse
					);
				});
			});

			describe("in the context menu", () => {
				it("is not possible because the button is invisible", async () => {
					const wrapper = await render();
					await openRowActionContextMenu(wrapper, IDS.INLINE_REPEAT.ALL_FALSE.firstCell + "-0");
					rowActionNotAvailableInContextMenu(
						wrapper,
						IDS.ROW_ACTIONS.LIST_ITEMS.viewInRepeatAllFalse
					);
				});
			});
		});

		describe("the remove row action", () => {
			describe("in the action column", () => {
				describe("if confirmed", () => {
					it("triggers a call to dispatchConfiguration.repeat.removeRow with the respective parameters", async () => {
						await findClickConfirmAndAssert(
							await render(),
							IDS.ROW_ACTIONS.BUTTONS.remove,
							dispatchConfig.repeat.removeRow,
							[ROW_DOCUMENT_PATH, createRepeatModelPath("DR_onlyRemoveTrue")] as const
						);
					});
				});

				describe("if not confirmed", () => {
					it("does not trigger a call to dispatchConfiguration.repeat.removeRow", async () => {
						await findClickCancelAndAssert(
							await render(),
							IDS.ROW_ACTIONS.BUTTONS.remove,
							dispatchConfig.repeat.removeRow
						);
					});
				});
			});

			describe("in the context menu", () => {
				describe("if confirmed", () => {
					it("triggers a call to dispatchConfiguration.repeat.removeRow with the respective parameters", async () => {
						await findClickConfirmAndAssertInContextMenu(
							await render(),
							IDS.INLINE_REPEAT.ONLY_REMOVE.firstCell + "-0",
							IDS.ROW_ACTIONS.LIST_ITEMS.remove,
							dispatchConfig.repeat.removeRow,
							[ROW_DOCUMENT_PATH, createRepeatModelPath("DR_onlyRemoveTrue")] as const
						);
					});
				});

				describe("if not confirmed", () => {
					it("does not trigger a call to dispatchConfiguration.repeat.removeRow", async () => {
						await findClickCancelAndAssertInContextMenu(
							await render(),
							IDS.INLINE_REPEAT.ONLY_REMOVE.firstCell + "-0",
							IDS.ROW_ACTIONS.LIST_ITEMS.remove,
							dispatchConfig.repeat.removeRow
						);
					});
				});
			});
		});

		describe("the copy row action", () => {
			describe("in the action column", () => {
				it("triggers a call to dispatchConfiguration.repeat.onCloneRow with the respective parameters", async () => {
					await findClickAndAssert(
						await render(),
						IDS.ROW_ACTIONS.BUTTONS.clone,
						dispatchConfig.repeat.onCloneRow,
						[ROW_DOCUMENT_PATH, createRepeatModelPath("DR_onlyClone")] as const
					);
				});
			});

			describe("in the context menu", () => {
				it("triggers a call to dispatchConfiguration.repeat.onCloneRow with the respective parameters", async () => {
					await findClickAndAssertInContextMenu(
						await render(),
						IDS.INLINE_REPEAT.ONLY_CLONE.firstCell + "-0",
						IDS.ROW_ACTIONS.LIST_ITEMS.clone,
						dispatchConfig.repeat.onCloneRow,
						[ROW_DOCUMENT_PATH, createRepeatModelPath("DR_onlyClone")] as const
					);
				});
			});
		});

		describe("the move down row action", () => {
			describe("in the action column", () => {
				it("triggers a call to dispatchConfiguration.repeat.onMoveRow with the respective parameters", async () => {
					await findClickAndAssert(
						await render(),
						IDS.ROW_ACTIONS.BUTTONS.moveDown,
						dispatchConfig.repeat.onMoveRow,
						[createRepeatModelPath("DR_onlyMove"), ROW_DOCUMENT_PATH, 1] as const
					);
				});
			});

			describe("in the context menu", () => {
				it("triggers a call to dispatchConfiguration.repeat.onMoveRow with the respective parameters", async () => {
					await findClickAndAssertInContextMenu(
						await render(),
						IDS.INLINE_REPEAT.ONLY_MOVE.firstCell + "-0",
						IDS.ROW_ACTIONS.LIST_ITEMS.moveDown,
						dispatchConfig.repeat.onMoveRow,
						[createRepeatModelPath("DR_onlyMove"), ROW_DOCUMENT_PATH, 1] as const
					);
				});
			});
		});

		describe("the move up row action", () => {
			describe("in the action column", () => {
				it("triggers a call to dispatchConfiguration.repeat.onMoveRow with the respective parameters", async () => {
					await findClickAndAssert(
						await render(),
						IDS.ROW_ACTIONS.BUTTONS.moveUp,
						dispatchConfig.repeat.onMoveRow,
						[
							createRepeatModelPath("DR_onlyMove"),
							[
								ROW_DOCUMENT_PATH[0],
								{
									...ROW_DOCUMENT_PATH[1],
									index: 2
								}
							],
							-1
						] as const
					);
				});
			});

			describe("in the context menu", () => {
				it("triggers a call to dispatchConfiguration.repeat.onMoveRow with the respective parameters", async () => {
					await findClickAndAssertInContextMenu(
						await render(),
						IDS.INLINE_REPEAT.ONLY_MOVE.firstCell + "-1",
						IDS.ROW_ACTIONS.LIST_ITEMS.moveUp,
						dispatchConfig.repeat.onMoveRow,
						[
							createRepeatModelPath("DR_onlyMove"),
							[
								ROW_DOCUMENT_PATH[0],
								{
									...ROW_DOCUMENT_PATH[1],
									index: 2
								}
							],
							-1
						] as const
					);
				});
			});
		});

		describe("the download row action", () => {
			describe("in the action column", () => {
				it("triggers a call to dispatchConfiguration.onAttachmentDownload with the respective parameters", async () => {
					await findClickAndAssert(
						await render(),
						IDS.ROW_ACTIONS.BUTTONS.download,
						dispatchConfig.onAttachmentDownload,
						[
							{
								original_filename: "attachment1",
								internal_filename: "attachment1",
								size: 0,
								mime_type: "text/plain",
								content: "data:"
							},
							DocumentPath.fromString("Root[1]/repeat_AttachmentCollection[1]/Attachment[1]")
						]
					);
				});
			});

			describe("in the context menu", () => {
				it("triggers a call to dispatchConfiguration.onAttachmentDownload with the respective parameters", async () => {
					await findClickAndAssertInContextMenu(
						await render(),
						IDS.INLINE_REPEAT.ONLY_DOWNLOAD.firstCell + "-0",
						IDS.ROW_ACTIONS.LIST_ITEMS.download,
						dispatchConfig.onAttachmentDownload,
						[
							{
								original_filename: "attachment1",
								internal_filename: "attachment1",
								size: 0,
								mime_type: "text/plain",
								content: "data:"
							},
							DocumentPath.fromString("Root[1]/repeat_AttachmentCollection[1]/Attachment[1]")
						]
					);
				});
			});
		});

		describe("a custom row action", () => {
			describe("in the action column", () => {
				describe("with confirmation that is confirmed", () => {
					it("triggers a call to dispatchConfiguration.repeat.onCustomRowAction with the respective parameters", async () => {
						await findClickConfirmAndAssert(
							await render(),
							IDS.ROW_ACTIONS.BUTTONS.eventAlwaysShownAndEnabledWithConfirmation,
							dispatchConfig.repeat.onCustomRowAction,
							[
								ROW_DOCUMENT_PATH,
								createRepeatModelPath("DR_allFalse"),
								"always-shown-and-enabled"
							] as const
						);
					});
				});

				describe("with confirmation that is not confirmed", () => {
					it("does not trigger a call to dispatchConfiguration.repeat.onCustomRowAction", async () => {
						await findClickCancelAndAssert(
							await render(),
							IDS.ROW_ACTIONS.BUTTONS.eventAlwaysShownAndEnabledWithConfirmation,
							dispatchConfig.repeat.onCustomRowAction
						);
					});
				});

				describe("with scope === 'ALWAYS'", () => {
					it("triggers a call to dispatchConfiguration.repeat.onCustomRowAction with the respective parameters", async () => {
						await findClickAndAssert(
							await render(),
							IDS.ROW_ACTIONS.BUTTONS.eventAlwaysShownAndEnabled,
							dispatchConfig.repeat.onCustomRowAction,
							[
								ROW_DOCUMENT_PATH,
								createRepeatModelPath(FORM_MODEL.nestedL6RowActions),
								"always-shown-and-enabled"
							] as const
						);
					});
				});

				describe("with scope === 'HIDDEN_IN_READONLY_MODE'", () => {
					it("triggers a call to dispatchConfiguration.repeat.onCustomRowAction with the respective parameters", async () => {
						await findClickAndAssert(
							await render(),
							IDS.ROW_ACTIONS.BUTTONS.eventHiddenInReadonlyMode,
							dispatchConfig.repeat.onCustomRowAction,
							[
								ROW_DOCUMENT_PATH,
								createRepeatModelPath(FORM_MODEL.nestedL6RowActions),
								"hidden-in-ro-mode"
							] as const
						);
					});
				});

				describe("with scope === 'HIDDEN_IN_EDIT_MODE'", () => {
					it("is not possible because the button is invisible", async () => {
						await rowActionNotAvailableInActionColumn(
							await render(),
							IDS.ROW_ACTIONS.BUTTONS.eventHiddenInEditMode
						);
					});
				});

				describe("with scope === 'DISABLED_IN_EDIT_MODE'", () => {
					it("is not possible because the button is disabled", async () => {
						await rowActionDisabledInActionColumn(
							await render(),
							IDS.ROW_ACTIONS.BUTTONS.eventDisabledInEditMode
						);
					});
				});

				describe("with scope === 'DISABLED_IN_READONLY_MODE'", () => {
					it("triggers a call to dispatchConfiguration.repeat.onCustomRowAction with the respective parameters", async () => {
						await findClickAndAssert(
							await render(),
							IDS.ROW_ACTIONS.BUTTONS.eventDisabledInReadonlyMode,
							dispatchConfig.repeat.onCustomRowAction,
							[
								ROW_DOCUMENT_PATH,
								createRepeatModelPath(FORM_MODEL.nestedL6RowActions),
								"disabled-in-ro-mode"
							] as const
						);
					});
				});
			});

			describe("in the context menu", () => {
				describe("with confirmation that is confirmed", () => {
					it("triggers a call to dispatchConfiguration.repeat.onCustomRowAction with the respective parameters", async () => {
						await findClickConfirmAndAssertInContextMenu(
							await render(),
							IDS.INLINE_REPEAT.ALL_FALSE.firstCell + "-0",
							IDS.ROW_ACTIONS.LIST_ITEMS.eventAlwaysShownAndEnabledWithConfirmation,
							dispatchConfig.repeat.onCustomRowAction,
							[
								ROW_DOCUMENT_PATH,
								createRepeatModelPath("DR_allFalse"),
								"always-shown-and-enabled"
							] as const
						);
					});
				});

				describe("with confirmation that is not confirmed", () => {
					it("does not trigger a call to dispatchConfiguration.repeat.onCustomRowAction", async () => {
						await findClickCancelAndAssertInContextMenu(
							await render(),
							IDS.INLINE_REPEAT.ALL_FALSE.firstCell + "-0",
							IDS.ROW_ACTIONS.LIST_ITEMS.eventAlwaysShownAndEnabledWithConfirmation,
							dispatchConfig.repeat.onCustomRowAction
						);
					});
				});

				describe("with scope === 'ALWAYS'", () => {
					it("triggers a call to dispatchConfiguration.repeat.onCustomRowAction with the respective parameters", async () => {
						await findClickAndAssertInContextMenu(
							await render(),
							IDS.INLINE_REPEAT.CUSTOM_ROW_ACTIONS.firstCell + "-0",
							IDS.ROW_ACTIONS.LIST_ITEMS.eventAlwaysShownAndEnabled,
							dispatchConfig.repeat.onCustomRowAction,
							[
								ROW_DOCUMENT_PATH,
								createRepeatModelPath(FORM_MODEL.nestedL6RowActions),
								"always-shown-and-enabled"
							] as const
						);
					});
				});

				describe("with scope === 'HIDDEN_IN_READONLY_MODE'", () => {
					it("triggers a call to dispatchConfiguration.repeat.onCustomRowAction with the respective parameters", async () => {
						await findClickAndAssertInContextMenu(
							await render(),
							IDS.INLINE_REPEAT.CUSTOM_ROW_ACTIONS.firstCell + "-0",
							IDS.ROW_ACTIONS.LIST_ITEMS.eventHiddenInReadonlyMode,
							dispatchConfig.repeat.onCustomRowAction,
							[
								ROW_DOCUMENT_PATH,
								createRepeatModelPath(FORM_MODEL.nestedL6RowActions),
								"hidden-in-ro-mode"
							] as const
						);
					});
				});

				describe("with scope === 'HIDDEN_IN_EDIT_MODE'", () => {
					it("is not possible because the button is invisible", async () => {
						const wrapper = await render();
						await openRowActionContextMenu(
							wrapper,
							IDS.INLINE_REPEAT.CUSTOM_ROW_ACTIONS.firstCell + "-0"
						);
						await rowActionNotAvailableInContextMenu(
							wrapper,
							IDS.ROW_ACTIONS.LIST_ITEMS.eventHiddenInEditMode
						);
					});
				});

				describe("with scope === 'DISABLED_IN_EDIT_MODE'", () => {
					it("is not possible because the button is disabled", async () => {
						const wrapper = await render();
						await openRowActionContextMenu(
							wrapper,
							IDS.INLINE_REPEAT.CUSTOM_ROW_ACTIONS.firstCell + "-0"
						);
						await rowActionDisabledInContextMenu(
							wrapper,
							IDS.ROW_ACTIONS.LIST_ITEMS.eventDisabledInEditMode
						);
					});
				});

				describe("with scope === 'DISABLED_IN_READONLY_MODE'", () => {
					it("triggers a call to dispatchConfiguration.repeat.onCustomRowAction with the respective parameters", async () => {
						await findClickAndAssertInContextMenu(
							await render(),
							IDS.INLINE_REPEAT.CUSTOM_ROW_ACTIONS.firstCell + "-0",
							IDS.ROW_ACTIONS.LIST_ITEMS.eventDisabledInReadonlyMode,
							dispatchConfig.repeat.onCustomRowAction,
							[
								ROW_DOCUMENT_PATH,
								createRepeatModelPath(FORM_MODEL.nestedL6RowActions),
								"disabled-in-ro-mode"
							] as const
						);
					});
				});
			});
		});
	});
}
