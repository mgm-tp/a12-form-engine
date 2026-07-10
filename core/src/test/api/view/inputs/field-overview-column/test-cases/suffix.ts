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

import { equal } from "node:assert/strict";

import { query } from "@com.mgmtp.a12.devtools/react";

import { RenderGroupFixture } from "../../../../../utils/rtl-render-group.js";
import { loadData, loadModels } from "../../../../../utils/setup.js";
import { IDS as AMOUNT_SUFFIX_IDS } from "../../../../../utils/test-model-helpers/amountSuffix.js";
import type { RenderWithInputMap } from "../../../../../utils/test-model-helpers/render-with-inputmocks.js";
import { renderWithInputMocks } from "../../../../../utils/test-model-helpers/render-with-inputmocks.js";
import { IDS } from "../../../../../utils/test-model-helpers/suffix.js";

export function executeTestForFieldOverviewColumnSuffix(): void {
	describe("if a suffix is defined in the fieldConfigurationEntry for a number field", () => {
		const renderSuffixModels = () => {
			const models = loadModels("controls.suffix");
			const data = {
				document: loadData("controls.suffix", "dataForSuffixTest", models.documentModel)
			};
			return renderWithInputMocks({
				models,
				data
			});
		};

		const { it, render } = RenderGroupFixture<RenderWithInputMap>(renderSuffixModels);

		it("renders a component with prop suffixes containing the suffix set in the model", async () => {
			const input = query(render.wrapper.inputMap.NumberInput)
				.withProp("uiId", IDS.IR_COLUMN_SUFFIX)
				.props();
			equal(input.modelElement.suffix, "mmol/l");
		});

		it("renders a component with prop suffixes = undefined, if no suffix is set in the model", async () => {
			const input = query(render.wrapper.inputMap.NumberInput)
				.withProp("uiId", IDS.IR_COLUMN_NO_SUFFIX)
				.props();
			equal(input.modelElement.suffix, undefined);
		});

		it("renders a component with a TextAffix with truncate = true, when truncateSuffix is set in the model", () => {
			const input = query(render.wrapper.inputMap.NumberInput)
				.withProp("uiId", IDS.IR_COLUMN_TRUNC_SUFFIX)
				.props();

			equal(input.modelElement.truncateSuffix, true);
		});

		it("renders a component with a TextAffix with truncate = undefined, when truncateSuffix is not set in the model", () => {
			const input = query(render.wrapper.inputMap.NumberInput)
				.withProp("uiId", IDS.IR_COLUMN_SUFFIX)
				.props();

			equal(input.modelElement.truncateSuffix, undefined);
		});
	});

	describe("if amountSuffix is defined in the form model settings", () => {
		const renderAmountSuffixModels = () => {
			const models = loadModels("controls.suffix", "amountSuffix");
			const data = {
				document: loadData("controls.suffix", "dataForAmountSuffixTest", models.documentModel)
			};

			return renderWithInputMocks({
				models,
				data
			});
		};

		const { it, render } = RenderGroupFixture<RenderWithInputMap>(renderAmountSuffixModels);

		describe("if the unit of the underlying number field is 'amount'", () => {
			describe("if for the number field a suffix is defined in the fieldConfig", () => {
				it(
					"renders a component with prop suffixes containing the suffix defined in fieldConfig, " +
						"overwriting the amount suffix from model settings",
					async () => {
						const input = query(render.wrapper.inputMap.NumberInput)
							.withProp("uiId", AMOUNT_SUFFIX_IDS.AMOUNT_COLUMN_SUFFIX)
							.props();
						equal(input.modelElement.suffix, "€");
					}
				);
			});

			describe("if for the number field no suffix is defined in the fieldConfig", () => {
				it("renders a component with prop suffixes containing the amount suffix defined in model settings", async () => {
					const input = query(render.wrapper.inputMap.NumberInput)
						.withProp("uiId", AMOUNT_SUFFIX_IDS.AMOUNT_COLUMN_NO_SUFFIX)
						.props();
					equal(input.modelElement.suffix, "Taler (EN)");
				});
			});
		});

		describe("if the unit of the underlying number field isn't 'amount'", () => {
			describe("if for the number field no suffix is defined in the fieldConfig", () => {
				it("renders a component with prop suffixes being undefined", async () => {
					const input = query(render.wrapper.inputMap.NumberInput)
						.withProp("uiId", AMOUNT_SUFFIX_IDS.COLUMN_NO_SUFFIX)
						.props();

					equal(input.modelElement.suffix, undefined);
				});
			});

			describe("if for the number field a suffix is defined in the fieldConfig", () => {
				it("renders a component with prop suffixes containing the suffix defined in fieldConfig", async () => {
					const input = query(render.wrapper.inputMap.NumberInput)
						.withProp("uiId", AMOUNT_SUFFIX_IDS.COLUMN_SUFFIX)
						.props();
					equal(input.modelElement.suffix, "mmol/l");
				});
			});
		});
	});
}
