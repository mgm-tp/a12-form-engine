// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
