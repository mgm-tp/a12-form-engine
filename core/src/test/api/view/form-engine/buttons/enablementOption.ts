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

import { strictEqual } from "node:assert/strict";

import { query } from "@com.mgmtp.a12.devtools/react";

import type { Models } from "../../../../../back-end/store/index.js";
import type { EnablementByButtonName } from "../../../../../view/internal/configuration/engine-configuration.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { BUTTON_ENABLEMENT } from "../../../../utils/test-model-helpers/buttons.enablement.js";

const { setupFormEngineRendererWithRtl } = SetupHelpers;

export function testEnablementOption(params: { models: Models }): void {
	const { models } = params;

	describe("button option 'enablement'", () => {
		describe("if the form engine is enabled", () => {
			describe("and the option 'enablement' of the button is not set", () => {
				it("renders an enabled button, when no entry in the enablement map exists", () => {
					setupAndTest({
						buttonId: BUTTON_ENABLEMENT.DIRTY_STATE.BUTTON_ALWAYS_SHOWN,
						expectedToBeDisabled: false
					});
				});
				it("renders a disabled button, when an entry in the enablement map for this button exists with disabled=true", () => {
					setupAndTest({
						buttonId: BUTTON_ENABLEMENT.DIRTY_STATE.BUTTON_ALWAYS_SHOWN,
						expectedToBeDisabled: true,
						enablementMap: {
							[BUTTON_ENABLEMENT.DIRTY_STATE.BUTTON_ALWAYS_SHOWN_NAME]: { disabled: true }
						}
					});
				});
			});

			describe("and the option 'enablement' of the button is set to 'disabled'", () => {
				describe("and neither the ui state nor the data is dirty", () => {
					describe("and no entry in the enablement map exists", () => {
						it("renders the button as disabled", () => {
							setupAndTest({
								buttonId: BUTTON_ENABLEMENT.DIRTY_STATE.BUTTON_DISABLED,
								expectedToBeDisabled: true
							});
						});
					});

					describe("and an entry with disabled=false in the enablement map exists", () => {
						it("renders the button as enabled", () => {
							setupAndTest({
								buttonId: BUTTON_ENABLEMENT.DIRTY_STATE.BUTTON_DISABLED,
								expectedToBeDisabled: false,
								enablementMap: {
									[BUTTON_ENABLEMENT.DIRTY_STATE.BUTTON_DISABLED_NAME]: { disabled: false }
								}
							});
						});
					});
				});

				describe("and the data is dirty", () => {
					describe("and no entry in the enablement map exists", () => {
						it("renders the button as enabled", () => {
							setupAndTest({
								buttonId: BUTTON_ENABLEMENT.DIRTY_STATE.BUTTON_DISABLED,
								dataDirty: true,
								expectedToBeDisabled: false
							});
						});
					});

					describe("and an entry with disabled=true in the enablement map exists", () => {
						it("renders the button as disabled", () => {
							setupAndTest({
								buttonId: BUTTON_ENABLEMENT.DIRTY_STATE.BUTTON_DISABLED,
								dataDirty: true,
								expectedToBeDisabled: true,
								enablementMap: {
									[BUTTON_ENABLEMENT.DIRTY_STATE.BUTTON_DISABLED_NAME]: { disabled: true }
								}
							});
						});
					});
				});

				describe("and the ui state is dirty", () => {
					describe("and no entry in the enablement map exists", () => {
						it("renders the button as enabled", () => {
							setupAndTest({
								buttonId: BUTTON_ENABLEMENT.DIRTY_STATE.BUTTON_DISABLED,
								uiDirty: true,
								expectedToBeDisabled: false
							});
						});
					});

					describe("and an entry with disabled=true in the enablement map exists", () => {
						it("renders the button as disabled", () => {
							setupAndTest({
								buttonId: BUTTON_ENABLEMENT.DIRTY_STATE.BUTTON_DISABLED,
								uiDirty: true,
								expectedToBeDisabled: true,
								enablementMap: {
									[BUTTON_ENABLEMENT.DIRTY_STATE.BUTTON_DISABLED_NAME]: { disabled: true }
								}
							});
						});
					});
				});
			});

			describe("and the option 'enablement' of the button is set to 'hidden'", () => {
				describe("and neither the ui state nor the data is dirty", () => {
					describe("and no entry in the enablement map exists", () => {
						it("does not render the button", () => {
							setupAndTest({
								buttonId: BUTTON_ENABLEMENT.DIRTY_STATE.BUTTON_HIDDEN,
								expectedToBeHidden: true
							});
						});
					});

					describe("and an entry with hidden=false in the enablement map exists", () => {
						it("renders the button", () => {
							setupAndTest({
								buttonId: BUTTON_ENABLEMENT.DIRTY_STATE.BUTTON_HIDDEN,
								expectedToBeHidden: false,
								enablementMap: {
									[BUTTON_ENABLEMENT.DIRTY_STATE.BUTTON_HIDDEN_NAME]: { hidden: false }
								}
							});
						});
					});
				});

				describe("and the data is dirty", () => {
					describe("and no entry in the enablement map exists", () => {
						it("renders the button", () => {
							setupAndTest({
								buttonId: BUTTON_ENABLEMENT.DIRTY_STATE.BUTTON_HIDDEN,
								dataDirty: true,
								expectedToBeHidden: false
							});
						});
					});

					describe("and an entry with hidden=true in the enablement map exists", () => {
						it("does not render the button", () => {
							setupAndTest({
								buttonId: BUTTON_ENABLEMENT.DIRTY_STATE.BUTTON_HIDDEN,
								dataDirty: true,
								expectedToBeHidden: true,
								enablementMap: {
									[BUTTON_ENABLEMENT.DIRTY_STATE.BUTTON_HIDDEN_NAME]: { hidden: true }
								}
							});
						});
					});

					describe("and the ui state is dirty", () => {
						describe("and no entry in the enablement map exists", () => {
							it("renders the button", () => {
								setupAndTest({
									buttonId: BUTTON_ENABLEMENT.DIRTY_STATE.BUTTON_HIDDEN,
									uiDirty: true,
									expectedToBeHidden: false
								});
							});
						});

						describe("and an entry with hidden=true in the enablement map exists", () => {
							it("does not render the button", () => {
								setupAndTest({
									buttonId: BUTTON_ENABLEMENT.DIRTY_STATE.BUTTON_HIDDEN,
									uiDirty: true,
									expectedToBeHidden: true,
									enablementMap: {
										[BUTTON_ENABLEMENT.DIRTY_STATE.BUTTON_HIDDEN_NAME]: {
											hidden: true
										}
									}
								});
							});
						});
					});
				});
			});
		});
	});

	function setupAndTest(options: {
		buttonId: string;
		dataDirty?: boolean;
		uiDirty?: boolean;
		enablementMap?: EnablementByButtonName;
		expectedToBeDisabled?: boolean;
		expectedToBeHidden?: boolean;
	}): void {
		const {
			buttonId,
			enablementMap,
			expectedToBeDisabled,
			expectedToBeHidden,
			dataDirty,
			uiDirty
		} = options;
		const { widgetMap } = setupFormEngineRendererWithRtl({
			models,
			data: { dirty: dataDirty },
			ui: { dirty: uiDirty },
			config: {
				enablements: enablementMap ? { byButtonName: enablementMap } : undefined
			}
		});

		if (expectedToBeDisabled !== undefined) {
			const button = query(widgetMap.Button).withId(buttonId).props();
			strictEqual(button.disabled, expectedToBeDisabled);
		}
		if (expectedToBeHidden === true) {
			query(widgetMap.Button).withId(buttonId).assertNotRendered();
		} else if (expectedToBeHidden === false) {
			query(widgetMap.Button).withId(buttonId).assertRendered();
		}
	}
}
