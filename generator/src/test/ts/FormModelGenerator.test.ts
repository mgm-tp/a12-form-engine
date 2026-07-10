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

import { deepStrictEqual } from "node:assert/strict";

import FormModelGenerator from "../../main/ts/generator/index.js";

import * as Readers from "./readers.js";

const TEST_MODELS: TestModel[] = [
	{ name: "ExampleModel" },
	{ name: "RepeatableGroupModel" },
	{ name: "AttachmentModel" },
	{ name: "MultiSelectModel" },
	{ name: "NestedGroups" },
	{ name: "Metadata" },
	{ name: "LabelsLocales", formModelLocales: ["en"] }
];

// generate separate tests to get a nicer output
describe("FormModelGenerator", () => {
	TEST_MODELS.forEach(defineTest);
});

// test a single model by generating the form and comparing it with the
// reference
function defineTest(testModel: TestModel) {
	it(testModel.name, () => {
		const exampleModel = Readers.readDocumentModel(`${testModel.name}.json`);
		const result = FormModelGenerator(exampleModel, testModel.formModelLocales).createFormModel(
			`Generated_from_${testModel.name}`
		);
		// uncomment to update reference files (be careful, overwrites files!)
		// Readers.writeTestJSON(`Generated_from_${testModel.name}.json`, result);

		const reference = Readers.readTestJSON(`Generated_from_${testModel.name}.json`);
		deepStrictEqual(result, reference);
	});
}

interface TestModel {
	name: string;
	formModelLocales?: string[];
}
