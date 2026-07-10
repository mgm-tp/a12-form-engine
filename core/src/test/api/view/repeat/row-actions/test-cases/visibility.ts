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

import { doesNotThrow, equal } from "node:assert/strict";

import { act } from "react";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import { within } from "@com.mgmtp.a12.devtools/react";

import type { EngineStore } from "../../../../../../back-end/store/index.js";
import type { Models } from "../../../../../../back-end/store/internal/store.js";
import type { ReadonlyObjectMap } from "../../../../../../models/index.js";
import type { EnablementByRow } from "../../../../../../view/internal/configuration/engine-configuration.js";
import type { RtlRenderWrapper } from "../../../../../rtl-utils/render-wrapper.js";
import { createModelPath } from "../../../../../utils/createModelPath.js";
import {
	loadData,
	setupContentBoxRendererWithRtlAsync,
	setupFormEngineRendererWithRtlAsync
} from "../../../../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../../../../utils/setupFixture.js";
import { VISIBILITY } from "../../../../../utils/test-model-helpers/repeat.row-actions.js";
import {
	DR_ROW_ACTIONS,
	ER_EXPANDED_ROW,
	FORM_MODEL
} from "../../../../../utils/test-model-helpers/test-button-enablements.js";

import {
	createEnablementMap,
	createRowActionIds,
	setupForDetachedRepeat,
	setupForEmbeddedRepeat
} from "../row-action-enablement-utils.js";
import {
	assertModelSetupCorrect,
	findAndAssertExpandedRowFooterButtonProps,
	openRowActionContextMenu,
	rowActionAvailableInActionColumn,
	rowActionAvailableInContextMenu,
	rowActionNotAvailableInActionColumn,
	rowActionNotAvailableInContextMenu
} from "../row-action-utils.js";

