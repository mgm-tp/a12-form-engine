// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { deepStrictEqual } from "node:assert/strict";

import { query } from "@com.mgmtp.a12.devtools/react";

import { getInputMocks } from "../../../../../rtl-utils/getInputMocks.js";
import { SetupHelpers } from "../../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../../utils/setupFixture.js";
import { CONTROLS } from "../../../../../utils/test-model-helpers/controls.js";

export function executeTestFormModelPath(): void {
	const models = setupModelsFixture("controls");

	it("renders a component with prop 'formModelPath' set to the correct formModelPath", () => {
		const inputMap = getInputMocks();
		SetupHelpers.setupFormEngineRendererWithRtl({ models, inputMap });
		const props = query(inputMap.NumberInput).withProp("uiId", CONTROLS.ID_L0_NUMBER).props();
		deepStrictEqual(props.formModelPath, CONTROLS.PATH_L0_NUMBER);
	});
}
