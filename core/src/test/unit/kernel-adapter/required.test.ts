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

import { ok, strictEqual } from "node:assert/strict";

import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import type { Locale } from "@com.mgmtp.a12.utils/utils-localization";
import { defaultLocalizerFactory } from "@com.mgmtp.a12.utils/utils-localization";

import { fullValidation } from "../../../back-end/store/internal/validation.js";
import { DocumentPath } from "../../../models/internal/utils/document-utils.js";
import { createDocumentPath } from "../../utils/createDocumentPath.js";
import { US_LOCALE } from "../../utils/localization.js";
import { createTestStore } from "../../utils/setup.js";
import { setupModelsFixture } from "../../utils/setupFixture.js";

describe("api.back-end.store.kernel-adapter", () => {
	describe("Required", () => {
		const models = setupModelsFixture("computation-validation.required");

		function setupStore(locale: Locale, document?: GroupInstance) {
			return createTestStore({
				storeConfig: {
					locale,
					models: models,
					data: {
						document: document || {}
					}
				}
			});
		}

		describe("Given a document with no repeatable rows", () => {
			it("returns one validation message for each required field and no validation message for a required group", () => {
				const pathToStringField = createDocumentPath(["Root"], ["String"], ["RequiredString"]);

				const locale = US_LOCALE;
				const localizer = defaultLocalizerFactory({ locale });
				const store = setupStore(locale);
				const validationMessage = fullValidation(store.getState());

				const stringRequiredError = validationMessage.find(m =>
					DocumentPath.equal(m.element, pathToStringField)
				);
				ok(stringRequiredError !== undefined, "Expected to find an error to the field!");
				strictEqual(localizer(...stringRequiredError.errorText), "This field is required.");
			});

			it("returns no validation message for a required group", () => {
				const pathToStringGroup = createDocumentPath(["Root"], ["String"]);

				const store = setupStore(US_LOCALE);
				const validationMessage = fullValidation(store.getState());

				const stringGroupError = validationMessage.find(m =>
					DocumentPath.equal(m.element, pathToStringGroup)
				);
				ok(stringGroupError === undefined, "Expected to find no error to the group!");
			});

			it("returns no validation message for a required field in a repeatable group", () => {
				const pathToStringField = createDocumentPath(["Root"], ["Repeated"], ["RequiredString"]);

				const store = setupStore(US_LOCALE);
				const validationMessage = fullValidation(store.getState());

				const stringGroupError = validationMessage.find(m =>
					DocumentPath.equal(m.element, pathToStringField)
				);
				ok(
					stringGroupError === undefined,
					"Expected to find no error for a field in the repeatable group!"
				);
			});
		});

		describe("Given a document with repeatable rows", () => {
			it("returns a validation message for each required field in each row a repeatable group", () => {
				const pathToStringFieldRow1 = createDocumentPath(
					["Root"],
					["Repeated", 1],
					["RequiredString"]
				);
				const pathToStringFieldRow2 = createDocumentPath(
					["Root"],
					["Repeated", 2],
					["RequiredString"]
				);

				const store = setupStore(US_LOCALE, {
					Root: { Repeated: [{}, {}] }
				});
				const validationMessage = fullValidation(store.getState());

				const stringField1 = validationMessage.find(m =>
					DocumentPath.equal(m.element, pathToStringFieldRow1)
				);
				ok(stringField1 !== undefined, "Expected to find one error for StringField in row 1");

				const stringField2 = validationMessage.find(m =>
					DocumentPath.equal(m.element, pathToStringFieldRow2)
				);
				ok(stringField2 !== undefined, "Expected to find one error for StringField in row 2");
			});
		});
	});
});
