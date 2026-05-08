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

import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { DataSelectors, Events } from "../../../../../../back-end/store/index.js";
import { DocumentUtils } from "../../../../../../models/internal/utils/document-utils.js";
import { setupModelsFixture } from "../../../../../utils/setupFixture.js";
import { DEP_ELEMENT } from "../../../../../utils/test-model-helpers/dependent-element.js";

import { executeChainedDependencyTests } from "./chainedDependencies.js";
import { executeClearParseErrorTests } from "./clearParseErrorTests.js";
import { executeDependentFieldTests } from "./dependentField.js";
import { executeTestsForErrorMessages } from "./errorMessages.js";

export function executeTestsForDependentElement(): void {
	describe("Dependent Elements", () => {
		const models = setupModelsFixture("dependencies.element");

		describe("Single value changes", () => {
			describe("Dependent Field", () => {
				executeDependentFieldTests(models);
			});
		});

		describe("Multiple dependencies", () => {
			it("sets all of the dependent fields", () => {
				const store = DEP_ELEMENT.setupStore({ models });
				store.dispatch(
					Events.valueChange({
						path: DEP_ELEMENT.pathToMasterEnumerationField,
						value: DEP_ELEMENT.SET_FIELD_VALUE_FIELD,
						formModelElementPath: []
					})
				);

				const document = DataSelectors.document()(store.getState());
				const value1 = DocumentUtils.getValue({
					document: document as GroupInstance,
					path: [
						...DEP_ELEMENT.ENUMERATION.DEPENDENT_FIELD_GROUP,
						{ elementName: DEP_ELEMENT.SET_FIELD_VALUE_FIELD, index: 1 }
					]
				});

				const value2 = DocumentUtils.getValue({
					document: document as GroupInstance,
					path: [
						...DEP_ELEMENT.ENUMERATION.DEPENDENT_FIELD_GROUP,
						{ elementName: "DependentFieldValue2", index: 1 }
					]
				});

				strictEqual(value1, "FieldValue");
				strictEqual(value2, "FieldValue");
			});
		});

		describe("Error messages", () => {
			executeTestsForErrorMessages();
		});

		describe("Chained dependencies", () => {
			executeChainedDependencyTests(models);
		});

		describe("Clear parse messages", () => {
			executeClearParseErrorTests(models);
		});
	});
}
