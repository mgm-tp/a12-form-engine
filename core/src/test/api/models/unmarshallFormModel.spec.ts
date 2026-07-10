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

import { deepStrictEqual, fail, notEqual, notStrictEqual, strictEqual } from "node:assert/strict";

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api";

import { assertCondition } from "../../../back-end/utils/internal/assertions.js";
import type { FormModel } from "../../../models/index.js";
import {
	defaultValueParser,
	findElementByFormModelPath,
	unmarshallFormModel
} from "../../../models/index.js";
import {
	isFormModelControl,
	isFormModelDetachedRepeat,
	isFormModelExpressionCell,
	isFormModelFieldBasedInputType,
	isFormModelRepeat
} from "../../../models/internal/FormModelGuards.js";
import type { ParsedFilterNode } from "../../../models/internal/jison/repeatfilter.cjs";
import { createModelPath } from "../../utils/createModelPath.js";
import { setupFixture, setupModelsFixture } from "../../utils/setupFixture.js";
import { DOCUMENT_MODEL, FORM_MODEL } from "../../utils/test-model-helpers/unmarshallFormModel.js";

describe("api.models.unmarshallFormModel", () => {
	const models = setupModelsFixture("test.unmarshallFormModel");
	const fixture = setupFixture(() => ({
		formModel: unmarshallFormModel(
			models.formModel,
			models.documentModel,
			defaultValueParser(models.documentModel)
		)
	}));
	describe("Path", () => {
		function assertion(
			element: object | undefined,
			expectedModelPath: ModelPath,
			elementName: string
		): void {
			notStrictEqual(element, undefined, `${elementName} not found`);

			if (isFormModelFieldBasedInputType(element!)) {
				deepStrictEqual(
					element.elementPath,
					expectedModelPath,
					`Wrong model path for element ${elementName}`
				);
			} else {
				fail("Expected that element is a Control or FieldOverviewColumn");
			}
		}

		it("adds an elementPath for existing dynamic amount suffix in model content", () => {
			const { amountSuffixFieldPath, amountSuffix } = fixture.formModel.content;

			notStrictEqual(amountSuffixFieldPath, undefined, "Path not found");

			const expectedModelPath = createModelPath(DOCUMENT_MODEL.rootGroup, "amountSuffixEnum");

			strictEqual(amountSuffix?.type, "dynamic");
			deepStrictEqual(
				amountSuffixFieldPath,
				expectedModelPath,
				`Wrong model path for amount suffix reference  ${amountSuffix.fieldRef}`
			);
		});

		it("adds an elementPath to controls in a top-level screen", () => {
			const elementF0 = findElementByFormModelPath(fixture.formModel, FORM_MODEL.pathToF0);
			const elementF11 = findElementByFormModelPath(fixture.formModel, FORM_MODEL.pathToF11);
			const elementF12 = findElementByFormModelPath(fixture.formModel, FORM_MODEL.pathToF12);
			const elementF2 = findElementByFormModelPath(fixture.formModel, FORM_MODEL.pathToF2);

			assertion(elementF0, createModelPath(DOCUMENT_MODEL.rootGroup, "F0"), "F0");
			assertion(elementF11, createModelPath(DOCUMENT_MODEL.rootGroup, "F1"), "F11");
			assertion(elementF12, createModelPath(DOCUMENT_MODEL.rootGroup, "F1"), "F12");
			assertion(
				elementF2,
				createModelPath(DOCUMENT_MODEL.rootGroup, DOCUMENT_MODEL.nestedGroup, "F2"),
				"F2"
			);
		});

		it("adds an elementPath to controls in a detached repeat detail screen", () => {
			const elementF4 = findElementByFormModelPath(fixture.formModel, FORM_MODEL.pathToF4InDr);
			const elementF5 = findElementByFormModelPath(fixture.formModel, FORM_MODEL.pathToF5InDr);

			assertion(
				elementF4,
				createModelPath(DOCUMENT_MODEL.rootGroup, DOCUMENT_MODEL.repeatableGroup, "F4"),
				"F4"
			);
			assertion(
				elementF5,
				createModelPath(DOCUMENT_MODEL.rootGroup, DOCUMENT_MODEL.repeatableGroup, "F5"),
				"F5"
			);
		});

		it("adds an elementPath to controls in an embedded repeat control-grid", () => {
			const elementF4 = findElementByFormModelPath(fixture.formModel, FORM_MODEL.pathToF4InEr);
			const elementF5 = findElementByFormModelPath(fixture.formModel, FORM_MODEL.pathToF5InEr);

			assertion(
				elementF4,
				createModelPath(DOCUMENT_MODEL.rootGroup, DOCUMENT_MODEL.repeatableGroup, "F4"),
				"F4"
			);
			assertion(
				elementF5,
				createModelPath(DOCUMENT_MODEL.rootGroup, DOCUMENT_MODEL.repeatableGroup, "F5"),
				"F5"
			);
		});

		it("adds an elementPath to field-overview columns", () => {
			const elementF4 = findElementByFormModelPath(fixture.formModel, FORM_MODEL.pathToF4InIr);
			const elementF5 = findElementByFormModelPath(fixture.formModel, FORM_MODEL.pathToF5InIr);

			assertion(
				elementF4,
				createModelPath(DOCUMENT_MODEL.rootGroup, DOCUMENT_MODEL.repeatableGroup, "F4"),
				"F4"
			);
			assertion(
				elementF5,
				createModelPath(DOCUMENT_MODEL.rootGroup, DOCUMENT_MODEL.repeatableGroup, "F5"),
				"F5"
			);
		});
	});

	describe("Occurrences", () => {
		function assertion(
			element: object | undefined,
			expectedOccurrence: number,
			elementName: string
		): void {
			notStrictEqual(element, `${elementName} not found`);

			if (isFormModelControl(element!)) {
				deepStrictEqual(
					element.occurrence,
					expectedOccurrence,
					`Wrong occurrence for element ${elementName}`
				);
			} else {
				fail("Expected that element is a Control or FieldOverviewColumn");
			}
		}

		it("adds the occurrence of a control to its model element", () => {
			const elementF0 = findElementByFormModelPath(fixture.formModel, FORM_MODEL.pathToF0);
			const elementF11 = findElementByFormModelPath(fixture.formModel, FORM_MODEL.pathToF11);
			const elementF12 = findElementByFormModelPath(fixture.formModel, FORM_MODEL.pathToF12);
			const elementF2 = findElementByFormModelPath(fixture.formModel, FORM_MODEL.pathToF2);

			assertion(elementF0, 1, "F0");
			assertion(elementF11, 1, "F11");
			assertion(elementF12, 2, "F12");
			assertion(elementF2, 1, "F2");
		});
	});

	describe("Field Configuration", () => {
		describe("field map", () => {
			it(
				"adds entries with the id of a document model element as key and " +
					"the information about dependencies as values to the field-configuration",
				() => {
					const fieldMap = fixture.formModel.content.fieldConfiguration.fieldMap;

					const entryForF6 = fieldMap["/rootGroup/groupForFieldConfiguration/F6"];

					notStrictEqual(entryForF6, undefined);
					const dependentField = entryForF6!.dependentField;

					const expectedDependentField: FormModel.DependentField = {
						case: [
							{
								masterValue: "key_1",
								masterValueTyped: "key_1",
								notRelevant: true
							} as FormModel.DependentFieldCase
						],
						masterFieldPath: createModelPath(
							DOCUMENT_MODEL.rootGroup,
							DOCUMENT_MODEL.groupForFieldConfiguration,
							DOCUMENT_MODEL.masterField1
						),
						masterField: "field_85aa6"
					};

					deepStrictEqual(dependentField, expectedDependentField);
				}
			);

			it(
				"adds entries with the id of a document model element as key and " +
					"the information about expositions as values to the field-configuration",
				() => {
					const fieldMap = fixture.formModel.content.fieldConfiguration.fieldMap;
					const entryForF6 = fieldMap["/rootGroup/F0"];
					const exposition = entryForF6?.exposition;

					strictEqual(exposition, "AREA", "Exposition AREA not set");
					deepStrictEqual(
						entryForF6?.elementPath,
						createModelPath(DOCUMENT_MODEL.rootGroup, "F0"),
						"Wrong elementPath"
					);
				}
			);
		});
	});

	describe("Group Configuration", () => {
		describe("group map", () => {
			it(
				"adds entries with the id of a document model element as key and " +
					"the information about dependencies as values to the group-configuration",
				() => {
					const groupMap = fixture.formModel.content.groupConfiguration.groupMap;
					const entryForF6 = groupMap["/rootGroup/groupForFieldConfiguration/G1"];

					notStrictEqual(entryForF6, undefined);
					const dependentGroup = entryForF6!.dependentGroup;

					const expectedDependentGroup: FormModel.DependentGroup = {
						case: [{ masterValue: "key_2", masterValueTyped: "key_2", notRelevant: true }],
						masterFieldPath: createModelPath(
							DOCUMENT_MODEL.rootGroup,
							DOCUMENT_MODEL.groupForFieldConfiguration,
							DOCUMENT_MODEL.masterField1
						),
						masterField: "field_85aa6"
					};

					deepStrictEqual(dependentGroup, expectedDependentGroup);
				}
			);
		});
	});

	describe("Filter expressions", () => {
		function assertion(element: object | undefined, elementName: string): void {
			const expectedFilterExpressionTree: ParsedFilterNode = {
				type: "filter",
				content: "Hello",
				operation: "=",
				context: {
					type: "field",
					name: "F4"
				}
			};

			notStrictEqual(element, undefined, `${elementName} not found`);

			if (isFormModelRepeat(element)) {
				deepStrictEqual(
					element.filterExpressionTree,
					expectedFilterExpressionTree,
					`Wrong filter expression tree for element ${elementName}`
				);
			} else {
				fail("Expected that element is a Repeat");
			}
		}

		it("parses the filter expression for a inline repeat and sets the entry filterExpressionTree at the repeat", () => {
			const inlineRepeat = findElementByFormModelPath(
				fixture.formModel,
				FORM_MODEL.pathToIrWithFilterExpression
			);
			assertion(inlineRepeat, "Inline-Repeat with filter expression");
		});

		it("parses the filter expression for a detached repeat and sets the entry filterExpressionTree at the repeat", () => {
			const detachedRepeat = findElementByFormModelPath(
				fixture.formModel,
				FORM_MODEL.pathToIrWithFilterExpression
			);
			assertion(detachedRepeat, "Detached-Repeat with filter expression");
		});

		it("parses the filter expression for an embedded repeat and sets the entry filterExpressionTree at the repeat", () => {
			const embeddedRepeat = findElementByFormModelPath(
				fixture.formModel,
				FORM_MODEL.pathToIrWithFilterExpression
			);
			assertion(embeddedRepeat, "Embedded-Repeat with filter expression");
		});
	});

	describe("Expressions", () => {
		it("parses the expression from a expression-cell and sets the entry expressionTree at the cell", () => {
			const expressionCell = findElementByFormModelPath(
				fixture.formModel,
				FORM_MODEL.pathToExpressionCell
			);
			const expectedFilterExpressionTree = {
				type: "root",
				children: [
					{
						type: "group",
						name: "rootGroup",
						children: [
							{ type: "token", name: "newline" },
							{ type: "string", content: "Value of F0: " },
							{ type: "field", name: "F0" },
							{ type: "token", name: "newline" }
						]
					}
				]
			};

			notStrictEqual(expressionCell, undefined, "Expression Cell not found");

			if (isFormModelExpressionCell(expressionCell)) {
				deepStrictEqual(expressionCell.expressionTree, expectedFilterExpressionTree);
			} else {
				fail("Expected that element is a Control or FieldOverviewColumn");
			}
		});

		it("successfully parses the expression from a detached repeat title using 'case'", () => {
			const detachedRepeat = findElementByFormModelPath(
				fixture.formModel,
				FORM_MODEL.pathToDetachedRepeat
			);
			notStrictEqual(detachedRepeat, undefined, "Detached Repeat not found");

			if (isFormModelDetachedRepeat(detachedRepeat)) {
				assertCondition(detachedRepeat.title?.type === "Expression");
				notEqual(detachedRepeat.title.expressionTree, undefined);
			} else {
				fail("Expected that element is a Detached Repeat");
			}
		});

		it("successfully parses the expression from a control label using 'case'", () => {
			const control = findElementByFormModelPath(
				fixture.formModel,
				FORM_MODEL.pathToF0WithExpressionLabel
			);
			notStrictEqual(control, undefined, "Control not found");

			if (control && isFormModelControl(control)) {
				assertCondition(control.label?.type === "Expression");
				notEqual(control.label.expressionTree, undefined);
			} else {
				fail("Expected that element is a Control");
			}
		});

		it("successfully parses the expression from an indexed control label using 'case'", () => {
			const control = findElementByFormModelPath(
				fixture.formModel,
				FORM_MODEL.pathToIndexedControlWithExpressionLabel
			);
			notStrictEqual(control, undefined, "Control not found");

			if (control && isFormModelControl(control)) {
				assertCondition(control.label?.type === "Expression");
				notEqual(control.label.expressionTree, undefined);
			} else {
				fail("Expected that element is a Control");
			}
		});

		it("successfully parses the expression from a field configuration label using 'case'", () => {
			const fce =
				fixture.formModel.content.fieldConfiguration.fieldMap[
					"/rootGroup/groupForIndexedControl/Number"
				];

			notStrictEqual(fce, undefined);

			assertCondition(fce?.label?.type === "Expression");
			notEqual(fce?.label?.expressionTree, undefined);
		});
	});

	describe("Dependent controls", () => {
		describe("No index", () => {
			it("adds a map with the id of a control-grid as key and the corresponding control information to the form-model", () => {
				const dependentScreenElements = fixture.formModel.content.dependentScreenElements;
				const entryForControlGrid = dependentScreenElements[FORM_MODEL.idDependentControlGrid];
				const expectedValue = {
					controls: {
						[FORM_MODEL.idDependentControlMaster]: {
							elementPath: createModelPath(DOCUMENT_MODEL.rootGroup, DOCUMENT_MODEL.masterField2),
							controlIndex: undefined,
							values: [false]
						}
					}
				};

				deepStrictEqual(entryForControlGrid, expectedValue);
			});

			it("adds a map with the id of a section as key and the corresponding control information to the form-model", () => {
				const dependentScreenElements = fixture.formModel.content.dependentScreenElements;
				const entryForControlGrid = dependentScreenElements[FORM_MODEL.idDependentSection];
				const expectedValue = {
					controls: {
						[FORM_MODEL.idDependentControlMaster]: {
							elementPath: createModelPath(DOCUMENT_MODEL.rootGroup, DOCUMENT_MODEL.masterField2),
							controlIndex: undefined,
							values: [false]
						}
					}
				};

				deepStrictEqual(entryForControlGrid, expectedValue);
			});

			it("adds a map with the id of a multi-column-section as key and the corresponding control information to the form-model", () => {
				const dependentScreenElements = fixture.formModel.content.dependentScreenElements;
				const entryForControlGrid = dependentScreenElements["section-59946"];
				const expectedValue = {
					controls: {
						[FORM_MODEL.idDependentControlMaster]: {
							elementPath: createModelPath(DOCUMENT_MODEL.rootGroup, DOCUMENT_MODEL.masterField2),
							controlIndex: undefined,
							values: [false]
						}
					}
				};

				deepStrictEqual(entryForControlGrid, expectedValue);
			});
		});

		describe("Control index", () => {
			it("adds a map with the id of a control-grid as key and the corresponding control information to the form-model", () => {
				const dependentScreenElements = fixture.formModel.content.dependentScreenElements;
				const entryForControlGrid =
					dependentScreenElements[FORM_MODEL.idDependentControlGridIndexedControlMaster];
				const expectedValue = {
					controls: {
						[FORM_MODEL.idDependentControlMasterWithIndex]: {
							elementPath: createModelPath(
								DOCUMENT_MODEL.rootGroup,
								DOCUMENT_MODEL.groupForIndexedControl,
								DOCUMENT_MODEL.indexedMasterControl
							),
							controlIndex: {
								type: "SEMANTIC",
								value: "1",
								typedValue: 1
							},
							values: ["SHOW_CG"]
						}
					}
				};

				deepStrictEqual(entryForControlGrid, expectedValue);
			});
		});
	});
});
