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

import { deepStrictEqual, fail } from "node:assert/strict";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { Locale } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import { defaultLocalizerFactory } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type { Models } from "../../../../back-end/store/internal/store.js";
import { DocumentModelUtils } from "../../../../models/internal/utils/document-model-utils.js";
import type { EnumerationValue } from "../../../../view/index.js";
import * as EnumValues from "../../../../view/internal/utilities/enumerable/localizeAndFilterEnumerationValues.js";
import { DE_LOCALE, US_LOCALE } from "../../../utils/localization.js";
import { ModelHelpers } from "../../../utils/model-helpers.js";
import { SetupHelpers } from "../../../utils/setup.js";
import { setupModelsFixture } from "../../../utils/setupFixture.js";

import { externalEnumerationProvider } from "../configurable_externalenumeration.js";

describe("unit.view.inputs", () => {
	describe("localizeAndFilterEnumerationValues", () => {
		const picusTypeModels: Models = setupModelsFixture("controls.picustypes");
		const dependentEnumerationModels: Models = setupModelsFixture("dependencies.enumeration");

		executeTestSuiteForLanguage(US_LOCALE);
		executeTestSuiteForLanguage(DE_LOCALE);

		function executeTestSuiteForLanguage(locale: Locale): void {
			describe(`${locale.language}`, () => {
				describe("given the path to an enumeration field", () => {
					describe("for which no dependent enumeration is set", () => {
						it("returns a list of all enumeration values containing the key and the localized label", () => {
							const pathToEnumerationField = ModelHelpers.createModelPath(
								"A12T_DependentEnumeration",
								"Model"
							);

							const expectedValues: EnumerationValue[] =
								locale.language === "en"
									? [
											{ label: "A-Class", value: "MERCEDES_A_CLASS" },
											{ label: "E-Class", value: "MERCEDES_E_CLASS" },
											{ label: "Corolla", value: "TOYOTA_COROLLA" },
											{ label: "Yaris", value: "TOYOTA_YARIS" },
											{ label: "Golf", value: "VW_GOLF" },
											{ label: "UP", value: "VW_UP" }
										]
									: [
											{ label: "A-Class (de)", value: "MERCEDES_A_CLASS" },
											{ label: "E-Class (de)", value: "MERCEDES_E_CLASS" },
											{ label: "Corolla (de)", value: "TOYOTA_COROLLA" },
											{ label: "Yaris (de)", value: "TOYOTA_YARIS" },
											{ label: "Golf (de)", value: "VW_GOLF" },
											{ label: "UP (de)", value: "VW_UP" }
										];

							executeTestForEnumerationField({
								expectedValues,
								pathToEnumerationField,
								models: dependentEnumerationModels,
								locale,
								document: { A12T_DependentEnumeration: { Brand: undefined } }
							});
						});
					});

					describe("for which a dependent enumeration is set", () => {
						it("returns a list of only the enumeration values matching the condition containing the key and the localized label", () => {
							const pathToEnumerationField = ModelHelpers.createModelPath(
								"A12T_DependentEnumeration",
								"Model"
							);
							const expectedValues: EnumerationValue[] =
								locale.language === "en"
									? [
											{ label: "A-Class", value: "MERCEDES_A_CLASS" },
											{ label: "E-Class", value: "MERCEDES_E_CLASS" }
										]
									: [
											{ label: "A-Class (de)", value: "MERCEDES_A_CLASS" },
											{ label: "E-Class (de)", value: "MERCEDES_E_CLASS" }
										];

							executeTestForEnumerationField({
								expectedValues,
								pathToEnumerationField,
								models: dependentEnumerationModels,
								locale,
								document: { A12T_DependentEnumeration: { Brand: "MERCEDES" } }
							});
						});
					});

					describe("for which alphabetical sorting is not set", () => {
						it("returns a list of all enumeration values containing the key and the localized label which is not sorted", () => {
							const pathToEnumerationField = ModelHelpers.createModelPath(
								"A12T_PicusTypes",
								"Enumeration",
								"Enumeration011"
							);

							const expectedValues: EnumerationValue[] =
								locale.language === "en"
									? [
											{ label: "One", value: "key_1" },
											{ label: "Two", value: "key_2" },
											{ label: "Three", value: "key_3" },
											{ label: "Four", value: "key_4" }
										]
									: [
											{ label: "Eins", value: "key_1" },
											{ label: "Zwei", value: "key_2" },
											{ label: "Drei", value: "key_3" },
											{ label: "Vier", value: "key_4" }
										];

							executeTestForEnumerationField({
								expectedValues,
								pathToEnumerationField,
								models: picusTypeModels,
								locale
							});
						});
					});

					describe("for which alphabetical sorting is set", () => {
						it("returns a list of all enumeration values containing the key and the localized label sorted by the label", () => {
							const pathToEnumerationField = ModelHelpers.createModelPath(
								"A12T_PicusTypes",
								"Enumeration",
								"AlphabeticalSorting",
								"Enumeration01"
							);
							const expectedValues: EnumerationValue[] =
								locale.language === "en"
									? [
											{ label: "Four", value: "key_4" },
											{ label: "One", value: "key_1" },
											{ label: "Three", value: "key_3" },
											{ label: "Two", value: "key_2" }
										]
									: [
											{ label: "Drei", value: "key_3" },
											{ label: "Eins", value: "key_1" },
											{ label: "Vier", value: "key_4" },
											{ label: "Zwei", value: "key_2" }
										];

							executeTestForEnumerationField({
								expectedValues,
								pathToEnumerationField,
								models: picusTypeModels,
								locale
							});
						});
					});
				});

				describe("given a path to a string field for which an external enumeration is defined", () => {
					describe("for which alphabetical sorting is not set", () => {
						it("returns a list of all enumeration values containing the key and the localized label which is not sorted", () => {
							const pathToEnumerationField = ModelHelpers.createModelPath(
								"A12T_PicusTypes",
								"Enumeration",
								"Enumeration05"
							);

							const expectedValues: EnumerationValue[] =
								locale.language === "en"
									? [
											{ label: "One", value: "key_1" },
											{ label: "Two", value: "key_2" },
											{ label: "Three", value: "key_3" },
											{ label: "Four", value: "key_4" }
										]
									: [
											{ label: "Eins", value: "key_1" },
											{ label: "Zwei", value: "key_2" },
											{ label: "Drei", value: "key_3" },
											{ label: "Vier", value: "key_4" }
										];

							executeTestForExternalEnumerationField({
								expectedValues,
								pathToEnumerationField,
								models: picusTypeModels,
								locale
							});
						});
					});

					describe("for which alphabetical sorting is set", () => {
						it("returns a list of all enumeration values containing the key and the localized label sorted by the label", () => {
							const pathToEnumerationField = ModelHelpers.createModelPath(
								"A12T_PicusTypes",
								"Enumeration",
								"AlphabeticalSorting",
								"Enumeration05"
							);
							const expectedValues: EnumerationValue[] =
								locale.language === "en"
									? [
											{ label: "Four", value: "key_4" },
											{ label: "One", value: "key_1" },
											{ label: "Three", value: "key_3" },
											{ label: "Two", value: "key_2" }
										]
									: [
											{ label: "Drei", value: "key_3" },
											{ label: "Eins", value: "key_1" },
											{ label: "Vier", value: "key_4" },
											{ label: "Zwei", value: "key_2" }
										];

							executeTestForExternalEnumerationField({
								expectedValues,
								pathToEnumerationField,
								models: picusTypeModels,
								locale
							});
						});
					});
				});
			});
		}

		interface TestOptions {
			readonly models: Models;
			readonly pathToEnumerationField: ModelPath;
			readonly expectedValues: EnumerationValue[];
			readonly locale: Locale;
			readonly document?: object;
		}

		function executeTestForEnumerationField(options: TestOptions): void {
			const { models, pathToEnumerationField, expectedValues, locale, document } = options;
			const renderConfiguration = SetupHelpers.setupRenderConfiguration({
				models,
				locale,
				data: document ? { document } : undefined
			});

			const field = DocumentModelUtils.findByPath(models.documentModel, pathToEnumerationField);
			if (!(field.type === "Field" && field.fieldType.type === "EnumerationType")) {
				fail(
					`Setup error: Expected field with path ${pathToEnumerationField} to be an enumeration field`
				);
			}

			const fce =
				models.formModel.content.fieldConfiguration.fieldMap[
					ModelPath.toString(pathToEnumerationField)
				];

			const enumerationValues = EnumValues.localizeAndFilterEnumerationValues({
				context: [],
				enumValues: field.fieldType.values,
				modelPath: pathToEnumerationField,
				renderOptions: renderConfiguration.renderOptions,
				localizer: defaultLocalizerFactory({ locale }),
				fieldConfigurationEntry: fce
			});

			deepStrictEqual(enumerationValues, expectedValues);
		}

		function executeTestForExternalEnumerationField(options: TestOptions): void {
			const { models, pathToEnumerationField, expectedValues, locale, document } = options;
			const renderConfiguration = SetupHelpers.setupRenderConfiguration({
				models,
				locale,
				data: document ? { document } : undefined,
				config: {
					externalEnumerationProvider
				}
			});

			const field = DocumentModelUtils.findByPath(models.documentModel, pathToEnumerationField);
			if (!(field.type === "Field" && field.fieldType.type === "StringType")) {
				fail(
					`Setup error: Expected field with path ${pathToEnumerationField} to be a string field`
				);
			}
			const values = [
				{
					value: "key_1",
					label: [
						{ locale: "en", text: "One" },
						{ locale: "de", text: "Eins" }
					]
				},
				{
					value: "key_2",
					label: [
						{ locale: "en", text: "Two" },
						{ locale: "de", text: "Zwei" }
					]
				},
				{
					value: "key_3",
					label: [
						{ locale: "en", text: "Three" },
						{ locale: "de", text: "Drei" }
					]
				},
				{
					value: "key_4",
					label: [
						{ locale: "en", text: "Four" },
						{ locale: "de", text: "Vier" }
					]
				}
			];

			const enumerationValues = EnumValues.localizeAndFilterEnumerationValues({
				context: [],
				enumValues: values,
				modelPath: pathToEnumerationField,
				renderOptions: renderConfiguration.renderOptions,
				localizer: defaultLocalizerFactory({ locale })
			});

			deepStrictEqual(enumerationValues, expectedValues);
		}
	});
});
