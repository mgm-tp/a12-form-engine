// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { strictEqual } from "node:assert/strict";

import { query } from "@com.mgmtp.a12.devtools/react";

import { getInputMocks } from "../../../../../rtl-utils/getInputMocks.js";
import { SetupHelpers } from "../../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../../utils/setupFixture.js";
import { IDS } from "../../../../../utils/test-model-helpers/suffix.js";

const { setupFormEngineRendererWithRtl } = SetupHelpers;

export function executeTestForTruncateSuffix(): void {
	const suffixModels = setupModelsFixture("controls.suffix");

	function assertTruncateSuffix(uiId: string, value: true | undefined): void {
		const inputMap = getInputMocks();
		setupFormEngineRendererWithRtl({ models: suffixModels, inputMap });
		const modelElement = query(inputMap.NumberInput).withProp("uiId", uiId).props().modelElement;
		strictEqual(modelElement.truncateSuffix, value);
	}

	it("renders a component with a TextAffix with truncate = true, when truncateSuffix is set in the model", () => {
		assertTruncateSuffix(IDS.CONTROL_TRUNC_SUFFIX, true);
	});

	it("renders a component with a TextAffix with truncate = undefined, when truncateSuffix is not set in the model", () => {
		assertTruncateSuffix(IDS.CONTROL_SUFFIX, undefined);
	});
}
