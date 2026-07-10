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

import type { EngineStore } from "../../../../../../back-end/store/index.js";
import type { Models } from "../../../../../../back-end/store/internal/store.js";
import type { EnablementByRow } from "../../../../../../view/internal/configuration/engine-configuration.js";
import type { RtlRenderWrapper } from "../../../../../rtl-utils/render-wrapper.js";
import { createModelPath } from "../../../../../utils/createModelPath.js";
import { loadData, setupFormEngineRendererWithRtl } from "../../../../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../../../../utils/setupFixture.js";
import {
	DR_ROW_ACTIONS,
	IR_ATTACHMENT_COLLECTION,
	IR_ROW_ACTIONS
} from "../../../../../utils/test-model-helpers/test-button-enablements.js";

import { createEnablementMap, setupForDetachedRepeat } from "../row-action-enablement-utils.js";
import {
	openRowActionContextMenu,
	rowActionDisabledInContextMenu as radicm,
	rowActionNotDisabledInContextMenu as randicm,
	rowActionDisabledInActionColumn,
	rowActionNotDisabledInActionColumn
} from "../row-action-utils.js";

import type {
	TestCaseFactory,
	TestCaseRender
} from "./disabled/disabled-test-case-permutations.js";
import { noRender, pickRender } from "./disabled/disabled-test-case-permutations.js";
import type {
	RenderPermutation,
	TestGroupFactory
} from "./disabled/disabled-test-case-permutations.js";

/**
 * These tests have been ported from an Enzyme tests setup that rendered all
 * test cases (see TestCase / TestGroup) upfront.
 *
 * The resulting RTL tests only render one case at a time. To avoid having to
 * rewrite the whole thing, this is now done in two phases:
 *
 * prepare phase: ALL renders are only declared as callbacks - not rendered yet!
 * (TestRenderFactory). The result is stored in a nested object holder
 * structure.
 *
 * describe phase: For each entry in the render holder, run the describe
 * functions. The describe functions use a modified it function (itCond), which
 * only describes tests that match the current entry of the render holder
 * iteration. The current entry is fed into a RenderGroupFixture, i.e. the
 * describe functions receive a RenderHolder structure.
 *
 * The code to achieve this is inside the ./disabled folder.
 */
export function executeTestForDisabled(): void {
	// create data and models fixtures
	const models = setupModelsFixture("test.custom-button-enablements");

	const documents = setupFixture(() => {
		const documentWith3Rows = loadData(
			"test.custom-button-enablements",
			"data",
			models.documentModel
		);
		const documentWithMaxRep = loadData(
			"test.custom-button-enablements",
			"data-maximum-repeatability",
			models.documentModel
		);

		return {
			documentWith3Rows,
			documentWithMaxRep
		};
	});

	// parametrize render and describe functions
	const setupTest = SetupTest(models);
	const createWrappers = CreateWrappers(setupTest, documents);
	const describeTestsForSingleRender = DescribeTestsForSingleRender(setupTest, models, documents);

	// create holder for render callbacks (do not render yet)
	const holder: TestGroupFactory = {
		wrappers: createWrappers({}),

		roWrappers: createWrappers({ readonly: true }),

		wrappersForDisabledRowActionButtons: createWrappers({ disabledByScope: true }),

		roWrappersForDisabledRowActionButtons: createWrappers({
			readonly: true,
			disabledByScope: true
		})
	};

	// run tests that don't use one of the prepared models
	describeTestsForSingleRender();

	// create describes/its for each entry
	Object.entries(holder).forEach(e1 => {
		Object.entries(e1[1]).forEach(e2 => {
			describe(`${e1[0]}.${e2[0]}`, () => {
				describeTestsForSingleRender({ holder, key1: e1[0] as any, key2: e2[0] as any });
			});
		});
	});
}

// just to avoid code duplication
async function rowActionDisabledInContextMenu(
	wrapper: RtlRenderWrapper,
	cellId: string,
	itemId: string
): Promise<void> {
	await openRowActionContextMenu(wrapper, cellId);
	radicm(wrapper, itemId);
}

// just to avoid code duplication
async function rowActionNotDisabledInContextMenu(
	wrapper: RtlRenderWrapper,
	cellId: string,
	itemId: string
): Promise<void> {
	await openRowActionContextMenu(wrapper, cellId);
	randicm(wrapper, itemId);
}

interface Documents {
	readonly documentWith3Rows: object;
	readonly documentWithMaxRep: object;
}

