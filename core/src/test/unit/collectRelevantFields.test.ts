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

import { notDeepStrictEqual, strictEqual } from "node:assert/strict";

import deepEqual from "fast-deep-equal";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { createEngineStore } from "../../back-end/store/index.js";
import type { RelevantFieldPaths } from "../../back-end/store/internal/collectRelevantFields.js";
import { collectRelevantFields } from "../../back-end/store/internal/collectRelevantFields.js";
import { DocumentPath, DocumentUtils } from "../../models/internal/utils/document-utils.js";

import { US_LOCALE } from "../utils/localization.js";
import { setupModelsFixture } from "../utils/setupFixture.js";
import {
	DOCUMENT_MODEL as DM,
	VISIBLE_FIELDS
} from "../utils/test-model-helpers/validation.partial.js";

describe("unit.back-end.store.collectRelevantFields", () => {
	const models = setupModelsFixture("computation-validation.partial");

	function assertRelevantFieldsContains(
		actual: RelevantFieldPaths[],
		expected: RelevantFieldPaths[]
	): void {
		expected.forEach(e =>
			strictEqual(
				actual.some(a => deepEqual(a, e)),
				true,
				`Expected ${JSON.stringify(e)} to be relevant`
			)
		);
	}

	function assertNoRelevantFields(
		actual: RelevantFieldPaths[],
		notExpected: EntityInstancePath[]
	): void {
		const actualDocumentPaths = actual.map(a => a.documentPath);
		notExpected.forEach(path =>
			actualDocumentPaths.forEach(actualPath =>
				notDeepStrictEqual(
					actualPath,
					path,
					`${DocumentPath.toString(path)} should not be relevant`
				)
			)
		);
	}

	describe("General", () => {
		// Screen validation is already tested extensively in the tests
		// for dependent fields, groups, ... => so we skip it here

		describe("Given an initial form model path", () => {
			describe("where the form model path points to an inline repeat", () => {
				describe("and no row path is given", () => {
					// Table validation
					it(
						"returns an entry with row index 0 for each field column cell in an inline repeat, " +
							"but no entries for fields outside of the repeat",
						() => {
							const document = DM.visiblePreFilledInlineRepeatWithVisibleColumn();
							const initialState = createEngineStore({
								models,
								locale: US_LOCALE,
								data: { document }
							});
							const relevantFields = collectRelevantFields(initialState, VISIBLE_FIELDS.irInMCS);
							assertRelevantFieldsContains(relevantFields, [
								{
									documentPath: DM.pathToGroup2RepeatableStringField(0),
									formModelPath: VISIBLE_FIELDS.requiredStringInIRInMCS
								}
							]);
							assertNoRelevantFields(relevantFields, [DM.pathToMasterEnumField]);
						}
					);
				});

				describe("and a row path is given", () => {
					// Row validation
					it(
						"returns an entry with the specific row index for each field column cell in an inline repeat, " +
							"but no entries for other rows or fields outside of the repeat",
						() => {
							const document = DM.visiblePreFilledInlineRepeatWithVisibleColumn();
							const initialState = createEngineStore({
								models,
								locale: US_LOCALE,
								data: { document }
							});
							const relevantFields = collectRelevantFields(
								initialState,
								VISIBLE_FIELDS.irInMCS,
								DM.pathToGroup2RepeatInstance(2)
							);
							assertRelevantFieldsContains(relevantFields, [
								{
									documentPath: DM.pathToGroup2RepeatableStringField(2),
									formModelPath: VISIBLE_FIELDS.requiredStringInIRInMCS
								}
							]);
							assertNoRelevantFields(relevantFields, [
								DM.pathToMasterEnumField,
								DM.pathToGroup2RepeatableStringField(1)
							]);
						}
					);
				});
			});

			describe("where the form model path points to an embedded repeat control grid", () => {
				describe("and no row path is given", () => {
					// Table validation
					it(
						"returns an entry with row index 0 for each field column cell in an embedded repeat control grid, " +
							"but no entries for fields outside of the repeat",
						() => {
							const document = DM.visiblePreFilledEmbeddedRepeatWithVisibleColumn();
							const initialState = createEngineStore({
								models,
								locale: US_LOCALE,
								data: { document }
							});
							const relevantFields = collectRelevantFields(initialState, VISIBLE_FIELDS.erCgGroup2);
							assertRelevantFieldsContains(relevantFields, [
								{
									documentPath: DM.pathToGroup2RepeatableStringField(0),
									formModelPath: VISIBLE_FIELDS.requiredStringInERGroup2
								}
							]);
							assertNoRelevantFields(relevantFields, [DM.pathToMasterEnumField]);
						}
					);
				});

				describe("and a row path is given", () => {
					// Row validation
					it(
						"returns an entry with the specific row index for each field column cell in an embedded repeat control grid, " +
							"but no entries for other rows or fields outside of the repeat",
						() => {
							const document = DM.visiblePreFilledEmbeddedRepeatWithVisibleColumn();
							const initialState = createEngineStore({
								models,
								locale: US_LOCALE,
								data: { document }
							});
							const relevantFields = collectRelevantFields(
								initialState,
								VISIBLE_FIELDS.erCgGroup2,
								DM.pathToGroup2RepeatInstance(2)
							);
							assertRelevantFieldsContains(relevantFields, [
								{
									documentPath: DM.pathToGroup2RepeatableStringField(2),
									formModelPath: VISIBLE_FIELDS.requiredStringInERGroup2
								}
							]);
							assertNoRelevantFields(relevantFields, [
								DM.pathToMasterEnumField,
								DM.pathToGroup2RepeatableStringField(1)
							]);
						}
					);
				});
			});
		});
	});

	describe("DependentField", () => {
		describe("No field is hidden", () => {
			it("returns all relevant controls of the target screen", () => {
				const document = DocumentUtils.setValue(
					{},
					DM.pathToMasterBooleanField,
					true,
					models.documentModel
				);
				const initialState = createEngineStore({
					models,
					locale: US_LOCALE,
					data: { document }
				});
				const relevantFields = collectRelevantFields(initialState);
				assertRelevantFieldsContains(relevantFields, [
					{
						documentPath: DM.pathToRequiredString,
						formModelPath: VISIBLE_FIELDS.requiredStringControl
					}
				]);
			});

			it("returns an entry with row index 0 for each field column cell in an inline repeat", () => {
				const document = DM.visiblePreFilledInlineRepeatWithVisibleColumn();
				const initialState = createEngineStore({
					models,
					locale: US_LOCALE,
					data: { document }
				});
				const relevantFields = collectRelevantFields(initialState);
				assertRelevantFieldsContains(relevantFields, [
					{
						documentPath: DM.pathToGroup2RepeatableStringField(0),
						formModelPath: VISIBLE_FIELDS.requiredStringInIRInMCS
					}
				]);

				// individual entries should not be returned
				assertNoRelevantFields(relevantFields, [
					DM.pathToGroup2RepeatableStringField(1),
					DM.pathToGroup2RepeatableStringField(2)
				]);
			});

			it("returns an entry with row index 0 for each control in an embedded repeat control grid", () => {
				const document = DM.visiblePreFilledEmbeddedRepeatWithVisibleColumn();
				const initialState = createEngineStore({
					models,
					locale: US_LOCALE,
					data: { document }
				});
				const relevantFields = collectRelevantFields(initialState);
				assertRelevantFieldsContains(relevantFields, [
					{
						documentPath: DM.pathToGroup2RepeatableStringField(0),
						formModelPath: VISIBLE_FIELDS.requiredStringInERGroup2
					}
				]);

				// individual entries should not be returned
				assertNoRelevantFields(relevantFields, [
					DM.pathToGroup2RepeatableStringField(1),
					DM.pathToGroup2RepeatableStringField(2)
				]);
			});
		});

		describe("At least one field is hidden", () => {
			it("does not return controls that were hidden", () => {
				const initialState = createEngineStore({
					models,
					locale: US_LOCALE,
					data: {
						document: {
							validation: {
								visibleFields: {
									masterBoolean: false
								}
							}
						}
					}
				});
				const relevantFields = collectRelevantFields(initialState, undefined, undefined);

				assertNoRelevantFields(relevantFields, [DM.pathToRequiredString]);
			});

			it("does not return field columns of inline repeats that are hidden", () => {
				const document = DM.visiblePreFilledInlineRepeatWithHiddenColumns();

				const initialState = createEngineStore({
					models,
					locale: US_LOCALE,
					data: { document }
				});
				const relevantFields = collectRelevantFields(initialState);

				assertNoRelevantFields(relevantFields, [
					// the whole string field column should be empty due to a dependent field dependency
					DM.pathToGroup2RepeatableStringField(0),
					DM.pathToGroup2RepeatableStringField(1),
					DM.pathToGroup2RepeatableStringField(2)
				]);
			});

			it("does not return field columns cells of individual rows of inline repeats that are hidden", () => {
				const document = DM.visiblePreFilledInlineRepeatWithHiddenColumns();

				const initialState = createEngineStore({
					models,
					locale: US_LOCALE,
					data: { document }
				});
				const relevantFields = collectRelevantFields(initialState);

				// the dependent hidden field for group index 1 is hidden due to a row-local dependency
				// and thus should not be relevant!
				assertNoRelevantFields(relevantFields, [
					DM.pathToGroup2RepeatableDependentHiddenField(0),
					DM.pathToGroup2RepeatableDependentHiddenField(1)
				]);

				// the same field for row #2 is visible and thus relevant, though
				assertRelevantFieldsContains(relevantFields, [
					{
						documentPath: DM.pathToGroup2RepeatableDependentHiddenField(2),
						formModelPath: VISIBLE_FIELDS.localDependentHiddenInIRInMCS
					}
				]);
			});

			it("does not return controls of embedded repeat control grids that are hidden", () => {
				const document = DM.visiblePreFilledEmbeddedRepeatWithHiddenColumns();
				const initialState = createEngineStore({
					models,
					locale: US_LOCALE,
					data: { document }
				});
				const relevantFields = collectRelevantFields(initialState);

				assertNoRelevantFields(relevantFields, [
					// the whole string field column should be empty due to a dependent field dependency
					DM.pathToGroup2RepeatableStringField(0),
					DM.pathToGroup2RepeatableStringField(1),
					DM.pathToGroup2RepeatableStringField(2)
				]);
			});

			it("does not return controls of individual rows of embedded repeat control grids that are hidden", () => {
				const document = DM.visiblePreFilledEmbeddedRepeatWithHiddenColumns();
				const initialState = createEngineStore({
					models,
					locale: US_LOCALE,
					data: { document }
				});
				const relevantFields = collectRelevantFields(initialState);

				// the dependent hidden field for group index 1 is hidden due to a row-local dependency
				// and thus should not be relevant!
				assertNoRelevantFields(relevantFields, [
					DM.pathToGroup2RepeatableDependentHiddenField(0),
					DM.pathToGroup2RepeatableDependentHiddenField(1)
				]);

				// the same field for row #2 is visible and thus relevant, though
				assertRelevantFieldsContains(relevantFields, [
					{
						documentPath: DM.pathToGroup2RepeatableDependentHiddenField(2),
						formModelPath: VISIBLE_FIELDS.localDependentHiddenInERGroup2
					}
				]);
			});
		});
	});

	describe("DependentGroup", () => {
		describe("No group is hidden", () => {
			it("returns all relevant controls, inline repeat columns of the target screen", () => {
				const document = DM.dependentGroupNoHiddenColumnsInlineRepeat();
				const secModelPathString = ModelPath.toString(VISIBLE_FIELDS.secIRGroup1ModelPath);

				const initialState = createEngineStore({
					models,
					ui: {
						sectionState: {
							[secModelPathString]: false
						}
					},
					locale: US_LOCALE,
					data: { document }
				});
				const relevantFields = collectRelevantFields(initialState);
				assertRelevantFieldsContains(relevantFields, [
					{
						documentPath: DM.pathToGroup1RepeatableStringField(0),
						formModelPath: VISIBLE_FIELDS.requiredStringInIRGroup1
					}
				]);

				// individual entries should not be returned
				assertNoRelevantFields(relevantFields, [
					DM.pathToGroup1RepeatableStringField(1),
					DM.pathToGroup1RepeatableStringField(2)
				]);
			});

			it("returns all relevant controls of embedded repeat control grids of the target screen", () => {
				const document = DM.dependentGroupNoHiddenColumnsEmbeddedRepeat();

				const initialState = createEngineStore({
					models,
					locale: US_LOCALE,
					data: { document }
				});
				const relevantFields = collectRelevantFields(initialState);
				assertRelevantFieldsContains(relevantFields, [
					{
						documentPath: DM.pathToGroup1RepeatableStringField(0),
						formModelPath: VISIBLE_FIELDS.requiredStringInERGroup1
					}
				]);

				// individual entries should not be returned
				assertNoRelevantFields(relevantFields, [
					DM.pathToGroup1RepeatableStringField(1),
					DM.pathToGroup1RepeatableStringField(2)
				]);
			});
		});

		describe("At least one group is hidden", () => {
			it("does not return inline repeat field columns of repeats that are hidden", () => {
				const document = DM.dependentGroupHiddenColumnsInlineRepeat();
				const secModelPathString = ModelPath.toString(VISIBLE_FIELDS.secIRGroup1ModelPath);

				const initialState = createEngineStore({
					models,
					ui: {
						sectionState: {
							[secModelPathString]: false
						}
					},
					locale: US_LOCALE,
					data: { document }
				});
				const relevantFields = collectRelevantFields(initialState);

				assertNoRelevantFields(relevantFields, [
					DM.pathToGroup1RepeatableStringField(0),
					DM.pathToGroup1RepeatableStringField(1),
					DM.pathToGroup1RepeatableStringField(2)
				]);
			});

			it("does not return inline repeat field columns cells of individual rows of inline repeats that are hidden", () => {
				const document = DM.dependentGroupHiddenColumnsInSomeRowsInlineRepeat();

				const initialState = createEngineStore({
					models,
					locale: US_LOCALE,
					data: { document }
				});
				const relevantFields = collectRelevantFields(initialState);

				// the nested group within the repeatable group is hidden for the first row
				assertNoRelevantFields(relevantFields, [
					DM.pathToNestedNonRepeatableGroupStringField(0),
					DM.pathToNestedNonRepeatableGroupStringField(1)
				]);

				// the nested group within the repeatable group is not hidden for the second row
				assertRelevantFieldsContains(relevantFields, [
					{
						documentPath: DM.pathToNestedNonRepeatableGroupStringField(2),
						formModelPath: VISIBLE_FIELDS.nestedNonRepeatableStringInIRInMCS
					}
				]);
			});

			it("does not return controls in an embedded repeat that is hidden", () => {
				const document = DM.dependentGroupHiddenColumnsEmbeddedRepeat();
				const secModelPathString = ModelPath.toString(VISIBLE_FIELDS.secIRGroup1ModelPath);

				const initialState = createEngineStore({
					models,
					ui: {
						sectionState: {
							[secModelPathString]: false
						}
					},
					locale: US_LOCALE,
					data: { document }
				});
				const relevantFields = collectRelevantFields(initialState);

				assertNoRelevantFields(relevantFields, [
					DM.pathToGroup1RepeatableStringField(0),
					DM.pathToGroup1RepeatableStringField(1),
					DM.pathToGroup1RepeatableStringField(2)
				]);
			});

			it("does not return controls in an embedded repeat of individual rows that are hidden", () => {
				const document = DM.dependentGroupHiddenColumnsInSomeRowsEmbeddedRepeat();

				const initialState = createEngineStore({
					models,
					locale: US_LOCALE,
					data: { document }
				});
				const relevantFields = collectRelevantFields(initialState);

				// the nested group within the repeatable group is hidden for the first row
				assertNoRelevantFields(relevantFields, [
					DM.pathToNestedNonRepeatableGroupStringField(0),
					DM.pathToNestedNonRepeatableGroupStringField(1)
				]);

				// the nested group within the repeatable group is not hidden for the second row
				assertRelevantFieldsContains(relevantFields, [
					{
						documentPath: DM.pathToNestedNonRepeatableGroupStringField(2),
						formModelPath: VISIBLE_FIELDS.nestedNonRepeatableStringInERGroup2
					}
				]);
			});
		});
	});

	describe("DependentControl", () => {
		describe("Screen element is not hidden", () => {
			it("returns all relevant controls from inside the multi-column section", () => {
				const document = DM.visiblePreFilledInlineRepeatWithVisibleColumn();
				const initialState = createEngineStore({
					models,
					locale: US_LOCALE,
					data: { document }
				});
				const relevantFields = collectRelevantFields(initialState);
				assertRelevantFieldsContains(relevantFields, [
					{
						documentPath: DM.pathToGroup2RepeatableStringField(0),
						formModelPath: VISIBLE_FIELDS.requiredStringInIRInMCS
					}
				]);
			});

			it("returns all relevant controls from inside the section", () => {
				const document = DM.visibleSection();
				const sec1ModelPathString = ModelPath.toString(VISIBLE_FIELDS.secIRGroup1ModelPath);
				const initialState = createEngineStore({
					models,
					ui: {
						sectionState: {
							[sec1ModelPathString]: false
						}
					},
					locale: US_LOCALE,
					data: { document }
				});
				const relevantFields = collectRelevantFields(initialState);
				assertRelevantFieldsContains(relevantFields, [
					{
						documentPath: DM.pathToGroup1RepeatableStringField(0),
						formModelPath: VISIBLE_FIELDS.requiredStringInIRGroup1
					}
				]);
			});

			it("returns all relevant controls from inside the control grid", () => {
				const document = DM.visibleCG();
				const initialState = createEngineStore({
					models,
					locale: US_LOCALE,
					data: { document }
				});
				const relevantFields = collectRelevantFields(initialState);
				assertRelevantFieldsContains(relevantFields, [
					{
						documentPath: DM.pathToNumberField,
						formModelPath: VISIBLE_FIELDS.numberField
					}
				]);
			});
		});

		describe("A section is hidden", () => {
			it("does not return controls/field columns from inside the section", () => {
				const document = DM.hiddenSection();
				const secModelPathString = ModelPath.toString(VISIBLE_FIELDS.secIRGroup1ModelPath);
				const initialState = createEngineStore({
					models,
					ui: {
						sectionState: {
							[secModelPathString]: false
						}
					},
					locale: US_LOCALE,
					data: { document }
				});
				const relevantFields = collectRelevantFields(initialState);
				assertNoRelevantFields(relevantFields, [DM.pathToGroup1RepeatableStringField(0)]);
			});
		});

		describe("A multi-column section is hidden", () => {
			it("does not return controls/field columns from inside the multi-column section", () => {
				const document = DM.hiddenMCS();
				const initialState = createEngineStore({
					models,
					locale: US_LOCALE,
					data: { document }
				});
				const relevantFields = collectRelevantFields(initialState);
				assertNoRelevantFields(relevantFields, [DM.pathToGroup2RepeatableStringField(0)]);
			});
		});

		describe("A control grid is hidden", () => {
			it("does not return controls from inside the control-grid", () => {
				const document = DM.hiddenCG();
				const initialState = createEngineStore({
					models,
					locale: US_LOCALE,
					data: { document }
				});
				const relevantFields = collectRelevantFields(initialState);
				assertNoRelevantFields(relevantFields, [DM.pathToNumberField]);
			});
		});
	});

	describe("Section Collapse", () => {
		describe("The section is collapsed by default", () => {
			it("does not return controls/field columns from inside the section", () => {
				const document = DM.collapsedByDefault();
				const initialState = createEngineStore({
					models,
					locale: US_LOCALE,
					data: { document }
				});
				const relevantFields = collectRelevantFields(initialState);
				assertNoRelevantFields(relevantFields, [DM.pathToGroup1RepeatableStringField(0)]);
			});
		});

		describe("The section is collapsed by the user", () => {
			it("returns no controls/field columns from inside the section", () => {
				const secModelPathString = ModelPath.toString(VISIBLE_FIELDS.sec2ModelPath);
				const initialState = createEngineStore({
					models,
					ui: {
						sectionState: {
							[secModelPathString]: true
						}
					},
					locale: US_LOCALE,
					data: { document: {} }
				});
				const relevantFields = collectRelevantFields(initialState);
				assertNoRelevantFields(relevantFields, [DM.pathToNumberField2]);
			});
		});

		describe("The section is not collapsed", () => {
			it("returns all relevant controls/field columns from inside the section", () => {
				const initialState = createEngineStore({
					models,
					locale: US_LOCALE,
					data: { document: {} }
				});
				const relevantFields = collectRelevantFields(initialState);
				assertRelevantFieldsContains(relevantFields, [
					{
						documentPath: DM.pathToNumberField2,
						formModelPath: VISIBLE_FIELDS.numberField2
					}
				]);
			});
		});

		describe("The section cannot be collapsed", () => {
			it("returns all relevant controls/field columns from inside the section", () => {
				const initialState = createEngineStore({
					models,
					locale: US_LOCALE,
					data: { document: {} }
				});
				const relevantFields = collectRelevantFields(initialState);
				assertRelevantFieldsContains(relevantFields, [
					{
						documentPath: DM.pathToMasterEnum2Field,
						formModelPath: VISIBLE_FIELDS.masterEnumField
					}
				]);
			});
		});
	});

	describe("Repeat", () => {
		describe("Detached Repeat", () => {
			it("returns all controls from the detail screen", () => {
				const document = DM.documentRepeat({ detachedRepeat: true });
				const initialState = createEngineStore({
					models,
					locale: US_LOCALE,
					data: { document },
					ui: {
						screenLocation: [
							{
								locationPath: [{ elementName: "Screen2" }],
								path: []
							},
							{
								path: [
									{ elementName: "validation", index: 1 },
									{ elementName: "repeatableGroup2", index: 1 }
								],
								locationPath: [
									{ elementName: "Screen2" },
									{ elementName: "inline-repeat-repeatableGroup" },
									{ elementName: "inline-repeat-repeatableGroup-detail-screen" }
								]
							}
						]
					}
				});
				const relevantFields = collectRelevantFields(initialState);

				assertRelevantFieldsContains(relevantFields, [
					{
						documentPath: DM.pathToGroup2RepeatableStringField(1),
						formModelPath: VISIBLE_FIELDS.requiredStringInDRDetailScreen
					},
					{
						documentPath: DM.pathToNestedRepeatableGroupStringField(0),
						formModelPath: VISIBLE_FIELDS.requiredStringInNestedRepeat
					}
				]);
			});
		});

		describe("Embedded Repeat", () => {
			it("returns all controls from the detail control-grid but no entries for FieldOverviewColumns which are not represented in the grid", () => {
				const document = DM.documentRepeat({ embeddedRepeat: true });
				const initialState = createEngineStore({
					models,
					locale: US_LOCALE,
					data: { document },
					ui: {
						screenLocation: [
							{
								locationPath: [{ elementName: "Screen2" }],
								path: []
							}
						]
					}
				});
				const relevantFields = collectRelevantFields(initialState);
				assertRelevantFieldsContains(relevantFields, [
					{
						documentPath: DM.pathToGroup3RepeatableStringField(0),
						formModelPath: VISIBLE_FIELDS.requiredStringInEmbeddedRepeatCG
					}
				]);
				assertNoRelevantFields(relevantFields, [DM.pathToGroup3RepeatInvisibleField(1)]);
			});
		});
	});

	describe("Indexed Controls", () => {
		it("returns hidden index fields for visible indexed controls", () => {
			const document = DM.indexedControlsDocument();

			const initialState = createEngineStore({
				models,
				locale: US_LOCALE,
				data: { document },
				ui: {
					screenLocation: [
						{
							locationPath: [{ elementName: "Screen6" }],
							path: []
						}
					]
				}
			});
			const relevantFields = collectRelevantFields(initialState);

			assertRelevantFieldsContains(relevantFields, [
				{
					documentPath: DM.pathToIndexedNumberField1,
					formModelPath: VISIBLE_FIELDS.indexedControl1
				},
				{
					documentPath: DM.pathToIndexField1
				},
				{
					documentPath: DM.pathToIndexedNumberField2,
					formModelPath: VISIBLE_FIELDS.indexedControl2
				},
				{
					documentPath: DM.pathToIndexField2
				}
			]);
		});

		it("does not return entries for indexed controls if the corresponding data context doesn't exist", () => {
			const initialState = createEngineStore({
				models,
				locale: US_LOCALE,
				data: { document: {} },
				ui: {
					screenLocation: [
						{
							locationPath: [{ elementName: "Screen6" }],
							path: []
						}
					]
				}
			});
			const relevantFields = collectRelevantFields(initialState);

			assertNoRelevantFields(relevantFields, [
				DM.pathToIndexedNumberField1,
				DM.pathToIndexedNumberField2,
				DM.pathToIndexField1,
				DM.pathToIndexField2
			]);
		});
	});
});
