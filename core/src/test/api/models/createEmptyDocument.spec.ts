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