function DescribeTestsForSingleRender(
	setupTest: ReturnType<typeof SetupTest>,
	models: Models,
	documents: Documents
) {
	return function (opts?: RenderPermutation): void {
		const { itCond, render } = opts ? pickRender(opts) : noRender();

		const describeIndependentTests = opts === undefined;

		// retain old Enzyme code structure
		const {
			wrappers,
			roWrappers,
			wrappersForDisabledRowActionButtons,
			roWrappersForDisabledRowActionButtons
		} = render;

		// Start of old Enzyme describe cascade

		describe("remove button", () => {
			executeTestForRowActionButtons({
				wrappers,
				repeatId: IR_ROW_ACTIONS.ID_REPEAT,
				buttonId: IR_ROW_ACTIONS.BUTTONS.ID_REMOVE,
				listItemId: IR_ROW_ACTIONS.LIST_ITEMS.ID_REMOVE,
				cellId: IR_ROW_ACTIONS.COLUMNS.ID
			});
		});

		describe("edit button", () => {
			executeTestForRowActionButtons({
				wrappers,
				repeatId: DR_ROW_ACTIONS.ID_REPEAT,
				buttonId: DR_ROW_ACTIONS.BUTTONS.ID_EDIT,
				listItemId: DR_ROW_ACTIONS.LIST_ITEMS.ID_EDIT,
				cellId: DR_ROW_ACTIONS.COLUMNS.ID
			});
		});

		describe("copy button", () => {
			executeTestForRowActionButtons({
				wrappers,
				repeatId: IR_ROW_ACTIONS.ID_REPEAT,
				buttonId: IR_ROW_ACTIONS.BUTTONS.ID_CLONE,
				listItemId: IR_ROW_ACTIONS.LIST_ITEMS.ID_CLONE,
				cellId: IR_ROW_ACTIONS.COLUMNS.ID
			});

			itCond(wrappers?.engineWithMaxRepDocuments)(
				"renders a disabled copy button if the document count is equal to the maximum number of rows",
				render => {
					for (let i = 0; i < 5; i++) {
						rowActionDisabledInActionColumn(
							render.wrapper,
							IR_ROW_ACTIONS.BUTTONS.ID_CLONE + `-${i + 1}`
						);

						rowActionDisabledInContextMenu(
							render.wrapper,
							`${IR_ROW_ACTIONS.COLUMNS.ID}-bodycell-${i}`,
							IR_ROW_ACTIONS.LIST_ITEMS.ID_CLONE + `-${i + 1}`
						);
					}
				}
			);
		});

		describe("move button", () => {
			executeTestForMoveButton();
		});

		describe("download button", () => {
			executeTestForDownloadButton();
		});

		describe("custom row action with scope === 'ALWAYS'", () => {
			executeTestForRowActionButtons({
				wrappers,
				repeatId: IR_ROW_ACTIONS.ID_REPEAT,
				buttonId: IR_ROW_ACTIONS.BUTTONS.ID_CUSTOM_ALWAYS_SHOWN_AND_ENABLED,
				listItemId: IR_ROW_ACTIONS.LIST_ITEMS.ID_CUSTOM_ALWAYS_SHOWN_AND_ENABLED,
				cellId: IR_ROW_ACTIONS.COLUMNS.ID
			});
		});

		describe("custom row action with scope === 'HIDDEN_IN_READONLY_MODE'", () => {
			executeTestForRowActionButtons({
				wrappers,
				repeatId: IR_ROW_ACTIONS.ID_REPEAT,
				buttonId: IR_ROW_ACTIONS.BUTTONS.ID_CUSTOM_HIDDEN_IN_RO_MODE,
				listItemId: IR_ROW_ACTIONS.LIST_ITEMS.ID_CUSTOM_HIDDEN_IN_RO_MODE,
				cellId: IR_ROW_ACTIONS.COLUMNS.ID
			});
		});

		describe("custom row action with scope === 'HIDDEN_IN_EDIT_MODE'", () => {
			executeTestForRowActionButtons({
				wrappers: roWrappers,
				repeatId: IR_ROW_ACTIONS.ID_REPEAT,
				buttonId: IR_ROW_ACTIONS.BUTTONS.ID_CUSTOM_HIDDEN_IN_EDIT_MODE,
				listItemId: IR_ROW_ACTIONS.LIST_ITEMS.ID_CUSTOM_HIDDEN_IN_EDIT_MODE,
				cellId: IR_ROW_ACTIONS.COLUMNS.ID
			});
		});

		describe("custom row action with scope === 'DISABLED_IN_EDIT_MODE'", () => {
			executeTestForRowActionButtons({
				wrappers: wrappersForDisabledRowActionButtons,
				repeatId: IR_ROW_ACTIONS.ID_REPEAT,
				buttonId: IR_ROW_ACTIONS.BUTTONS.ID_CUSTOM_DISABLED_IN_EDIT_MODE,
				listItemId: IR_ROW_ACTIONS.LIST_ITEMS.ID_CUSTOM_DISABLED_IN_EDIT_MODE,
				cellId: IR_ROW_ACTIONS.COLUMNS.ID,
				disabledByScope: true
			});
		});

		describe("custom row action with scope === 'DISABLED_IN_READONLY_MODE'", () => {
			executeTestForRowActionButtons({
				wrappers: roWrappersForDisabledRowActionButtons,
				repeatId: IR_ROW_ACTIONS.ID_REPEAT,
				buttonId: IR_ROW_ACTIONS.BUTTONS.ID_CUSTOM_DISABLED_IN_RO_MODE,
				listItemId: IR_ROW_ACTIONS.LIST_ITEMS.ID_CUSTOM_DISABLED_IN_RO_MODE,
				cellId: IR_ROW_ACTIONS.COLUMNS.ID,
				disabledByScope: true
			});
		});

		describe("view button", () => {
			executeTestForRowActionButtons({
				wrappers: roWrappers,
				repeatId: DR_ROW_ACTIONS.ID_REPEAT,
				buttonId: DR_ROW_ACTIONS.BUTTONS.ID_VIEW,
				listItemId: DR_ROW_ACTIONS.LIST_ITEMS.ID_VIEW,
				cellId: DR_ROW_ACTIONS.COLUMNS.ID
			});
		});

		describe("detached repeat buttons", () => {
			executeTestForDetachedRepeatButtons();
		});

		function executeTestForRowActionButtons(options: {
			wrappers?: Partial<TestCaseRender>;
			repeatId: string;
			buttonId: string;
			listItemId: string;
			cellId: string;
			disabledByScope?: boolean;
		}): void {
			describe("if the form is disabled", () => {
				describe("and no entry in the enablement map for any button exists", () => {
					itCond(options.wrappers?.disabledEngine)(
						"renders in each row a disabled button",
						render => {
							rowActionDisabledInActionColumn(render.wrapper, options.buttonId + "-1");
							rowActionDisabledInContextMenu(
								render.wrapper,
								options.cellId + "-bodycell-0",
								options.listItemId + "-1"
							);
						}
					);
				});

				describe("and an entry with 'disabled=false' in the enablement map for a button in the second row exists", () => {
					itCond(options.wrappers?.disabledEngineWithMapForRow2)(
						"renders in the second row an enabled button",
						render => {
							rowActionNotDisabledInActionColumn(render.wrapper, options.buttonId + "-2");
							rowActionNotDisabledInContextMenu(
								render.wrapper,
								options.cellId + "-bodycell-1",
								options.listItemId + "-2"
							);
						}
					);

					itCond(options.wrappers?.disabledEngineWithMapForRow2)(
						"renders in the all other rows a disabled button",
						render => {
							const rowsToCheck = [0, 2];

							for (const i of rowsToCheck) {
								rowActionDisabledInActionColumn(render.wrapper, options.buttonId + `-${i + 1}`);
								rowActionDisabledInContextMenu(
									render.wrapper,
									options.cellId + `-bodycell-${i}`,
									options.listItemId + `-${i + 1}`
								);
							}
						}
					);
				});

				describe("and an entry with 'disabled=false' in the enablement map for a button for all row exists", () => {
					itCond(options.wrappers?.disabledEngineWithMapForAllRows)(
						"renders in all rows an enabled button",
						render => {
							for (let i = 0; i < 3; i++) {
								rowActionNotDisabledInActionColumn(render.wrapper, options.buttonId + `-${i + 1}`);
								rowActionNotDisabledInContextMenu(
									render.wrapper,
									options.cellId + `-bodycell-${i}`,
									options.listItemId + `-${i + 1}`
								);
							}
						}
					);

					describe("and an entry with 'disabled=true' in the enablement map for a button in the second row exists", () => {
						itCond(options.wrappers?.disabledEngineWithMapForAllRowsAndRow2)(
							"overrules the entry for all rows",
							render => {
								rowActionDisabledInActionColumn(render.wrapper, options.buttonId + "-2");
								rowActionDisabledInContextMenu(
									render.wrapper,
									options.cellId + "-bodycell-1",
									options.listItemId + "-2"
								);
							}
						);
					});
				});
			});

			describe("if the form is not disabled", () => {
				if (options.disabledByScope) {
					executeTestForDisabledRowActionButtons(options);
				} else {
					executeTestForEnabledRowActionButtons(options);
				}
			});
		}

		function executeTestForEnabledRowActionButtons(options: {
			wrappers?: Partial<TestCaseRender>;
			repeatId: string;
			buttonId: string;
			listItemId: string;
			cellId: string;
			disabledByScope?: boolean;
		}): void {
			describe("and no entry in the enablement map for any button exists", () => {
				itCond(options.wrappers?.enabledEngine)("renders an enabled button in each row", render => {
					rowActionNotDisabledInActionColumn(render.wrapper, options.buttonId + "-1");
					rowActionNotDisabledInContextMenu(
						render.wrapper,
						options.cellId + "-bodycell-0",
						options.listItemId + "-1"
					);
				});
			});

			describe("and an entry with 'disabled=true' in the enablement map for a button in the second row exists", () => {
				itCond(options.wrappers?.enabledEngineWithMapForRow2)(
					"renders in the second row a disabled button",
					render => {
						rowActionDisabledInActionColumn(render.wrapper, options.buttonId + "-2");
						rowActionDisabledInContextMenu(
							render.wrapper,
							options.cellId + "-bodycell-1",
							options.listItemId + "-2"
						);
					}
				);

				itCond(options.wrappers?.enabledEngineWithMapForRow2)(
					"renders in all the other rows enabled buttons",
					render => {
						const rowsToCheck = [0, 2];

						for (const i of rowsToCheck) {
							rowActionNotDisabledInActionColumn(render.wrapper, options.buttonId + `-${i + 1}`);
							rowActionNotDisabledInContextMenu(
								render.wrapper,
								options.cellId + `-bodycell-${i}`,
								options.listItemId + `-${i + 1}`
							);
						}
					}
				);
			});

			describe("and an entry with 'disabled=true' in the enablement map for a button for all row exists", () => {
				itCond(options.wrappers?.enabledEngineWithMapForAllRows)(
					"renders in all rows a disabled button",
					render => {
						for (let i = 0; i < 3; i++) {
							rowActionDisabledInActionColumn(render.wrapper, options.buttonId + `-${i + 1}`);
							rowActionDisabledInContextMenu(
								render.wrapper,
								options.cellId + `-bodycell-${i}`,
								options.listItemId + `-${i + 1}`
							);
						}
					}
				);

				describe("and an entry with 'disabled=false' in the enablement map for a button in the second row exists", () => {
					itCond(options.wrappers?.enabledEngineWithMapForAllRowsAndRow2)(
						"overrules the entry for all rows",
						render => {
							rowActionNotDisabledInActionColumn(render.wrapper, options.buttonId + "-2");
							rowActionNotDisabledInContextMenu(
								render.wrapper,
								options.cellId + "-bodycell-1",
								options.listItemId + "-2"
							);
						}
					);
				});
			});
		}

		function executeTestForDisabledRowActionButtons(options: {
			wrappers?: Partial<TestCaseRender>;
			repeatId: string;
			buttonId: string;
			listItemId: string;
			cellId: string;
			disabledByScope?: boolean;
		}): void {
			describe("and no entry in the enablement map for any button exists", () => {
				itCond(options.wrappers?.enabledEngine)("renders a disabled button in each row", render => {
					rowActionDisabledInActionColumn(render.wrapper, options.buttonId + "-1");
					rowActionDisabledInContextMenu(
						render.wrapper,
						options.cellId + "-bodycell-0",
						options.listItemId + "-1"
					);
				});
			});

			describe("and an entry with 'disabled=false' in the enablement map for a button in the second row exists", () => {
				itCond(options.wrappers?.enabledEngineWithMapForRow2)(
					"renders in the second row an enabled button",
					render => {
						rowActionNotDisabledInActionColumn(render.wrapper, options.buttonId + "-2");
						rowActionNotDisabledInContextMenu(
							render.wrapper,
							options.cellId + "-bodycell-1",
							options.listItemId + "-2"
						);
					}
				);

				itCond(options.wrappers?.enabledEngineWithMapForRow2)(
					"renders in all the other rows disabled buttons",
					render => {
						const rowsToCheck = [0, 2];

						for (const i of rowsToCheck) {
							rowActionDisabledInActionColumn(render.wrapper, options.buttonId + `-${i + 1}`);
							rowActionDisabledInContextMenu(
								render.wrapper,
								options.cellId + `-bodycell-${i}`,
								options.listItemId + `-${i + 1}`
							);
						}
					}
				);
			});

			describe("and an entry with 'disabled=false' in the enablement map for a button for all row exists", () => {
				itCond(options.wrappers?.enabledEngineWithMapForAllRows)(
					"renders in all rows an enabled button",
					render => {
						for (let i = 0; i < 3; i++) {
							rowActionNotDisabledInActionColumn(render.wrapper, options.buttonId + `-${i + 1}`);
							rowActionNotDisabledInContextMenu(
								render.wrapper,
								options.cellId + `-bodycell-${i}`,
								options.listItemId + `-${i + 1}`
							);
						}
					}
				);

				describe("and an entry with 'disabled=true' in the enablement map for a button in the second row exists", () => {
					itCond(options.wrappers?.enabledEngineWithMapForAllRowsAndRow2)(
						"overrules the entry for all rows",
						render => {
							rowActionDisabledInActionColumn(render.wrapper, options.buttonId + "-2");
							rowActionDisabledInContextMenu(
								render.wrapper,
								options.cellId + "-bodycell-1",
								options.listItemId + "-2"
							);
						}
					);
				});
			});
		}

		function executeTestForMoveButton(): void {
			describe("if the form is disabled", () => {
				describe("and no entry in the enablement map for any button exists", () => {
					itCond(wrappers?.disabledEngine)("renders in each row a disabled button", render => {
						for (let i = 0; i < 3; i++) {
							rowActionDisabledInActionColumn(
								render.wrapper,
								IR_ROW_ACTIONS.BUTTONS.ID_MOVE_DOWN + `-${i + 1}`
							);
							rowActionDisabledInContextMenu(
								render.wrapper,
								`${IR_ROW_ACTIONS.COLUMNS.ID}-bodycell-${i}`,
								IR_ROW_ACTIONS.LIST_ITEMS.ID_MOVE_DOWN + `-${i + 1}`
							);

							rowActionDisabledInActionColumn(
								render.wrapper,
								IR_ROW_ACTIONS.BUTTONS.ID_MOVE_UP + `-${i + 1}`
							);
							rowActionDisabledInContextMenu(
								render.wrapper,
								`${IR_ROW_ACTIONS.COLUMNS.ID}-bodycell-${i}`,
								IR_ROW_ACTIONS.LIST_ITEMS.ID_MOVE_UP + `-${i + 1}`
							);
						}
					});
				});

				describe("and an entry with 'disabled=false' in the enablement map for a button in the second row exists", () => {
					itCond(wrappers?.disabledEngineWithMapForRow2)(
						"renders in the second row an enabled button",
						render => {
							rowActionNotDisabledInActionColumn(
								render.wrapper,
								IR_ROW_ACTIONS.BUTTONS.ID_MOVE_DOWN + "-2"
							);
							rowActionNotDisabledInContextMenu(
								render.wrapper,
								`${IR_ROW_ACTIONS.COLUMNS.ID}-bodycell-1`,
								IR_ROW_ACTIONS.LIST_ITEMS.ID_MOVE_DOWN + "-2"
							);

							rowActionNotDisabledInActionColumn(
								render.wrapper,
								IR_ROW_ACTIONS.BUTTONS.ID_MOVE_UP + "-2"
							);
							rowActionNotDisabledInContextMenu(
								render.wrapper,
								`${IR_ROW_ACTIONS.COLUMNS.ID}-bodycell-1`,
								IR_ROW_ACTIONS.LIST_ITEMS.ID_MOVE_UP + "-2"
							);
						}
					);

					itCond(wrappers?.disabledEngineWithMapForRow2)(
						"renders in all the other rows a disabled button",
						render => {
							const rowsToCheck = [0, 2];

							for (const i of rowsToCheck) {
								rowActionDisabledInActionColumn(
									render.wrapper,
									IR_ROW_ACTIONS.BUTTONS.ID_MOVE_DOWN + `-${i + 1}`
								);
								rowActionDisabledInContextMenu(
									render.wrapper,
									`${IR_ROW_ACTIONS.COLUMNS.ID}-bodycell-${i}`,
									IR_ROW_ACTIONS.LIST_ITEMS.ID_MOVE_DOWN + `-${i + 1}`
								);

								rowActionDisabledInActionColumn(
									render.wrapper,
									IR_ROW_ACTIONS.BUTTONS.ID_MOVE_UP + `-${i + 1}`
								);
								rowActionDisabledInContextMenu(
									render.wrapper,
									`${IR_ROW_ACTIONS.COLUMNS.ID}-bodycell-${i}`,
									IR_ROW_ACTIONS.LIST_ITEMS.ID_MOVE_UP + `-${i + 1}`
								);
							}
						}
					);
				});

				describe("and an entry with 'disabled=false' in the enablement map for a button for all row exists", () => {
					itCond(wrappers?.disabledEngineWithMapForAllRows)(
						"renders in the first row an enable move down and disabled move up button",
						render => {
							rowActionNotDisabledInActionColumn(
								render.wrapper,
								IR_ROW_ACTIONS.BUTTONS.ID_MOVE_DOWN + "-1"
							);
							rowActionNotDisabledInContextMenu(
								render.wrapper,
								`${IR_ROW_ACTIONS.COLUMNS.ID}-bodycell-0`,
								IR_ROW_ACTIONS.LIST_ITEMS.ID_MOVE_DOWN + "-1"
							);

							rowActionDisabledInActionColumn(
								render.wrapper,
								IR_ROW_ACTIONS.BUTTONS.ID_MOVE_UP + "-1"
							);
							rowActionDisabledInContextMenu(
								render.wrapper,
								`${IR_ROW_ACTIONS.COLUMNS.ID}-bodycell-0`,
								IR_ROW_ACTIONS.LIST_ITEMS.ID_MOVE_UP + "-1"
							);
						}
					);

					itCond(wrappers?.disabledEngineWithMapForAllRows)(
						"renders in the second row an enable move down and up button",
						render => {
							rowActionNotDisabledInActionColumn(
								render.wrapper,
								IR_ROW_ACTIONS.BUTTONS.ID_MOVE_DOWN + "-2"
							);
							rowActionNotDisabledInContextMenu(
								render.wrapper,
								`${IR_ROW_ACTIONS.COLUMNS.ID}-bodycell-1`,
								IR_ROW_ACTIONS.LIST_ITEMS.ID_MOVE_DOWN + "-2"
							);

							rowActionNotDisabledInActionColumn(
								render.wrapper,
								IR_ROW_ACTIONS.BUTTONS.ID_MOVE_UP + "-2"
							);
							rowActionNotDisabledInContextMenu(
								render.wrapper,
								`${IR_ROW_ACTIONS.COLUMNS.ID}-bodycell-1`,
								IR_ROW_ACTIONS.LIST_ITEMS.ID_MOVE_UP + "-2"
							);
						}
					);

					itCond(wrappers?.disabledEngineWithMapForAllRows)(
						"renders in the third row an disabled move down and enabled move up button",
						render => {
							rowActionDisabledInActionColumn(
								render.wrapper,
								IR_ROW_ACTIONS.BUTTONS.ID_MOVE_DOWN + "-3"
							);
							rowActionDisabledInContextMenu(
								render.wrapper,
								`${IR_ROW_ACTIONS.COLUMNS.ID}-bodycell-2`,
								IR_ROW_ACTIONS.LIST_ITEMS.ID_MOVE_DOWN + "-3"
							);

							rowActionNotDisabledInActionColumn(
								render.wrapper,
								IR_ROW_ACTIONS.BUTTONS.ID_MOVE_UP + "-3"
							);
							rowActionNotDisabledInContextMenu(
								render.wrapper,
								`${IR_ROW_ACTIONS.COLUMNS.ID}-bodycell-2`,
								IR_ROW_ACTIONS.LIST_ITEMS.ID_MOVE_UP + "-3"
							);
						}
					);
				});
			});

			describe("if the form is not disabled", () => {
				describe("and no entry in the enablement map for any button exists", () => {
					itCond(wrappers?.enabledEngine)(
						"renders in the first row an enabled move down and disabled move up button",
						render => {
							rowActionNotDisabledInActionColumn(
								render.wrapper,
								IR_ROW_ACTIONS.BUTTONS.ID_MOVE_DOWN + "-1"
							);
							rowActionNotDisabledInContextMenu(
								render.wrapper,
								`${IR_ROW_ACTIONS.COLUMNS.ID}-bodycell-0`,
								IR_ROW_ACTIONS.LIST_ITEMS.ID_MOVE_DOWN + "-1"
							);

							rowActionDisabledInActionColumn(
								render.wrapper,
								IR_ROW_ACTIONS.BUTTONS.ID_MOVE_UP + "-1"
							);
							rowActionDisabledInContextMenu(
								render.wrapper,
								`${IR_ROW_ACTIONS.COLUMNS.ID}-bodycell-0`,
								IR_ROW_ACTIONS.LIST_ITEMS.ID_MOVE_UP + "-1"
							);
						}
					);

					itCond(wrappers?.enabledEngine)(
						"renders in the second row an enabled move down and up button",
						render => {
							rowActionNotDisabledInActionColumn(
								render.wrapper,
								IR_ROW_ACTIONS.BUTTONS.ID_MOVE_DOWN + "-2"
							);
							rowActionNotDisabledInContextMenu(
								render.wrapper,
								`${IR_ROW_ACTIONS.COLUMNS.ID}-bodycell-1`,
								IR_ROW_ACTIONS.LIST_ITEMS.ID_MOVE_DOWN + "-2"
							);

							rowActionNotDisabledInActionColumn(
								render.wrapper,
								IR_ROW_ACTIONS.BUTTONS.ID_MOVE_UP + "-2"
							);
							rowActionNotDisabledInContextMenu(
								render.wrapper,
								`${IR_ROW_ACTIONS.COLUMNS.ID}-bodycell-1`,
								IR_ROW_ACTIONS.LIST_ITEMS.ID_MOVE_UP + "-2"
							);
						}
					);

					itCond(wrappers?.enabledEngine)(
						"renders in the third row an disabled move down and enabled move up button",
						render => {
							rowActionDisabledInActionColumn(
								render.wrapper,
								IR_ROW_ACTIONS.BUTTONS.ID_MOVE_DOWN + "-3"
							);
							rowActionDisabledInContextMenu(
								render.wrapper,
								`${IR_ROW_ACTIONS.COLUMNS.ID}-bodycell-2`,
								IR_ROW_ACTIONS.LIST_ITEMS.ID_MOVE_DOWN + "-3"
							);

							rowActionNotDisabledInActionColumn(
								render.wrapper,
								IR_ROW_ACTIONS.BUTTONS.ID_MOVE_UP + "-3"
							);
							rowActionNotDisabledInContextMenu(
								render.wrapper,
								`${IR_ROW_ACTIONS.COLUMNS.ID}-bodycell-2`,
								IR_ROW_ACTIONS.LIST_ITEMS.ID_MOVE_UP + "-3"
							);
						}
					);
				});

				describe("and an entry with 'disabled=true' in the enablement map for a button in the second row exists", () => {
					itCond(wrappers?.enabledEngineWithMapForRow2)(
						"renders in the second row an disabled move down and up button",
						render => {
							rowActionDisabledInActionColumn(
								render.wrapper,
								IR_ROW_ACTIONS.BUTTONS.ID_MOVE_DOWN + "-2"
							);
							rowActionDisabledInContextMenu(
								render.wrapper,
								`${IR_ROW_ACTIONS.COLUMNS.ID}-bodycell-1`,
								IR_ROW_ACTIONS.LIST_ITEMS.ID_MOVE_DOWN + "-2"
							);

							rowActionDisabledInActionColumn(
								render.wrapper,
								IR_ROW_ACTIONS.BUTTONS.ID_MOVE_UP + "-2"
							);
							rowActionDisabledInContextMenu(
								render.wrapper,
								`${IR_ROW_ACTIONS.COLUMNS.ID}-bodycell-1`,
								IR_ROW_ACTIONS.LIST_ITEMS.ID_MOVE_UP + "-2"
							);

							rowActionNotDisabledInActionColumn(
								render.wrapper,
								IR_ROW_ACTIONS.BUTTONS.ID_MOVE_UP + "-3"
							);
							rowActionNotDisabledInContextMenu(
								render.wrapper,
								`${IR_ROW_ACTIONS.COLUMNS.ID}-bodycell-2`,
								IR_ROW_ACTIONS.LIST_ITEMS.ID_MOVE_UP + "-3"
							);

							rowActionNotDisabledInActionColumn(
								render.wrapper,
								IR_ROW_ACTIONS.BUTTONS.ID_MOVE_DOWN + "-1"
							);
							rowActionNotDisabledInContextMenu(
								render.wrapper,
								`${IR_ROW_ACTIONS.COLUMNS.ID}-bodycell-0`,
								IR_ROW_ACTIONS.LIST_ITEMS.ID_MOVE_DOWN + "-1"
							);
						}
					);
				});

				describe("and an entry with 'disabled=true' in the enablement map for a button for all row exists", () => {
					itCond(wrappers?.enabledEngineWithMapForAllRows)(
						"renders in all rows an disabled button",
						render => {
							for (let i = 0; i < 3; i++) {
								rowActionDisabledInActionColumn(
									render.wrapper,
									IR_ROW_ACTIONS.BUTTONS.ID_MOVE_DOWN + `-${i + 1}`
								);
								rowActionDisabledInContextMenu(
									render.wrapper,
									`${IR_ROW_ACTIONS.COLUMNS.ID}-bodycell-${i}`,
									IR_ROW_ACTIONS.LIST_ITEMS.ID_MOVE_DOWN + `-${i + 1}`
								);

								rowActionDisabledInActionColumn(
									render.wrapper,
									IR_ROW_ACTIONS.BUTTONS.ID_MOVE_UP + `-${i + 1}`
								);
								rowActionDisabledInContextMenu(
									render.wrapper,
									`${IR_ROW_ACTIONS.COLUMNS.ID}-bodycell-${i}`,
									IR_ROW_ACTIONS.LIST_ITEMS.ID_MOVE_UP + `-${i + 1}`
								);
							}
						}
					);
				});
			});
		}

		function executeTestForDownloadButton(): void {
			describe("if the form is disabled", () => {
				describe("and no entry in the enablement map for any button exists", () => {
					itCond(wrappers?.disabledEngine)("renders in each row a disabled button", render => {
						for (let i = 0; i < 3; i++) {
							rowActionDisabledInActionColumn(
								render.wrapper,
								IR_ATTACHMENT_COLLECTION.BUTTONS.ID_DOWNLOAD + `-${i + 1}`
							);
							rowActionDisabledInContextMenu(
								render.wrapper,
								`${IR_ATTACHMENT_COLLECTION.COLUMNS.ID_DOWNLOAD}-bodycell-${i}`,
								IR_ATTACHMENT_COLLECTION.LIST_ITEMS.ID_DOWNLOAD + `-${i + 1}`
							);
						}
					});
				});

				describe("and an entry with 'disabled=false' in the enablement map for a button in the second row exists", () => {
					describe("and each row contains an attachment", () => {
						describe("renders in the second row", () => {
							itCond(wrappers?.disabledEngineWithMapForRow2)("an enabled button", render => {
								rowActionNotDisabledInActionColumn(
									render.wrapper,
									IR_ATTACHMENT_COLLECTION.BUTTONS.ID_DOWNLOAD + "-2"
								);
								rowActionNotDisabledInContextMenu(
									render.wrapper,
									`${IR_ATTACHMENT_COLLECTION.COLUMNS.ID_DOWNLOAD}-bodycell-1`,
									IR_ATTACHMENT_COLLECTION.LIST_ITEMS.ID_DOWNLOAD + "-2"
								);
							});

							describeIndependentTests &&
								it("a disabled button if the attachment for this row is unassigned", () => {
									const withUnassigned = setupTest({
										disabled: true,
										document: documents.documentWith3Rows,
										enablementMap: createEnablementMap({ entry: { [2]: { disabled: false } } }),
										unassigned: ["2"]
									});

									rowActionDisabledInActionColumn(
										withUnassigned,
										IR_ATTACHMENT_COLLECTION.BUTTONS.ID_DOWNLOAD + "-2"
									);
									rowActionDisabledInContextMenu(
										withUnassigned,
										`${IR_ATTACHMENT_COLLECTION.COLUMNS.ID_DOWNLOAD}-bodycell-1`,
										IR_ATTACHMENT_COLLECTION.LIST_ITEMS.ID_DOWNLOAD + "-2"
									);
								});
						});

						itCond(wrappers?.disabledEngineWithMapForRow2)(
							"renders in all the other rows a disabled button",
							render => {
								const rowsToCheck = [0, 2];

								for (const i of rowsToCheck) {
									rowActionDisabledInActionColumn(
										render.wrapper,
										IR_ATTACHMENT_COLLECTION.BUTTONS.ID_DOWNLOAD + `-${i + 1}`
									);
									rowActionDisabledInContextMenu(
										render.wrapper,
										`${IR_ATTACHMENT_COLLECTION.COLUMNS.ID_DOWNLOAD}-bodycell-${i}`,
										IR_ATTACHMENT_COLLECTION.LIST_ITEMS.ID_DOWNLOAD + `-${i + 1}`
									);
								}
							}
						);
					});

					describe("and the second row does not contain an attachment", () => {
						itCond(wrappers?.disabledEngineWithMaxRepDocumentsAndMapForRow2)(
							"renders in the second row an enabled button",
							render => {
								rowActionNotDisabledInActionColumn(
									render.wrapper,
									IR_ATTACHMENT_COLLECTION.BUTTONS.ID_DOWNLOAD + "-2"
								);
								rowActionNotDisabledInContextMenu(
									render.wrapper,
									`${IR_ATTACHMENT_COLLECTION.COLUMNS.ID_DOWNLOAD}-bodycell-1`,
									IR_ATTACHMENT_COLLECTION.LIST_ITEMS.ID_DOWNLOAD + "-2"
								);
							}
						);

						itCond(wrappers?.disabledEngineWithMaxRepDocumentsAndMapForRow2)(
							"renders in all the other rows a disabled button",
							render => {
								const rowsToCheck = [0, 2, 3, 4];

								for (const i of rowsToCheck) {
									rowActionDisabledInActionColumn(
										render.wrapper,
										IR_ATTACHMENT_COLLECTION.BUTTONS.ID_DOWNLOAD + `-${i + 1}`
									);
									rowActionDisabledInContextMenu(
										render.wrapper,
										`${IR_ATTACHMENT_COLLECTION.COLUMNS.ID_DOWNLOAD}-bodycell-${i}`,
										IR_ATTACHMENT_COLLECTION.LIST_ITEMS.ID_DOWNLOAD + `-${i + 1}`
									);
								}
							}
						);
					});
				});

				describe("and an entry with 'disabled=false' in the enablement map for a button for all row exists", () => {
					describe("and each row contains an attachment", () => {
						describe("renders in each row ", () => {
							itCond(wrappers?.disabledEngineWithMapForAllRows)("an enabled button", render => {
								for (let i = 0; i < 3; i++) {
									rowActionNotDisabledInActionColumn(
										render.wrapper,
										IR_ATTACHMENT_COLLECTION.BUTTONS.ID_DOWNLOAD + `-${i + 1}`
									);
									rowActionNotDisabledInContextMenu(
										render.wrapper,
										`${IR_ATTACHMENT_COLLECTION.COLUMNS.ID_DOWNLOAD}-bodycell-${i}`,
										IR_ATTACHMENT_COLLECTION.LIST_ITEMS.ID_DOWNLOAD + `-${i + 1}`
									);
								}
							});

							describeIndependentTests &&
								it("a disabled button if all attachments are unassigned", () => {
									const withAllUnassigned = setupTest({
										disabled: true,
										document: documents.documentWith3Rows,
										enablementMap: createEnablementMap({ entry: { [0]: { disabled: false } } }),
										unassigned: ["1", "2", "3"]
									});

									for (let i = 0; i < 3; i++) {
										rowActionDisabledInActionColumn(
											withAllUnassigned,
											IR_ATTACHMENT_COLLECTION.BUTTONS.ID_DOWNLOAD + `-${i + 1}`
										);
										rowActionDisabledInContextMenu(
											withAllUnassigned,
											`${IR_ATTACHMENT_COLLECTION.COLUMNS.ID_DOWNLOAD}-bodycell-${i}`,
											IR_ATTACHMENT_COLLECTION.LIST_ITEMS.ID_DOWNLOAD + `-${i + 1}`
										);
									}
								});
						});

						describe("and an entry with 'disabled=true' in the enablement map for a button in the second row exists", () => {
							itCond(wrappers?.disabledEngineWithMapForAllRowsAndRow2)(
								"overrules the entry for all rows",
								render => {
									rowActionDisabledInActionColumn(
										render.wrapper,
										IR_ATTACHMENT_COLLECTION.BUTTONS.ID_DOWNLOAD + "-2"
									);
									rowActionDisabledInContextMenu(
										render.wrapper,
										`${IR_ATTACHMENT_COLLECTION.COLUMNS.ID_DOWNLOAD}-bodycell-1`,
										IR_ATTACHMENT_COLLECTION.LIST_ITEMS.ID_DOWNLOAD + "-2"
									);
								}
							);
						});
					});

					describe("and the second row does not contain an attachment", () => {
						itCond(wrappers?.disabledEngineWithMaxRepDocumentsAndMapForAllRows)(
							"renders in each row an enabled button",
							render => {
								for (let i = 0; i < 5; i++) {
									rowActionNotDisabledInActionColumn(
										render.wrapper,
										IR_ATTACHMENT_COLLECTION.BUTTONS.ID_DOWNLOAD + `-${i + 1}`
									);
									rowActionNotDisabledInContextMenu(
										render.wrapper,
										`${IR_ATTACHMENT_COLLECTION.COLUMNS.ID_DOWNLOAD}-bodycell-${i}`,
										IR_ATTACHMENT_COLLECTION.LIST_ITEMS.ID_DOWNLOAD + `-${i + 1}`
									);
								}
							}
						);
					});
				});
			});

			describe("if the form is not disabled", () => {
				describe("and no entry in the enablement map for any button exists", () => {
					describe("and each row contains an attachment", () => {
						itCond(wrappers?.enabledEngine)("renders in each row an enabled button", render => {
							for (let i = 0; i < 3; i++) {
								rowActionNotDisabledInActionColumn(
									render.wrapper,
									IR_ATTACHMENT_COLLECTION.BUTTONS.ID_DOWNLOAD + `-${i + 1}`
								);
								rowActionNotDisabledInContextMenu(
									render.wrapper,
									`${IR_ATTACHMENT_COLLECTION.COLUMNS.ID_DOWNLOAD}-bodycell-${i}`,
									IR_ATTACHMENT_COLLECTION.LIST_ITEMS.ID_DOWNLOAD + `-${i + 1}`
								);
							}
						});

						describeIndependentTests &&
							it("renders in each row a disabled button if the attachments are unassigned", () => {
								const withAllUnassigned = setupTest({
									disabled: false,
									document: documents.documentWith3Rows,
									unassigned: ["1", "2", "3"]
								});

								for (let i = 0; i < 3; i++) {
									rowActionDisabledInActionColumn(
										withAllUnassigned,
										IR_ATTACHMENT_COLLECTION.BUTTONS.ID_DOWNLOAD + `-${i + 1}`
									);
									rowActionDisabledInContextMenu(
										withAllUnassigned,
										`${IR_ATTACHMENT_COLLECTION.COLUMNS.ID_DOWNLOAD}-bodycell-${i}`,
										IR_ATTACHMENT_COLLECTION.LIST_ITEMS.ID_DOWNLOAD + `-${i + 1}`
									);
								}
							});
					});

					describe("and the second row does not contain an attachment", () => {
						itCond(wrappers?.engineWithMaxRepDocuments)(
							"renders in the second row a disabled button",
							render => {
								rowActionDisabledInActionColumn(
									render.wrapper,
									IR_ATTACHMENT_COLLECTION.BUTTONS.ID_DOWNLOAD + "-2"
								);
								rowActionDisabledInContextMenu(
									render.wrapper,
									`${IR_ATTACHMENT_COLLECTION.COLUMNS.ID_DOWNLOAD}-bodycell-1`,
									IR_ATTACHMENT_COLLECTION.LIST_ITEMS.ID_DOWNLOAD + "-2"
								);
							}
						);

						itCond(wrappers?.engineWithMaxRepDocuments)(
							"renders in all the other rows an enabled button",
							render => {
								const rowsToCheck = [0, 2, 3, 4];

								for (const i of rowsToCheck) {
									rowActionNotDisabledInActionColumn(
										render.wrapper,
										IR_ATTACHMENT_COLLECTION.BUTTONS.ID_DOWNLOAD + `-${i + 1}`
									);
									rowActionNotDisabledInContextMenu(
										render.wrapper,
										`${IR_ATTACHMENT_COLLECTION.COLUMNS.ID_DOWNLOAD}-bodycell-${i}`,
										IR_ATTACHMENT_COLLECTION.LIST_ITEMS.ID_DOWNLOAD + `-${i + 1}`
									);
								}
							}
						);
					});
				});

				describe("and an entry with 'disabled=true' in the enablement map for a button in the second row exists", () => {
					itCond(wrappers?.enabledEngineWithMapForRow2)(
						"renders in the second row a disabled button",
						render => {
							rowActionDisabledInActionColumn(
								render.wrapper,
								IR_ATTACHMENT_COLLECTION.BUTTONS.ID_DOWNLOAD + "-2"
							);
							rowActionDisabledInContextMenu(
								render.wrapper,
								`${IR_ATTACHMENT_COLLECTION.COLUMNS.ID_DOWNLOAD}-bodycell-1`,
								IR_ATTACHMENT_COLLECTION.LIST_ITEMS.ID_DOWNLOAD + "-2"
							);
						}
					);

					itCond(wrappers?.enabledEngineWithMapForRow2)(
						"renders in all the other rows an enabled button",
						render => {
							const rowsToCheck = [0, 2];

							for (const i of rowsToCheck) {
								rowActionNotDisabledInActionColumn(
									render.wrapper,
									IR_ATTACHMENT_COLLECTION.BUTTONS.ID_DOWNLOAD + `-${i + 1}`
								);
								rowActionNotDisabledInContextMenu(
									render.wrapper,
									`${IR_ATTACHMENT_COLLECTION.COLUMNS.ID_DOWNLOAD}-bodycell-${i}`,
									IR_ATTACHMENT_COLLECTION.LIST_ITEMS.ID_DOWNLOAD + `-${i + 1}`
								);
							}
						}
					);
				});

				describe("and an entry with 'disabled=true' in the enablement map for a button for all row exists", () => {
					itCond(wrappers?.enabledEngineWithMapForAllRows)(
						"renders in all rows a disabled button",
						render => {
							for (let i = 0; i < 3; i++) {
								rowActionDisabledInActionColumn(
									render.wrapper,
									IR_ATTACHMENT_COLLECTION.BUTTONS.ID_DOWNLOAD + `-${i + 1}`
								);
								rowActionDisabledInContextMenu(
									render.wrapper,
									`${IR_ATTACHMENT_COLLECTION.COLUMNS.ID_DOWNLOAD}-bodycell-${i}`,
									IR_ATTACHMENT_COLLECTION.LIST_ITEMS.ID_DOWNLOAD + `-${i + 1}`
								);
							}
						}
					);

					describe("and an entry with 'disabled=false' in the enablement map for a button in the second row exists", () => {
						itCond(wrappers?.enabledEngineWithMapForAllRowsAndRow2)(
							"overrules the entry for all rows",
							render => {
								rowActionNotDisabledInActionColumn(
									render.wrapper,
									IR_ATTACHMENT_COLLECTION.BUTTONS.ID_DOWNLOAD + "-2"
								);
								rowActionNotDisabledInContextMenu(
									render.wrapper,
									`${IR_ATTACHMENT_COLLECTION.COLUMNS.ID_DOWNLOAD}-bodycell-1`,
									IR_ATTACHMENT_COLLECTION.LIST_ITEMS.ID_DOWNLOAD + "-2"
								);
							}
						);

						describeIndependentTests &&
							it("overrules the entry for this row if its attachment is unassigned", () => {
								const withUnassigned = setupTest({
									disabled: false,
									document: documents.documentWith3Rows,
									enablementMap: createEnablementMap({
										entry: { [0]: { disabled: true }, [2]: { disabled: false } }
									}),
									unassigned: ["2"]
								});

								rowActionDisabledInActionColumn(
									withUnassigned,
									IR_ATTACHMENT_COLLECTION.BUTTONS.ID_DOWNLOAD + "-2"
								);
								rowActionDisabledInContextMenu(
									withUnassigned,
									`${IR_ATTACHMENT_COLLECTION.COLUMNS.ID_DOWNLOAD}-bodycell-1`,
									IR_ATTACHMENT_COLLECTION.LIST_ITEMS.ID_DOWNLOAD + "-2"
								);
							});
					});
				});
			});
		}

		function executeTestForDetachedRepeatButtons(): void {
			const drWrappers: any = setupFixture(() => {
				const enabledEngine = setupForDetachedRepeat({
					document: documents.documentWith3Rows,
					models,
					disabled: false
				});

				const disabledEngine = setupForDetachedRepeat({
					document: documents.documentWith3Rows,
					models,
					disabled: true
				});

				const readonlyEnabledEngine = setupForDetachedRepeat({
					document: documents.documentWith3Rows,
					models,
					readonly: true
				});
				const readonlyDisabledEngine = setupForDetachedRepeat({
					document: documents.documentWith3Rows,
					models,
					readonly: true,
					disabled: true
				});
				const enabledEngineWithMap = setupForDetachedRepeat({
					document: documents.documentWith3Rows,
					models,
					disabled: false,
					enablementMap: createEnablementMap({ entry: { [2]: { disabled: true } } })
				});
				const disabledEngineWithMap = setupForDetachedRepeat({
					document: documents.documentWith3Rows,
					models,
					disabled: true,
					enablementMap: createEnablementMap({ entry: { [2]: { disabled: false } } })
				});
				const readonlyEngineWithMap = setupForDetachedRepeat({
					document: documents.documentWith3Rows,
					models,
					readonly: true,
					enablementMap: createEnablementMap({ entry: { [2]: { disabled: true } } })
				});
				const readonlyDisabledEngineWithMap = setupForDetachedRepeat({
					document: documents.documentWith3Rows,
					models,
					readonly: true,
					disabled: true,
					enablementMap: createEnablementMap({ entry: { [2]: { disabled: false } } })
				});

				return {
					enabledEngine,
					disabledEngine,
					readonlyDisabledEngine,
					readonlyDisabledEngineWithMap,
					readonlyEnabledEngine,
					readonlyEngineWithMap,
					disabledEngineWithMap,
					enabledEngineWithMap
				};
			});
			describe("if the form is disabled", () => {
				describe("and no entry in the enablement map for any button exists", () => {
					describeIndependentTests &&
						it("renders a disabled commit and cancel button", () => {
							rowActionDisabledInActionColumn(
								drWrappers.disabledEngine,
								DR_ROW_ACTIONS.BUTTONS.ID_CANCEL
							);
							rowActionDisabledInActionColumn(
								drWrappers.disabledEngine,
								DR_ROW_ACTIONS.BUTTONS.ID_COMMIT
							);
						});

					describeIndependentTests &&
						it("renders a disabled return button if the engine is also readonly", () => {
							rowActionDisabledInActionColumn(
								drWrappers.readonlyDisabledEngine,
								DR_ROW_ACTIONS.BUTTONS.ID_RETURN
							);
						});
				});

				describe("and an entry with 'disabled=false' in the enablement map for the buttons exists", () => {
					describeIndependentTests &&
						it("renders an enabled commit and cancel button", () => {
							rowActionNotDisabledInActionColumn(
								drWrappers.disabledEngineWithMap,
								DR_ROW_ACTIONS.BUTTONS.ID_CANCEL
							);
							rowActionNotDisabledInActionColumn(
								drWrappers.disabledEngineWithMap,
								DR_ROW_ACTIONS.BUTTONS.ID_COMMIT
							);
						});

					describeIndependentTests &&
						it("renders an enabled return button if the engine is also readonly", () => {
							rowActionNotDisabledInActionColumn(
								drWrappers.readonlyDisabledEngineWithMap,
								DR_ROW_ACTIONS.BUTTONS.ID_RETURN
							);
						});
				});
			});

			describe("if the form is not disabled", () => {
				describe("and no entry in the enablement map for any button exists", () => {
					describeIndependentTests &&
						it("renders an enabled commit and cancel button", () => {
							rowActionNotDisabledInActionColumn(
								drWrappers.enabledEngine,
								DR_ROW_ACTIONS.BUTTONS.ID_CANCEL
							);
							rowActionNotDisabledInActionColumn(
								drWrappers.enabledEngine,
								DR_ROW_ACTIONS.BUTTONS.ID_COMMIT
							);
						});

					describeIndependentTests &&
						it("renders an enabled return button if the engine is also readonly", () => {
							rowActionNotDisabledInActionColumn(
								drWrappers.readonlyEnabledEngine,
								DR_ROW_ACTIONS.BUTTONS.ID_RETURN
							);
						});
				});

				describe("and an entry with 'disabled=true' in the enablement map for the button exists", () => {
					describeIndependentTests &&
						it("renders a disabled commit and cancel button", () => {
							rowActionDisabledInActionColumn(
								drWrappers.enabledEngineWithMap,
								DR_ROW_ACTIONS.BUTTONS.ID_CANCEL
							);
							rowActionDisabledInActionColumn(
								drWrappers.enabledEngineWithMap,
								DR_ROW_ACTIONS.BUTTONS.ID_COMMIT
							);
						});

					describeIndependentTests &&
						it("renders a disabled return button if the engine is also readonly", () => {
							rowActionDisabledInActionColumn(
								drWrappers.readonlyEngineWithMap,
								DR_ROW_ACTIONS.BUTTONS.ID_RETURN
							);
						});
				});

				describe("and the option 'detachedRepeatCommitButtonEnablement' is not set", () => {
					describe("and no entry in the enablement map for any button exists", () => {
						describeIndependentTests &&
							it("renders an enabled commit and cancel button", () => {
								rowActionNotDisabledInActionColumn(
									drWrappers.enabledEngine,
									DR_ROW_ACTIONS.BUTTONS.ID_CANCEL
								);
								rowActionNotDisabledInActionColumn(
									drWrappers.enabledEngine,
									DR_ROW_ACTIONS.BUTTONS.ID_COMMIT
								);
							});

						describeIndependentTests &&
							it("renders an enabled return button if the engine is also readonly", () => {
								rowActionNotDisabledInActionColumn(
									drWrappers.readonlyEnabledEngine,
									DR_ROW_ACTIONS.BUTTONS.ID_RETURN
								);
							});
					});

					describe("and an entry with 'disabled=true' in the enablement map for the button exists", () => {
						describeIndependentTests &&
							it("renders a disabled commit and cancel button", () => {
								rowActionDisabledInActionColumn(
									drWrappers.enabledEngineWithMap,
									DR_ROW_ACTIONS.BUTTONS.ID_CANCEL
								);
								rowActionDisabledInActionColumn(
									drWrappers.enabledEngineWithMap,
									DR_ROW_ACTIONS.BUTTONS.ID_COMMIT
								);
							});

						describeIndependentTests &&
							it("renders a disabled return button if the engine is also readonly", () => {
								rowActionDisabledInActionColumn(
									drWrappers.readonlyEngineWithMap,
									DR_ROW_ACTIONS.BUTTONS.ID_RETURN
								);
							});
					});
				});

				describe("and the option 'detachedRepeatCommitButtonEnablement' is set to 'disabled'", () => {
					let adaptedModels: Models;
					before(() => {
						adaptedModels = {
							...models,
							formModel: {
								...models.formModel,
								content: {
									...models.formModel.content,
									detachedRepeatCommitButtonEnablement: "DISABLED"
								}
							}
						};
					});

					describe("and the data on the screen did not change yet", () => {
						describe("and no entry in the enablement map exists", () => {
							const wrapper = () =>
								setupForDetachedRepeat({
									document: documents.documentWith3Rows,
									models: adaptedModels,
									documentDirty: true // Set this option to be sure that this dirty state is not taken into account
								});

							describeIndependentTests &&
								it("renders a disabled commit button", () => {
									rowActionDisabledInActionColumn(wrapper(), DR_ROW_ACTIONS.BUTTONS.ID_COMMIT);
								});

							describeIndependentTests &&
								it("renders an enabled cancel button", () => {
									rowActionNotDisabledInActionColumn(wrapper(), DR_ROW_ACTIONS.BUTTONS.ID_CANCEL);
								});
						});

						describe("and an entry with disabled=false in the enablement map exists", () => {
							describeIndependentTests &&
								it("renders an enabled commit button", () => {
									const wrapper = setupForDetachedRepeat({
										document: documents.documentWith3Rows,
										models: adaptedModels,
										enablementMap: createEnablementMap({ entry: { [2]: { disabled: false } } })
									});
									rowActionNotDisabledInActionColumn(wrapper, DR_ROW_ACTIONS.BUTTONS.ID_COMMIT);
								});
						});
					});

					describe("and the data on the screen changed", () => {
						describe("and no entry in the enablement map exists", () => {
							describeIndependentTests &&
								it("renders an enabled commit button", () => {
									const wrapper = setupForDetachedRepeat({
										document: documents.documentWith3Rows,
										models: adaptedModels,
										screenDirty: true
									});
									rowActionNotDisabledInActionColumn(wrapper, DR_ROW_ACTIONS.BUTTONS.ID_COMMIT);
								});
						});

						describe("and an entry with disabled=true in the enablement map exists", () => {
							describeIndependentTests &&
								it("renders a disabled commit button", () => {
									const wrapper = setupForDetachedRepeat({
										document: documents.documentWith3Rows,
										models: adaptedModels,
										screenDirty: true,
										enablementMap: createEnablementMap({ entry: { [2]: { disabled: true } } })
									});
									rowActionDisabledInActionColumn(wrapper, DR_ROW_ACTIONS.BUTTONS.ID_COMMIT);
								});
						});
					});
				});
			});
		}
	};
}

