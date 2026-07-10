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

import { strictEqual } from "node:assert/strict";

import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { setupModelsFixture } from "../../utils/setupFixture.js";
import { createDocumentPath } from "../../utils/createDocumentPath.js";
import { createModelPath } from "../../utils/createModelPath.js";

import type {
	CorrectionModeItem,
	EngineStore,
	GroupInstance
} from "./correction-mode-test-utils.js";
import {
	assertFormModelPath,
	assertLink,
	assertNumberOfLinks,
	baseDocument,
	DocumentUtils,
	f1R1Dr1,
	f1R1Er1,
	f1R1Ir1,
	g1RPath,
	getLinks,
	ModelPath,
	ROOT_GROUP,
	screen1,
	screen1Er1,
	setupTest
} from "./correction-mode-test-utils.js";

describe("unit.view.validation.correctionMode.repeatableGroupField", () => {
	const models = setupModelsFixture("computation-validation.correctionmode");

	// F1R1
	describe("Given a field with an invalid value in a repeatable group", () => {
		// ir1, er1, and dr1
		describe("and repeats containing a control referencing the field", () => {
			it("does not return a link if the referenced row does not exist in the document", () => {
				// Add two rows to repeatable group
				const document = DocumentUtils.setValue(
					baseDocument,
					g1RPath,
					[
						{ G1R2: {}, F1R1: 42 },
						{ G1R2: {}, F1R1: 12 }
					],
					models.documentModel
				);

				const { messages, state } = setupTest({ document, models });
				strictEqual(messages.length, 1, "Expected that there is one validation message");
				const message = messages[0];

				const nonExistingElement = [
					{ elementName: "root", index: 1 },
					{ elementName: "G1R", index: 5 },
					{ elementName: "F1R1", index: 1 }
				];
				const newMessage = {
					...message,
					element: nonExistingElement,
					referencedFields: [nonExistingElement]
				};

				const links = getLinks(state, newMessage);
				assertNumberOfLinks(links.length, 0);
			});
		});

		describe("and an inline-repeat containing a control referencing the field", () => {
			it("returns a link if the row which contains the error exists in the document", () => {
				// Add two rows to repeatable group
				const document = DocumentUtils.setValue(
					baseDocument,
					g1RPath,
					[
						{ G1R2: {}, F1R1: 42 },
						{ G1R2: {}, F1R1: 12 }
					],
					models.documentModel
				);

				const { messages, state } = setupTest({ document, models });
				strictEqual(messages.length, 1, "Expected that there is one validation message");

				const links = getLinks(state, messages[0]);

				assertNumberOfLinks(links.length, 3);

				assertLink({
					link: links[0],
					expectedFormModelPath: f1R1Ir1,
					expectedLocationStack: [
						{
							locationPath: screen1,
							focusedComponent: { formModelPath: f1R1Ir1, index: 1 },
							focusedComponentRequestCount: 1,
							path: [],
							repeatInstanceState: { ["/Screen1/ir1"]: { page: 1, expandedRowPath: undefined } }
						}
					],
					expectedSectionsCollapse: []
				});
			});

			it(
				"returns a link to the control that also considers the page of the repeat if the row which contains " +
					"the error exists in the document and is not placed on the first page",
				() => {
					// Add two rows to repeatable group
					const document = DocumentUtils.setValue(
						baseDocument,
						g1RPath,
						[
							{ G1R2: {}, F1R1: 42 },
							{ G1R2: {}, F1R1: 42 },
							{ G1R2: {}, F1R1: 42 },
							{ G1R2: {}, F1R1: 12 }
						],
						models.documentModel
					);

					const { messages, state } = setupTest({ document, models });
					strictEqual(messages.length, 1, "Expected that there is one validation message");

					const links = getLinks(state, messages[0]);

					assertNumberOfLinks(links.length, 3);

					assertLink({
						link: links[0],
						expectedFormModelPath: f1R1Ir1,
						expectedLocationStack: [
							{
								locationPath: screen1,
								focusedComponent: { formModelPath: f1R1Ir1, index: 3 },
								focusedComponentRequestCount: 1,
								path: [],
								repeatInstanceState: { ["/Screen1/ir1"]: { page: 2, expandedRowPath: undefined } }
							}
						],
						expectedSectionsCollapse: []
					});
				}
			);
		});

		describe("and an embedded-repeat detail control grid containing a control referencing the field", () => {
			it("returns a link if the row which contains the error exists in the document", () => {
				// Add two rows to repeatable group
				const document = DocumentUtils.setValue(
					baseDocument,
					g1RPath,
					[
						{ G1R2: {}, F1R1: 42 },
						{ G1R2: {}, F1R1: 12 }
					],
					models.documentModel
				);

				const { messages, state } = setupTest({ document, models });
				strictEqual(messages.length, 1, "Expected that there is one validation message");

				const links = getLinks(state, messages[0]);

				assertNumberOfLinks(links.length, 3);

				assertLink({
					link: links[1],
					expectedFormModelPath: f1R1Er1,
					expectedLocationStack: [
						{
							locationPath: screen1,
							path: [],
							focusedComponent: { formModelPath: f1R1Er1, index: 1 },
							focusedComponentRequestCount: 1,
							repeatInstanceState: {
								[ModelPath.toString(screen1Er1)]: {
									expandedRowPath: createDocumentPath(["root"], ["G1R", 2]),
									page: undefined
								}
							}
						}
					],
					expectedSectionsCollapse: []
				});
			});
		});

		describe("and a detached-repeat detail screen containing a control referencing the field", () => {
			it("returns a link if the row which contains the error exists in the document", () => {
				// Add two rows to repeatable group
				const document = DocumentUtils.setValue(
					baseDocument,
					g1RPath,
					[
						{ G1R2: {}, F1R1: 42 },
						{ G1R2: {}, F1R1: 12 }
					],
					models.documentModel
				);

				const { messages, state } = setupTest({ document, models });
				strictEqual(messages.length, 1, "Expected that there is one validation message");

				const links = getLinks(state, messages[0]);

				assertNumberOfLinks(links.length, 3);

				assertLink({
					link: links[2],
					expectedFormModelPath: f1R1Dr1,
					expectedLocationStack: [
						{
							locationPath: [{ elementName: "Screen1" }],
							path: [],
							focusedComponent: undefined,
							focusedComponentRequestCount: undefined,
							repeatInstanceState: undefined
						},
						{
							locationPath: createModelPath("Screen1", "dr1", "Details"),
							path: createDocumentPath([ROOT_GROUP], ["G1R", 2]),
							focusedComponent: { formModelPath: f1R1Dr1 },
							focusedComponentRequestCount: 1,
							repeatInstanceState: undefined
						}
					],
					expectedSectionsCollapse: []
				});
			});
		});

		describe("and an indexed control referencing the field", () => {
			function setup(
				indexedGroupPath: EntityInstancePath,
				baseDoc: GroupInstance
			): readonly CorrectionModeItem[] {
				// Add two rows to repeatable group, second one is invalid and targeted by indices
				const document = DocumentUtils.setValue(
					baseDoc,
					indexedGroupPath,
					[
						{ IndexField: false, F1: 42 },
						{ IndexField: true, F1: 24 }
					],
					models.documentModel
				);
				// set up a screen location in an unrelated data context to make sure,
				// that the link creation is not influenced by the current screen's data context
				const ui: Partial<EngineStore.UIState> = {
					screenLocation: [
						{ path: [], locationPath: [{ elementName: "ScreenIndexedControls" }] },
						{
							path: createDocumentPath(["IndexedControls"], ["Group2"]),
							locationPath: createModelPath(
								"ScreenIndexedControls",
								"secFields",
								"Group2_Repeat",
								"Details"
							)
						}
					]
				};
				const { messages, state } = setupTest({ document, models, ui });
				strictEqual(messages.length, 1, "Expected that there is one validation message");
				return getLinks(state, messages[0]);
			}

			it("returns links to the indexed controls on top level screen and the non-indexed input", () => {
				const indexedGroupPath = createDocumentPath(["IndexedControls"], ["Group1", 0]);

				const links = setup(indexedGroupPath, baseDocument);

				assertNumberOfLinks(links.length, 3);

				const rowPath = createModelPath("ScreenIndexedControls", "secFields", "cg", "rowGroup1");

				const detailScreenPath = createModelPath(
					"ScreenIndexedControls",
					"secFields",
					"Group1_Repeat",
					"Details"
				);
				const controlOnDetailScreenPath = detailScreenPath.concat(
					createModelPath("Group1_Controls", "rowGroup1", "control_2ffb8")
				);

				// numeric index
				assertFormModelPath({
					link: links[0],
					expectedFormModelPath: rowPath.concat(createModelPath("control_8a190"))
				});
				// semantic index
				assertFormModelPath({
					link: links[1],
					expectedFormModelPath: rowPath.concat(createModelPath("control_e53ab"))
				});
				// control on detail screen
				assertLink({
					link: links[2],
					expectedFormModelPath: controlOnDetailScreenPath,
					expectedLocationStack: [
						{
							locationPath: [{ elementName: "ScreenIndexedControls" }],
							path: [],
							focusedComponent: undefined,
							focusedComponentRequestCount: undefined,
							repeatInstanceState: undefined
						},
						{
							locationPath: detailScreenPath,
							path: createDocumentPath(["IndexedControls"], ["Group1", 2]),
							focusedComponent: { formModelPath: controlOnDetailScreenPath },
							focusedComponentRequestCount: 1,
							repeatInstanceState: undefined
						}
					]
				});
			});

			it("returns links to the indexed controls on detail screen and the non-indexed input", () => {
				const baseDocument = {
					CustomTypes: {
						MultiSelect2: [{ value: "key1" }]
					},
					IndexedControls: {
						// condition for the triggering rule
						EnableErrorOnDetailScreen: true,
						Group1: [
							{
								IndexField: true
							}
						]
					}
				};

				const indexedGroupPath = createDocumentPath(
					["IndexedControls"],
					["Group1"],
					["Group1_1", 0]
				);

				const links = setup(indexedGroupPath, baseDocument);

				assertNumberOfLinks(links.length, 4); // 3 + "EnableErrorOnDetailScreen" link

				const detailScreenPath = createModelPath(
					"ScreenIndexedControls",
					"secFields",
					"Group1_Repeat",
					"Details"
				);

				const rowPath = detailScreenPath.concat(createModelPath("Group1_Controls", "rowGroup1_1"));

				const columnPath = detailScreenPath.concat(
					createModelPath("Group1_1_Repeat", "fieldbasedrepeatoverviewcolumn_b0c64")
				);

				// first link [0] is the error for the helper field "EnableErrorOnDetailScreen"

				// numeric index on detail screen
				assertFormModelPath({
					link: links[1],
					expectedFormModelPath: rowPath.concat(createModelPath("control_12b1f"))
				});
				// semantic index on detail screen
				assertFormModelPath({
					link: links[2],
					expectedFormModelPath: rowPath.concat(createModelPath("control_59269"))
				});
				// column input
				assertLink({
					link: links[3],
					expectedFormModelPath: columnPath,
					expectedLocationStack: [
						{
							locationPath: [{ elementName: "ScreenIndexedControls" }],
							path: [],
							focusedComponent: undefined,
							focusedComponentRequestCount: undefined,
							repeatInstanceState: undefined
						},
						{
							locationPath: detailScreenPath,
							path: createDocumentPath(["IndexedControls"], ["Group1", 1]),
							focusedComponent: { formModelPath: columnPath, index: 1 },
							focusedComponentRequestCount: 1,
							repeatInstanceState: {
								[ModelPath.toString(columnPath.slice(0, -1))]: {
									page: undefined,
									expandedRowPath: undefined
								}
							}
						}
					]
				});
			});
		});
	});
});
