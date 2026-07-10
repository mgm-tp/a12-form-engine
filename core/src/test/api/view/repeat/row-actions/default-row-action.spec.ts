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

import { equal, strictEqual } from "node:assert/strict";
import type { Mock } from "node:test";

import { query } from "@com.mgmtp.a12.devtools/react";

import { UiId } from "../../../../../back-end/utils/internal/generateUiId.js";
import type { WidgetMap } from "../../../../../view/index.js";
import type { TableWidgetMap } from "../../../../../view/internal/components/form-engine/repeat/table-widget-map.js";
import { mouseEventMock } from "../../../../rtl-utils/mock-utils.js";
import type { RtlRenderWrapper } from "../../../../rtl-utils/render-wrapper.js";
import { findClickConfirm } from "../../../../utils/row-action-buttons.js";
import type { Context } from "../../../../utils/rtl-render-group.js";
import { RenderGroupFixture } from "../../../../utils/rtl-render-group.js";
import { setupFixture, setupModelsFixture } from "../../../../utils/setupFixture.js";
import { IDS } from "../../../../utils/test-model-helpers/repeat.row-actions.js";
import { createModelPath } from "../../../../utils/createModelPath.js";
import { loadData, setupFormEngineRendererWithRtlAsync } from "../../../../utils/setup.js";

import {
	stubbedDispatchConfig as dispatchConfig,
	resetStubbedDispatchConfig
} from "./row-action-utils.js";

