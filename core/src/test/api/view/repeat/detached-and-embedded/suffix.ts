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

import { within } from "@com.mgmtp.a12.devtools/react";

import { SetupHelpers } from "../../../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../../../utils/setupFixture.js";

const { loadData } = SetupHelpers;

export function executeSuffixTests(options: { bodyCellId: string }): void {
	const models = setupModelsFixture("controls.suffix");
	const fixture = setupFixture(() => ({
		document: loadData("controls.suffix", "dataForSuffixTest", models.documentModel),
		emptyRowsDocument: loadData("controls.suffix", "emptyDataForSuffixTest", models.documentModel)
	}));

	describe("given a suffix defined in the fieldConfigurationEntry for a number field", () => {
		describe("and given no number field value", () => {
			it("shows a table cell containing the suffix", async () => {
				const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
					models,
					data: { document: fixture.emptyRowsDocument }
				});

				const textContent = within(wrapper.baseElement).getById(options.bodyCellId).textContent;
				strictEqual(textContent, "mmol/l");
			});
		});

		describe("and given a number field value", () => {
			it("shows a table cell containing the formatted value and suffix separated by a space", async () => {
				const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
					models,
					data: { document: fixture.document }
				});
				const textContent = within(wrapper.baseElement).getById(options.bodyCellId).textContent;
				strictEqual(textContent, "42 mmol/l");
			});
		});
	});
}
