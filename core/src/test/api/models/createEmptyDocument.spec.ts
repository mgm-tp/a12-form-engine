// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { deepStrictEqual } from "node:assert/strict";

import type { FormModel } from "../../../models/index.js";
import { createEmptyDocument } from "../../../models/index.js";
import { setupModelsFixture } from "../../utils/setupFixture.js";

describe("api.models.createEmptyDocument", () => {
	const model = setupModelsFixture("controls");
	const modelWithInitialValues = setupModelsFixture("controls.initial-values");
	const modelWithInitialRows = setupModelsFixture("repeat", "inline-initial-rows");
	const modelWithInitialRowsAndValues = setupModelsFixture(
		"repeat",
		"inline-initial-rows-and-values"
	);

	const modelWithControlIndex = setupModelsFixture("controls.index", undefined, form => ({
		...form,
		content: { ...form.content, fieldConfiguration: {} } as FormModel.Content
	}));
	const modelWithControlIndexWithInitialValues = setupModelsFixture("controls.index");

	describe("given a document model", () => {
		describe("and a form model without initial values", () => {
			describe("and with no numberOfInitialRows defined in the groupConfiguration", () => {
				it("returns an empty document", () => {
					const createdDocument = createEmptyDocument(model.documentModel, model.formModel);
					deepStrictEqual(createdDocument, {});
				});
			});

			describe("and with numberOfInitialRows defined for a group in the groupConfiguration", () => {
				it("returns a document containing the specified number of empty rows", () => {
					const createdDocument = createEmptyDocument(
						modelWithInitialRows.documentModel,
						modelWithInitialRows.formModel
					);
					deepStrictEqual(createdDocument, {
						Root: {
							Nested_L2: [{}, {}, {}]
						}
					});
				});
			});

			describe("and controls with index are defined", () => {
				it("returns a document without values", () => {
					const createdDocument = createEmptyDocument(
						modelWithControlIndex.documentModel,
						modelWithControlIndex.formModel
					);
					deepStrictEqual(createdDocument, {});
				});
			});
		});

		describe("and a form model with initial values", () => {
			describe("and with no numberOfInitialRows defined in the groupConfiguration", () => {
				it("returns a document where the initial values are filled", () => {
					const createdDocument = createEmptyDocument(
						modelWithInitialValues.documentModel,
						modelWithInitialValues.formModel
					);
					deepStrictEqual(createdDocument, {
						rootGroup: {
							withInitialValues: {
								StringField: "String value",
								NumberField: 42,
								BooleanFieldTrue: true,
								BooleanFieldFalse: false,
								ConfirmField: true,
								DateField: new Date("2020-03-09"),
								DateTimeField: new Date("2020-03-09T09:25:00.000Z"),
								TimeField: new Date("1970-01-01T10:25:00.000Z"),
								EnumerationField: "key_2"
							}
						}
					});
				});
			});

			describe("and with numberOfInitialRows defined for a group in the groupConfiguration", () => {
				it("returns a document containing the specified number of empty rows where the initial values are filled", () => {
					const createdDocument = createEmptyDocument(
						modelWithInitialRowsAndValues.documentModel,
						modelWithInitialRowsAndValues.formModel
					);
					deepStrictEqual(createdDocument, {
						Root: {
							Nested_L2: [
								{
									L2_String: "Test",
									L2_Number: 42,
									L2_Boolean: true,
									L2_Date: new Date("2000-01-01")
								},
								{
									L2_String: "Test",
									L2_Number: 42,
									L2_Boolean: true,
									L2_Date: new Date("2000-01-01")
								},
								{
									L2_String: "Test",
									L2_Number: 42,
									L2_Boolean: true,
									L2_Date: new Date("2000-01-01")
								}
							]
						}
					});
				});
			});

			describe("and controls with index are defined", () => {
				it("returns a document with initial values", () => {
					const createdDocument = createEmptyDocument(
						modelWithControlIndexWithInitialValues.documentModel,
						modelWithControlIndexWithInitialValues.formModel
					);
					deepStrictEqual(createdDocument, {
						root: {
							contacts_with_children_count: [
								{
									applicant: true,
									details: {
										number_of_children: 0
									}
								},
								{
									applicant: false,
									details: {
										number_of_children: 0
									}
								}
							]
						}
					});
				});
			});
		});
	});
});
