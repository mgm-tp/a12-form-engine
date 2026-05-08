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

import { deepStrictEqual } from "node:assert/strict";
import { mock } from "node:test";

import { act } from "react";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { query } from "@com.mgmtp.a12.devtools/react";
import type { Message } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type { Localizable } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type { EngineStore } from "../../../../../../back-end/store/internal/store.js";
import type { ReadonlyObjectMap } from "../../../../../../models/index.js";
import type { InputPropsType } from "../../../../../../view/internal/configuration/componentMap/input/input.js";
import { DefaultInputMap } from "../../../../../../view/internal/configuration/componentMap/input/input.js";
import { ControlInputMock } from "../../../../../rtl-utils/getInputMocks.js";
import { DocumentHelpers } from "../../../../../utils/document-helpers.js";
import { SetupHelpers } from "../../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../../utils/setupFixture.js";
import {
	CONTROLS,
	createDocumentForControlsModels,
	locationStackForControlsModel
} from "../../../../../utils/test-model-helpers/controls.js";
import { createValidationEntry } from "../../../../../utils/validation.js";

const { setupFormEngineRendererWithRtl } = SetupHelpers;
const { createDocumentPath } = DocumentHelpers;
export function executeTestForMessages(): void {
	const controls = setupModelsFixture("controls");

	describe("rendered text", () => {
		describeTests("ERROR");

		describeTests("WARNING");

		describeTests("INFO");
	});

	function describeTests(severity: Message.Severity): void {
		function setup(
			options: {
				locationPath?: ModelPath;
				repeatInstanceState?: ReadonlyObjectMap<EngineStore.Repeat.InstanceState>;
				withWidgets?: true;
			} = {}
		) {
			const value_L0_backup = 100;
			const value_L0_document = 200;
			const value_L1 = 300;

			const document = createDocumentForControlsModels({
				L0_Number: value_L0_document,
				L1_Number: value_L1
			});
			const backupDocument = createDocumentForControlsModels({ L0_Number: value_L0_backup });
			const repeatPath = createDocumentPath([CONTROLS.ROOT], [CONTROLS.repeatableGroup, 1]);

			const l0NumberFieldPath = createDocumentPath([CONTROLS.ROOT], [CONTROLS.L0_Number]);
			const l1NumberPath = [...repeatPath, ...createDocumentPath(["L1_Number"])];

			const L0_Error_Localizables = [
				{
					key: "foo",
					defaults: { en: "L0 error" }
				}
			];

			const L1_Error_Localizables = [
				{
					key: "foo",
					defaults: { en: "L1 error" }
				}
			];

			function assertMessage(
				componentMock: React.ComponentType<InputPropsType>,
				componentUiId: string,
				message: Localizable[]
			) {
				const element = query(componentMock).withProp("uiId", componentUiId).props();
				const validationMessages = element["validationMessages"];
				if (severity === "ERROR") {
					deepStrictEqual(validationMessages.errors, [message]);
				} else if (severity === "WARNING") {
					deepStrictEqual(validationMessages.warnings, [message]);
				} else {
					deepStrictEqual(validationMessages.infos, [message]);
				}
			}

			const inputMap = {
				...DefaultInputMap,
				Input: mock.fn(ControlInputMock)
			};

			const wrapper = setupFormEngineRendererWithRtl({
				models: controls,
				data: { document },
				inputMap,
				withWidgets: options.withWidgets,
				ui: {
					messages: {
						...createValidationEntry({
							path: l0NumberFieldPath,
							type: severity,
							errorText: L0_Error_Localizables
						}),
						...createValidationEntry({
							path: l1NumberPath,
							type: severity,
							errorText: L1_Error_Localizables
						})
					},
					backup: [
						{
							document: backupDocument,
							messages: {
								...createValidationEntry({
									path: l0NumberFieldPath,
									type: severity,
									errorText: [
										{
											key: "foo",
											defaults: { en: "backup error" }
										}
									]
								})
							}
						}
					],
					screenLocation: locationStackForControlsModel(options)
				}
			});

			return {
				...wrapper,
				L0_Error_Localizables,
				L1_Error_Localizables,
				assertMessage,
				inputMap
			};
		}

		describe(severity, () => {
			describe("when the control is located in a top-level screen", () => {
				it("reads the error from the state", () => {
					const { inputMap, assertMessage, L0_Error_Localizables } = setup();

					assertMessage(inputMap.Input, CONTROLS.ID_L0_NUMBER, L0_Error_Localizables);
				});
			});

			describe("when the control is located in an embedded-repeat detail control-grid", () => {
				describe("and the referenced field is inside the repeatable group", () => {
					it("reads the error correctly from the state", async () => {
						const { inputMap, assertMessage, L1_Error_Localizables } = await act(() =>
							setup({
								repeatInstanceState: {
									[ModelPath.toString(CONTROLS.er_locationPath)]: {
										expandedRowPath: createDocumentPath(
											[CONTROLS.ROOT],
											[CONTROLS.repeatableGroup, 1]
										)
									}
								},
								withWidgets: true
							})
						);

						assertMessage(inputMap.Input, CONTROLS.ID_L1_NUMBER_IN_ER, L1_Error_Localizables);
					});

					describe("and the referenced field is outside the repeatable group", () => {
						it("reads the error correctly from the state", async () => {
							const { inputMap, assertMessage, L0_Error_Localizables } = await act(() =>
								setup({
									repeatInstanceState: {
										[ModelPath.toString(CONTROLS.er_locationPath)]: {
											expandedRowPath: createDocumentPath(
												[CONTROLS.ROOT],
												[CONTROLS.repeatableGroup, 1]
											)
										}
									},
									withWidgets: true
								})
							);

							assertMessage(inputMap.Input, CONTROLS.ID_L0_NUMBER_IN_ER, L0_Error_Localizables);
						});
					});
				});

				describe("when the control is located in a detached-repeat detail-screen", () => {
					describe("and the referenced field is inside the repeatable group", () => {
						it("reads the error correctly from the state", () => {
							const { inputMap, assertMessage, L1_Error_Localizables } = setup({
								locationPath: CONTROLS.dr_locationPath
							});

							assertMessage(inputMap.Input, CONTROLS.ID_L1_NUMBER_IN_DR, L1_Error_Localizables);
						});
					});

					describe("and the referenced field is outside the repeatable group", () => {
						it("reads the error correctly from the state", () => {
							const { inputMap, assertMessage, L0_Error_Localizables } = setup({
								locationPath: CONTROLS.dr_locationPath
							});

							assertMessage(inputMap.Input, CONTROLS.ID_L0_NUMBER_IN_DR, L0_Error_Localizables);
						});
					});
				});
			});
		});
	}
}
