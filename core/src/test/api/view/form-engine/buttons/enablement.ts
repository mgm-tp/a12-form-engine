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

import { ok, strictEqual } from "node:assert/strict";

import type { Models } from "../../../../../back-end/store/index.js";
import type { EnablementByButtonName } from "../../../../../view/internal/configuration/engine-configuration.js";
import { createDocumentPath } from "../../../../utils/createDocumentPath.js";
import { createModelPath } from "../../../../utils/createModelPath.js";
import { DE_LOCALE } from "../../../../utils/localization.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";
import { BUTTONS } from "../../../../utils/test-model-helpers/button.form.js";
import { setupFormEngineRendererWithRtl } from "../../../../utils/setup.js";

import { triggerProps } from "./trigger.js";

export function testEnablement(params: {
	models: Models;
	enablementModels: Models;
	drId: string;
	alwaysId: string;
	alwaysName: string;
	hiddenRoId: string;
	hiddenRoName: string;
	disabledRoId: string;
	disabledRoName: string;
	hiddenEditId: string;
	hiddenEditName: string;
	disabledEditId: string;
	disabledEditName: string;
	buttonType?: "menuItem" | "navigationButton";
}): void {
	const {
		models,
		enablementModels,
		drId,
		alwaysId,
		alwaysName,
		hiddenRoId,
		hiddenRoName,
		disabledRoId,
		disabledRoName,
		hiddenEditId,
		hiddenEditName,
		disabledEditId,
		disabledEditName,
		buttonType
	} = params;

	const menuItem = buttonType === "menuItem";
	const getProps = triggerProps(menuItem);
	const itLabel = menuItem ? "item" : "button";

	describe("enablement", () => {
		const enablementMapModels = setupModelsFixture("test.custom-button-enablements");

		it(`renders ${
			buttonType ? "a disabled" : "an enabled"
		} ${itLabel}, when a detached repeat detail screen is open`, () => {
			const { widgetMap } = setupFormEngineRendererWithRtl({
				models,
				locale: DE_LOCALE,
				data: {},
				ui: {
					screenLocation: [
						{
							path: createDocumentPath(),
							locationPath: createModelPath(BUTTONS.screen1)
						},
						{
							path: BUTTONS.groupDocumentPath,
							locationPath: BUTTONS.detachedRepeatDetailScreen
						}
					]
				}
			});
			const button = getProps(widgetMap)(drId);
			ok(button?.disabled === !!buttonType);
		});

		describe("if the form-engine is", () => {
			describe("disabled", () => {
				it(`renders a disabled ${itLabel}, when no entry in the enablement map exists`, () => {
					setupAndTest({
						models: enablementMapModels,
						formEngineDisabled: true,
						menuItem,
						buttonId: hiddenRoId,
						expectedToBeDisabled: true
					});
				});

				it(`renders an enabled ${itLabel}, when an entry in the enablement map for this ${itLabel} exists with disabled=false`, () => {
					setupAndTest({
						models: enablementMapModels,
						formEngineDisabled: true,
						menuItem,
						buttonId: hiddenRoId,
						enablementMap: { [hiddenRoName]: { disabled: false } },
						expectedToBeDisabled: false
					});
				});
			});

			describe("enabled", () => {
				describe("readonly", () => {
					describe(`and the ${itLabel} has scope === 'ALWAYS'`, () => {
						it(`renders an enabled ${itLabel} if no entry in the enablement map exists`, () => {
							setupAndTest({
								models: enablementMapModels,
								formEngineReadonly: true,
								menuItem,
								buttonId: alwaysId,
								expectedToBeHidden: false,
								expectedToBeDisabled: false
							});
						});

						it(`doesn't render the ${itLabel} if an entry with hidden === true exists in the " +
								"enablement map for this ${itLabel}`, () => {
							setupAndTest({
								models: enablementMapModels,
								formEngineReadonly: true,
								menuItem,
								buttonId: alwaysId,
								enablementMap: { [alwaysName]: { hidden: true } },
								expectedToBeHidden: true
							});
						});

						it(`renders a disabled ${itLabel} if an entry with disabled === true exists in the " +
								"enablement map for this ${itLabel}`, () => {
							setupAndTest({
								models: enablementMapModels,
								formEngineReadonly: true,
								menuItem,
								buttonId: alwaysId,
								enablementMap: { [alwaysName]: { disabled: true } },
								expectedToBeHidden: false,
								expectedToBeDisabled: true
							});
						});
					});

					describe(`and the ${itLabel} has scope === 'HIDDEN_IN_READONLY_MODE'`, () => {
						it(`doesn't render the ${itLabel} if no entry in the enablement map exists`, () => {
							setupAndTest({
								models: enablementMapModels,
								formEngineReadonly: true,
								menuItem,
								buttonId: hiddenRoId,
								expectedToBeHidden: true
							});
						});

						it(
							`renders an enabled ${itLabel} if an entry with hidden === false exists in the ` +
								`enablement map for this ${itLabel}`,
							() => {
								setupAndTest({
									models: enablementMapModels,
									formEngineReadonly: true,
									menuItem,
									buttonId: hiddenRoId,
									enablementMap: { [hiddenRoName]: { hidden: false } },
									expectedToBeHidden: false,
									expectedToBeDisabled: false
								});
							}
						);

						it(
							`renders a disabled ${itLabel} if an entry with hidden === false and disabled === true ` +
								`exists in the enablement map for this ${itLabel}`,
							() => {
								setupAndTest({
									models: enablementMapModels,
									formEngineReadonly: true,
									menuItem,
									buttonId: hiddenRoId,
									enablementMap: {
										[hiddenRoName]: {
											hidden: false,
											disabled: true
										}
									},
									expectedToBeHidden: false,
									expectedToBeDisabled: true
								});
							}
						);
					});

					describe(`and the ${itLabel} has scope === 'DISABLED_IN_READONLY_MODE'`, () => {
						it(`renders a disabled ${itLabel} if no entry in the enablement map exists`, () => {
							setupAndTest({
								models: enablementMapModels,
								formEngineReadonly: true,
								menuItem,
								buttonId: disabledRoId,
								expectedToBeHidden: false,
								expectedToBeDisabled: true
							});
						});

						it(
							`doesn't render the ${itLabel} if an entry with hidden === true exists in the ` +
								`enablement map for this ${itLabel}`,
							() => {
								setupAndTest({
									models: enablementMapModels,
									formEngineReadonly: true,
									menuItem,
									buttonId: disabledRoId,
									enablementMap: {
										[disabledRoName]: { hidden: true }
									},
									expectedToBeHidden: true
								});
							}
						);

						it(
							`renders an enabled ${itLabel} if an entry with disabled === false exists in the ` +
								`enablement map for this ${itLabel}`,
							() => {
								setupAndTest({
									models: enablementMapModels,
									formEngineReadonly: true,
									menuItem,
									buttonId: disabledRoId,
									enablementMap: {
										[disabledRoName]: { disabled: false }
									},
									expectedToBeHidden: false,
									expectedToBeDisabled: false
								});
							}
						);
					});
				});

				describe("not readonly", () => {
					describe(`and the ${itLabel} has scope === 'ALWAYS'`, () => {
						it(`renders an enabled ${itLabel} if no entry in the enablement map exists`, () => {
							setupAndTest({
								models: enablementMapModels,
								menuItem,
								buttonId: alwaysId,
								expectedToBeHidden: false,
								expectedToBeDisabled: false
							});
						});

						it(
							`doesn't render the ${itLabel} if an entry with hidden === true exists in the ` +
								`enablement map for this ${itLabel}`,
							() => {
								setupAndTest({
									models: enablementMapModels,
									menuItem,
									buttonId: alwaysId,
									enablementMap: { [alwaysName]: { hidden: true } },
									expectedToBeHidden: true
								});
							}
						);

						it(
							`renders a disabled ${itLabel} if an entry with disabled === true exists in the ` +
								`enablement map for this ${itLabel}`,
							() => {
								setupAndTest({
									models: enablementMapModels,
									menuItem,
									buttonId: alwaysId,
									enablementMap: {
										[alwaysName]: { disabled: true }
									},
									expectedToBeHidden: false,
									expectedToBeDisabled: true
								});
							}
						);
					});

					describe(`and the ${itLabel} has scope === 'HIDDEN_IN_EDIT_MODE'`, () => {
						it(`doesn't render the ${itLabel} if no entry in the enablement map exists`, () => {
							setupAndTest({
								models: enablementMapModels,
								menuItem,
								buttonId: hiddenEditId,
								expectedToBeHidden: true
							});
						});

						it(
							`renders an enabled ${itLabel} if an entry with hidden === false exists in the ` +
								`enablement map for this ${itLabel}`,
							() => {
								setupAndTest({
									models: enablementMapModels,
									menuItem,
									buttonId: hiddenEditId,
									enablementMap: {
										[hiddenEditName]: { hidden: false }
									},
									expectedToBeHidden: false,
									expectedToBeDisabled: false
								});
							}
						);

						it(
							`renders a disabled ${itLabel} if an entry with hidden === false and disabled === true ` +
								`exists in the enablement map for this ${itLabel}`,
							() => {
								setupAndTest({
									models: enablementMapModels,
									menuItem,
									buttonId: hiddenEditId,
									enablementMap: {
										[hiddenEditName]: {
											hidden: false,
											disabled: true
										}
									},
									expectedToBeHidden: false,
									expectedToBeDisabled: true
								});
							}
						);
					});

					describe(`and the ${itLabel} has scope === 'DISABLED_IN_EDIT_MODE'`, () => {
						it(`renders a disabled ${itLabel} if no entry in the enablement map exists`, () => {
							setupAndTest({
								models: enablementMapModels,
								menuItem,
								buttonId: disabledEditId,
								expectedToBeHidden: false,
								expectedToBeDisabled: true
							});
						});

						it(
							`doesn't render the ${itLabel} if an entry with hidden === true exists in the ` +
								`enablement map for this ${itLabel}`,
							() => {
								setupAndTest({
									models: enablementMapModels,
									menuItem,
									buttonId: disabledEditId,
									enablementMap: {
										[disabledEditName]: { hidden: true }
									},
									expectedToBeHidden: true
								});
							}
						);

						it(
							`renders an enabled ${itLabel} if an entry with disabled === false exists in the ` +
								`enablement map for this ${itLabel}`,
							() => {
								setupAndTest({
									models: enablementMapModels,
									menuItem,
									buttonId: disabledEditId,
									enablementMap: {
										[disabledEditName]: { disabled: false }
									},
									expectedToBeHidden: false,
									expectedToBeDisabled: false
								});
							}
						);
					});
				});
			});
		});

		function setupAndTest(options: {
			models?: Models;
			buttonId: string;
			dataDirty?: boolean;
			uiDirty?: boolean;
			enablementMap?: EnablementByButtonName;
			formEngineDisabled?: boolean;
			formEngineReadonly?: boolean;
			expectedToBeDisabled?: boolean;
			expectedToBeHidden?: boolean;
			menuItem?: boolean;
		}): void {
			const {
				buttonId,
				enablementMap,
				formEngineDisabled,
				formEngineReadonly,
				models,
				expectedToBeDisabled,
				expectedToBeHidden,
				dataDirty,
				uiDirty,
				menuItem
			} = options;
			const { widgetMap } = setupFormEngineRendererWithRtl({
				models: models ?? enablementModels,
				data: { dirty: dataDirty },
				ui: { disabled: formEngineDisabled, readonly: formEngineReadonly, dirty: uiDirty },
				config: {
					enablements: enablementMap ? { byButtonName: enablementMap } : undefined
				}
			});

			const button = triggerProps(menuItem)(widgetMap)(buttonId);

			if (expectedToBeDisabled !== undefined) {
				strictEqual(button?.disabled, expectedToBeDisabled);
			}

			if (expectedToBeHidden === true) {
				strictEqual(button, undefined);
			} else if (expectedToBeHidden === false) {
				ok(button !== undefined);
			}
		}
	});
}