function SetupTest(models: Models) {
	return function (options: {
		disabled: boolean;
		readonly?: boolean;
		enablementMap?: EnablementByRow;
		screenLocation?: EngineStore.ScreenState;
		document?: object;
		unassigned?: string[];
	}): RtlRenderWrapper {
		const screenLocation: EngineStore.ScreenState[] = [
			{
				locationPath: createModelPath("rowActionButtons"),
				path: []
			}
		];

		if (options.screenLocation) {
			screenLocation.push(options.screenLocation);
		}

		return setupFormEngineRendererWithRtl({
			models,
			data: {
				document: options.document ?? {},
				attachmentState: { unassigned: options.unassigned }
			},
			ui: {
				disabled: options.disabled,
				readonly: options.readonly,
				screenLocation
			},
			config: {
				enablements: { byRow: options.enablementMap }
			}
		});
	};
}

function CreateWrappers(setupTest: ReturnType<typeof SetupTest>, documents: Documents) {
	return function (options: { readonly?: boolean; disabledByScope?: boolean }): TestCaseFactory {
		const { readonly, disabledByScope } = options;

		const enabledEngine = () =>
			setupTest({
				disabled: false,
				readonly,
				document: documents.documentWith3Rows
			});
		const enabledEngineWithMapForRow2 = () =>
			setupTest({
				disabled: false,
				readonly,
				document: documents.documentWith3Rows,
				enablementMap: createEnablementMap({ entry: { [2]: { disabled: !disabledByScope } } })
			});
		const enabledEngineWithMapForAllRows = () =>
			setupTest({
				disabled: false,
				readonly,
				document: documents.documentWith3Rows,
				enablementMap: createEnablementMap({ entry: { [0]: { disabled: !disabledByScope } } })
			});
		const enabledEngineWithMapForAllRowsAndRow2 = () =>
			setupTest({
				disabled: false,
				readonly,
				document: documents.documentWith3Rows,
				enablementMap: createEnablementMap({
					entry: { [0]: { disabled: !disabledByScope }, [2]: { disabled: !!disabledByScope } }
				})
			});

		const disabledEngine = () =>
			setupTest({
				disabled: true,
				readonly,
				document: documents.documentWith3Rows
			});
		const disabledEngineWithMapForRow2 = () =>
			setupTest({
				disabled: true,
				readonly,
				document: documents.documentWith3Rows,
				enablementMap: createEnablementMap({ entry: { [2]: { disabled: false } } })
			});
		const disabledEngineWithMapForAllRows = () =>
			setupTest({
				disabled: true,
				readonly,
				document: documents.documentWith3Rows,
				enablementMap: createEnablementMap({ entry: { [0]: { disabled: false } } })
			});
		const disabledEngineWithMapForAllRowsAndRow2 = () =>
			setupTest({
				disabled: true,
				readonly,
				document: documents.documentWith3Rows,
				enablementMap: createEnablementMap({
					entry: { [0]: { disabled: false }, [2]: { disabled: true } }
				})
			});

		const engineWithMaxRepDocuments = () =>
			setupTest({
				disabled: false,
				readonly,
				document: documents.documentWithMaxRep
			});
		const disabledEngineWithMaxRepDocumentsAndMapForRow2 = () =>
			setupTest({
				disabled: true,
				readonly,
				document: documents.documentWithMaxRep,
				enablementMap: createEnablementMap({ entry: { [2]: { disabled: false } } })
			});
		const disabledEngineWithMaxRepDocumentsAndMapForAllRows = () =>
			setupTest({
				disabled: true,
				readonly,
				document: documents.documentWithMaxRep,
				enablementMap: createEnablementMap({ entry: { [0]: { disabled: false } } })
			});

		return {
			enabledEngine,
			enabledEngineWithMapForAllRows,
			enabledEngineWithMapForRow2,
			enabledEngineWithMapForAllRowsAndRow2,
			disabledEngine,
			disabledEngineWithMapForAllRows,
			disabledEngineWithMapForRow2,
			disabledEngineWithMapForAllRowsAndRow2,
			engineWithMaxRepDocuments,
			disabledEngineWithMaxRepDocumentsAndMapForRow2,
			disabledEngineWithMaxRepDocumentsAndMapForAllRows
		};
	};
}
