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

import { query } from "@com.mgmtp.a12.devtools/react";
import { Locale } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type { Models } from "../../../../../../back-end/store/index.js";
import type { InputMap } from "../../../../../../view/internal/configuration/componentMap/input/input-map.js";
import { getInputMocks } from "../../../../../rtl-utils/getInputMocks.js";
import { US_LOCALE } from "../../../../../utils/localization.js";
import { SetupHelpers } from "../../../../../utils/setup.js";
import { setupFixtureObject, setupModelsFixture } from "../../../../../utils/setupFixture.js";
import { IDS as AMOUNT_SUFFIX_IDS } from "../../../../../utils/test-model-helpers/amountSuffix.js";
import { IDS } from "../../../../../utils/test-model-helpers/suffix.js";

const { setupFormEngineRendererWithRtl, loadData } = SetupHelpers;

export function executeTestForSuffix(): void {
	const suffixModels = setupModelsFixture("controls.suffix");

	interface TestSuffixOptions {
		readonly models: Models;
		readonly document: object;
		readonly locale?: Locale;
		readonly inputId: string;
		readonly expectedText: string | undefined;
	}

	function testSuffix(options: TestSuffixOptions): void {
		const { inputId, expectedText } = options;
		const inputMap = renderSuffix(undefined, options);
		assertSuffix(inputMap, inputId, expectedText);
	}

	async function testSuffixWithWidgets(options: TestSuffixOptions): Promise<void> {
		const { inputId, expectedText } = options;
		const inputMap = await act(() => renderSuffix(true, options));
		assertSuffix(inputMap, inputId, expectedText);
	}

	function renderSuffix(withWidgets: true | undefined, options: TestSuffixOptions) {
		const { models, document, locale } = options;

		const inputMap = getInputMocks();

		setupFormEngineRendererWithRtl({
			models,
			data: { document },
			locale,
			inputMap,
			withWidgets
		});

		return inputMap;
	}

	function assertSuffix(inputMap: InputMap, inputId: string, expectedText: string | undefined) {
		const modelElement = query(inputMap.NumberInput).withProp("uiId", inputId).props().modelElement;

		strictEqual(modelElement.suffix, expectedText);
	}

	describe("if a suffix is defined in the fieldConfigurationEntry for a number field", () => {
		it("renders a component with prop suffixes containing the suffix set in the model", () => {
			testSuffix({
				models: suffixModels,
				document: {},
				inputId: IDS.CONTROL_SUFFIX,
				expectedText: "mmol/l"
			});
		});

		it("renders a component with prop suffixes = undefined, if no suffix is set in the model", () => {
			testSuffix({
				models: suffixModels,
				document: {},
				inputId: IDS.CONTROL_NO_SUFFIX,
				expectedText: undefined
			});
		});
	});

	describe("if amountSuffix is defined in the form model settings", () => {
		const amountSuffixModels = setupModelsFixture("controls.suffix", "amountSuffix");
		const suffixModels = setupModelsFixture("controls.suffix");

		const dataForAmountSuffixTest = setupFixtureObject(() =>
			loadData("controls.suffix", "dataForAmountSuffixTest", amountSuffixModels.documentModel)
		);

		describe("if the unit of the underlying number field is 'amount'", () => {
			describe("if for the number field no suffix is defined in the fieldConfig", () => {
				it("renders a component with prop suffixes containing the amount suffix defined in model settings", () => {
					testSuffix({
						models: amountSuffixModels,
						document: dataForAmountSuffixTest,
						inputId: AMOUNT_SUFFIX_IDS.AMOUNT_CONTROL_NO_SUFFIX,
						expectedText: "Taler (EN)"
					});
				});
			});

			describe("if for the number field a suffix is only defined for a different locale in the fieldConfig", () => {
				it("renders a component with prop suffixes containing the amount suffix defined in model settings", () => {
					testSuffix({
						models: suffixModels,
						locale: Locale.fromString("de_DE") as Locale,
						document: dataForAmountSuffixTest,
						inputId: IDS.CONTROL_MULTILINGUAL_SUFFIX_PARTIAL,
						expectedText: "global amount suffix"
					});
				});
			});

			describe("if for the number field a suffix is defined in the fieldConfig", () => {
				it(
					"renders a component with prop suffixes containing the suffix defined in fieldConfig, " +
						"overwriting the amount suffix from model settings",
					() => {
						testSuffix({
							models: amountSuffixModels,
							document: {},
							inputId: AMOUNT_SUFFIX_IDS.AMOUNT_CONTROL_SUFFIX,
							expectedText: "€"
						});
					}
				);
			});
		});

		describe("if the unit of the underlying number field isn't 'amount'", () => {
			describe("if for the number field no suffix is defined in the fieldConfig", () => {
				it("renders a component with prop suffixes being undefined", () => {
					testSuffix({
						models: amountSuffixModels,
						document: {},
						inputId: AMOUNT_SUFFIX_IDS.CONTROL_NO_SUFFIX,
						expectedText: undefined
					});
				});
			});

			describe("if for the number field a suffix is defined in the fieldConfig", () => {
				it("renders a component with prop suffixes containing the suffix defined in fieldConfig", () => {
					testSuffix({
						models: amountSuffixModels,
						document: {},
						inputId: AMOUNT_SUFFIX_IDS.CONTROL_SUFFIX,
						expectedText: "mmol/l"
					});
				});
			});
		});
	});

	describe("localization", () => {
		describe("given a form-model with the languages [en, de]", () => {
			function createDocument() {
				return { root: { rep_none: [{}] } };
			}

			describe("and a suffix text defined for both languages for a control", () => {
				it("renders a component with prop suffixes containing the english suffix text of the model if the locale is 'en'", () => {
					testSuffix({
						models: suffixModels,
						document: createDocument(),
						locale: US_LOCALE,
						inputId: IDS.CONTROL_MULTILINGUAL_SUFFIX,
						expectedText: "Unit"
					});
				});

				it("renders a component with prop suffixes containing the english suffix text of the model if the locale is 'de'", () => {
					testSuffix({
						models: suffixModels,
						document: createDocument(),
						locale: { language: "de", country: "DE" },
						inputId: IDS.CONTROL_MULTILINGUAL_SUFFIX,
						expectedText: "Maßeinheit"
					});
				});
			});

			describe("and a suffix text defined for both languages for a field overview column", () => {
				it("renders a component with prop suffixes containing the english suffix text of the model if the locale is 'en'", async () => {
					await testSuffixWithWidgets({
						models: suffixModels,
						document: createDocument(),
						locale: US_LOCALE,
						inputId: IDS.IR_COLUMN_MULTILINGUAL_SUFFIX,
						expectedText: "Unit"
					});
				});

				it("renders a component with prop suffixes containing the english suffix text of the model if the locale is 'de'", async () => {
					await testSuffixWithWidgets({
						models: suffixModels,
						document: createDocument(),
						locale: { language: "de", country: "DE" },
						inputId: IDS.IR_COLUMN_MULTILINGUAL_SUFFIX,
						expectedText: "Maßeinheit"
					});
				});
			});
		});
	});
}
