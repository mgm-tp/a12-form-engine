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

import { deepStrictEqual } from "node:assert/strict";

import type {
	EntityInstancePath,
	GroupInstance
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import {
	defaultDataFormats,
	defaultLocalizerFactory
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { EnumerableHelper } from "../../../../view/internal/utilities/enumerable/enumerableHelper.js";
import type { EnumerationValue } from "../../../../view/internal/utilities/enumerable/enumValue.js";
import { DocumentHelpers } from "../../../utils/document-helpers.js";
import { US_LOCALE } from "../../../utils/localization.js";
import { SetupHelpers } from "../../../utils/setup.js";
import { setupModelsFixture } from "../../../utils/setupFixture.js";

const { setupRenderConfiguration } = SetupHelpers;
const { createDocumentPath } = DocumentHelpers;

describe("api.view.EnumerableHelper", () => {
	const models = setupModelsFixture("dependencies.enumeration");

	const DEPENDENT_ENUMERATION_PATH = createDocumentPath(["A12T_DependentEnumeration"], ["Model"]);
	const MASTER_ENUMERATION_PATH = createDocumentPath(["A12T_DependentEnumeration"], ["Brand"]);

	const allModelValues = [
		{ value: "MERCEDES_A_CLASS", label: "A-Class" },
		{ value: "MERCEDES_E_CLASS", label: "E-Class" },
		{ value: "TOYOTA_COROLLA", label: "Corolla" },
		{ value: "TOYOTA_YARIS", label: "Yaris" },
		{ value: "VW_GOLF", label: "Golf" },
		{ value: "VW_UP", label: "UP" }
	];

	const allBrandValues = [
		{ value: "MERCEDES", label: "Mercedes" },
		{ value: "TOYOTA", label: "Toyota" },
		{ value: "VW", label: "VW" }
	];

	describe("getLocalizedDependentEnumerationValues", () => {
		function test(path: EntityInstancePath, document?: GroupInstance): EnumerationValue[] {
			const renderConfiguration = setupRenderConfiguration({ models, data: { document } });
			return EnumerableHelper.getLocalizedDependentEnumerationValues(
				renderConfiguration.renderOptions,
				path,
				defaultLocalizerFactory({ locale: US_LOCALE, dataFormats: defaultDataFormats(US_LOCALE) })
			);
		}

		describe("Enumeration values of field dependent on value of master field", () => {
			describe("where the master field and dependent field are not in a repeatable group", () => {
				it("returns all enumeration values with their localized label if no master value is set", () => {
					const enumerationValues = test(DEPENDENT_ENUMERATION_PATH);
					deepStrictEqual(enumerationValues, allModelValues);
				});

				it("returns only enumeration values with their localized label which fit the dependency", () => {
					const document = { A12T_DependentEnumeration: { Brand: "MERCEDES" } };
					const enumerationValues = test(DEPENDENT_ENUMERATION_PATH, document);
					deepStrictEqual(enumerationValues, allModelValues.slice(0, 2));
				});
			});

			describe("where the master field and dependent field are in a repeatable group", () => {
				const document = { A12T_DependentEnumeration: { Cars: [{}] } };
				const path = createDocumentPath(["A12T_DependentEnumeration"], ["Cars"], ["Model"]);

				it("returns all enumeration values with their localized label if no master value is set", () => {
					const enumerationValues = test(path, document);
					deepStrictEqual(enumerationValues, allModelValues);
				});

				it("returns only enumeration values with their localized label which fit the dependency", () => {
					const newDocument = {
						A12T_DependentEnumeration: {
							Cars: [{ Brand: "MERCEDES" }]
						}
					};

					const enumerationValues = test(path, newDocument);
					deepStrictEqual(enumerationValues, allModelValues.slice(0, 2));
				});
			});

			describe("where the master field is not in a repeatable group and dependent field is in a repeatable group", () => {
				const document = { A12T_DependentEnumeration: { Restricted: { Cars: [{}] } } };
				const path = createDocumentPath(
					["A12T_DependentEnumeration"],
					["Restricted"],
					["Cars"],
					["Model"]
				);

				it("returns all enumeration values with their localized label if no master value is set", () => {
					const enumerationValues = test(path, document);
					deepStrictEqual(enumerationValues, allModelValues);
				});

				it("returns only enumeration values with their localized label which fit the dependency", () => {
					const newDocument = {
						A12T_DependentEnumeration: {
							Restricted: { Cars: [{}], BrandRestriction: "MERCEDES" }
						}
					};
					const enumerationValues = test(path, newDocument);
					deepStrictEqual(enumerationValues, allModelValues.slice(0, 2));
				});
			});
		});

		describe("Enumeration values not dependent on any other field", () => {
			it("returns all enumeration values with their localized label if no dependency is defined for the enumeration", () => {
				const enumerationValues = test(MASTER_ENUMERATION_PATH);
				deepStrictEqual(enumerationValues, allBrandValues);
			});
		});
	});

	describe("getLocalizedEnumerationValues", () => {
		it("returns all localized enumeration values for an enumeration field", () => {
			const renderConfiguration = setupRenderConfiguration({
				models,
				data: {
					document: {
						A12T_DependentEnumeration: {
							Brand: "MERCEDES"
						}
					}
				}
			});
			const enumerationValues = EnumerableHelper.getLocalizedEnumerationValues(
				renderConfiguration.renderOptions,
				DEPENDENT_ENUMERATION_PATH,
				defaultLocalizerFactory({ locale: US_LOCALE, dataFormats: defaultDataFormats(US_LOCALE) })
			);

			deepStrictEqual(enumerationValues, allModelValues);
		});
	});
});
