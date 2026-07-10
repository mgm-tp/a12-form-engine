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

import { Expression } from "@com.mgmtp.a12.expression/expression-core";
import { DocumentServiceFactory } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import type { FormModel } from "../../models/index.js";
import { addConditionallyHiddenElementsMap } from "../../models/internal/unmarshall/addConditionallyHiddenElementsMap.js";

import { createModelPath } from "../utils/createModelPath.js";
import { DocumentModelHelpers } from "../utils/DocumentModelHelpers.js";
import {
	createButtonPanel,
	createControl,
	createControlGrid,
	createDetachedRepeat,
	createEmbeddedRepeat,
	createExpressionColumn,
	createFieldColumn,
	createFormModel,
	createInlineRepeat,
	createMultiColumnSection,
	createRow,
	createScreen,
	createSection
} from "../utils/form-model-factory.js";

describe("unit.models.internal.utils.conditionallyHiddenElements", () => {
	describe("addConditionallyHiddenElementsMap", () => {
		function createFormModelWithElements(elements: Array<FormModel.ScreenElement>) {
			return createFormModel({
				screens: [
					createScreen({
						id: "testScreen",
						name: "Test Screen",
						screenElements: elements
					})
				]
			});
		}

		function createSectionWithControl(controlWithHideCondition: FormModel.Control) {
			return createSection({
				id: `section_${controlWithHideCondition.id}`,
				screenElements: [
					createControlGrid({
						id: `cg_${controlWithHideCondition.id}`,
						rows: [
							createRow({
								id: `row_${controlWithHideCondition.id}`,
								cells: [controlWithHideCondition]
							})
						]
					})
				]
			});
		}

		describe("when form model has no elements with hide conditions", () => {
			it("should not add any conditionally hidden elements to the form model", () => {
				const control = createControl("control1");
				const section = createSectionWithControl(control);
				const formModel = createFormModelWithElements([section]);

				const documentModel = DocumentModelHelpers.createDocumentModel(
					DocumentModelHelpers.Group({
						id: "root",
						name: "root",
						elements: []
					})
				);
				const dmSearchService = new DocumentServiceFactory().getDocumentModelSearchService(
					documentModel
				);

				addConditionallyHiddenElementsMap(formModel, documentModel, dmSearchService);

				deepStrictEqual(formModel.content.conditionallyHiddenElements, {});
			});
		});

		describe("when form model has elements with hide conditions", () => {
			describe("with enumeration field master", () => {
				it("should create conditionally hidden elements map with enum values", () => {
					const control = createControl("control1", undefined, {
						masterField: "masterField1",
						cases: [{ masterValue: "value1" }]
					});
					const section = createSectionWithControl(control);
					const formModel = createFormModelWithElements([section]);
					const enumField = DocumentModelHelpers.Field({
						id: "masterField1",
						name: "masterField1",
						fieldType: {
							type: "EnumerationType",
							values: [{ value: "value1" }, { value: "value2" }]
						}
					});

					const documentModel = DocumentModelHelpers.createDocumentModel(
						DocumentModelHelpers.Group({
							id: "root",
							name: "root",
							elements: [enumField]
						})
					);
					const dmSearchService = new DocumentServiceFactory().getDocumentModelSearchService(
						documentModel
					);

					addConditionallyHiddenElementsMap(formModel, documentModel, dmSearchService);

					const expected = {
						control1: {
							masterFieldModelPath: createModelPath("root", "masterField1"),
							values: ["value1"]
						}
					};

					deepStrictEqual(formModel.content.conditionallyHiddenElements, expected);
				});

				it("should handle null master values for enum fields", () => {
					const control = createControl("control1", undefined, {
						masterField: "masterField1",
						cases: [{ masterValue: "value1" }, { masterValue: null }]
					});
					const section = createSectionWithControl(control);
					const formModel = createFormModelWithElements([section]);
					const enumField = DocumentModelHelpers.Field({
						id: "masterField1",
						name: "masterField1",
						fieldType: {
							type: "EnumerationType",
							values: [{ value: "value1" }, { value: "value2" }]
						}
					});

					const documentModel = DocumentModelHelpers.createDocumentModel(
						DocumentModelHelpers.Group({
							id: "root",
							name: "root",
							elements: [enumField]
						})
					);
					const dmSearchService = new DocumentServiceFactory().getDocumentModelSearchService(
						documentModel
					);

					addConditionallyHiddenElementsMap(formModel, documentModel, dmSearchService);

					const expected = {
						control1: {
							masterFieldModelPath: createModelPath("root", "masterField1"),
							values: ["value1", null]
						}
					};

					deepStrictEqual(formModel.content.conditionallyHiddenElements, expected);
				});
			});

			describe("with boolean field master", () => {
				it("should transform string values to boolean for boolean fields", () => {
					const control = createControl("control1", undefined, {
						masterField: "masterField1",
						cases: [{ masterValue: "true" }, { masterValue: "false" }]
					});
					const section = createSectionWithControl(control);
					const formModel = createFormModelWithElements([section]);
					const booleanField = DocumentModelHelpers.Field({
						id: "masterField1",
						name: "masterField1",
						fieldType: {
							type: "BooleanType"
						}
					});

					const documentModel = DocumentModelHelpers.createDocumentModel(
						DocumentModelHelpers.Group({
							id: "root",
							name: "root",
							elements: [booleanField]
						})
					);
					const dmSearchService = new DocumentServiceFactory().getDocumentModelSearchService(
						documentModel
					);

					addConditionallyHiddenElementsMap(formModel, documentModel, dmSearchService);

					const expected = {
						control1: {
							masterFieldModelPath: createModelPath("root", "masterField1"),
							values: [true, false]
						}
					};

					deepStrictEqual(formModel.content.conditionallyHiddenElements, expected);
				});

				it("should handle null and invalid values for boolean fields", () => {
					const control = createControl("control1", undefined, {
						masterField: "masterField1",
						cases: [{ masterValue: "true" }, { masterValue: null }, { masterValue: "invalid" }]
					});
					const section = createSectionWithControl(control);
					const formModel = createFormModelWithElements([section]);
					const booleanField = DocumentModelHelpers.Field({
						id: "masterField1",
						name: "masterField1",
						fieldType: {
							type: "BooleanType"
						}
					});

					const documentModel = DocumentModelHelpers.createDocumentModel(
						DocumentModelHelpers.Group({
							id: "root",
							name: "root",
							elements: [booleanField]
						})
					);
					const dmSearchService = new DocumentServiceFactory().getDocumentModelSearchService(
						documentModel
					);

					addConditionallyHiddenElementsMap(formModel, documentModel, dmSearchService);

					const expected = {
						control1: {
							masterFieldModelPath: createModelPath("root", "masterField1"),
							values: [true, null, null]
						}
					};

					deepStrictEqual(formModel.content.conditionallyHiddenElements, expected);
				});
			});

			describe("with confirm field master", () => {
				it("should transform 'true' to boolean true for confirm fields", () => {
					const control = createControl("control1", undefined, {
						masterField: "masterField1",
						cases: [{ masterValue: "true" }]
					});
					const section = createSectionWithControl(control);
					const formModel = createFormModelWithElements([section]);
					const confirmField = DocumentModelHelpers.Field({
						id: "masterField1",
						name: "masterField1",
						fieldType: {
							type: "ConfirmType"
						}
					});

					const documentModel = DocumentModelHelpers.createDocumentModel(
						DocumentModelHelpers.Group({
							id: "root",
							name: "root",
							elements: [confirmField]
						})
					);
					const dmSearchService = new DocumentServiceFactory().getDocumentModelSearchService(
						documentModel
					);

					addConditionallyHiddenElementsMap(formModel, documentModel, dmSearchService);

					const expected = {
						control1: {
							masterFieldModelPath: createModelPath("root", "masterField1"),
							values: [true]
						}
					};

					deepStrictEqual(formModel.content.conditionallyHiddenElements, expected);
				});

				it("should handle null values for confirm fields", () => {
					const control = createControl("control1", undefined, {
						masterField: "masterField1",
						cases: [{ masterValue: "true" }, { masterValue: null }]
					});
					const section = createSectionWithControl(control);
					const formModel = createFormModelWithElements([section]);
					const confirmField = DocumentModelHelpers.Field({
						id: "masterField1",
						name: "masterField1",
						fieldType: {
							type: "ConfirmType"
						}
					});

					const documentModel = DocumentModelHelpers.createDocumentModel(
						DocumentModelHelpers.Group({
							id: "root",
							name: "root",
							elements: [confirmField]
						})
					);
					const dmSearchService = new DocumentServiceFactory().getDocumentModelSearchService(
						documentModel
					);

					addConditionallyHiddenElementsMap(formModel, documentModel, dmSearchService);

					const expected = {
						control1: {
							masterFieldModelPath: createModelPath("root", "masterField1"),
							values: [true, null]
						}
					};

					deepStrictEqual(formModel.content.conditionallyHiddenElements, expected);
				});
			});

			describe("when master field path is not found", () => {
				it("should not add element to conditionally hidden elements map", () => {
					const control = createControl("control1", undefined, {
						masterField: "nonexistentfield",
						cases: [{ masterValue: "true" }]
					});
					const section = createSectionWithControl(control);
					const formModel = createFormModelWithElements([section]);
					const confirmField = DocumentModelHelpers.Field({
						id: "masterField1",
						name: "masterField1",
						fieldType: {
							type: "ConfirmType"
						}
					});

					const documentModel = DocumentModelHelpers.createDocumentModel(
						DocumentModelHelpers.Group({
							id: "root",
							name: "root",
							elements: [confirmField]
						})
					);
					const dmSearchService = new DocumentServiceFactory().getDocumentModelSearchService(
						documentModel
					);
					addConditionallyHiddenElementsMap(formModel, documentModel, dmSearchService);

					deepStrictEqual(formModel.content.conditionallyHiddenElements, {});
				});
			});

			describe("with multiple elements having hide conditions", () => {
				it("should create entries for all elements with valid hide conditions", () => {
					const control1 = createControl("control1", undefined, {
						masterField: "masterField1",
						cases: [{ masterValue: "value1" }]
					});
					const control2 = createControl("control2", undefined, {
						masterField: "masterField2",
						cases: [{ masterValue: "true" }]
					});
					const section1 = createSectionWithControl(control1);
					const section2 = createSectionWithControl(control2);
					const sectionWithCondition = createSection({
						id: "sectionWithCondition",
						screenElements: [],
						hideCondition: {
							masterField: "masterField1",
							cases: [{ masterValue: "value2" }]
						}
					});
					const formModel = createFormModelWithElements([section1, section2, sectionWithCondition]);

					const documentModel = DocumentModelHelpers.createDocumentModel(
						DocumentModelHelpers.Group({
							id: "root",
							name: "root",
							elements: [
								DocumentModelHelpers.Field({
									id: "masterField1",
									name: "masterField1",
									fieldType: {
										type: "StringType"
									}
								}),
								DocumentModelHelpers.Field({
									id: "masterField2",
									name: "masterField2",
									fieldType: {
										type: "BooleanType"
									}
								})
							]
						})
					);

					const dmSearchService = new DocumentServiceFactory().getDocumentModelSearchService(
						documentModel
					);

					addConditionallyHiddenElementsMap(formModel, documentModel, dmSearchService);

					const expected = {
						control1: {
							masterFieldModelPath: createModelPath("root", "masterField1"),
							values: ["value1"]
						},
						control2: {
							masterFieldModelPath: createModelPath("root", "masterField2"),
							values: [true]
						},
						sectionWithCondition: {
							masterFieldModelPath: createModelPath("root", "masterField1"),
							values: ["value2"]
						}
					};

					deepStrictEqual(formModel.content.conditionallyHiddenElements, expected);
				});
			});
		});

		describe("should handle all element types with hide conditions", () => {
			function createElementWithHideCondition(
				type: string,
				elementId: string,
				masterFieldId: string,
				masterValue: string
			): FormModel.ScreenElement {
				const hideCondition: FormModel.HideCondition = {
					masterField: masterFieldId,
					cases: [{ masterValue }]
				};

				switch (type) {
					case "Section":
						return createSection({ id: elementId, hideCondition });
					case "MultiColumnSection":
						return createMultiColumnSection({ id: elementId, hideCondition });
					case "ControlGrid":
						return createControlGrid({ id: elementId, hideCondition });
					case "ButtonPanel":
						return createButtonPanel({ id: elementId, hideCondition });
					case "InlineRepeat":
						return createInlineRepeat({ id: elementId, hideCondition });
					case "DetachedRepeat":
						return createDetachedRepeat({
							id: elementId,
							detailScreen: createScreen({ id: "detailScreen" }),
							hideCondition
						});
					case "EmbeddedRepeat":
						return createEmbeddedRepeat({
							id: elementId,
							controlGrid: createControlGrid({ id: "embeddedGrid" }),
							hideCondition
						});
					case "CustomScreenElement":
						return {
							type: "CustomScreenElement",
							id: elementId,
							name: elementId,
							hideCondition
						};
					case "FieldOverviewColumn":
						return createDetachedRepeat({
							id: "repeat1",
							columns: [createFieldColumn({ id: elementId, hideCondition })],
							detailScreen: createScreen({ id: "detailScreen" })
						});
					case "ExpressionOverviewColumn":
						return createDetachedRepeat({
							id: "repeat1",
							columns: [createExpressionColumn({ id: elementId, hideCondition })],
							detailScreen: createScreen({ id: "detailScreen" })
						});
					default:
						throw new Error(`Unknown element type: ${type}`);
				}
			}

			const elementTypes = [
				"Section",
				"MultiColumnSection",
				"ControlGrid",
				"ButtonPanel",
				"InlineRepeat",
				"DetachedRepeat",
				"EmbeddedRepeat",
				"CustomScreenElement",
				"FieldOverviewColumn",
				"ExpressionOverviewColumn"
			];

			for (const elementType of elementTypes) {
				it(`should handle ${elementType} with hide condition`, () => {
					const element = createElementWithHideCondition(
						elementType,
						`${elementType}1`,
						"masterField1",
						"testValue"
					);
					const formModel = createFormModelWithElements([element]);

					const documentModel = DocumentModelHelpers.createDocumentModel(
						DocumentModelHelpers.Group({
							id: "root",
							name: "root",
							elements: [
								DocumentModelHelpers.Field({
									id: "masterField1",
									name: "masterField1",
									fieldType: {
										type: "StringType"
									}
								})
							]
						})
					);
					const dmSearchService = new DocumentServiceFactory().getDocumentModelSearchService(
						documentModel
					);

					addConditionallyHiddenElementsMap(formModel, documentModel, dmSearchService);

					const elementId = `${elementType}1`;
					const expectedEntry = {
						masterFieldModelPath: createModelPath("root", "masterField1"),
						values: ["testValue"]
					};

					deepStrictEqual(
						formModel.content.conditionallyHiddenElements?.[elementId],
						expectedEntry
					);
				});
			}
		});

		describe("should handle nested elements with hide conditions", () => {
			it("should process hide conditions in nested structure (control grid with rows and cells)", () => {
				const controlGrid: FormModel.ControlGrid = {
					...createControlGrid({
						id: "grid1",
						rows: [
							{
								...createRow({
									id: "row1",
									cells: [
										{
											type: "ExpressionCell",
											id: "cell1",
											name: "cell1",
											expression: "test expression",
											expressionTree: { type: Expression.NodeType.ROOT, children: [] },
											hideCondition: {
												masterField: "masterField1",
												cases: [{ masterValue: "hideCell" }]
											}
										},
										{
											type: "TextCell",
											id: "cell2",
											name: "cell2",
											content: { text: [{ locale: "en", text: "test" }] },
											hideCondition: {
												masterField: "masterField2",
												cases: [{ masterValue: "true" }]
											}
										},
										{
											type: "CustomCell",
											id: "cell3",
											name: "cell3",
											hideCondition: {
												masterField: "masterField1",
												cases: [{ masterValue: "hideCustom" }]
											}
										}
									]
								}),
								hideCondition: {
									masterField: "masterField1",
									cases: [{ masterValue: "hideRow" }]
								}
							}
						]
					}),
					hideCondition: {
						masterField: "masterField1",
						cases: [{ masterValue: "hideGrid" }]
					}
				};

				const formModel = createFormModelWithElements([controlGrid]);

				const documentModel = DocumentModelHelpers.createDocumentModel(
					DocumentModelHelpers.Group({
						id: "root",
						name: "root",
						elements: [
							DocumentModelHelpers.Field({
								id: "masterField1",
								name: "masterField1",
								fieldType: {
									type: "StringType"
								}
							}),
							DocumentModelHelpers.Field({
								id: "masterField2",
								name: "masterField2",
								fieldType: {
									type: "BooleanType"
								}
							})
						]
					})
				);

				const dmSearchService = new DocumentServiceFactory().getDocumentModelSearchService(
					documentModel
				);

				addConditionallyHiddenElementsMap(formModel, documentModel, dmSearchService);

				const expected = {
					grid1: {
						masterFieldModelPath: createModelPath("root", "masterField1"),
						values: ["hideGrid"]
					},
					row1: {
						masterFieldModelPath: createModelPath("root", "masterField1"),
						values: ["hideRow"]
					},
					cell1: {
						masterFieldModelPath: createModelPath("root", "masterField1"),
						values: ["hideCell"]
					},
					cell2: {
						masterFieldModelPath: createModelPath("root", "masterField2"),
						values: [true]
					},
					cell3: {
						masterFieldModelPath: createModelPath("root", "masterField1"),
						values: ["hideCustom"]
					}
				};

				deepStrictEqual(formModel.content.conditionallyHiddenElements, expected);
			});
		});
	});
});