describe("api.view.repeat", () => {
	afterEach(() => {
		resetStubbedDispatchConfig(dispatchConfig);
	});
	describe("Default Row Action", () => {
		const models = setupModelsFixture("repeat.row-actions");
		const fixture = setupFixture(() => ({
			document: loadData("repeat.row-actions", "data-repeat-options", models.documentModel)
		}));

		const SCREEN_MODEL_PATH = createModelPath("DefaultRowActionsScreen");

		function setupFormEngineRendererForTests(
			readonly: boolean,
			disabled: boolean,
			correctionMode: boolean
		): Promise<RtlRenderWrapper> {
			return setupFormEngineRendererWithRtlAsync({
				models,
				data: { document: fixture.document },
				ui: {
					readonly,
					disabled,
					screenLocation: [
						{
							locationPath: SCREEN_MODEL_PATH,
							path: []
						}
					],
					correctionModeBackup: correctionMode
						? {
								sections: {},
								location: []
							}
						: undefined
				},
				dispatchConfig
			});
		}

		function findBodyRow(tableMap: TableWidgetMap, repeatId: string) {
			const rowId = UiId.generateForRepeatTableBodyRow({ id: repeatId, rowIndex: 0 });
			return query(tableMap.TableTemplate.BodyRow).withId(rowId).props();
		}

		function findBodyRowClickAndAssert(
			tableMap: TableWidgetMap,
			repeatId: string,
			func: Mock<(...args: never[]) => unknown>,
			expectedCallCount = 1
		): void {
			const row = findBodyRow(tableMap, repeatId);

			row.onClick?.(mouseEventMock);

			strictEqual(
				func.mock.callCount(),
				expectedCallCount,
				`Dispatch function was called ${func.mock.callCount()} time(s). Expected call count: ${expectedCallCount}`
			);
		}

		function findButtonClickAndAssert(
			widgetMap: WidgetMap,
			buttonId: string,
			func?: Mock<(...args: never[]) => unknown>,
			notCallFunc?: Mock<(...args: never[]) => unknown>
		): void {
			const expectedCallCount = 1;
			const rowActionButton = query(widgetMap.Button).withId(buttonId).props();
			rowActionButton.onClick?.(mouseEventMock);

			if (func) {
				strictEqual(
					func.mock.callCount(),
					expectedCallCount,
					`Dispatch function was called ${func.mock.callCount()} time(s). Expected call count: ${expectedCallCount}`
				);
			}

			if (notCallFunc) {
				strictEqual(
					notCallFunc.mock.callCount(),
					0,
					`Dispatch function was called ${notCallFunc.mock.callCount()} time(s). Expected call count: ${0}`
				);
			}
		}

		async function findClickConfirmAndAssert(
			wrapper: RtlRenderWrapper,
			buttonId: string,
			func: Mock<(...args: never[]) => unknown>,
			notCallFunc: Mock<(...args: never[]) => unknown>
		): Promise<void> {
			await findClickConfirm(wrapper, buttonId);
			strictEqual(
				func.mock.callCount(),
				1,
				`Dispatch function was called ${func.mock.callCount()} time(s). Expected call count: ${1}`
			);

			strictEqual(
				notCallFunc.mock.callCount(),
				0,
				`Dispatch function was called ${notCallFunc.mock.callCount()} time(s). Expected call count: ${0}`
			);
		}

		function testNoActionOnRow(
			context: Context,
			repeatId: string,
			stubToWatch: Mock<(...args: never[]) => unknown>
		) {
			const { it, render } = context;

			it("doesn't render a row title", () => {
				const row = findBodyRow(render.wrapper.tableMap, repeatId);
				equal(row.title, undefined);
			});

			describe("and the row is clicked", () => {
				it("doesn't trigger any action", () => {
					findBodyRowClickAndAssert(
						render.wrapper.tableMap,
						IDS.DEFAULT_ROW_ACTIONS.repeatEdit,
						stubToWatch,
						0
					);
				});
			});
		}

		function testRowDisabled(context: Context, repeatId: string) {
			const { it, render } = context;

			it("doesn't render a row title", () => {
				const row = findBodyRow(render.wrapper.tableMap, repeatId);
				equal(row.title, undefined);
			});

			describe("and the row is clicked", () => {
				it("doesn't trigger any action because the row is disabled", () => {
					const row = findBodyRow(render.wrapper.tableMap, IDS.DEFAULT_ROW_ACTIONS.repeatEdit);
					equal(row.interactive, false);
				});
			});
		}

		// reuse the cleanup group (called multiple times)
		function testDefaultRowAction(options: {
			context: Context;
			expectedActionsAfterClick: {
				defaultViewAction: boolean;
				defaultEditAction: boolean;
				defaultDownloadAction: boolean;
				actionWithScopeUndefined: boolean;
				actionWithScopeEditHidden: boolean;
				actionWithScopeEditDisabled: boolean;
				actionWithScopeReadonlyHidden: boolean;
				actionWithScopeReadonlyDisabled: boolean;
			};
			disabled: boolean;
		}) {
			const { context } = options;
			const { it, render } = context;

			const describeTestInteractive = (rowId: string, expectedInteractive: boolean) => {
				it(`renders the row as ${
					expectedInteractive ? "an " : "a non-"
				}interactive element`, () => {
					const row = findBodyRow(render.wrapper.tableMap, rowId);
					equal(row.interactive, expectedInteractive);
				});
			};

			describe("and a repeat with default row action 'Edit/View' is given", () => {
				if (
					options.expectedActionsAfterClick.defaultViewAction ||
					options.expectedActionsAfterClick.defaultEditAction
				) {
					it("renders the row with the edit / view default button label as title", () => {
						const row = findBodyRow(render.wrapper.tableMap, IDS.DEFAULT_ROW_ACTIONS.repeatEdit);
						equal(
							row.title,
							options.expectedActionsAfterClick.defaultEditAction ? "edit the row" : "view the row"
						);
					});

					describe("and the row is clicked", () => {
						it("triggers enterRow", () => {
							findBodyRowClickAndAssert(
								render.wrapper.tableMap,
								IDS.DEFAULT_ROW_ACTIONS.repeatEdit,
								dispatchConfig.repeat.enterRow
							);
						});
					});
				} else if (options.disabled === true) {
					describe("and the row is clicked", () => {
						it("triggers no enterRow because the row is disabled", () => {
							const row = findBodyRow(render.wrapper.tableMap, IDS.DEFAULT_ROW_ACTIONS.repeatEdit);
							equal(row.interactive, false);
						});
					});
				} else {
					describe("and the row is clicked", () => {
						it("triggers no enterRow", () => {
							findBodyRowClickAndAssert(
								render.wrapper.tableMap,
								IDS.DEFAULT_ROW_ACTIONS.repeatEdit,
								dispatchConfig.repeat.enterRow,
								0
							);
						});
					});
				}

				describeTestInteractive(
					IDS.DEFAULT_ROW_ACTIONS.repeatEdit,
					options.expectedActionsAfterClick.defaultViewAction ||
						options.expectedActionsAfterClick.defaultEditAction
				);
			});

			describe("and a repeat with default row action 'Download' is given", () => {
				if (options.expectedActionsAfterClick.defaultDownloadAction) {
					it("renders the row with the download default button label as title", () => {
						const row = findBodyRow(
							render.wrapper.tableMap,
							IDS.DEFAULT_ROW_ACTIONS.repeatDownload
						);
						equal(row.title, "download file");
					});

					describe("and the row is clicked", () => {
						it("calls onAttachmentDownload", () => {
							findBodyRowClickAndAssert(
								render.wrapper.tableMap,
								IDS.DEFAULT_ROW_ACTIONS.repeatDownload,
								dispatchConfig.onAttachmentDownload
							);
						});
					});
				} else if (options.disabled === true) {
					describe("and the row is clicked", () => {
						it("does not call onAttachmentDownload", () => {
							const row = findBodyRow(
								render.wrapper.tableMap,
								IDS.DEFAULT_ROW_ACTIONS.repeatDownload
							);
							equal(row.interactive ?? false, false);
						});
					});
				} else {
					describe("and the row is clicked", () => {
						it("does not call onAttachmentDownload", () => {
							findBodyRowClickAndAssert(
								render.wrapper.tableMap,
								IDS.DEFAULT_ROW_ACTIONS.repeatDownload,
								dispatchConfig.onAttachmentDownload,
								0
							);
						});
					});
				}

				describeTestInteractive(
					IDS.DEFAULT_ROW_ACTIONS.repeatDownload,
					options.expectedActionsAfterClick.defaultDownloadAction
				);
			});

			describe("and a repeat with a custom default row action with scope === 'ALWAYS' is given", () => {
				if (options.expectedActionsAfterClick.actionWithScopeUndefined) {
					it("renders the row with label of the custom row action as title", () => {
						const row = findBodyRow(
							render.wrapper.tableMap,
							IDS.DEFAULT_ROW_ACTIONS.repeatEventAlwaysShownAndEnabled
						);
						equal(row.title, "always-shown-and-enabled");
					});

					describe("and the row is clicked", () => {
						it("triggers onCustomRowAction with the custom row action event", () => {
							findBodyRowClickAndAssert(
								render.wrapper.tableMap,
								IDS.DEFAULT_ROW_ACTIONS.repeatEventAlwaysShownAndEnabled,
								dispatchConfig.repeat.onCustomRowAction
							);
						});
					});
				} else if (options.disabled) {
					testRowDisabled(context, IDS.DEFAULT_ROW_ACTIONS.repeatEventAlwaysShownAndEnabled);
				} else {
					testNoActionOnRow(
						context,
						IDS.DEFAULT_ROW_ACTIONS.repeatEventAlwaysShownAndEnabled,
						dispatchConfig.repeat.onCustomRowAction
					);
				}

				describeTestInteractive(
					IDS.DEFAULT_ROW_ACTIONS.repeatEventAlwaysShownAndEnabled,
					options.expectedActionsAfterClick.actionWithScopeUndefined
				);
			});

			describe("and a repeat with a custom default row action with scope === 'HIDDEN_IN_READONLY_MODE' is given", () => {
				if (options.expectedActionsAfterClick.actionWithScopeReadonlyHidden) {
					it("renders the row with label of the custom row action as title", () => {
						const row = findBodyRow(
							render.wrapper.tableMap,
							IDS.DEFAULT_ROW_ACTIONS.repeatEventHiddenInReadonlyMode
						);
						equal(row.title, "hidden-in-ro-mode");
					});

					describe("and the row is clicked", () => {
						it("triggers onCustomRowAction with the custom row action event", () => {
							findBodyRowClickAndAssert(
								render.wrapper.tableMap,
								IDS.DEFAULT_ROW_ACTIONS.repeatEventHiddenInReadonlyMode,
								dispatchConfig.repeat.onCustomRowAction
							);
						});
					});
				} else if (options.disabled) {
					testRowDisabled(context, IDS.DEFAULT_ROW_ACTIONS.repeatEventAlwaysShownAndEnabled);
				} else {
					testNoActionOnRow(
						context,
						IDS.DEFAULT_ROW_ACTIONS.repeatEventHiddenInReadonlyMode,
						dispatchConfig.repeat.onCustomRowAction
					);
				}

				describeTestInteractive(
					IDS.DEFAULT_ROW_ACTIONS.repeatEventHiddenInReadonlyMode,
					options.expectedActionsAfterClick.actionWithScopeReadonlyHidden
				);
			});

			describe("and a repeat with a custom default row action with scope === 'DISABLED_IN_READONLY_MODE' is given", () => {
				if (options.expectedActionsAfterClick.actionWithScopeReadonlyDisabled) {
					it("renders the row with label of the custom row action as title", () => {
						const row = findBodyRow(
							render.wrapper.tableMap,
							IDS.DEFAULT_ROW_ACTIONS.repeatEventDisabledInReadonlyMode
						);
						equal(row.title, "disabled-in-r/o-mode");
					});

					describe("and the row is clicked", () => {
						it("triggers onCustomRowAction with the custom row action event", () => {
							findBodyRowClickAndAssert(
								render.wrapper.tableMap,
								IDS.DEFAULT_ROW_ACTIONS.repeatEventDisabledInReadonlyMode,
								dispatchConfig.repeat.onCustomRowAction
							);
						});
					});
				} else if (options.disabled) {
					testRowDisabled(context, IDS.DEFAULT_ROW_ACTIONS.repeatEventAlwaysShownAndEnabled);
				} else {
					testNoActionOnRow(
						context,
						IDS.DEFAULT_ROW_ACTIONS.repeatEventDisabledInReadonlyMode,
						dispatchConfig.repeat.onCustomRowAction
					);
				}

				describeTestInteractive(
					IDS.DEFAULT_ROW_ACTIONS.repeatEventDisabledInReadonlyMode,
					options.expectedActionsAfterClick.actionWithScopeReadonlyDisabled
				);
			});

			describe("and a repeat with a custom default row action with scope === 'HIDDEN_IN_EDIT_MODE' is given", () => {
				if (options.expectedActionsAfterClick.actionWithScopeEditHidden) {
					it("renders the row with label of the custom row action as title", () => {
						const row = findBodyRow(
							render.wrapper.tableMap,
							IDS.DEFAULT_ROW_ACTIONS.repeatEventHiddenInEditMode
						);
						equal(row.title, "hidden-in-edit-mode");
					});

					describe("and the row is clicked", () => {
						it("triggers onCustomRowAction with the custom row action event", () => {
							findBodyRowClickAndAssert(
								render.wrapper.tableMap,
								IDS.DEFAULT_ROW_ACTIONS.repeatEventHiddenInEditMode,
								dispatchConfig.repeat.onCustomRowAction
							);
						});
					});
				} else if (options.disabled) {
					testRowDisabled(context, IDS.DEFAULT_ROW_ACTIONS.repeatEventAlwaysShownAndEnabled);
				} else {
					testNoActionOnRow(
						context,
						IDS.DEFAULT_ROW_ACTIONS.repeatEventHiddenInEditMode,
						dispatchConfig.repeat.onCustomRowAction
					);
				}

				describeTestInteractive(
					IDS.DEFAULT_ROW_ACTIONS.repeatEventHiddenInEditMode,
					options.expectedActionsAfterClick.actionWithScopeEditHidden
				);
			});

			describe("and a repeat with a custom default row action with scope === 'DISABLED_IN_EDIT_MODE' is given", () => {
				if (options.expectedActionsAfterClick.actionWithScopeEditDisabled) {
					it("renders the row with label of the custom row action as title", () => {
						const row = findBodyRow(
							render.wrapper.tableMap,
							IDS.DEFAULT_ROW_ACTIONS.repeatEventDisabledInEditMode
						);
						equal(row.title, "disabled-in-edit-mode");
					});

					describe("and the row is clicked", () => {
						it("triggers onCustomRowAction with the custom row action event", () => {
							findBodyRowClickAndAssert(
								render.wrapper.tableMap,
								IDS.DEFAULT_ROW_ACTIONS.repeatEventDisabledInEditMode,
								dispatchConfig.repeat.onCustomRowAction
							);
						});
					});
				} else if (options.disabled) {
					testRowDisabled(context, IDS.DEFAULT_ROW_ACTIONS.repeatEventAlwaysShownAndEnabled);
				} else {
					testNoActionOnRow(
						context,
						IDS.DEFAULT_ROW_ACTIONS.repeatEventDisabledInEditMode,
						dispatchConfig.repeat.onCustomRowAction
					);
				}

				describeTestInteractive(
					IDS.DEFAULT_ROW_ACTIONS.repeatEventDisabledInEditMode,
					options.expectedActionsAfterClick.actionWithScopeEditDisabled
				);
			});

			describe("and a repeat with no default row action is given", () => {
				if (options.disabled) {
					testRowDisabled(context, IDS.DEFAULT_ROW_ACTIONS.repeatEventAlwaysShownAndEnabled);
				} else {
					testNoActionOnRow(
						context,
						IDS.DEFAULT_ROW_ACTIONS.repeatNoDefaultRowAction,
						dispatchConfig.repeat.onCustomRowAction
					);
				}

				describeTestInteractive(IDS.DEFAULT_ROW_ACTIONS.repeatNoDefaultRowAction, false);
			});
		}

		const defaultStateRender = () => setupFormEngineRendererForTests(false, false, false);

		// stateful test -> separate describe
		describe("if the form is neither readonly nor disabled", () => {
			describe("and a remove row action button is clicked", () => {
				it("only triggers the event of the remove action button", async () => {
					await findClickConfirmAndAssert(
						await defaultStateRender(),
						IDS.DEFAULT_ROW_ACTIONS.removeButton,
						dispatchConfig.repeat.removeRow,
						dispatchConfig.repeat.enterRow
					);
				});
			});
		});

		describe("if the form is neither readonly nor disabled", () => {
			const context = RenderGroupFixture(defaultStateRender);
			const { it, render } = context;

			testDefaultRowAction({
				context,
				expectedActionsAfterClick: {
					actionWithScopeUndefined: true,
					actionWithScopeReadonlyHidden: true,
					actionWithScopeReadonlyDisabled: true,
					actionWithScopeEditHidden: false,
					actionWithScopeEditDisabled: false,
					defaultEditAction: true,
					defaultViewAction: false,
					defaultDownloadAction: true
				},
				disabled: false
			});

			describe("and a move up row action button is clicked", () => {
				it("only triggers the event of the move up action button", () => {
					findButtonClickAndAssert(
						render.wrapper.widgetMap,
						IDS.DEFAULT_ROW_ACTIONS.moveUpButton,
						dispatchConfig.repeat.onMoveRow,
						dispatchConfig.repeat.enterRow
					);
				});
			});

			describe("and a move down row action button is clicked", () => {
				it("only triggers the event of the move down action button", () => {
					findButtonClickAndAssert(
						render.wrapper.widgetMap,
						IDS.DEFAULT_ROW_ACTIONS.moveDownButton,
						dispatchConfig.repeat.onMoveRow,
						dispatchConfig.repeat.enterRow
					);
				});
			});

			describe("and a clone row action button is clicked", () => {
				it("only triggers the event of the clone action button", () => {
					findButtonClickAndAssert(
						render.wrapper.widgetMap,
						IDS.DEFAULT_ROW_ACTIONS.cloneButton,
						dispatchConfig.repeat.onCloneRow,
						dispatchConfig.repeat.enterRow
					);
				});
			});

			describe("and a edit row action button is clicked", () => {
				describe("and a custom default row action is defined", () => {
					it("only triggers the event of the edit action button", () => {
						findButtonClickAndAssert(
							render.wrapper.widgetMap,
							IDS.DEFAULT_ROW_ACTIONS.editButton,
							dispatchConfig.repeat.enterRow,
							dispatchConfig.repeat.onCustomRowAction
						);
					});
				});
			});

			describe("and a download row action button is clicked", () => {
				describe("and a custom default row action is defined", () => {
					it("only triggers the event of the download action button", () => {
						findButtonClickAndAssert(
							render.wrapper.widgetMap,
							IDS.DEFAULT_ROW_ACTIONS.downloadButton,
							undefined,
							dispatchConfig.repeat.onCustomRowAction
						);
					});
				});
			});
		});

		describe("if the form is disabled", () => {
			const context = RenderGroupFixture(() => setupFormEngineRendererForTests(false, true, false));

			testDefaultRowAction({
				context,
				expectedActionsAfterClick: {
					actionWithScopeUndefined: false,
					actionWithScopeReadonlyHidden: false,
					actionWithScopeReadonlyDisabled: false,
					actionWithScopeEditHidden: false,
					actionWithScopeEditDisabled: false,
					defaultEditAction: false,
					defaultViewAction: false,
					defaultDownloadAction: false
				},
				disabled: true
			});
		});

		describe("if the form is readonly", () => {
			const context = RenderGroupFixture(() => setupFormEngineRendererForTests(true, false, false));

			testDefaultRowAction({
				context,
				expectedActionsAfterClick: {
					actionWithScopeUndefined: true,
					actionWithScopeReadonlyHidden: false,
					actionWithScopeReadonlyDisabled: false,
					actionWithScopeEditHidden: true,
					actionWithScopeEditDisabled: true,
					defaultEditAction: false,
					defaultViewAction: true,
					defaultDownloadAction: true
				},
				disabled: false
			});
		});

		describe("if the form is in correction mode", () => {
			const context = RenderGroupFixture(() => setupFormEngineRendererForTests(false, false, true));
			testDefaultRowAction({
				context,
				expectedActionsAfterClick: {
					actionWithScopeUndefined: false,
					actionWithScopeReadonlyHidden: false,
					actionWithScopeReadonlyDisabled: false,
					actionWithScopeEditHidden: false,
					actionWithScopeEditDisabled: false,
					defaultEditAction: false,
					defaultViewAction: false,
					defaultDownloadAction: false
				},
				disabled: true
			});
		});
	});
});
