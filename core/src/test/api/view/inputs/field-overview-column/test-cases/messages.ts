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

import { deepEqual, equal } from "node:assert/strict";

import { query } from "@com.mgmtp.a12.devtools/react";

import type { FormModel } from "../../../../../../models/index.js";
import { createDocumentPath } from "../../../../../utils/createDocumentPath.js";
import { setupModelsFixture } from "../../../../../utils/setupFixture.js";
import {
	CONTROLS,
	createDocumentForControlsModels,
	setupForControlsModel
} from "../../../../../utils/test-model-helpers/controls.js";
import type { RenderWithInputMap } from "../../../../../utils/test-model-helpers/render-with-inputmocks.js";
import {
	createDocumentForTooltipsModels,
	IDS,
	setupForTooltipsModel
} from "../../../../../utils/test-model-helpers/tooltips.js";
import { createValidationEntry } from "../../../../../utils/validation.js";

export function executeTestForFieldOverviewColumnMessages(): void {
	const controls = setupModelsFixture("controls");
	const tooltips = setupModelsFixture("controls.tooltips");

	const documentControls = createDocumentForControlsModels({
		L0_Number: CONTROLS.L0_NUMBER_VALUE,
		L1_Number: CONTROLS.L1_NUMBER_VALUE
	});
	const backupDocumentControls = createDocumentForControlsModels({
		L0_Number: CONTROLS.L0_NUMBER_VALUE_BACKUP
	});
	const repeatPath = createDocumentPath([CONTROLS.ROOT], [CONTROLS.repeatableGroup, 1]);

	const controlsNumberFieldPath = createDocumentPath([CONTROLS.ROOT], [CONTROLS.L0_Number]);
	const controlsRepeatNumberFieldPath = [
		...repeatPath,
		...createDocumentPath([CONTROLS.L1_Number])
	];

	const documentTooltips = createDocumentForTooltipsModels({
		NumberType: IDS.NUMBER_TYPE_VALUE,
		NumberTypeRepeat: IDS.NUMBER_TYPE_VALUE_REPEAT
	});
	const backupDocumentTooltips = createDocumentForTooltipsModels({
		NumberType: IDS.NUMBER_TYPE_VALUE_BACKUP
	});

	const controlsTooltipsNumberFieldPath = IDS.NUMBER_TYPE_PATH;
	const controlsTooltipsRepeatNumberFieldPath = IDS.NUMBER_TYPE_REPEAT_PATH;

	function setup(options: {
		errorType: "ERROR" | "WARNING" | "INFO";
		messageExposition?: FormModel.MessageExpositionPresentation;
	}): Promise<RenderWithInputMap> {
		const messages = {
			...createValidationEntry({
				path:
					options.messageExposition === "TOOLTIP"
						? controlsTooltipsNumberFieldPath
						: controlsNumberFieldPath,
				type: options.errorType,
				errorText: [
					{
						key: "foo",
						defaults: { en: "current error" }
					}
				]
			}),
			...createValidationEntry({
				path:
					options.messageExposition === "TOOLTIP"
						? controlsTooltipsRepeatNumberFieldPath
						: controlsRepeatNumberFieldPath,
				type: options.errorType,
				errorText: [
					{
						key: "foo",
						defaults: { en: "error" }
					}
				]
			})
		};

		const backupMessages = {
			...createValidationEntry({
				path:
					options.messageExposition === "TOOLTIP"
						? controlsTooltipsNumberFieldPath
						: controlsNumberFieldPath,
				type: options.errorType,
				errorText: [
					{
						key: "foo",
						defaults: { en: "backup error" }
					}
				]
			})
		};

		const setupForModel =
			options.messageExposition === "TOOLTIP" ? setupForTooltipsModel : setupForControlsModel;

		return setupForModel({
			models: options.messageExposition === "TOOLTIP" ? tooltips : controls,
			backupDocument:
				options.messageExposition === "TOOLTIP" ? backupDocumentTooltips : backupDocumentControls,
			document: options.messageExposition === "TOOLTIP" ? documentTooltips : documentControls,
			messages,
			backupMessages
		});
	}

	describe("messageExposition = none", () => {
		describe("Error", () => {
			describe("text", () => {
				describe("when the control is located in a top-level screen", () => {
					describe("and the referenced field is inside the repeatable group", () => {
						it("renders an input with the validation messages from the state and messageExposition undefined", async () => {
							const wrapper = await setup({ errorType: "ERROR" });
							const numberInput = query(wrapper.inputMap.NumberInput)
								.withProp("uiId", CONTROLS.ID_IR_L1_NUMBER)
								.props();
							deepEqual(numberInput.validationMessages, {
								errors: [[{ key: "foo", defaults: { en: "error" } }]],
								infos: [],
								warnings: []
							});
							equal(numberInput.modelElement.messageExposition, undefined);
						});
					});

					describe("and the referenced field is outside the repeatable group", () => {
						it("renders an input with the validation messages from the state and messageExposition undefined", async () => {
							const wrapper = await setup({ errorType: "ERROR" });
							const numberInput = query(wrapper.inputMap.NumberInput)
								.withProp("uiId", CONTROLS.ID_IR_L0_NUMBER)
								.props();
							deepEqual(numberInput.validationMessages, {
								errors: [[{ key: "foo", defaults: { en: "current error" } }]],
								infos: [],
								warnings: []
							});
							equal(numberInput.modelElement.messageExposition, undefined);
						});
					});
				});
			});
		});

		describe("Warning", () => {
			describe("text", () => {
				describe("when the control is located in a top-level screen", () => {
					describe("and the referenced field is inside the repeatable group", () => {
						it("renders an input with the validation messages from the state and messageExposition undefined", async () => {
							const wrapper = await setup({ errorType: "WARNING" });
							const numberInput = query(wrapper.inputMap.NumberInput)
								.withProp("uiId", CONTROLS.ID_IR_L1_NUMBER)
								.props();
							deepEqual(numberInput.validationMessages, {
								errors: [],
								infos: [],
								warnings: [[{ key: "foo", defaults: { en: "error" } }]]
							});
							equal(numberInput.modelElement.messageExposition, undefined);
						});
					});

					describe("and the referenced field is outside the repeatable group", () => {
						it("renders an input with the validation messages from the state and messageExposition undefined", async () => {
							const wrapper = await setup({ errorType: "WARNING" });
							const numberInput = query(wrapper.inputMap.NumberInput)
								.withProp("uiId", CONTROLS.ID_IR_L0_NUMBER)
								.props();
							deepEqual(numberInput.validationMessages, {
								errors: [],
								infos: [],
								warnings: [[{ key: "foo", defaults: { en: "current error" } }]]
							});
							equal(numberInput.modelElement.messageExposition, undefined);
						});
					});
				});
			});
		});

		describe("Info", () => {
			describe("text", () => {
				describe("when the control is located in a top-level screen", () => {
					describe("and the referenced field is inside the repeatable group", () => {
						it("renders an input with the validation messages from the state and messageExposition undefined", async () => {
							const wrapper = await setup({ errorType: "INFO" });
							const numberInput = query(wrapper.inputMap.NumberInput)
								.withProp("uiId", CONTROLS.ID_IR_L1_NUMBER)
								.props();
							deepEqual(numberInput.validationMessages, {
								errors: [],
								infos: [[{ key: "foo", defaults: { en: "error" } }]],
								warnings: []
							});
							equal(numberInput.modelElement.messageExposition, undefined);
						});
					});

					describe("and the referenced field is outside the repeatable group", () => {
						it("renders an input with the validation messages from the state and messageExposition undefined", async () => {
							const wrapper = await setup({ errorType: "INFO" });
							const numberInput = query(wrapper.inputMap.NumberInput)
								.withProp("uiId", CONTROLS.ID_IR_L0_NUMBER)
								.props();
							deepEqual(numberInput.validationMessages, {
								errors: [],
								infos: [[{ key: "foo", defaults: { en: "current error" } }]],
								warnings: []
							});
							equal(numberInput.modelElement.messageExposition, undefined);
						});
					});
				});
			});
		});
	});

	describe("messageExposition = TOOLTIP", () => {
		describe("Error", () => {
			describe("text", () => {
				describe("when the control is located in a top-level screen", () => {
					describe("and the referenced field is inside the repeatable group", () => {
						it("renders an input with the validation messages from the state and messageExposition 'TOOLTIP'", async () => {
							const wrapper = await setup({ errorType: "ERROR", messageExposition: "TOOLTIP" });
							const numberInput = query(wrapper.inputMap.NumberInput)
								.withProp("uiId", IDS.NUMBER_INPUT_INLINE_REPEAT)
								.props();
							deepEqual(numberInput.validationMessages, {
								errors: [[{ key: "foo", defaults: { en: "error" } }]],
								infos: [],
								warnings: []
							});
							equal(numberInput.modelElement.messageExposition, "TOOLTIP");
						});
					});

					describe("and the referenced field is outside the repeatable group", () => {
						it("renders an input with the validation messages from the state and messageExposition 'TOOLTIP'", async () => {
							const wrapper = await setup({ errorType: "ERROR", messageExposition: "TOOLTIP" });
							const numberInput = query(wrapper.inputMap.NumberInput)
								.withProp("uiId", IDS.NUMBER_INPUT)
								.props();
							deepEqual(numberInput.validationMessages, {
								errors: [[{ key: "foo", defaults: { en: "current error" } }]],
								infos: [],
								warnings: []
							});
							equal(numberInput.modelElement.messageExposition, "TOOLTIP");
						});
					});
				});
			});
		});

		describe("Warning", () => {
			describe("text", () => {
				describe("when the control is located in a top-level screen", () => {
					describe("and the referenced field is inside the repeatable group", () => {
						it("renders an input with the validation messages from the state and messageExposition 'TOOLTIP'", async () => {
							const wrapper = await setup({ errorType: "WARNING", messageExposition: "TOOLTIP" });
							const numberInput = query(wrapper.inputMap.NumberInput)
								.withProp("uiId", IDS.NUMBER_INPUT_INLINE_REPEAT)
								.props();
							deepEqual(numberInput.validationMessages, {
								errors: [],
								infos: [],
								warnings: [[{ key: "foo", defaults: { en: "error" } }]]
							});
							equal(numberInput.modelElement.messageExposition, "TOOLTIP");
						});
					});

					describe("and the referenced field is outside the repeatable group", () => {
						it("renders an input with the validation messages from the state and messageExposition 'TOOLTIP'", async () => {
							const wrapper = await setup({ errorType: "WARNING", messageExposition: "TOOLTIP" });
							const numberInput = query(wrapper.inputMap.NumberInput)
								.withProp("uiId", IDS.NUMBER_INPUT)
								.props();
							deepEqual(numberInput.validationMessages, {
								errors: [],
								infos: [],
								warnings: [[{ key: "foo", defaults: { en: "current error" } }]]
							});
							equal(numberInput.modelElement.messageExposition, "TOOLTIP");
						});
					});
				});
			});
		});

		describe("Info", () => {
			describe("text", () => {
				describe("when the control is located in a top-level screen", () => {
					describe("and the referenced field is inside the repeatable group", () => {
						it("renders an input with the validation messages from the state and messageExposition 'TOOLTIP'", async () => {
							const wrapper = await setup({ errorType: "INFO", messageExposition: "TOOLTIP" });
							const numberInput = query(wrapper.inputMap.NumberInput)
								.withProp("uiId", IDS.NUMBER_INPUT_INLINE_REPEAT)
								.props();
							deepEqual(numberInput.validationMessages, {
								errors: [],
								infos: [[{ key: "foo", defaults: { en: "error" } }]],
								warnings: []
							});
							equal(numberInput.modelElement.messageExposition, "TOOLTIP");
						});
					});

					describe("and the referenced field is outside the repeatable group", () => {
						it("renders an input with the validation messages from the state and messageExposition 'TOOLTIP'", async () => {
							const wrapper = await setup({ errorType: "INFO", messageExposition: "TOOLTIP" });
							const numberInput = query(wrapper.inputMap.NumberInput)
								.withProp("uiId", IDS.NUMBER_INPUT)
								.props();
							deepEqual(numberInput.validationMessages, {
								errors: [],
								infos: [[{ key: "foo", defaults: { en: "current error" } }]],
								warnings: []
							});
							equal(numberInput.modelElement.messageExposition, "TOOLTIP");
						});
					});
				});
			});
		});
	});
}
