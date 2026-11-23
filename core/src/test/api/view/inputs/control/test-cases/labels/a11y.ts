// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { query } from "@com.mgmtp.a12.devtools/react";

import { getComponentMocks } from "../../../../../../rtl-utils/getComponentMocks.js";
import { SetupHelpers } from "../../../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../../../utils/setupFixture.js";
import { IDS as A11Y_IDS } from "../../../../../../utils/test-model-helpers/a11y.js";

export function executeA11yTests(): void {
	const a11yModels = setupModelsFixture("a11y", "controls");

	function assertHideLabel(opts: { elementId: string; hideLabel: true | undefined }): void {
		const { elementId, hideLabel } = opts;
		const componentMap = getComponentMocks();
		SetupHelpers.setupFormEngineRendererWithRtl({
			models: a11yModels,
			componentMap
		});

		query(componentMap.BufferedTextLine)
			.withId(elementId)
			.withProp("hideLabel", hideLabel)
			.assertRendered();
	}

	describe("labelHiddenButRead", () => {
		describe("given a control with 'labelHiddenButRead'=true", () => {
			it("renders a component with prop 'hideLabel' = true", () => {
				assertHideLabel({
					elementId: A11Y_IDS.Title.INLINE_REPEAT.STRING_HIDE_LABEL_ID,
					hideLabel: true
				});
			});
		});

		describe("given a control with 'labelHiddenButRead'=undefined", () => {
			it("renders a component with prop 'hideLabel'=undefined", () => {
				assertHideLabel({
					elementId: A11Y_IDS.Title.INLINE_REPEAT.STRING_ID,
					hideLabel: undefined
				});
			});
		});
	});
}
