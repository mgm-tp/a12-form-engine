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

import type { EngineStore } from "../../../../../../back-end/store/index.js";
import type { ReadonlyObjectMap } from "../../../../../../models/index.js";
import type { EnablementByRow } from "../../../../../../view/internal/configuration/engine-configuration.js";
import { DefaultRepeatButtonNames } from "../../../../../../view/internal/configuration/engine-configuration.js";
import type { RtlRenderWrapper } from "../../../../../rtl-utils/render-wrapper.js";
import { ModelHelpers } from "../../../../../utils/model-helpers.js";
import { setupFixture, setupModelsFixture } from "../../../../../utils/setupFixture.js";
import { DEFAULT_ROW_ACTION_VISIBILITY } from "../../../../../utils/test-model-helpers/repeat.row-actions.js";

import { setupForEmbeddedRepeat } from "../row-action-enablement-utils.js";
import {
	assertRowActionContextMenuState,
	assertRowActionInActionColumnState,
	createEnablementMapForVisibilityTests,
	findAndAssertExpandedRowFooterButtonProps,
	openRowActionContextMenu
} from "../row-action-utils.js";

export function executeTestForDefaultRowActionVisibility(): void {
	const documentFixture = setupFixture(() => {
		return {
			document: {
				Root: {
					repeat: [{}, {}, {}],
					repeat_AttachmentCollection: [{}, {}, {}]
				}
			}
		};
	});
	const models = setupModelsFixture("repeat.row-actions");

	describe("Given a repeat with default row action Edit/View", () => {
		executeTest({
			defaultRowAction: DefaultRepeatButtonNames.edit,
			repeatShowButton: {
				repeatPath: DEFAULT_ROW_ACTION_VISIBILITY.EDIT_SHOWN.REPEAT_PATH,
				groupName: "repeat",
				columnId: DEFAULT_ROW_ACTION_VISIBILITY.EDIT_SHOWN.COLUMN_ID,
				buttons: generateButtonIds({
					repeatId: DEFAULT_ROW_ACTION_VISIBILITY.EDIT_SHOWN.REPEAT_ID,
					buttons: {
						edit: true,
						clone: true,
						delete: true,
						move: true,
						custom: true
					}
				})
			},
			repeatHideButton: {
				repeatPath: DEFAULT_ROW_ACTION_VISIBILITY.EDIT_HIDDEN.REPEAT_PATH,
				groupName: "repeat",
				columnId: DEFAULT_ROW_ACTION_VISIBILITY.EDIT_HIDDEN.COLUMN_ID,
				defaultRowActionButton: generateButtonIds({
					repeatId: DEFAULT_ROW_ACTION_VISIBILITY.EDIT_HIDDEN.REPEAT_ID,
					buttons: {
						edit: true
					}
				}),
				otherButtons: generateButtonIds({
					repeatId: DEFAULT_ROW_ACTION_VISIBILITY.EDIT_HIDDEN.REPEAT_ID,
					buttons: {
						clone: true,
						delete: true,
						move: true,
						custom: true
					}
				})
			}
		});
	});

	describe("Given a repeat with default row action Download", () => {
		executeTest({
			defaultRowAction: DefaultRepeatButtonNames.download,
			repeatShowButton: {
				repeatPath: DEFAULT_ROW_ACTION_VISIBILITY.DOWNLOAD_SHOWN.REPEAT_PATH,
				groupName: "repeat_AttachmentCollection",
				columnId: DEFAULT_ROW_ACTION_VISIBILITY.DOWNLOAD_SHOWN.COLUMN_ID,
				buttons: generateButtonIds({
					repeatId: DEFAULT_ROW_ACTION_VISIBILITY.DOWNLOAD_SHOWN.REPEAT_ID,
					buttons: {
						edit: true,
						clone: true,
						delete: true,
						move: true,
						download: true,
						custom: true
					}
				})
			},
			repeatHideButton: {
				repeatPath: DEFAULT_ROW_ACTION_VISIBILITY.DOWNLOAD_HIDDEN.REPEAT_PATH,
				groupName: "repeat_AttachmentCollection",
				columnId: DEFAULT_ROW_ACTION_VISIBILITY.DOWNLOAD_HIDDEN.COLUMN_ID,
				defaultRowActionButton: generateButtonIds({
					repeatId: DEFAULT_ROW_ACTION_VISIBILITY.DOWNLOAD_HIDDEN.REPEAT_ID,
					buttons: {
						download: true
					}
				}),
				otherButtons: generateButtonIds({
					repeatId: DEFAULT_ROW_ACTION_VISIBILITY.DOWNLOAD_HIDDEN.REPEAT_ID,
					buttons: {
						edit: true,
						clone: true,
						delete: true,
						move: true,
						custom: true
					}
				})
			}
		});
	});

	describe("Given a repeat with a custom default row action", () => {
		executeTest({
			defaultRowAction: "custom",
			repeatShowButton: {
				repeatPath: DEFAULT_ROW_ACTION_VISIBILITY.CUSTOM_SHOWN.REPEAT_PATH,
				groupName: "repeat",
				columnId: DEFAULT_ROW_ACTION_VISIBILITY.CUSTOM_SHOWN.COLUMN_ID,
				buttons: generateButtonIds({
					repeatId: DEFAULT_ROW_ACTION_VISIBILITY.CUSTOM_SHOWN.REPEAT_ID,
					buttons: {
						edit: true,
						clone: true,
						delete: true,
						move: true,
						custom: true,
						"always-shown-and-enabled": true
					}
				})
			},
			repeatHideButton: {
				repeatPath: DEFAULT_ROW_ACTION_VISIBILITY.CUSTOM_HIDDEN.REPEAT_PATH,
				groupName: "repeat",
				columnId: DEFAULT_ROW_ACTION_VISIBILITY.CUSTOM_HIDDEN.COLUMN_ID,
				defaultRowActionButton: generateButtonIds({
					repeatId: DEFAULT_ROW_ACTION_VISIBILITY.CUSTOM_HIDDEN.REPEAT_ID,
					buttons: {
						custom: true
					}
				}),
				otherButtons: generateButtonIds({
					repeatId: DEFAULT_ROW_ACTION_VISIBILITY.CUSTOM_HIDDEN.REPEAT_ID,
					buttons: {
						edit: true,
						clone: true,
						delete: true,
						move: true,
						"always-shown-and-enabled": true
					}
				})
			}
		});
	});

	interface RepeatDescriptor {
		repeatPath: ModelPath;
		groupName: string;
	}

	interface ButtonIdMap {
		readonly [key: string]: { buttonId: string; listItemId: string };
	}

	function executeTest(options: {
		defaultRowAction: string;
		repeatShowButton: RepeatDescriptor & {
			columnId: string;
			buttons: ButtonIdMap;
		};
		repeatHideButton: RepeatDescriptor & {
			columnId: string;
			defaultRowActionButton: ButtonIdMap;
			otherButtons: ButtonIdMap;
		};
	}) {
		const { defaultRowAction, repeatShowButton, repeatHideButton } = options;

		describe("and hideButton is undefined", () => {
			describe("renders in each row", () => {
				const wrapperFixture = { wrapper: () => setup({}) };
				const rows = threeRowsRendererForButton(repeatShowButton);

				assertButtonsState({
					wrapperFixture,
					rows,
					columnId: repeatShowButton.columnId,
					buttons: repeatShowButton.buttons,
					visible: true
				});
			});
		});

		interface ThreeRowsRendererForButtonConfig extends RepeatDescriptor {
			enablementMap?: EnablementByRow;
		}
		function threeRowsRendererForButton(c: ThreeRowsRendererForButtonConfig, rows = [1, 2, 3]) {
			return rows.map(index => ({
				index,
				expandedRowWrapper: () => setup({ ...c, expandedRowIndex: index })
			}));
		}

		describe("and hideButton is true", () => {
			describe("without enablement map", () => {
				const wrapperFixture = {
					wrapper: () => setup({})
				};
				const rows = threeRowsRendererForButton(repeatHideButton);

				describe("renders in each row", () => {
					assertButtonsState({
						wrapperFixture,
						rows,
						columnId: repeatHideButton.columnId,
						buttons: repeatHideButton.otherButtons,
						visible: true
					});
				});

				describe("does not render in each row", () => {
					assertButtonsState({
						wrapperFixture,
						rows,
						columnId: repeatHideButton.columnId,
						buttons: repeatHideButton.defaultRowActionButton,
						visible: false
					});
				});
			});

			describe("with enablement map", () => {
				describe(
					"and an entry with 'hidden=false' exists for the button " +
						"of the default row action in the first row",
					() => {
						const enablementMap = createEnablementMapForVisibilityTests({
							event: defaultRowAction,
							entry: { [1]: { hidden: false } }
						});
						const wrapperFixture = { wrapper: () => setup({ enablementMap }) };
						const firstRow = threeRowsRendererForButton(
							{
								repeatPath: repeatHideButton.repeatPath,
								groupName: repeatHideButton.groupName,
								enablementMap
							},
							[1]
						);

						const otherRows = threeRowsRendererForButton(
							{
								repeatPath: repeatHideButton.repeatPath,
								groupName: repeatHideButton.groupName,
								enablementMap
							},
							[2, 3]
						);

						describe("renders in the first row", () => {
							assertButtonsState({
								wrapperFixture,
								rows: firstRow,
								columnId: repeatHideButton.columnId,
								buttons: {
									...repeatHideButton.defaultRowActionButton,
									...repeatHideButton.otherButtons
								},
								visible: true
							});
						});

						describe("renders in all the other rows", () => {
							assertButtonsState({
								wrapperFixture,
								rows: otherRows,
								columnId: repeatHideButton.columnId,
								buttons: repeatHideButton.otherButtons,
								visible: true
							});
						});

						describe("does not render in all the other rows", () => {
							assertButtonsState({
								wrapperFixture,
								rows: otherRows,
								columnId: repeatHideButton.columnId,
								buttons: repeatHideButton.defaultRowActionButton,
								visible: false
							});
						});
					}
				);

				describe(
					"and an entry with 'hidden=false' exists for the button " +
						"of the default row action in all rows",
					() => {
						const enablementMap = createEnablementMapForVisibilityTests({
							event: defaultRowAction,
							entry: { [0]: { hidden: false } }
						});
						const wrapperFixture = { wrapper: () => setup({ enablementMap }) };
						const rows = threeRowsRendererForButton({ ...repeatHideButton, enablementMap });

						describe("renders in each row", () => {
							assertButtonsState({
								wrapperFixture,
								rows,
								columnId: repeatHideButton.columnId,
								buttons: {
									...repeatHideButton.defaultRowActionButton,
									...repeatHideButton.otherButtons
								},
								visible: true
							});
						});
					}
				);
			});
		});
	}

	function assertButtonsState(options: {
		wrapperFixture: { wrapper: () => Promise<RtlRenderWrapper> };
		columnId: string;
		buttons: ButtonIdMap;
		rows: { index: number; expandedRowWrapper: () => Promise<RtlRenderWrapper> }[];
		visible: boolean;
	}) {
		const { wrapperFixture, columnId, buttons, rows, visible } = options;

		describe(`buttons`, () => {
			it("in the action column", async () => {
				const wrapper = await wrapperFixture.wrapper();
				for (const b of Object.entries(buttons)) {
					for (const row of rows) {
						assertRowActionInActionColumnState(wrapper, b[1].buttonId + `-${row.index}`, visible);
					}
				}
			});

			it("in the context menu, when right-clicking in rows", async () => {
				const wrapper = await wrapperFixture.wrapper();
				for (const row of rows) {
					await openRowActionContextMenu(wrapper, columnId + `-bodycell-${row.index - 1}`);
					for (const b of Object.entries(buttons)) {
						assertRowActionContextMenuState(wrapper, b[1].listItemId + `-${row.index}`, {
							available: visible
						});
					}
				}
			});

			for (const row of rows) {
				it("in the expanded embedded repeat row footer " + row.index, async () => {
					const wrapper = await row.expandedRowWrapper();
					for (const b of Object.entries(buttons)) {
						findAndAssertExpandedRowFooterButtonProps({
							wrapper,
							buttonId: b[1].buttonId + `-${row.index}`,
							isExpected: visible
						});
					}
				});
			}
		});
	}

	interface ButtonTestConfig extends RepeatDescriptor {
		expandedRowIndex: number;
	}

	function setup(
		params: Partial<ButtonTestConfig> & {
			enablementMap?: EnablementByRow;
		}
	): Promise<RtlRenderWrapper> {
		const repeatInstanceState: ReadonlyObjectMap<EngineStore.Repeat.InstanceState> | undefined =
			params.repeatPath && params.groupName && params.expandedRowIndex
				? {
						[ModelPath.toString(params.repeatPath)]: {
							expandedRowPath: [
								{ elementName: "Root", index: 1 },
								{ elementName: params.groupName, index: params.expandedRowIndex }
							]
						}
					}
				: undefined;
		const screenLocation: EngineStore.ScreenState[] = [
			{
				locationPath: ModelHelpers.createModelPath("Enablement"),
				path: [],
				repeatInstanceState
			}
		];

		return setupForEmbeddedRepeat({
			models,
			document: documentFixture.document,
			enablementMap: params.enablementMap,
			screenLocation
		});
	}

	function generateButtonIds(options: {
		repeatId: string;
		buttons: {
			edit?: boolean;
			clone?: boolean;
			move?: boolean;
			delete?: boolean;
			download?: boolean;
			custom?: boolean;
			"always-shown-and-enabled"?: boolean;
		};
	}): ButtonIdMap {
		return {
			...(options.buttons.edit
				? {
						edit: {
							buttonId: `a12-edit-button-${options.repeatId}`,
							listItemId: `a12-edit-list-item-${options.repeatId}`
						}
					}
				: undefined),
			...(options.buttons.clone
				? {
						clone: {
							buttonId: `a12-copy-button-${options.repeatId}`,
							listItemId: `a12-copy-list-item-${options.repeatId}`
						}
					}
				: undefined),
			...(options.buttons.move
				? {
						move_up: {
							buttonId: `a12-up-button-${options.repeatId}`,
							listItemId: `a12-up-list-item-${options.repeatId}`
						},
						move_down: {
							buttonId: `a12-down-button-${options.repeatId}`,
							listItemId: `a12-down-list-item-${options.repeatId}`
						}
					}
				: undefined),
			...(options.buttons.delete
				? {
						delete: {
							buttonId: `a12-remove-button-${options.repeatId}`,
							listItemId: `a12-remove-list-item-${options.repeatId}`
						}
					}
				: undefined),
			...(options.buttons.download
				? {
						download: {
							buttonId: `a12-download-button-${options.repeatId}`,
							listItemId: `a12-download-list-item-${options.repeatId}`
						}
					}
				: undefined),
			...(options.buttons.custom
				? {
						custom: {
							buttonId: `a12-custom-custom-button-${options.repeatId}`,
							listItemId: `a12-custom-custom-list-item-${options.repeatId}`
						}
					}
				: undefined),
			...(options.buttons["always-shown-and-enabled"]
				? {
						"always-shown-and-enabled": {
							buttonId: `a12-custom-always-shown-and-enabled-button-${options.repeatId}`,
							listItemId: `a12-custom-always-shown-and-enabled-list-item-${options.repeatId}`
						}
					}
				: undefined)
		};
	}
}
