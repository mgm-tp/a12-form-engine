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

import { act } from "react";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { query } from "@com.mgmtp.a12.devtools/react";

import type { EngineStore } from "../../../../../../back-end/store/index.js";
import type { InputMap } from "../../../../../../view/internal/configuration/componentMap/input/input-map.js";
import { getInputMocks } from "../../../../../rtl-utils/getInputMocks.js";
import { DocumentHelpers } from "../../../../../utils/document-helpers.js";
import { SetupHelpers } from "../../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../../utils/setupFixture.js";
import type { LocationStackPosition } from "../../../../../utils/test-model-helpers/controls.js";
import {
	CONTROLS,
	createDocumentForControlsModels
} from "../../../../../utils/test-model-helpers/controls.js";

const { createDocumentPath } = DocumentHelpers;

export function executeTestForDisabled(): void {
	function assertInputDisabled(options: {
		locationPosition?: LocationStackPosition;
		engineDisabled?: boolean;

		elementId: string;
		expectedValue: boolean;
	}): void {
		const inputMap = render(false, options);
		assertRender(inputMap, options);
	}

	async function assertInputDisabledWithWidgets(options: {
		locationPosition?: LocationStackPosition;
		engineDisabled?: boolean;

		elementId: string;
		expectedValue: boolean;
	}): Promise<void> {
		const inputMap = await act(() => render(true, options));
		assertRender(inputMap, options);
	}

	function render(
		withWidgets: boolean,
		options: {
			locationPosition?: LocationStackPosition;
			engineDisabled?: boolean;
		}
	): InputMap {
		const { locationPosition, engineDisabled } = options;

		const value_L0_backup = 100;
		const value_L0_document = 200;
		const value_L1 = 300;

		const document = createDocumentForControlsModels({
			L0_Number: value_L0_document,
			L1_Number: value_L1
		});
		const backupDocument = createDocumentForControlsModels({ L0_Number: value_L0_backup });

		const repeatPath = createDocumentPath([CONTROLS.ROOT], [CONTROLS.repeatableGroup, 1]);

		const screenLocation: EngineStore.ScreenState[] = [
			{
				locationPath: [{ elementName: CONTROLS.screenName }],
				path: [],
				repeatInstanceState:
					options.locationPosition === "embedded"
						? {
								[ModelPath.toString(CONTROLS.er_locationPath)]: {
									expandedRowPath: repeatPath
								}
							}
						: {}
			}
		];

		if (locationPosition === "detached") {
			screenLocation.push({
				path: repeatPath,
				locationPath: CONTROLS.dr_locationPath
			});
		}

		const inputMap = getInputMocks();
		SetupHelpers.setupFormEngineRendererWithRtl({
			withWidgets: withWidgets ? true : undefined,
			inputMap,
			models: controls,
			data: { document },
			ui: {
				disabled: engineDisabled,
				backup: [{ document: backupDocument, messages: {} }],
				screenLocation: screenLocation
			}
		});
		return inputMap;
	}

	function assertRender(
		inputMap: InputMap,
		options: {
			elementId: string;
			expectedValue: boolean;
		}
	) {
		const { elementId, expectedValue } = options;
		const props = query(inputMap.NumberInput).withProp("uiId", elementId).props();
		strictEqual(props.modelElement.disabled, expectedValue);
	}

	const controls = setupModelsFixture("controls");

	describe("when the control is located in a top-level screen", () => {
		it("is disabled if the form-engine is disabled", () => {
			assertInputDisabled({
				engineDisabled: true,
				elementId: CONTROLS.ID_L0_NUMBER,
				expectedValue: true
			});
		});

		it("is not disabled if the form-engine is not disabled", () => {
			assertInputDisabled({
				engineDisabled: false,
				elementId: CONTROLS.ID_L0_NUMBER,
				expectedValue: false
			});
		});
	});

	describe("when the control is located in an embedded-repeat detail control-grid", () => {
		it("is disabled if the form-engine is disabled", async () => {
			await assertInputDisabledWithWidgets({
				locationPosition: "embedded",
				engineDisabled: true,
				elementId: CONTROLS.ID_L1_NUMBER_IN_ER,
				expectedValue: true
			});
		});

		it("is not disabled if the form-engine is not disabled", async () => {
			await assertInputDisabledWithWidgets({
				locationPosition: "embedded",
				engineDisabled: false,
				elementId: CONTROLS.ID_L1_NUMBER_IN_ER,
				expectedValue: false
			});
		});
	});

	describe("when the control is located in a detached-repeat detail-screen", () => {
		it("is disabled if the form-engine is disabled", () => {
			assertInputDisabled({
				locationPosition: "detached",
				engineDisabled: true,
				elementId: CONTROLS.ID_L1_NUMBER_IN_DR,
				expectedValue: true
			});
		});

		it("is not disabled if the form-engine is not disabled", () => {
			assertInputDisabled({
				locationPosition: "detached",
				engineDisabled: false,
				elementId: CONTROLS.ID_L1_NUMBER_IN_DR,
				expectedValue: false
			});
		});
	});
}
