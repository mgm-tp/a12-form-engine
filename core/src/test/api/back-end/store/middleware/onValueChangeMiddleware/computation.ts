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

import { notStrictEqual, strictEqual } from "node:assert/strict";

import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { DataSelectors, Events, UiStateSelectors } from "../../../../../../back-end/store/index.js";
import {
	DocumentPath,
	DocumentUtils
} from "../../../../../../models/internal/utils/document-utils.js";
import { createDocumentPath } from "../../../../../utils/createDocumentPath.js";
import { createTestStore } from "../../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../../utils/setupFixture.js";
import { DOCUMENT_PATHS } from "../../../../../utils/test-model-helpers/computation.js";
import { generateAttachment } from "../../../../view/inputs/input-element/generic-tests/input-utils.js";

const {
	FIELD_A,
	FIELD_ATTACHMENT,
	FIELD_B,
	FIELD_C,
	FIELD_G,
	FIELD_H,
	FIELD_I,
	FIELD_MULTI_SELECT,
	FIELD_QUOTIENT
} = DOCUMENT_PATHS;

export function executeTestsForComputation(): void {
	describe("Computation", () => {
		const models = setupModelsFixture("computation-validation.computation");

		function setupStore(document?: object) {
			return createTestStore({ storeConfig: { models, data: { document: document || {} } } });
		}

		const pathFieldC = DocumentPath.toString(FIELD_C);
		const pathFieldG = DocumentPath.toString(FIELD_G);
		const pathFieldQuotient = DocumentPath.toString(FIELD_QUOTIENT);

		describe("field changes to a correct input", () => {
			it("sets the computed result", () => {
				const store = setupStore();
				store.dispatch(Events.valueChange({ path: FIELD_A, value: 1, formModelElementPath: [] }));
				store.dispatch(Events.valueChange({ path: FIELD_B, value: 2, formModelElementPath: [] }));

				const document = DataSelectors.document()(store.getState());
				const valueSum = DocumentUtils.getValue({
					document: document as GroupInstance,
					path: FIELD_C
				});

				const valueDiff = DocumentUtils.getValue({
					document: document as GroupInstance,
					path: FIELD_G
				});

				strictEqual(valueSum, 3, "Expected that the sum of A and B is calculated!");
				strictEqual(valueDiff, -1, "Expected that the difference of A and B is calculated!");
			});
		});

		describe("field changes to an incorrect input", () => {
			it("sets the computed result to null", () => {
				const store = setupStore();

				// First execute an initial computation
				store.dispatch(Events.valueChange({ path: FIELD_A, value: 1, formModelElementPath: [] }));
				store.dispatch(Events.valueChange({ path: FIELD_B, value: 2, formModelElementPath: [] }));

				const document = DataSelectors.document()(store.getState());
				const valueSum = DocumentUtils.getValue({
					document: document as GroupInstance,
					path: FIELD_C
				});

				const valueDiff = DocumentUtils.getValue({
					document: document as GroupInstance,
					path: FIELD_G
				});

				strictEqual(valueSum, 3, "Expected that the sum of A and B is calculated!");
				strictEqual(valueDiff, -1, "Expected that the difference of A and B is calculated!");

				// TEST
				// Set an invalid input for FIELD_A
				store.dispatch(Events.valueChange({ path: FIELD_A, value: -1, formModelElementPath: [] }));
				store.dispatch(Events.valueChange({ path: FIELD_B, value: 2, formModelElementPath: [] }));

				const documentAfter = DataSelectors.document()(store.getState());
				const valueSumAfter = DocumentUtils.getValue({
					document: documentAfter as GroupInstance,
					path: FIELD_C
				});

				const valueDiffAfter = DocumentUtils.getValue({
					document: documentAfter as GroupInstance,
					path: FIELD_G
				});

				strictEqual(valueSumAfter, null, "Expected that the sum of A and B is set to null!");
				strictEqual(
					valueDiffAfter,
					null,
					"Expected that the difference of A and B is set to null!"
				);
			});
		});

		describe("computation results in a validation error", () => {
			it("sets the computed results and the error messages", () => {
				const store = setupStore();

				store.dispatch(Events.valueChange({ path: FIELD_A, value: 1, formModelElementPath: [] }));
				store.dispatch(Events.valueChange({ path: FIELD_B, value: -22, formModelElementPath: [] }));

				const document = DataSelectors.document()(store.getState());
				const valueSum = DocumentUtils.getValue({
					document: document as GroupInstance,
					path: FIELD_C
				});

				const valueDiff = DocumentUtils.getValue({
					document: document as GroupInstance,
					path: FIELD_G
				});

				strictEqual(valueSum, -21, "Expected that the sum of A and B is calculated!");
				strictEqual(valueDiff, null, "Expected that the difference of A and B is not calculated!");

				const messages = UiStateSelectors.messages()(store.getState());
				const errorSumField = messages[pathFieldC];
				const errorDiffField = messages[pathFieldG];

				notStrictEqual(errorSumField, undefined, "Expected to find an error for the sum field");
				notStrictEqual(errorDiffField, undefined, "Expected to find an error for the diff field");
			});

			describe("clearing the source field clears the stale parse error on the computed field", () => {
				it("clears the parse error when the source field is cleared directly", () => {
					const store = setupStore();

					// Trigger a computation error: diff = 13 - 2 = 11 > 10
					store.dispatch(
						Events.valueChange({ path: FIELD_A, value: 13, formModelElementPath: [] })
					);
					store.dispatch(Events.valueChange({ path: FIELD_B, value: 2, formModelElementPath: [] }));

					notStrictEqual(
						UiStateSelectors.messages()(store.getState())[pathFieldG],
						undefined,
						"Expected FIELD_G to have a parse error after an invalid computation"
					);

					// Clear Field A — the computed difference becomes indeterminate
					store.dispatch(
						Events.valueChange({ path: FIELD_A, value: null, formModelElementPath: [] })
					);

					strictEqual(
						UiStateSelectors.messages()(store.getState())[pathFieldG],
						undefined,
						"Expected the stale parse error on FIELD_G to be cleared after Field A is cleared"
					);
				});
			});

			describe("computation results after changing to a correct value", () => {
				it("sets the new computed results and deletes the error messages", () => {
					const store = setupStore();

					// create an initial error
					store.dispatch(Events.valueChange({ path: FIELD_A, value: 1, formModelElementPath: [] }));
					store.dispatch(
						Events.valueChange({ path: FIELD_B, value: -22, formModelElementPath: [] })
					);

					const document = DataSelectors.document()(store.getState());
					const valueSum = DocumentUtils.getValue({
						document: document as GroupInstance,
						path: FIELD_C
					});

					const valueDiff = DocumentUtils.getValue({
						document: document as GroupInstance,
						path: FIELD_G
					});

					strictEqual(valueSum, -21, "Expected that the sum of A and B is calculated!");
					strictEqual(
						valueDiff,
						null,
						"Expected that the difference of A and B is not calculated!"
					);

					const messages = UiStateSelectors.messages()(store.getState());
					const errorSumField = messages[pathFieldC];
					const errorDiffField = messages[pathFieldG];

					notStrictEqual(errorSumField, undefined, "Expected to find an error for the sum field");
					notStrictEqual(errorDiffField, undefined, "Expected to find an error for the diff field");

					// TEST
					// Create a valid computation
					store.dispatch(Events.valueChange({ path: FIELD_A, value: 1, formModelElementPath: [] }));
					store.dispatch(Events.valueChange({ path: FIELD_B, value: 2, formModelElementPath: [] }));

					const documentAfter = DataSelectors.document()(store.getState());
					const valueSumAfter = DocumentUtils.getValue({
						document: documentAfter as GroupInstance,
						path: FIELD_C
					});

					const valueDiffAfter = DocumentUtils.getValue({
						document: documentAfter as GroupInstance,
						path: FIELD_G
					});

					strictEqual(valueSumAfter, 3, "Expected that the sum of A and B is calculated!");
					strictEqual(valueDiffAfter, -1, "Expected that the difference of A and B is calculated!");
				});
			});
		});

		describe("computation results in a syntax error", () => {
			it("sets the computed results to null and the error messages", () => {
				const initialDocument = {
					root: {
						NonRep: {
							FieldA: 1,
							FieldB: 2,
							FieldG: -1,
							FieldC: 3,
							ResultDivision: 0.5
						}
					}
				};
				const store = setupStore(initialDocument);

				store.dispatch(Events.valueChange({ path: FIELD_A, value: 56, formModelElementPath: [] }));
				store.dispatch(Events.valueChange({ path: FIELD_B, value: 17, formModelElementPath: [] }));

				const document = DataSelectors.document()(store.getState());
				const valueDivision = DocumentUtils.getValue({
					document: document as GroupInstance,
					path: FIELD_QUOTIENT
				});

				const valueDiff = DocumentUtils.getValue({
					document: document as GroupInstance,
					path: FIELD_G
				});

				strictEqual(
					valueDivision,
					null,
					"Expected that the calculations resets the value due to a syntax error"
				);
				strictEqual(valueDiff, null, "Expected that the difference of A and B is not calculated!");

				const messages = UiStateSelectors.messages()(store.getState());
				const errorQuotientField = messages[pathFieldQuotient];
				const errorDiffField = messages[pathFieldG];

				notStrictEqual(
					errorQuotientField?.parseError,
					undefined,
					"Expected to find a parse error for the quotient field"
				);

				notStrictEqual(errorDiffField, undefined, "Expected to find an error for the diff field");
			});

			describe("computation results after in a correct value", () => {
				it("sets the new computed results and deletes the error messages", () => {
					const initialDocument = {
						root: {
							NonRep: {
								FieldA: 1,
								FieldB: 2,
								FieldG: -1,
								FieldC: 3,
								ResultDivision: 0.5
							}
						}
					};
					const store = setupStore(initialDocument);

					// create an initial error
					store.dispatch(
						Events.valueChange({ path: FIELD_A, value: 56, formModelElementPath: [] })
					);
					store.dispatch(
						Events.valueChange({ path: FIELD_B, value: 17, formModelElementPath: [] })
					);

					const messages = UiStateSelectors.messages()(store.getState());
					const errorQuotientField = messages[pathFieldQuotient];

					notStrictEqual(
						errorQuotientField?.parseError,
						undefined,
						"Expected to find a parse error for the quotient field"
					);

					// TEST
					// Create a valid computation
					store.dispatch(Events.valueChange({ path: FIELD_A, value: 1, formModelElementPath: [] }));
					store.dispatch(Events.valueChange({ path: FIELD_B, value: 2, formModelElementPath: [] }));

					const documentAfter = DataSelectors.document()(store.getState());
					const valueDivisionAfter = DocumentUtils.getValue({
						document: documentAfter as GroupInstance,
						path: FIELD_QUOTIENT
					});

					strictEqual(valueDivisionAfter, 0.5, "Expected that the sum of A and B is calculated!");
				});
			});
		});

		describe("compute based on dependency", () => {
			const MASTER_FIELD = createDocumentPath(
				["root"],
				["DependentComputation"],
				["enumerationField"]
			);
			const DC_FIELD_A = createDocumentPath(["root"], ["DependentComputation"], ["FieldA"]);
			const DC_FIELD_B = createDocumentPath(["root"], ["DependentComputation"], ["FieldB"]);
			const DC_FIELD_C = createDocumentPath(["root"], ["DependentComputation"], ["FieldC"]);

			it("will only compute if the master field is set to 'yes'", () => {
				const store = setupStore();

				store.dispatch(
					Events.valueChange({ path: MASTER_FIELD, value: "key_2", formModelElementPath: [] })
				);
				store.dispatch(
					Events.valueChange({ path: DC_FIELD_A, value: 2, formModelElementPath: [] })
				);
				store.dispatch(
					Events.valueChange({ path: DC_FIELD_B, value: 1, formModelElementPath: [] })
				);

				const documentBefore = DataSelectors.document()(store.getState());
				const valueSumBefore = DocumentUtils.getValue({
					document: documentBefore as GroupInstance,
					path: DC_FIELD_C
				});

				strictEqual(valueSumBefore, null, "Expected that the sum of A and B is not calculated!");

				// Change to value which indicates that a computation should be executed
				store.dispatch(
					Events.valueChange({ path: MASTER_FIELD, value: "key_1", formModelElementPath: [] })
				);
				const documentAfter = DataSelectors.document()(store.getState());
				const valueSumAfter = DocumentUtils.getValue({
					document: documentAfter as GroupInstance,
					path: DC_FIELD_C
				});

				strictEqual(valueSumAfter, 3, "Expected that the sum of A and B is not calculated!");
			});
		});

		describe("MultiSelect", () => {
			describe("Value is added", () => {
				it("triggers a computation and set the result correctly", () => {
					const store = setupStore();
					store.dispatch(
						Events.multiSelectValueChange({
							path: FIELD_MULTI_SELECT,
							value: [{ value: "key2" }, { value: "key1" }],
							formModelElementPath: []
						})
					);

					const document = DataSelectors.document()(store.getState());
					const value = DocumentUtils.getValue({
						document: document as GroupInstance,
						path: FIELD_H
					});

					strictEqual(value, 2);
				});
			});

			describe("All values are removed", () => {
				it("triggers a computation and set the result correctly", () => {
					const initialDocument = {
						root: {
							MultiSelectComputation: {
								MultiSelect1: [{ value: "key1" }, { value: "key2" }],
								FieldH: 2
							}
						}
					};

					const store = setupStore(initialDocument);
					store.dispatch(
						Events.multiSelectValueChange({
							path: FIELD_MULTI_SELECT,
							value: [],
							formModelElementPath: []
						})
					);

					const document = DataSelectors.document()(store.getState());
					const value = DocumentUtils.getValue({
						document: document as GroupInstance,
						path: FIELD_H
					});

					strictEqual(value, 0);
				});
			});
		});

		describe("Attachment", () => {
			describe("Attachment is added", () => {
				it("triggers a computation and set the result correctly", () => {
					const store = setupStore();
					store.dispatch(
						Events.attachmentValueChange({
							path: FIELD_ATTACHMENT,
							value: generateAttachment({ size: 1200 }),
							formModelElementPath: []
						})
					);

					const document = DataSelectors.document()(store.getState());
					const value = DocumentUtils.getValue({
						document: document as GroupInstance,
						path: FIELD_I
					});

					strictEqual(value, 1.2);
				});
			});

			describe("Attachment is removed", () => {
				it("triggers a computation and set the result correctly", () => {
					const initialDocument = {
						root: {
							AttachmentComputation: {
								Attachment: generateAttachment({ size: 1200 }),
								FieldI: 1.2
							}
						}
					};

					const store = setupStore(initialDocument);
					store.dispatch(
						Events.attachmentValueChange({
							path: FIELD_ATTACHMENT,
							value: {},
							formModelElementPath: []
						})
					);

					const document = DataSelectors.document()(store.getState());
					const value = DocumentUtils.getValue({
						document: document as GroupInstance,
						path: FIELD_I
					});

					strictEqual(value, null);
				});
			});
		});
	});
}
