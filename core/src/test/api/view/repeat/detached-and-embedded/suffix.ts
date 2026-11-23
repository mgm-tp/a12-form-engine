// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