export function executeTestForVisibility(): void {
	const models = setupModelsFixture("test.custom-button-enablements");
	const rowActionButtonModels = setupModelsFixture("repeat.row-actions");

	const fixture = setupFixture(() => {
		const document = loadData("test.custom-button-enablements", "data", models.documentModel);
		const rowActionDocument = loadData("repeat.row-actions", "data", models.documentModel);
		return { document, rowActionDocument };
	});

	function setupEmbeddedRepeatTest(params: {
		readonly: boolean;
		expandedRowIndex: number;
		enablementMap: EnablementByRow;
	}): Promise<RtlRenderWrapper> {
		const repeatInstanceState: ReadonlyObjectMap<EngineStore.Repeat.InstanceState> = {
			[ModelPath.toString(FORM_MODEL.embeddedRepeatPath)]: {
				expandedRowPath: [
					{ elementName: "root", index: 1 },
					{ elementName: "repeatGroupEmbeddedRepeat", index: params.expandedRowIndex }
				]
			}
		};
		const screenLocation: EngineStore.ScreenState[] = [
			{
				locationPath: createModelPath("rowActionButtons"),
				path: [],
				repeatInstanceState
			}
		];

		return setupForEmbeddedRepeat({
			models,
			document: fixture.document,
			readonly: params.readonly,
			enablementMap: params.enablementMap,
			screenLocation
		});
	}

	describe("without enablement map", () => {
		describe("if the form is readonly", () => {
			const fixtureWrapper = {
				wrapper: () => setupTest({ readonly: true })
			};

			describe("renders in each row", () => {
				const cells = [
					{
						cellId: VISIBILITY.NOT_RO.COLUMNS.ID,
						buttons: {
							view: {
								repeatId: VISIBILITY.NOT_RO.REPEAT_ID,
								buttonId: VISIBILITY.NOT_RO.BUTTONS.ID_VIEW,
								listItemId: VISIBILITY.NOT_RO.LIST_ITEMS.ID_VIEW
							},
							customAlwaysShownAndEnabled: {
								repeatId: VISIBILITY.NOT_RO.REPEAT_ID,
								buttonId: VISIBILITY.NOT_RO.BUTTONS.ID_ALWAYS_SHOWN_AND_ENABLED,
								listItemId: VISIBILITY.NOT_RO.LIST_ITEMS.ID_ALWAYS_SHOWN_AND_ENABLED
							},
							customHiddenInEditMode: {
								repeatId: VISIBILITY.NOT_RO.REPEAT_ID,
								buttonId: VISIBILITY.NOT_RO.BUTTONS.ID_HIDDEN_IN_EDIT_MODE,
								listItemId: VISIBILITY.NOT_RO.LIST_ITEMS.ID_HIDDEN_IN_EDIT_MODE
							},
							customDisabledInEditMode: {
								repeatId: VISIBILITY.NOT_RO.REPEAT_ID,
								buttonId: VISIBILITY.NOT_RO.BUTTONS.ID_DISABLED_IN_EDIT_MODE,
								listItemId: VISIBILITY.NOT_RO.LIST_ITEMS.ID_DISABLED_IN_EDIT_MODE
							},
							customDisabledInRoMode: {
								repeatId: VISIBILITY.NOT_RO.REPEAT_ID,
								buttonId: VISIBILITY.NOT_RO.BUTTONS.ID_DISABLED_IN_RO_MODE,
								listItemId: VISIBILITY.NOT_RO.LIST_ITEMS.ID_DISABLED_IN_RO_MODE
							}
						}
					},
					{
						cellId: VISIBILITY.NOT_RO.COLUMNS.ID_DOWNLOAD,
						buttons: {
							download: {
								repeatId: VISIBILITY.NOT_RO.REPEAT_ATTACHMENT_COLLECTION_ID,
								buttonId: VISIBILITY.NOT_RO.BUTTONS.ID_DOWNLOAD,
								listItemId: VISIBILITY.NOT_RO.LIST_ITEMS.ID_DOWNLOAD
							}
						}
					}
				];
				describe(`buttons`, () => {
					for (const cell of cells) {
						it("in the action column", async () => {
							const wrapper = await fixtureWrapper.wrapper();
							for (const b of Object.entries(cell.buttons)) {
								rowActionAvailableInActionColumn(wrapper, b[1].buttonId + "-1");
								rowActionAvailableInActionColumn(wrapper, b[1].buttonId + "-2");
							}
						});
					}

					for (const cell of cells) {
						it("in the context menu, when the row is right-clicked in row 1", async () => {
							const wrapper = await act(() => fixtureWrapper.wrapper());
							await openRowActionContextMenu(wrapper, cell.cellId + "-bodycell-0");
							for (const b of Object.entries(cell.buttons)) {
								rowActionAvailableInContextMenu(wrapper, b[1].listItemId + "-1");
							}
						});
					}

					for (const cell of cells) {
						it("in the context menu, when the row is right-clicked in row 2", async () => {
							const wrapper = await act(() => fixtureWrapper.wrapper());
							await openRowActionContextMenu(wrapper, cell.cellId + "-bodycell-1");
							for (const b of Object.entries(cell.buttons)) {
								rowActionAvailableInContextMenu(wrapper, b[1].listItemId + "-2");
							}
						});
					}
				});
			});

			describe("does not render in each row", () => {
				const cellId = VISIBILITY.NOT_RO.COLUMNS.ID;
				const buttons = {
					edit: {
						repeatId: VISIBILITY.NOT_RO.REPEAT_ID,
						buttonId: VISIBILITY.NOT_RO.BUTTONS.ID_EDIT,
						listItemId: VISIBILITY.NOT_RO.LIST_ITEMS.ID_EDIT
					},
					clone: {
						repeatId: VISIBILITY.NOT_RO.REPEAT_ID,
						buttonId: VISIBILITY.NOT_RO.BUTTONS.ID_CLONE,
						listItemId: VISIBILITY.NOT_RO.LIST_ITEMS.ID_CLONE
					},
					delete: {
						repeatId: VISIBILITY.NOT_RO.REPEAT_ID,
						buttonId: VISIBILITY.NOT_RO.BUTTONS.ID_DELETE,
						listItemId: VISIBILITY.NOT_RO.LIST_ITEMS.ID_DELETE
					},
					customHiddenInRoMode: {
						repeatId: VISIBILITY.NOT_RO.REPEAT_ID,
						buttonId: VISIBILITY.NOT_RO.BUTTONS.ID_HIDDEN_IN_RO_MODE,
						listItemId: VISIBILITY.NOT_RO.LIST_ITEMS.ID_HIDDEN_IN_RO_MODE
					},
					moveDown: {
						repeatId: VISIBILITY.NOT_RO.REPEAT_ID,
						buttonId: VISIBILITY.NOT_RO.BUTTONS.ID_MOVE_DOWN,
						listItemId: VISIBILITY.NOT_RO.LIST_ITEMS.ID_MOVE_DOWN
					},
					moveUp: {
						repeatId: VISIBILITY.NOT_RO.REPEAT_ID,
						buttonId: VISIBILITY.NOT_RO.BUTTONS.ID_MOVE_UP,
						listItemId: VISIBILITY.NOT_RO.LIST_ITEMS.ID_MOVE_UP
					}
				};
				describe(`buttons`, () => {
					it("in the action column", async () => {
						const wrapper = await fixtureWrapper.wrapper();
						for (const b of Object.entries(buttons)) {
							rowActionNotAvailableInActionColumn(wrapper, b[1].buttonId + "-1");
							rowActionNotAvailableInActionColumn(wrapper, b[1].buttonId + "-2");
						}
					});

					it("in the context menu, when the row is right-clicked col 1", async () => {
						const wrapper = await act(() => fixtureWrapper.wrapper());
						await openRowActionContextMenu(wrapper, cellId + "-bodycell-0");
						for (const b of Object.entries(buttons)) {
							rowActionNotAvailableInContextMenu(wrapper, b[1].listItemId + "-1");
						}
					});

					it("in the context menu, when the row is right-clicked col 2", async () => {
						const wrapper = await act(() => fixtureWrapper.wrapper());
						await openRowActionContextMenu(wrapper, cellId + "-bodycell-1");
						for (const b of Object.entries(buttons)) {
							rowActionNotAvailableInContextMenu(wrapper, b[1].listItemId + "-2");
						}
					});
				});
			});

			describe("and the detached repeat detail screen is opened", () => {
				const detachedRepeat = {
					wrapper: () =>
						setupTest({
							screenLocation: {
								locationPath: VISIBILITY.NOT_RO.DR_LOCATION_PATH,
								path: VISIBILITY.NOT_RO.DR_PATH
							},
							contentBoxRenderer: true,
							readonly: true
						})
				};

				it("does render the return button", async () => {
					rowActionAvailableInActionColumn(
						await detachedRepeat.wrapper(),
						VISIBILITY.NOT_RO.BUTTONS.ID_RETURN
					);
				});

				it("does not render the commit button", async () => {
					rowActionNotAvailableInActionColumn(
						await detachedRepeat.wrapper(),
						VISIBILITY.NOT_RO.BUTTONS.ID_COMMIT
					);
				});
			});
		});

		describe("if the form is not readonly", () => {
			const fixtureWrapper = {
				wrapper: () => setupTest({})
			};

			describe("Standard Row Actions", () => {
				describe("and the enablement for the row action buttons are set to true in the model", () => {
					before(() => {
						assertModelSetupCorrect(
							rowActionButtonModels.formModel,
							VISIBILITY.NOT_RO.REPEAT_PATH,
							true
						);
					});
					describe("renders in each row", () => {
						const cells = [
							{
								cellId: VISIBILITY.NOT_RO.COLUMNS.ID,
								buttons: {
									edit: {
										repeatId: VISIBILITY.NOT_RO.REPEAT_ID,
										buttonId: VISIBILITY.NOT_RO.BUTTONS.ID_EDIT,
										listItemId: VISIBILITY.NOT_RO.LIST_ITEMS.ID_EDIT
									},
									clone: {
										repeatId: VISIBILITY.NOT_RO.REPEAT_ID,
										buttonId: VISIBILITY.NOT_RO.BUTTONS.ID_CLONE,
										listItemId: VISIBILITY.NOT_RO.LIST_ITEMS.ID_CLONE
									},
									delete: {
										repeatId: VISIBILITY.NOT_RO.REPEAT_ID,
										buttonId: VISIBILITY.NOT_RO.BUTTONS.ID_DELETE,
										listItemId: VISIBILITY.NOT_RO.LIST_ITEMS.ID_DELETE
									},
									moveDown: {
										repeatId: VISIBILITY.NOT_RO.REPEAT_ID,
										buttonId: VISIBILITY.NOT_RO.BUTTONS.ID_MOVE_DOWN,
										listItemId: VISIBILITY.NOT_RO.LIST_ITEMS.ID_MOVE_DOWN
									},
									moveUp: {
										repeatId: VISIBILITY.NOT_RO.REPEAT_ID,
										buttonId: VISIBILITY.NOT_RO.BUTTONS.ID_MOVE_UP,
										listItemId: VISIBILITY.NOT_RO.LIST_ITEMS.ID_MOVE_UP
									}
								}
							},
							{
								cellId: VISIBILITY.NOT_RO.COLUMNS.ID_DOWNLOAD,
								buttons: {
									download: {
										repeatId: VISIBILITY.NOT_RO.REPEAT_ATTACHMENT_COLLECTION_ID,
										buttonId: VISIBILITY.NOT_RO.BUTTONS.ID_DOWNLOAD,
										listItemId: VISIBILITY.NOT_RO.LIST_ITEMS.ID_DOWNLOAD
									}
								}
							}
						];
						describe(`buttons`, () => {
							for (const cell of cells) {
								it("in the action column", async () => {
									const wrapper = await fixtureWrapper.wrapper();
									for (const b of Object.entries(cell.buttons)) {
										rowActionAvailableInActionColumn(wrapper, b[1].buttonId + "-1");
										rowActionAvailableInActionColumn(wrapper, b[1].buttonId + "-2");
									}
								});
							}

							for (const cell of cells) {
								it("in the context menu, when the row is right-clicked row 1", async () => {
									const wrapper = await act(() => fixtureWrapper.wrapper());
									await openRowActionContextMenu(wrapper, cell.cellId + "-bodycell-0");
									for (const b of Object.entries(cell.buttons)) {
										rowActionAvailableInContextMenu(wrapper, b[1].listItemId + "-1");
									}
								});
							}

							for (const cell of cells) {
								it("in the context menu, when the row is right-clicked row 2", async () => {
									const wrapper = await act(() => fixtureWrapper.wrapper());
									await openRowActionContextMenu(wrapper, cell.cellId + "-bodycell-1");
									for (const b of Object.entries(cell.buttons)) {
										rowActionAvailableInContextMenu(wrapper, b[1].listItemId + "-2");
									}
								});
							}
						});
					});
				});

				describe("and the enablement for the row action buttons are set to false in the model", () => {
					before(() => {
						assertModelSetupCorrect(
							rowActionButtonModels.formModel,
							VISIBILITY.ALL_ROW_ACTIONS_DISABLED.REPEAT_PATH,
							false
						);
					});
					describe("does not render in each row", () => {
						const cells = [
							{
								cellId: VISIBILITY.ALL_ROW_ACTIONS_DISABLED.COLUMNS.ID,
								buttons: {
									clone: {
										repeatId: VISIBILITY.ALL_ROW_ACTIONS_DISABLED.REPEAT_ID,
										buttonId: VISIBILITY.ALL_ROW_ACTIONS_DISABLED.BUTTONS.ID_CLONE,
										listItemId: VISIBILITY.ALL_ROW_ACTIONS_DISABLED.LIST_ITEMS.ID_CLONE
									},
									delete: {
										repeatId: VISIBILITY.ALL_ROW_ACTIONS_DISABLED.REPEAT_ID,
										buttonId: VISIBILITY.ALL_ROW_ACTIONS_DISABLED.BUTTONS.ID_DELETE,
										listItemId: VISIBILITY.ALL_ROW_ACTIONS_DISABLED.LIST_ITEMS.ID_DELETE
									},
									moveDown: {
										repeatId: VISIBILITY.ALL_ROW_ACTIONS_DISABLED.REPEAT_ID,
										buttonId: VISIBILITY.ALL_ROW_ACTIONS_DISABLED.BUTTONS.ID_MOVE_DOWN,
										listItemId: VISIBILITY.ALL_ROW_ACTIONS_DISABLED.LIST_ITEMS.ID_MOVE_DOWN
									},
									moveUp: {
										repeatId: VISIBILITY.ALL_ROW_ACTIONS_DISABLED.REPEAT_ID,
										buttonId: VISIBILITY.ALL_ROW_ACTIONS_DISABLED.BUTTONS.ID_MOVE_UP,
										listItemId: VISIBILITY.ALL_ROW_ACTIONS_DISABLED.LIST_ITEMS.ID_MOVE_UP
									}
								}
							},
							{
								cellId: VISIBILITY.ALL_ROW_ACTIONS_DISABLED.COLUMNS.ID_DOWNLOAD,
								buttons: {
									download: {
										repeatId: VISIBILITY.ALL_ROW_ACTIONS_DISABLED.REPEAT_ATTACHMENT_COLLECTION_ID,
										buttonId: VISIBILITY.ALL_ROW_ACTIONS_DISABLED.BUTTONS.ID_DOWNLOAD,
										listItemId: VISIBILITY.ALL_ROW_ACTIONS_DISABLED.LIST_ITEMS.ID_DOWNLOAD
									}
								}
							}
						];

						for (const cell of cells) {
							it("in the action column", async () => {
								const wrapper = await fixtureWrapper.wrapper();
								for (const b of Object.entries(cell.buttons)) {
									rowActionNotAvailableInActionColumn(wrapper, b[1].buttonId + "-1");
									rowActionNotAvailableInActionColumn(wrapper, b[1].buttonId + "-2");
								}
							});
						}

						for (const cell of cells) {
							it("in the context menu, when the row is right-clicked in row 1", async () => {
								const wrapper = await act(() => fixtureWrapper.wrapper());
								await openRowActionContextMenu(wrapper, cell.cellId + "-bodycell-0");
								for (const b of Object.entries(cell.buttons)) {
									rowActionNotAvailableInContextMenu(wrapper, b[1].listItemId + "-1");
								}
							});
						}

						for (const cell of cells) {
							it("in the context menu, when the row is right-clicked in row 2", async () => {
								const wrapper = await act(() => fixtureWrapper.wrapper());
								await openRowActionContextMenu(wrapper, cell.cellId + "-bodycell-1");
								for (const b of Object.entries(cell.buttons)) {
									rowActionNotAvailableInContextMenu(wrapper, b[1].listItemId + "-2");
								}
							});
						}
					});
				});

				describe("and the enablement for the row action buttons are set to undefined in the model", () => {
					before(() => {
						assertModelSetupCorrect(
							rowActionButtonModels.formModel,
							VISIBILITY.ALL_ROW_ACTIONS_UNDEFINED.REPEAT_PATH,
							undefined
						);
					});
					describe("does not render in each row", () => {
						const cells = [
							{
								cellId: VISIBILITY.ALL_ROW_ACTIONS_UNDEFINED.COLUMNS.ID,
								buttons: {
									clone: {
										repeatId: VISIBILITY.ALL_ROW_ACTIONS_UNDEFINED.REPEAT_ID,
										buttonId: VISIBILITY.ALL_ROW_ACTIONS_UNDEFINED.BUTTONS.ID_CLONE,
										listItemId: VISIBILITY.ALL_ROW_ACTIONS_UNDEFINED.LIST_ITEMS.ID_CLONE
									},
									delete: {
										repeatId: VISIBILITY.ALL_ROW_ACTIONS_UNDEFINED.REPEAT_ID,
										buttonId: VISIBILITY.ALL_ROW_ACTIONS_UNDEFINED.BUTTONS.ID_DELETE,
										listItemId: VISIBILITY.ALL_ROW_ACTIONS_UNDEFINED.LIST_ITEMS.ID_DELETE
									},
									moveDown: {
										repeatId: VISIBILITY.ALL_ROW_ACTIONS_UNDEFINED.REPEAT_ID,
										buttonId: VISIBILITY.ALL_ROW_ACTIONS_UNDEFINED.BUTTONS.ID_MOVE_DOWN,
										listItemId: VISIBILITY.ALL_ROW_ACTIONS_UNDEFINED.LIST_ITEMS.ID_MOVE_DOWN
									},
									moveUp: {
										repeatId: VISIBILITY.ALL_ROW_ACTIONS_UNDEFINED.REPEAT_ID,
										buttonId: VISIBILITY.ALL_ROW_ACTIONS_UNDEFINED.BUTTONS.ID_MOVE_UP,
										listItemId: VISIBILITY.ALL_ROW_ACTIONS_UNDEFINED.LIST_ITEMS.ID_MOVE_UP
									}
								}
							},
							{
								cellId: VISIBILITY.ALL_ROW_ACTIONS_UNDEFINED.COLUMNS.ID_DOWNLOAD,
								buttons: {
									download: {
										repeatId: VISIBILITY.ALL_ROW_ACTIONS_UNDEFINED.REPEAT_ATTACHMENT_COLLECTION_ID,
										buttonId: VISIBILITY.ALL_ROW_ACTIONS_UNDEFINED.BUTTONS.ID_DOWNLOAD,
										listItemId: VISIBILITY.ALL_ROW_ACTIONS_UNDEFINED.LIST_ITEMS.ID_DOWNLOAD
									}
								}
							}
						];

						for (const cell of cells) {
							it("in the action column", async () => {
								const wrapper = await fixtureWrapper.wrapper();
								for (const b of Object.entries(cell.buttons)) {
									rowActionNotAvailableInActionColumn(wrapper, b[1].buttonId + "-1");
									rowActionNotAvailableInActionColumn(wrapper, b[1].buttonId + "-2");
								}
							});
						}

						for (const cell of cells) {
							it("in the context menu, when the row is right-clicked in row 1", async () => {
								const wrapper = await act(() => fixtureWrapper.wrapper());
								await openRowActionContextMenu(wrapper, cell.cellId + "-bodycell-0");
								for (const b of Object.entries(cell.buttons)) {
									rowActionNotAvailableInContextMenu(wrapper, b[1].listItemId + "-1");
								}
							});
						}

						for (const cell of cells) {
							it("in the context menu, when the row is right-clicked in row 2", async () => {
								const wrapper = await act(() => fixtureWrapper.wrapper());
								await openRowActionContextMenu(wrapper, cell.cellId + "-bodycell-1");
								for (const b of Object.entries(cell.buttons)) {
									rowActionNotAvailableInContextMenu(wrapper, b[1].listItemId + "-2");
								}
							});
						}
					});
				});
			});

			describe("Custom Row Actions", () => {
				describe("renders in each row", () => {
					const cellId = VISIBILITY.NOT_RO.COLUMNS.ID;
					const buttons = {
						customAlwaysShownAndEnabled: {
							repeatId: VISIBILITY.NOT_RO.REPEAT_ID,
							buttonId: VISIBILITY.NOT_RO.BUTTONS.ID_ALWAYS_SHOWN_AND_ENABLED,
							listItemId: VISIBILITY.NOT_RO.LIST_ITEMS.ID_ALWAYS_SHOWN_AND_ENABLED
						},
						customHiddenInRoMode: {
							repeatId: VISIBILITY.NOT_RO.REPEAT_ID,
							buttonId: VISIBILITY.NOT_RO.BUTTONS.ID_HIDDEN_IN_RO_MODE,
							listItemId: VISIBILITY.NOT_RO.LIST_ITEMS.ID_HIDDEN_IN_RO_MODE
						},
						customDisabledInEditMode: {
							repeatId: VISIBILITY.NOT_RO.REPEAT_ID,
							buttonId: VISIBILITY.NOT_RO.BUTTONS.ID_DISABLED_IN_EDIT_MODE,
							listItemId: VISIBILITY.NOT_RO.LIST_ITEMS.ID_DISABLED_IN_EDIT_MODE
						},
						customDisabledInRoMode: {
							repeatId: VISIBILITY.NOT_RO.REPEAT_ID,
							buttonId: VISIBILITY.NOT_RO.BUTTONS.ID_DISABLED_IN_RO_MODE,
							listItemId: VISIBILITY.NOT_RO.LIST_ITEMS.ID_DISABLED_IN_RO_MODE
						}
					};
					describe(`buttons`, () => {
						it("in the action column", async () => {
							const wrapper = await fixtureWrapper.wrapper();
							for (const b of Object.entries(buttons)) {
								rowActionAvailableInActionColumn(wrapper, b[1].buttonId + "-1");
								rowActionAvailableInActionColumn(wrapper, b[1].buttonId + "-2");
							}
						});

						it("in the context menu, when the row is right-clicked col 1", async () => {
							const wrapper = await act(() => fixtureWrapper.wrapper());
							await openRowActionContextMenu(wrapper, cellId + "-bodycell-0");
							for (const b of Object.entries(buttons)) {
								rowActionAvailableInContextMenu(wrapper, b[1].listItemId + "-1");
							}
						});

						it("in the context menu, when the row is right-clicked col 2", async () => {
							const wrapper = await act(() => fixtureWrapper.wrapper());
							await openRowActionContextMenu(wrapper, cellId + "-bodycell-1");
							for (const b of Object.entries(buttons)) {
								rowActionAvailableInContextMenu(wrapper, b[1].listItemId + "-2");
							}
						});
					});
				});
			});

			describe("does not render any other row actions", () => {
				it("in the action column", async () => {
					const wrapper = await fixtureWrapper.wrapper();
					const bodyRow0 = within(wrapper.baseElement).getById(
						`${VISIBILITY.NOT_RO.REPEAT_ID}-bodyrow-0`
					);
					const buttons = within(bodyRow0).getAllByDataRole("button");
					equal(buttons.length, 9);
				});

				it("in the context menu, when the row is right-clicked", async () => {
					const wrapper = await act(() => fixtureWrapper.wrapper());
					await openRowActionContextMenu(wrapper, `${VISIBILITY.NOT_RO.COLUMNS.ID}-bodycell-0`);
					const contextMenu = within(wrapper.baseElement).getByDataRole("portal");
					const items = within(contextMenu).getAllByDataRole("list-item");
					equal(items.length, 9);
				});
			});

			describe("and the detached repeat detail screen is opened", () => {
				const detachedRepeat = {
					wrapper: () =>
						setupTest({
							screenLocation: {
								locationPath: VISIBILITY.NOT_RO.DR_LOCATION_PATH,
								path: VISIBILITY.NOT_RO.DR_PATH
							},
							contentBoxRenderer: true
						})
				};

				describe("and the option 'detachedRepeatCommitButtonEnablement' is not set", () => {
					it("does render the commit button", async () => {
						rowActionAvailableInActionColumn(
							await detachedRepeat.wrapper(),
							VISIBILITY.NOT_RO.BUTTONS.ID_COMMIT
						);
					});

					it("does render the cancel button", async () => {
						rowActionAvailableInActionColumn(
							await detachedRepeat.wrapper(),
							VISIBILITY.NOT_RO.BUTTONS.ID_CANCEL
						);
					});
				});

				describe("and the option 'detachedRepeatCommitButtonEnablement' is set to 'hidden'", () => {
					const adaptedModels: () => Models = () => ({
						...rowActionButtonModels,
						formModel: {
							...rowActionButtonModels.formModel,
							content: {
								...rowActionButtonModels.formModel.content,
								detachedRepeatCommitButtonEnablement: "HIDDEN"
							}
						}
					});

					describe("and the data on the screen did not change yet", () => {
						const fixture = {
							wrapper: () =>
								setupTest({
									models: adaptedModels(),
									screenLocation: {
										locationPath: VISIBILITY.NOT_RO.DR_LOCATION_PATH,
										path: VISIBILITY.NOT_RO.DR_PATH
									},
									contentBoxRenderer: true
								})
						};

						it("renders no commit button", async () => {
							rowActionNotAvailableInActionColumn(
								await fixture.wrapper(),
								VISIBILITY.NOT_RO.BUTTONS.ID_COMMIT
							);
						});

						it("renders a cancel button", async () => {
							rowActionAvailableInActionColumn(
								await fixture.wrapper(),
								VISIBILITY.NOT_RO.BUTTONS.ID_CANCEL
							);
						});
					});

					describe("and the data on the screen changed", () => {
						it("renders a commit button", async () => {
							const wrapper = await setupTest({
								models: adaptedModels(),
								screenLocation: {
									locationPath: VISIBILITY.NOT_RO.DR_LOCATION_PATH,
									path: VISIBILITY.NOT_RO.DR_PATH,
									dirty: true
								},
								contentBoxRenderer: true
							});
							rowActionAvailableInActionColumn(wrapper, VISIBILITY.NOT_RO.BUTTONS.ID_COMMIT);
						});
					});
				});
			});
		});

		describe("if the repeat is readonly by model", () => {
			const fixtureWrapper = {
				wrapper: () => setupTest({ readonly: false })
			};

			describe("renders in each row", () => {
				const cells = [
					{
						cellId: VISIBILITY.BY_MODEL.COLUMNS.ID,
						buttons: {
							view: {
								repeatId: VISIBILITY.BY_MODEL.REPEAT_ID,
								buttonId: VISIBILITY.BY_MODEL.BUTTONS.ID_VIEW,
								listItemId: VISIBILITY.BY_MODEL.LIST_ITEMS.ID_VIEW
							},
							customAlwaysShownAndEnabled: {
								repeatId: VISIBILITY.BY_MODEL.REPEAT_ID,
								buttonId: VISIBILITY.BY_MODEL.BUTTONS.ID_ALWAYS_SHOWN_AND_ENABLED,
								listItemId: VISIBILITY.BY_MODEL.LIST_ITEMS.ID_ALWAYS_SHOWN_AND_ENABLED
							},
							customHiddenInEditMode: {
								repeatId: VISIBILITY.BY_MODEL.REPEAT_ID,
								buttonId: VISIBILITY.BY_MODEL.BUTTONS.ID_HIDDEN_IN_EDIT_MODE,
								listItemId: VISIBILITY.BY_MODEL.LIST_ITEMS.ID_HIDDEN_IN_EDIT_MODE
							},
							customDisabledInEditMode: {
								repeatId: VISIBILITY.BY_MODEL.REPEAT_ID,
								buttonId: VISIBILITY.BY_MODEL.BUTTONS.ID_DISABLED_IN_EDIT_MODE,
								listItemId: VISIBILITY.BY_MODEL.LIST_ITEMS.ID_DISABLED_IN_EDIT_MODE
							},
							customDisabledInRoMode: {
								repeatId: VISIBILITY.BY_MODEL.REPEAT_ID,
								buttonId: VISIBILITY.BY_MODEL.BUTTONS.ID_DISABLED_IN_RO_MODE,
								listItemId: VISIBILITY.BY_MODEL.LIST_ITEMS.ID_DISABLED_IN_RO_MODE
							}
						}
					},
					{
						cellId: VISIBILITY.BY_MODEL.COLUMNS.ID_DOWNLOAD,
						buttons: {
							download: {
								repeatId: VISIBILITY.BY_MODEL.REPEAT_ATTACHMENT_COLLECTION_ID,
								buttonId: VISIBILITY.BY_MODEL.BUTTONS.ID_DOWNLOAD,
								listItemId: VISIBILITY.BY_MODEL.LIST_ITEMS.ID_DOWNLOAD
							}
						}
					}
				];

				describe(`buttons`, () => {
					for (const cell of cells) {
						it("in the action column", async () => {
							const wrapper = await fixtureWrapper.wrapper();
							for (const b of Object.entries(cell.buttons)) {
								rowActionAvailableInActionColumn(wrapper, b[1].buttonId + "-1");
								rowActionAvailableInActionColumn(wrapper, b[1].buttonId + "-2");
							}
						});
					}

					for (const cell of cells) {
						it("in the context menu, when the row is right-clicked in row 1", async () => {
							const wrapper = await act(() => fixtureWrapper.wrapper());
							await openRowActionContextMenu(wrapper, cell.cellId + "-bodycell-0");
							for (const b of Object.entries(cell.buttons)) {
								rowActionAvailableInContextMenu(wrapper, b[1].listItemId + "-1");
							}
						});
						it("in the context menu, when the row is right-clicked in row 2", async () => {
							const wrapper = await act(() => fixtureWrapper.wrapper());
							await openRowActionContextMenu(wrapper, cell.cellId + "-bodycell-1");
							for (const b of Object.entries(cell.buttons)) {
								rowActionAvailableInContextMenu(wrapper, b[1].listItemId + "-2");
							}
						});
					}
				});
			});

			describe("does not render any other row actions", () => {
				it("in the action column", async () => {
					const wrapper = await fixtureWrapper.wrapper();
					const bodyRow0 = within(wrapper.baseElement).getById(
						`${VISIBILITY.BY_MODEL.REPEAT_ID}-bodyrow-0`
					);
					const buttons = within(bodyRow0).getAllByDataRole("button");
					equal(buttons.length, 5);
				});

				it("in the context menu, when the row is right-clicked", async () => {
					const wrapper = await act(() => fixtureWrapper.wrapper());
					await openRowActionContextMenu(wrapper, `${VISIBILITY.BY_MODEL.COLUMNS.ID}-bodycell-0`);
					const contextMenu = within(wrapper.baseElement).getByDataRole("portal");
					const items = within(contextMenu).getAllByDataRole("list-item");
					equal(items.length, 5);
				});
			});

			describe("and the detached repeat detail screen is opened", () => {
				it("does render the return button", async () => {
					const wrapper = await setupTest({
						readonly: false,
						screenLocation: {
							locationPath: VISIBILITY.BY_MODEL.DR_LOCATION_PATH,
							path: VISIBILITY.BY_MODEL.DR_PATH
						},
						contentBoxRenderer: true
					});
					rowActionAvailableInActionColumn(wrapper, VISIBILITY.BY_MODEL.BUTTONS.ID_RETURN);
				});
			});
		});

		describe("if the repeat is readonly by dependency", () => {
			const fixtureWrapper = {
				wrapper: () =>
					setupTest({
						readonly: false,
						document: {
							Root: {
								...(fixture.rowActionDocument["Root"] as any),
								L0_Bool: true
							}
						}
					})
			};

			describe("renders in each row", () => {
				const cells = [
					{
						cellId: VISIBILITY.BY_DEP.COLUMNS.ID,
						buttons: {
							view: {
								repeatId: VISIBILITY.BY_DEP.REPEAT_ID,
								buttonId: VISIBILITY.BY_DEP.BUTTONS.ID_VIEW,
								listItemId: VISIBILITY.BY_DEP.LIST_ITEMS.ID_VIEW
							},
							customAlwaysShownAndEnabled: {
								repeatId: VISIBILITY.BY_DEP.REPEAT_ID,
								buttonId: VISIBILITY.BY_DEP.BUTTONS.ID_ALWAYS_SHOWN_AND_ENABLED,
								listItemId: VISIBILITY.BY_DEP.LIST_ITEMS.ID_ALWAYS_SHOWN_AND_ENABLED
							},
							customHiddenInEditMode: {
								repeatId: VISIBILITY.BY_DEP.REPEAT_ID,
								buttonId: VISIBILITY.BY_DEP.BUTTONS.ID_HIDDEN_IN_EDIT_MODE,
								listItemId: VISIBILITY.BY_DEP.LIST_ITEMS.ID_HIDDEN_IN_EDIT_MODE
							},
							customDisabledInEditMode: {
								repeatId: VISIBILITY.BY_DEP.REPEAT_ID,
								buttonId: VISIBILITY.BY_DEP.BUTTONS.ID_DISABLED_IN_EDIT_MODE,
								listItemId: VISIBILITY.BY_DEP.LIST_ITEMS.ID_DISABLED_IN_EDIT_MODE
							},
							customDisabledInRoMode: {
								repeatId: VISIBILITY.BY_DEP.REPEAT_ID,
								buttonId: VISIBILITY.BY_DEP.BUTTONS.ID_DISABLED_IN_RO_MODE,
								listItemId: VISIBILITY.BY_DEP.LIST_ITEMS.ID_DISABLED_IN_RO_MODE
							}
						}
					},
					{
						cellId: VISIBILITY.BY_DEP.COLUMNS.ID_DOWNLOAD,
						buttons: {
							download: {
								repeatId: VISIBILITY.BY_DEP.REPEAT_ATTACHMENT_COLLECTION_ID,
								buttonId: VISIBILITY.BY_DEP.BUTTONS.ID_DOWNLOAD,
								listItemId: VISIBILITY.BY_DEP.LIST_ITEMS.ID_DOWNLOAD
							}
						}
					}
				];

				for (const cell of cells) {
					describe(`buttons`, () => {
						it("in the action column", async () => {
							const wrapper = await fixtureWrapper.wrapper();
							for (const b of Object.entries(cell.buttons)) {
								rowActionAvailableInActionColumn(wrapper, b[1].buttonId + "-1");
								rowActionAvailableInActionColumn(wrapper, b[1].buttonId + "-2");
							}
						});

						it("in the context menu, when the row is right-clicked in row 1", async () => {
							const wrapper = await act(() => fixtureWrapper.wrapper());
							await openRowActionContextMenu(wrapper, cell.cellId + "-bodycell-0");
							for (const b of Object.entries(cell.buttons)) {
								rowActionAvailableInContextMenu(wrapper, b[1].listItemId + "-1");
							}
						});
						it("in the context menu, when the row is right-clicked in row 2", async () => {
							const wrapper = await act(() => fixtureWrapper.wrapper());
							await openRowActionContextMenu(wrapper, cell.cellId + "-bodycell-1");
							for (const b of Object.entries(cell.buttons)) {
								rowActionAvailableInContextMenu(wrapper, b[1].listItemId + "-2");
							}
						});
					});
				}
			});

			describe("does not render any other row actions", () => {
				it("in the action column", async () => {
					const wrapper = await fixtureWrapper.wrapper();
					const bodyRow0 = within(wrapper.baseElement).getById(VISIBILITY.BY_DEP.BODY_ROW);
					const buttons = within(bodyRow0).getAllByDataRole("button");
					equal(buttons.length, 5);
				});

				it("in the context menu, when the row is right-clicked", async () => {
					const wrapper = await act(() => fixtureWrapper.wrapper());
					await openRowActionContextMenu(wrapper, `${VISIBILITY.BY_DEP.COLUMNS.ID}-bodycell-0`);
					const contextMenu = within(wrapper.baseElement).getByDataRole("portal");
					const items = within(contextMenu).getAllByDataRole("list-item");
					equal(items.length, 5);
				});
			});

			it("and the detached repeat detail screen is opened", async () => {
				const wrapper = await setupTest({
					screenLocation: {
						locationPath: VISIBILITY.BY_DEP.DR_LOCATION_PATH,
						path: VISIBILITY.BY_DEP.DR_PATH
					},
					contentBoxRenderer: true,
					document: {
						Root: {
							...(fixture.rowActionDocument["Root"] as any),
							L0_Bool: true
						}
					}
				});

				doesNotThrow(
					() => rowActionAvailableInActionColumn(wrapper, VISIBILITY.BY_DEP.BUTTONS.ID_RETURN),
					"does render the return button"
				);

				doesNotThrow(
					() => rowActionNotAvailableInActionColumn(wrapper, VISIBILITY.BY_DEP.BUTTONS.ID_COMMIT),
					"does not render the commit button"
				);

				doesNotThrow(
					() => rowActionNotAvailableInActionColumn(wrapper, VISIBILITY.BY_DEP.BUTTONS.ID_CANCEL),
					"does not render the cancel button"
				);
			});
		});

		describe("if the repeat is not readonly by dependency", () => {
			const fixtureWrapper = {
				wrapper: () => setupTest({})
			};

			describe("renders in each row", () => {
				const cells = [
					{
						cellId: VISIBILITY.BY_DEP.COLUMNS.ID,
						buttons: {
							edit: {
								repeatId: VISIBILITY.BY_DEP.REPEAT_ID,
								buttonId: VISIBILITY.BY_DEP.BUTTONS.ID_EDIT,
								listItemId: VISIBILITY.BY_DEP.LIST_ITEMS.ID_EDIT
							},
							delete: {
								repeatId: VISIBILITY.BY_DEP.REPEAT_ID,
								buttonId: VISIBILITY.BY_DEP.BUTTONS.ID_DELETE,
								listItemId: VISIBILITY.BY_DEP.LIST_ITEMS.ID_DELETE
							},
							clone: {
								repeatId: VISIBILITY.BY_DEP.REPEAT_ID,
								buttonId: VISIBILITY.BY_DEP.BUTTONS.ID_CLONE,
								listItemId: VISIBILITY.BY_DEP.LIST_ITEMS.ID_CLONE
							},
							moveUp: {
								repeatId: VISIBILITY.BY_DEP.REPEAT_ID,
								buttonId: VISIBILITY.BY_DEP.BUTTONS.ID_MOVE_UP,
								listItemId: VISIBILITY.BY_DEP.LIST_ITEMS.ID_MOVE_UP
							},
							moveDown: {
								repeatId: VISIBILITY.BY_DEP.REPEAT_ID,
								buttonId: VISIBILITY.BY_DEP.BUTTONS.ID_MOVE_DOWN,
								listItemId: VISIBILITY.BY_DEP.LIST_ITEMS.ID_MOVE_DOWN
							},
							customHiddenInRoMode: {
								repeatId: VISIBILITY.BY_DEP.REPEAT_ID,
								buttonId: VISIBILITY.BY_DEP.BUTTONS.ID_HIDDEN_IN_RO_MODE,
								listItemId: VISIBILITY.BY_DEP.LIST_ITEMS.ID_HIDDEN_IN_RO_MODE
							},
							customDisabledInEditMode: {
								repeatId: VISIBILITY.BY_DEP.REPEAT_ID,
								buttonId: VISIBILITY.BY_DEP.BUTTONS.ID_DISABLED_IN_EDIT_MODE,
								listItemId: VISIBILITY.BY_DEP.LIST_ITEMS.ID_DISABLED_IN_EDIT_MODE
							},
							customDisabledInRoMode: {
								repeatId: VISIBILITY.BY_DEP.REPEAT_ID,
								buttonId: VISIBILITY.BY_DEP.BUTTONS.ID_DISABLED_IN_RO_MODE,
								listItemId: VISIBILITY.BY_DEP.LIST_ITEMS.ID_DISABLED_IN_RO_MODE
							}
						}
					},
					{
						cellId: VISIBILITY.BY_DEP.COLUMNS.ID_DOWNLOAD,
						buttons: {
							download: {
								repeatId: VISIBILITY.BY_DEP.REPEAT_ATTACHMENT_COLLECTION_ID,
								buttonId: VISIBILITY.BY_DEP.BUTTONS.ID_DOWNLOAD,
								listItemId: VISIBILITY.BY_DEP.LIST_ITEMS.ID_DOWNLOAD
							}
						}
					}
				];
				for (const cell of cells) {
					describe(`buttons`, () => {
						it("in the action column", async () => {
							const wrapper = await fixtureWrapper.wrapper();
							for (const b of Object.entries(cell.buttons)) {
								rowActionAvailableInActionColumn(wrapper, b[1].buttonId + "-1");
								rowActionAvailableInActionColumn(wrapper, b[1].buttonId + "-2");
							}
						});

						it("in the context menu, when the row is right-clicked in row 1", async () => {
							const wrapper = await act(() => fixtureWrapper.wrapper());
							await openRowActionContextMenu(wrapper, cell.cellId + "-bodycell-0");
							for (const b of Object.entries(cell.buttons)) {
								rowActionAvailableInContextMenu(wrapper, b[1].listItemId + "-1");
							}
						});
						it("in the context menu, when the row is right-clicked in row 2", async () => {
							const wrapper = await act(() => fixtureWrapper.wrapper());
							await openRowActionContextMenu(wrapper, cell.cellId + "-bodycell-1");
							for (const b of Object.entries(cell.buttons)) {
								rowActionAvailableInContextMenu(wrapper, b[1].listItemId + "-2");
							}
						});
					});
				}
			});

			describe("does not render any other button", () => {
				it("in the action column", async () => {
					const wrapper = await fixtureWrapper.wrapper();
					const bodyRow0 = within(wrapper.baseElement).getById(VISIBILITY.BY_DEP.BODY_ROW);
					const buttons = within(bodyRow0).getAllByDataRole("button");
					equal(buttons.length, 9);
				});

				it("in the context menu, when the row is right-clicked", async () => {
					const wrapper = await act(() => fixtureWrapper.wrapper());
					await openRowActionContextMenu(wrapper, `${VISIBILITY.BY_DEP.COLUMNS.ID}-bodycell-0`);
					const contextMenu = within(wrapper.baseElement).getByDataRole("portal");
					const items = within(contextMenu).getAllByDataRole("list-item");
					equal(items.length, 9);
				});
			});

			it("and the detached repeat detail screen is opened", async () => {
				const wrapper = await setupTest({
					screenLocation: {
						locationPath: VISIBILITY.BY_DEP.DR_LOCATION_PATH,
						path: VISIBILITY.BY_DEP.DR_PATH
					},
					contentBoxRenderer: true
				});

				doesNotThrow(
					() => rowActionNotAvailableInActionColumn(wrapper, VISIBILITY.BY_DEP.BUTTONS.ID_RETURN),
					"does not render the return button"
				);

				doesNotThrow(
					() => rowActionAvailableInActionColumn(wrapper, VISIBILITY.BY_DEP.BUTTONS.ID_COMMIT),
					"does render the commit button"
				);

				doesNotThrow(
					() => rowActionAvailableInActionColumn(wrapper, VISIBILITY.BY_DEP.BUTTONS.ID_CANCEL),
					"does render the cancel button"
				);
			});
		});
	});

	describe("with enablement map", () => {
		describe("if the form is readonly", () => {
			describe("and an entry with 'hidden=false' in the enablement map for a button in the first row exists", () => {
				const wrapperFixture = {
					wrapper: () =>
						setupTestForCustomization({
							readonly: true,
							enablementMap: createEnablementMap({ entry: { [1]: { hidden: false } } })
						})
				};

				describe("renders in the first row", () => {
					const cells = createRowActionIds({
						view: true,
						delete: true,
						copy: true,
						move: true,
						download: true,
						customAlwaysShownAndEnabled: true,
						customHiddenInEditMode: true,
						customHiddenInRoMode: true,
						customDisabledInEditMode: true,
						customDisabledInRoMode: true
					});
					for (const cell of cells) {
						describe(`buttons`, () => {
							it("in the action column", async () => {
								const wrapper = await wrapperFixture.wrapper();
								for (const b of cell.buttons) {
									rowActionAvailableInActionColumn(wrapper, b.button.buttonId + "-1");
								}
							});

							it("in the context menu, when the row is right-clicked", async () => {
								const wrapper = await act(() => wrapperFixture.wrapper());
								openRowActionContextMenu(wrapper, cell.cellId + "-bodycell-0");
								for (const b of cell.buttons) {
									rowActionAvailableInContextMenu(wrapper, b.button.listItemId + "-1");
								}
							});
						});
					}

					it("a disabled view button in the expanded embedded repeat row footer", async () => {
						const wrapper = await setupEmbeddedRepeatTest({
							readonly: true,
							expandedRowIndex: 1,
							enablementMap: createEnablementMap({ entry: { [1]: { hidden: false } } })
						});

						findAndAssertExpandedRowFooterButtonProps({
							wrapper,
							buttonId: ER_EXPANDED_ROW.BUTTONS.ID_VIEW + "-1",
							isDisabled: true,
							isExpected: true
						});
					});
				});

				describe("does not render", () => {
					// Instead of the edit button the view button is rendered
					const cells = createRowActionIds({
						edit: true
					});
					for (const cell of cells) {
						describe(`buttons`, () => {
							it("in the action column", async () => {
								const wrapper = await wrapperFixture.wrapper();
								for (const b of cell.buttons) {
									rowActionNotAvailableInActionColumn(wrapper, b.button.buttonId + "-1");
									rowActionNotAvailableInActionColumn(wrapper, b.button.buttonId + "-2");
								}
							});

							it("in the context menu, when the row is right-clicked 1", async () => {
								const wrapper = await act(() => wrapperFixture.wrapper());
								openRowActionContextMenu(wrapper, cell.cellId + "-bodycell-0");
								for (const b of cell.buttons) {
									rowActionNotAvailableInContextMenu(wrapper, b.button.listItemId + "-1");
								}
							});

							it("in the context menu, when the row is right-clicked 2", async () => {
								const wrapper = await act(() => wrapperFixture.wrapper());
								openRowActionContextMenu(wrapper, cell.cellId + "-bodycell-1");
								for (const b of cell.buttons) {
									rowActionNotAvailableInContextMenu(wrapper, b.button.listItemId + "-2");
								}
							});
						});
					}

					it("an edit button in the expanded embedded repeat row footer", async () => {
						const wrapper = await setupEmbeddedRepeatTest({
							readonly: true,
							expandedRowIndex: 1,
							enablementMap: createEnablementMap({ entry: { [1]: { hidden: false } } })
						});
						findAndAssertExpandedRowFooterButtonProps({
							wrapper,
							buttonId: ER_EXPANDED_ROW.BUTTONS.ID_EDIT + "-1",
							isExpected: false
						});
					});
				});
			});

			describe("and an entry with 'hidden=false' in the enablement map for a button for all rows exists", () => {
				const wrapperFixture = {
					wrapper: () =>
						setupTestForCustomization({
							readonly: true,
							enablementMap: createEnablementMap({ entry: { [0]: { hidden: false } } })
						})
				};

				describe("renders in all rows", () => {
					const cells = createRowActionIds({
						view: true,
						delete: true,
						copy: true,
						move: true,
						download: true,
						customAlwaysShownAndEnabled: true,
						customHiddenInEditMode: true,
						customHiddenInRoMode: true,
						customDisabledInEditMode: true,
						customDisabledInRoMode: true
					});

					for (const cell of cells) {
						describe(`buttons`, () => {
							it("in the action column", async () => {
								const wrapper = await wrapperFixture.wrapper();
								for (const b of cell.buttons) {
									rowActionAvailableInActionColumn(wrapper, b.button.buttonId + "-1");
									rowActionAvailableInActionColumn(wrapper, b.button.buttonId + "-2");
								}
							});

							it("in the context menu, when the row is right-clicked 1", async () => {
								const wrapper = await act(() => wrapperFixture.wrapper());
								openRowActionContextMenu(wrapper, cell.cellId + "-bodycell-0");
								for (const b of cell.buttons) {
									rowActionAvailableInActionColumn(wrapper, b.button.listItemId + "-1");
								}
							});

							it("in the context menu, when the row is right-clicked 2", async () => {
								const wrapper = await act(() => wrapperFixture.wrapper());
								openRowActionContextMenu(wrapper, cell.cellId + "-bodycell-1");
								for (const b of cell.buttons) {
									rowActionAvailableInActionColumn(wrapper, b.button.listItemId + "-2");
								}
							});
						});
					}

					[1, 2, 3].forEach(index => {
						it("a disabled view button in the expanded embedded repeat row footer", async () => {
							const wrapper = await setupEmbeddedRepeatTest({
								readonly: true,
								expandedRowIndex: index,
								enablementMap: createEnablementMap({ entry: { [0]: { hidden: false } } })
							});

							findAndAssertExpandedRowFooterButtonProps({
								wrapper,
								buttonId: ER_EXPANDED_ROW.BUTTONS.ID_VIEW + "-" + index,
								isExpected: true,
								isDisabled: true
							});
						});
					});
				});

				describe("does not render", () => {
					const cells = createRowActionIds({
						edit: true
					});
					for (const cell of cells) {
						describe(`buttons`, () => {
							it("in the action column", async () => {
								const wrapper = await wrapperFixture.wrapper();
								for (const b of cell.buttons) {
									rowActionNotAvailableInActionColumn(wrapper, b.button.buttonId + "-1");
									rowActionNotAvailableInActionColumn(wrapper, b.button.buttonId + "-2");
								}
							});

							it("in the context menu, when the row is right-clicked 1", async () => {
								const wrapper = await act(() => wrapperFixture.wrapper());
								openRowActionContextMenu(wrapper, cell.cellId + "-bodycell-0");
								for (const b of cell.buttons) {
									rowActionNotAvailableInContextMenu(wrapper, b.button.listItemId + "-1");
								}
							});

							it("in the context menu, when the row is right-clicked 2", async () => {
								const wrapper = await act(() => wrapperFixture.wrapper());
								openRowActionContextMenu(wrapper, cell.cellId + "-bodycell-1");
								for (const b of cell.buttons) {
									rowActionNotAvailableInContextMenu(wrapper, b.button.listItemId + "-2");
								}
							});
						});
					}

					[1, 2, 3].forEach(index => {
						it("a disabled edit button in the expanded embedded repeat row footer", async () => {
							const wrapper = await setupEmbeddedRepeatTest({
								readonly: true,
								expandedRowIndex: index,
								enablementMap: createEnablementMap({ entry: { [0]: { hidden: false } } })
							});

							findAndAssertExpandedRowFooterButtonProps({
								wrapper,
								buttonId: ER_EXPANDED_ROW.BUTTONS.ID_EDIT + "-" + index,
								isExpected: false
							});
						});
					});
				});

				describe("and an entry with 'hidden=true' in the enablement map for a button in the first row exits", () => {
					const enablementMap = () =>
						createEnablementMap({
							entry: { [0]: { hidden: false }, [1]: { hidden: true } }
						});
					const render = () =>
						act(() =>
							setupTestForCustomization({
								readonly: true,
								enablementMap: enablementMap()
							})
						);

					it("overrules the enablement given for all rows - row 1", async () => {
						const wrapper = await render();
						rowActionNotAvailableInActionColumn(wrapper, DR_ROW_ACTIONS.BUTTONS.ID_VIEW + "-1");

						await openRowActionContextMenu(wrapper, `${DR_ROW_ACTIONS.COLUMNS.ID}-bodycell-0`);
						rowActionNotAvailableInContextMenu(wrapper, DR_ROW_ACTIONS.BUTTONS.ID_VIEW + "-1");
					});

					it("overrules the enablement given for all rows - row 2", async () => {
						const wrapper = await render();

						rowActionAvailableInActionColumn(wrapper, DR_ROW_ACTIONS.BUTTONS.ID_VIEW + "-2");

						await openRowActionContextMenu(wrapper, `${DR_ROW_ACTIONS.COLUMNS.ID}-bodycell-1`);
						rowActionAvailableInContextMenu(wrapper, DR_ROW_ACTIONS.LIST_ITEMS.ID_VIEW + "-2");
					});

					it("overrules the enablement given for all rows (embedded repeat) row 1", async () => {
						// check ER expanded row footer
						const erWrapper = await setupEmbeddedRepeatTest({
							readonly: true,
							expandedRowIndex: 1,
							enablementMap: enablementMap()
						});

						findAndAssertExpandedRowFooterButtonProps({
							wrapper: erWrapper,
							buttonId: ER_EXPANDED_ROW.BUTTONS.ID_VIEW + "-1",
							isExpected: false
						});
					});

					[2, 3].forEach(index => {
						it(`overrules the enablement given for all rows (embedded repeat) row ${index}`, async () => {
							const wrapper = await setupEmbeddedRepeatTest({
								readonly: true,
								expandedRowIndex: index,
								enablementMap: enablementMap()
							});

							findAndAssertExpandedRowFooterButtonProps({
								wrapper,
								buttonId: ER_EXPANDED_ROW.BUTTONS.ID_VIEW + "-" + index,
								isExpected: true,
								isDisabled: true
							});
						});
					});
				});
			});

			describe("and an entry with 'hidden=true' in the enablement map exits for the first row", () => {
				const wrapperFixture = {
					wrapper: () =>
						setupTestForCustomization({
							readonly: true,
							enablementMap: createEnablementMap({ entry: { [1]: { hidden: true } } })
						})
				};

				describe("does not render in the first row", () => {
					const cells = createRowActionIds({
						view: true,
						download: true,
						customHiddenInEditMode: true,
						customDisabledInEditMode: true,
						customDisabledInRoMode: true
					});
					for (const cell of cells) {
						describe(`buttons`, () => {
							it("in the action column", async () => {
								const wrapper = await wrapperFixture.wrapper();
								for (const b of cell.buttons) {
									rowActionNotAvailableInActionColumn(wrapper, b.button.buttonId + "-1");
									rowActionAvailableInActionColumn(wrapper, b.button.buttonId + "-2");
								}
							});

							it("in the context menu, when the row is right-clicked 1", async () => {
								const wrapper = await act(() => wrapperFixture.wrapper());
								openRowActionContextMenu(wrapper, cell.cellId + "-bodycell-0");
								for (const b of cell.buttons) {
									rowActionNotAvailableInContextMenu(wrapper, b.button.listItemId + "-1");
								}
							});

							it("in the context menu, when the row is right-clicked 2", async () => {
								const wrapper = await act(() => wrapperFixture.wrapper());
								openRowActionContextMenu(wrapper, cell.cellId + "-bodycell-1");
								for (const b of cell.buttons) {
									rowActionAvailableInContextMenu(wrapper, b.button.listItemId + "-2");
								}
							});
						});
					}

					it("a disabled view button in the expanded embedded repeat row footer", async () => {
						const wrapper = await setupEmbeddedRepeatTest({
							readonly: true,
							expandedRowIndex: 1,
							enablementMap: createEnablementMap({ entry: { [1]: { hidden: true } } })
						});

						findAndAssertExpandedRowFooterButtonProps({
							wrapper,
							buttonId: ER_EXPANDED_ROW.BUTTONS.ID_VIEW + "-1",
							isExpected: false
						});
					});

					[2, 3].forEach(index => {
						it("a disabled view button in the expanded embedded repeat row footer", async () => {
							const wrapper = await setupEmbeddedRepeatTest({
								readonly: true,
								expandedRowIndex: index,
								enablementMap: createEnablementMap({ entry: { [1]: { hidden: true } } })
							});

							findAndAssertExpandedRowFooterButtonProps({
								wrapper,
								buttonId: ER_EXPANDED_ROW.BUTTONS.ID_VIEW + "-" + index,
								isExpected: true,
								isDisabled: true
							});
						});
					});
				});

				describe("detached repeat footer buttons", () => {
					it("does not render the return button", async () => {
						const wrapper = await setupForDetachedRepeat({
							models,
							document: fixture.document,
							readonly: true,
							enablementMap: createEnablementMap({ entry: { [2]: { hidden: true } } })
						});
						rowActionNotAvailableInActionColumn(wrapper, DR_ROW_ACTIONS.BUTTONS.ID_RETURN);
					});
				});
			});
		});

		describe("if the form is not readonly", () => {
			describe("and an entry with 'hidden=true' in the enablement map for a button for the first row exists", () => {
				const fixtureWrapper = {
					wrapper: () =>
						setupTestForCustomization({
							readonly: false,
							enablementMap: createEnablementMap({ entry: { [1]: { hidden: true } } })
						})
				};

				describe("does not render in the first row", () => {
					const cells = createRowActionIds({
						view: true,
						edit: true,
						delete: true,
						copy: true,
						move: true,
						download: true,
						customHiddenInEditMode: true,
						customHiddenInRoMode: true,
						customAlwaysShownAndEnabled: true,
						customDisabledInEditMode: true,
						customDisabledInRoMode: true
					});

					for (const cell of cells) {
						describe(`buttons`, () => {
							it("in the action column", async () => {
								const wrapper = await fixtureWrapper.wrapper();
								for (const b of cell.buttons) {
									rowActionNotAvailableInActionColumn(wrapper, b.button.buttonId + "-1");
								}
							});

							it("in the context menu, when the row is right-clicked", async () => {
								const wrapper = await act(() => fixtureWrapper.wrapper());
								await openRowActionContextMenu(wrapper, cell.cellId + "-bodycell-0");
								for (const b of cell.buttons) {
									rowActionNotAvailableInContextMenu(
										await fixtureWrapper.wrapper(),
										b.button.listItemId + "-1"
									);
								}
							});
						});
					}

					it("a disabled edit button in the expanded embedded repeat row footer", async () => {
						const wrapper = await setupEmbeddedRepeatTest({
							readonly: false,
							expandedRowIndex: 1,
							enablementMap: createEnablementMap({ entry: { [1]: { hidden: true } } })
						});

						findAndAssertExpandedRowFooterButtonProps({
							wrapper,
							buttonId: ER_EXPANDED_ROW.BUTTONS.ID_EDIT + "-1",
							isExpected: false
						});
					});
				});

				describe("renders in the second row", () => {
					const cells = createRowActionIds({
						edit: true,
						delete: true,
						copy: true,
						move: true,
						download: true,
						customHiddenInRoMode: true,
						customAlwaysShownAndEnabled: true,
						customDisabledInEditMode: true,
						customDisabledInRoMode: true
					});

					for (const cell of cells) {
						describe(`buttons`, () => {
							it("in the action column", async () => {
								const wrapper = await fixtureWrapper.wrapper();
								for (const b of cell.buttons) {
									rowActionAvailableInActionColumn(wrapper, b.button.buttonId + "-2");
								}
							});

							it("in the context menu, when the row is right-clicked", async () => {
								const wrapper = await act(() => fixtureWrapper.wrapper());
								await openRowActionContextMenu(wrapper, cell.cellId + "-bodycell-1");
								for (const b of cell.buttons) {
									rowActionAvailableInContextMenu(wrapper, b.button.listItemId + "-2");
								}
							});
						});
					}

					it("a disabled edit button in the expanded embedded repeat row footer", async () => {
						const wrapper = await setupEmbeddedRepeatTest({
							readonly: false,
							expandedRowIndex: 2,
							enablementMap: createEnablementMap({ entry: { [1]: { hidden: true } } })
						});

						findAndAssertExpandedRowFooterButtonProps({
							wrapper,
							buttonId: ER_EXPANDED_ROW.BUTTONS.ID_EDIT + "-2",
							isExpected: true,
							isDisabled: true
						});
					});
				});

				describe("detached repeat footer buttons", () => {
					it("and the option 'detachedRepeatCommitButtonEnablement' is not set", async () => {
						const detachedRepeat = {
							wrapper: await setupForDetachedRepeat({
								models,
								document: fixture.document,
								readonly: false,
								enablementMap: createEnablementMap({ entry: { [2]: { hidden: true } } })
							})
						};

						doesNotThrow(() => {
							rowActionNotAvailableInActionColumn(
								detachedRepeat.wrapper,
								DR_ROW_ACTIONS.BUTTONS.ID_RETURN
							);
						}, "does not render the return button");

						doesNotThrow(() => {
							rowActionNotAvailableInActionColumn(
								detachedRepeat.wrapper,
								DR_ROW_ACTIONS.BUTTONS.ID_COMMIT
							);
						}, "does not render the commit button");

						doesNotThrow(() => {
							rowActionNotAvailableInActionColumn(
								detachedRepeat.wrapper,
								DR_ROW_ACTIONS.BUTTONS.ID_CANCEL
							);
						}, "does not render the cancel button");
					});

					it("and the option 'detachedRepeatCommitButtonEnablement' is set to 'hidden' and the data changed", async () => {
						const detachedRepeat = {
							wrapper: await setupForDetachedRepeat({
								models: {
									...models,
									formModel: {
										...models.formModel,
										content: {
											...models.formModel.content,
											detachedRepeatCommitButtonEnablement: "HIDDEN"
										}
									}
								},
								document: fixture.document,
								readonly: false,
								enablementMap: createEnablementMap({ entry: { [2]: { hidden: true } } }),
								screenDirty: true
							})
						};

						doesNotThrow(() => {
							rowActionNotAvailableInActionColumn(
								detachedRepeat.wrapper,
								DR_ROW_ACTIONS.BUTTONS.ID_RETURN
							);
						}, "does not render the return button");

						doesNotThrow(() => {
							rowActionNotAvailableInActionColumn(
								detachedRepeat.wrapper,
								DR_ROW_ACTIONS.BUTTONS.ID_COMMIT
							);
						}, "does not render the commit button");

						doesNotThrow(() => {
							rowActionNotAvailableInActionColumn(
								detachedRepeat.wrapper,
								DR_ROW_ACTIONS.BUTTONS.ID_CANCEL
							);
						}, "does not render the cancel button");
					});
				});
			});

			describe("and an entry with 'hidden=true' in the enablement map for a button for all rows exits", () => {
				const fixtureWrapper = {
					wrapper: () =>
						setupTestForCustomization({
							readonly: false,
							enablementMap: createEnablementMap({ entry: { [0]: { hidden: true } } })
						})
				};

				describe("does not render", () => {
					const cells = createRowActionIds({
						edit: true,
						view: true,
						delete: true,
						copy: true,
						move: true,
						download: true,
						customHiddenInRoMode: true,
						customAlwaysShownAndEnabled: true,
						customHiddenInEditMode: true,
						customDisabledInEditMode: true,
						customDisabledInRoMode: true
					});

					for (const cell of cells) {
						describe(`buttons`, () => {
							it("in the action column", async () => {
								const wrapper = await fixtureWrapper.wrapper();
								for (const b of cell.buttons) {
									rowActionNotAvailableInActionColumn(wrapper, b.button.buttonId + "-1");
									rowActionNotAvailableInActionColumn(wrapper, b.button.buttonId + "-2");
								}
							});

							it("in the context menu, when the row is right-clicked", async () => {
								const wrapper = await act(() => fixtureWrapper.wrapper());
								await openRowActionContextMenu(wrapper, cell.cellId + "-bodycell-0");
								for (const b of cell.buttons) {
									rowActionNotAvailableInContextMenu(
										await fixtureWrapper.wrapper(),
										b.button.listItemId + "-1"
									);
								}
							});
							it("in the context menu, when the row is right-clicked", async () => {
								const wrapper = await act(() => fixtureWrapper.wrapper());
								await openRowActionContextMenu(wrapper, cell.cellId + "-bodycell-1");
								for (const b of cell.buttons) {
									rowActionNotAvailableInContextMenu(
										await fixtureWrapper.wrapper(),
										b.button.listItemId + "-2"
									);
								}
							});
						});

						[1, 2, 3].forEach(index => {
							it("a disabled edit button in the expanded embedded repeat row footer", async () => {
								const wrapper = await setupEmbeddedRepeatTest({
									readonly: false,
									expandedRowIndex: index,
									enablementMap: createEnablementMap({ entry: { [0]: { hidden: true } } })
								});

								findAndAssertExpandedRowFooterButtonProps({
									wrapper,
									buttonId: ER_EXPANDED_ROW.BUTTONS.ID_EDIT + "-" + index,
									isExpected: false
								});
							});
						});
					}
				});
			});
		});
	});

	function setupTestForCustomization(options: {
		readonly: boolean;
		enablementMap?: EnablementByRow;
	}): Promise<RtlRenderWrapper> {
		const screenLocation: EngineStore.ScreenState[] = [
			{
				locationPath: createModelPath("rowActionButtons"),
				path: []
			}
		];

		return setupFormEngineRendererWithRtlAsync({
			models,
			data: { document: fixture.document },
			ui: {
				readonly: options.readonly,
				screenLocation
			},
			config: {
				enablements: { byRow: options.enablementMap }
			}
		});
	}

	function setupTest(options: {
		models?: Models;
		readonly?: boolean;
		screenLocation?: EngineStore.ScreenState;
		contentBoxRenderer?: boolean;
		document?: object;
	}): Promise<RtlRenderWrapper> {
		const screenLocation: EngineStore.ScreenState[] = [
			{
				locationPath: createModelPath("Enablement"),
				path: []
			}
		];

		if (options.screenLocation) {
			screenLocation.push(options.screenLocation);
		}

		const render = options.contentBoxRenderer
			? setupContentBoxRendererWithRtlAsync
			: setupFormEngineRendererWithRtlAsync;

		return render({
			models: options.models || rowActionButtonModels,
			data: { document: options.document || fixture.rowActionDocument },
			ui: {
				readonly: options.readonly,
				screenLocation
			}
		});
	}
}
