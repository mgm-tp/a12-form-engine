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

import { deepStrictEqual, strictEqual } from "node:assert/strict";

import { setupModelsFixture } from "../../utils/setupFixture.js";

import {
	assertLink,
	assertNumberOfLinks,
	baseDocument,
	createDocumentPath,
	createModelPath,
	DocumentUtils,
	f1r1r1Dr11,
	f1r1r1Er11,
	f1r1r1Ir11,
	g1RPath,
	getLinks,
	ModelPath,
	screen1Dr1,
	screen1Dr1Er11,
	sectionDr11,
	setupTest
} from "./correction-mode-test-utils.js";

describe("unit.view.validation.correctionMode.nestedRepeatableField", () => {
	const models = setupModelsFixture("computation-validation.correctionmode");

	// F1R1R1
	describe("Given a field with an invalid value in a nested repeatable group", () => {
		describe("and repeats containing a control referencing the field", () => {
			it("does not return a link if the referenced row does not exist in the document", () => {
				// Add two rows to repeatable group
				const document = DocumentUtils.setValue(
					baseDocument,
					g1RPath,
					[{ G1R2: { F1R21: 42 } }, { G1R2: { F1R21: 12 } }],
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

		// dr1 > ir11
		describe("and a nested inline-repeat containing a control referencing the field", () => {
			it("returns a link if the row which contains the error exists in the document", () => {
				// Add two rows to repeatable group
				const document = DocumentUtils.setValue(
					baseDocument,
					g1RPath,
					[
						{ G1R2: {}, G1R1R: [{ F1R1R1: 42 }] },
						{ G1R2: {}, G1R1R: [{ F1R1R1: 12 }] }
					],
					models.documentModel
				);

				const { messages, state } = setupTest({ document, models });
				strictEqual(messages.length, 1, "Expected that there is one validation message");

				const links = getLinks(state, messages[0]);

				assertNumberOfLinks(links.length, 3);

				assertLink({
					link: links[0],
					expectedFormModelPath: f1r1r1Ir11,
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
							path: createDocumentPath(["root"], ["G1R", 2]),
							focusedComponent: { formModelPath: f1r1r1Ir11, index: 0 },
							focusedComponentRequestCount: 1,
							repeatInstanceState: {
								["/Screen1/dr1/Details/ir11"]: { page: undefined, expandedRowPath: undefined }
							}
						}
					],
					expectedSectionsCollapse: []
				});
			});
		});

		// dr1 > er11
		describe("and an embedded-repeat detail control grid containing a control referencing the field", () => {
			it("returns a link if the row which contains the error exists in the document", () => {
				// Add two rows to repeatable group
				const document = DocumentUtils.setValue(
					baseDocument,
					g1RPath,
					[
						{ G1R2: {}, G1R1R: [{ F1R1R1: 42 }] },
						{ G1R2: {}, G1R1R: [{ F1R1R1: 12 }] }
					],
					models.documentModel
				);

				const { messages, state } = setupTest({ document, models });
				strictEqual(messages.length, 1, "Expected that there is one validation message");

				const links = getLinks(state, messages[0]);

				assertNumberOfLinks(links.length, 3);

				assertLink({
					link: links[1],
					expectedFormModelPath: f1r1r1Er11,
					expectedLocationStack: [
						{
							locationPath: [{ elementName: "Screen1" }],
							path: [],
							focusedComponent: undefined,
							focusedComponentRequestCount: undefined,
							repeatInstanceState: undefined
						},
						{
							locationPath: screen1Dr1,
							path: createDocumentPath(["root"], ["G1R", 2]),
							focusedComponent: {
								formModelPath: f1r1r1Er11,
								index: 0
							},
							focusedComponentRequestCount: 1,
							repeatInstanceState: {
								[ModelPath.toString(screen1Dr1Er11)]: {
									expandedRowPath: createDocumentPath(["root"], ["G1R", 2], ["G1R1R", 1]),
									page: undefined
								}
							}
						}
					],
					expectedSectionsCollapse: []
				});
			});
		});

		// dr1 > dr11
		describe("and a detached-repeat detail screen containing a control referencing the field", () => {
			it("returns a link if the row which contains the error exists in the document", () => {
				// Add two rows to repeatable group
				const document = DocumentUtils.setValue(
					baseDocument,
					g1RPath,
					[
						{ G1R2: {}, G1R1R: [{ F1R1R1: 42 }] },
						{ G1R2: {}, G1R1R: [{ F1R1R1: 12 }] }
					],
					models.documentModel
				);

				const { messages, state } = setupTest({ document, models });
				strictEqual(messages.length, 1, "Expected that there is one validation message");

				const links = getLinks(state, messages[0]);

				assertNumberOfLinks(links.length, 3);

				assertLink({
					link: links[2],
					expectedFormModelPath: f1r1r1Dr11,
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
							path: createDocumentPath(["root"], ["G1R", 2]),
							focusedComponent: undefined,
							focusedComponentRequestCount: undefined,
							repeatInstanceState: undefined
						},
						{
							locationPath: createModelPath("Screen1", "dr1", "Details", "dr11", "Details"),
							path: createDocumentPath(["root"], ["G1R", 2], ["G1R1R", 1]),
							focusedComponent: {
								formModelPath: f1r1r1Dr11
							},
							focusedComponentRequestCount: 1,
							repeatInstanceState: undefined
						}
					],
					expectedSectionsCollapse: [
						{
							collapse: false,
							path: sectionDr11
						}
					]
				});
			});
		});

		describe("and a collapsed section in a nested detached-repeat detail screen containing a control referencing the field", () => {
			it("returns a link with a new section state, where the section is opened", () => {
				const document = DocumentUtils.setValue(
					baseDocument,
					g1RPath,
					[
						{ G1R2: {}, G1R1R: [{ F1R1R1: 42 }] },
						{ G1R2: {}, G1R1R: [{ F1R1R1: 12 }] }
					],
					models.documentModel
				);

				const { messages, state } = setupTest({ document, models });
				strictEqual(messages.length, 1, "Expected that there is one validation message");

				const links = getLinks(state, messages[0]);

				assertNumberOfLinks(links.length, 3);
				strictEqual(links[2].sectionsCollapse.length, 1);
				deepStrictEqual(links[2].sectionsCollapse[0].path, sectionDr11);
				deepStrictEqual(links[2].sectionsCollapse[0].collapse, false);
			});
		});
	});
});
