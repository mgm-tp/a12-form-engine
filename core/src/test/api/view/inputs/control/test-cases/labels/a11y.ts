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

import { query } from "@com.mgmtp.a12.devtools/react";

import { getComponentMocks } from "../../../../../../rtl-utils/getComponentMocks.js";
import { setupFormEngineRendererWithRtl } from "../../../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../../../utils/setupFixture.js";
import { IDS as A11Y_IDS } from "../../../../../../utils/test-model-helpers/a11y.js";

export function executeA11yTests(): void {
	const a11yModels = setupModelsFixture("a11y", "controls");

	function assertHideLabel(opts: { elementId: string; hideLabel: true | undefined }): void {
		const { elementId, hideLabel } = opts;
		const componentMap = getComponentMocks();
		setupFormEngineRendererWithRtl({
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
