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

import type { CorrectionModeItem } from "./correction-mode-test-utils.js";
import {
	assertLink,
	assertNumberOfLinks,
	baseDocument,
	createDocumentPath,
	detailScreenDr1,
	detailScreenDr1Dr11,
	detailScreenDr1Er11,
	DocumentUtils,
	f2MDr1,
	f2MDr1Dr11,
	f2MDr1Er11,
	f2MDr1Ir11,
	f2MEr1,
	f2MIr1,
	f2MPath,
	f2MScreen1,
	f2MScreen2,
	g1RPath,
	getLinks,
	ModelPath,
	ROOT_GROUP,
	screen1,
	screen1Er1,
	screen2,
	setupTest
} from "./correction-mode-test-utils.js";

describe("unit.view.validation.correctionMode.rootGroupField", () => {
	const models = setupModelsFixture("computation-validation.correctionmode");

	// F2M
	describe("Given a field with an invalid value in the root group", () => {
		describe("and no screen containing a control referencing the field", () => {
			it("does not return any link", () => {
				const notVisibleFieldPath = createDocumentPath([ROOT_GROUP], ["notVisibleField"]);

				const document = DocumentUtils.setValue(
					baseDocument,
					notVisibleFieldPath,
					12,
					models.documentModel
				);

				const { messages, state } = setupTest({ document, models });
				strictEqual(messages.length, 1, "Expected that there is one validation message");
				const links = getLinks(state, messages[0]);
				assertNumberOfLinks(links.length, 0);
			});
		});

		// Screen1 and Screen2
		describe("and a top level screen containing a control referencing the field", () => {
			let links: ReadonlyArray<CorrectionModeItem>;
			before(() => {
				const document = DocumentUtils.setValue(baseDocument, f2MPath, 12, models.documentModel);
				const { messages, state } = setupTest({ document, models });
				links = getLinks(state, messages[0]);
			});

			it("returns a correct link to the control on screen 1", () => {
				assertLink({
					link: links[0],
					expectedFormModelPath: f2MScreen1,
					expectedLocationStack: [
						{
							locationPath: screen1,
							focusedComponent: { formModelPath: f2MScreen1 },
							focusedComponentRequestCount: 1,
							path: [],
							repeatInstanceState: undefined
						}
					],
					expectedSectionsCollapse: []
				});
			});

			it("returns a correct link to the control on screen 2", () => {
				assertLink({
					link: links[1],
					expectedFormModelPath: f2MScreen2,
					expectedLocationStack: [
						{
							locationPath: screen2,
							focusedComponent: { formModelPath: f2MScreen2 },
							focusedComponentRequestCount: 1,
							path: [],
							repeatInstanceState: undefined
						}
					],
					expectedSectionsCollapse: []
				});
			});
		});

		// ir1, er1, and dr1
		describe("and repeats containing a control referencing the field", () => {
			it("does not return a link if the repeatable group has no rows", () => {
				const document = DocumentUtils.setValue(baseDocument, f2MPath, 23, models.documentModel);

				const { messages, state } = setupTest({ document, models });

				strictEqual(messages.length, 1, "Expected that there is one validation message");

				const links = getLinks(state, messages[0]);

				assertNumberOfLinks(links.length, 2);
				deepStrictEqual(links[0].formModelPath, f2MScreen1, "Wrong form model path in first link");

				deepStrictEqual(links[1].formModelPath, f2MScreen2, "Wrong form model path in second link");
			});
		});

		// ir1
		describe("and a inline-repeat containing a control referencing the field", () => {
			it("returns a link if the repeatable group has at least one row", () => {
				let document = DocumentUtils.setValue(baseDocument, f2MPath, 23, models.documentModel);

				// Add two rows to repeatable group
				document = DocumentUtils.setValue(
					document,
					g1RPath,
					[{ G1R2: {} }, { G1R2: {} }],
					models.documentModel
				);

				const { messages, state } = setupTest({ document, models });
				strictEqual(messages.length, 1, "Expected that there is one validation message");

				const links = getLinks(state, messages[0]);
				assertNumberOfLinks(links.length, 5);

				assertLink({
					link: links[1],
					expectedFormModelPath: f2MIr1,
					expectedLocationStack: [
						{
							locationPath: screen1,
							path: [],
							focusedComponent: {
								formModelPath: f2MIr1,
								index: 0
							},
							focusedComponentRequestCount: 1,
							repeatInstanceState: { ["/Screen1/ir1"]: { page: 1, expandedRowPath: undefined } }
						}
					],
					expectedSectionsCollapse: []
				});
			});
		});

		// dr1 > ir11
		describe("and a nested inline-repeat containing a control referencing the field", () => {
			it("returns a link if the nested repeatable group has at least one row", () => {
				let document = DocumentUtils.setValue(baseDocument, f2MPath, 23, models.documentModel);

				// Add two rows to repeatable group
				document = DocumentUtils.setValue(
					document,
					g1RPath,
					[
						{ G1R2: {}, G1R1R: [{}] },
						{ G1R2: {}, G1R1R: [{}] }
					],
					models.documentModel
				);

				const { messages, state } = setupTest({ document, models });
				strictEqual(messages.length, 1, "Expected that there is one validation message");

				const links = getLinks(state, messages[0]);

				assertNumberOfLinks(links.length, 8);

				assertLink({
					link: links[4],
					expectedFormModelPath: f2MDr1Ir11,
					expectedLocationStack: [
						{
							locationPath: screen1,
							path: [],
							focusedComponent: undefined,
							focusedComponentRequestCount: undefined,
							repeatInstanceState: undefined
						},
						{
							locationPath: detailScreenDr1,
							path: g1RPath,
							focusedComponent: {
								formModelPath: f2MDr1Ir11,
								index: 0
							},
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

		// er1
		describe("and an embedded-repeat containing a control referencing the field", () => {
			it("returns a link if the repeatable group has at least one row", () => {
				let document = DocumentUtils.setValue(baseDocument, f2MPath, 23, models.documentModel);

				// Add two rows to repeatable group
				document = DocumentUtils.setValue(
					document,
					g1RPath,
					[{ G1R2: {} }, { G1R2: {} }],
					models.documentModel
				);

				const { messages, state } = setupTest({ document, models });
				strictEqual(messages.length, 1, "Expected that there is one validation message");

				const links = getLinks(state, messages[0]);
				assertNumberOfLinks(links.length, 5);

				assertLink({
					link: links[2],
					expectedFormModelPath: f2MEr1,
					expectedLocationStack: [
						{
							locationPath: screen1,
							path: [],
							focusedComponent: {
								formModelPath: f2MEr1,
								index: 0
							},
							focusedComponentRequestCount: 1,
							repeatInstanceState: {
								[ModelPath.toString(screen1Er1)]: {
									expandedRowPath: createDocumentPath(["root"], ["G1R"]),
									page: undefined
								}
							}
						}
					],
					expectedSectionsCollapse: []
				});
			});
		});

		// dr1 > er11
		describe("and a nested embedded-repeat containing a control referencing the field", () => {
			it("returns a link if the nested repeatable group has at least one row", () => {
				let document = DocumentUtils.setValue(baseDocument, f2MPath, 23, models.documentModel);

				// Add two rows to repeatable group
				document = DocumentUtils.setValue(
					document,
					g1RPath,
					[
						{ G1R2: {}, G1R1R: [{}] },
						{ G1R2: {}, G1R1R: [{}] }
					],
					models.documentModel
				);

				const { messages, state } = setupTest({ document, models });
				strictEqual(messages.length, 1, "Expected that there is one validation message");

				const links = getLinks(state, messages[0]);

				assertNumberOfLinks(links.length, 8);

				assertLink({
					link: links[5],
					expectedFormModelPath: f2MDr1Er11,
					expectedLocationStack: [
						{
							locationPath: screen1,
							path: [],
							focusedComponent: undefined,
							focusedComponentRequestCount: undefined,
							repeatInstanceState: undefined
						},
						{
							locationPath: detailScreenDr1,
							path: g1RPath,
							focusedComponent: {
								formModelPath: f2MDr1Er11,
								index: 0
							},
							focusedComponentRequestCount: 1,
							repeatInstanceState: {
								[ModelPath.toString(detailScreenDr1Er11)]: {
									expandedRowPath: createDocumentPath(["root"], ["G1R"], ["G1R1R"]),
									page: undefined
								}
							}
						}
					],
					expectedSectionsCollapse: []
				});
			});
		});

		// dr1
		describe("and a detached-repeat detail screen containing a control referencing the field", () => {
			it("returns a link if the repeatable group has at least one row", () => {
				let document = DocumentUtils.setValue(baseDocument, f2MPath, 23, models.documentModel);

				// Add two rows to repeatable group
				document = DocumentUtils.setValue(
					document,
					g1RPath,
					[{ G1R2: {} }, { G1R2: {} }],
					models.documentModel
				);

				const { messages, state } = setupTest({ document, models });
				strictEqual(messages.length, 1, "Expected that there is one validation message");

				const links = getLinks(state, messages[0]);

				assertNumberOfLinks(links.length, 5);

				assertLink({
					link: links[3],
					expectedFormModelPath: f2MDr1,
					expectedLocationStack: [
						{
							locationPath: screen1,
							path: [],
							focusedComponent: undefined,
							focusedComponentRequestCount: undefined,
							repeatInstanceState: undefined
						},
						{
							locationPath: detailScreenDr1,
							path: g1RPath,
							focusedComponent: {
								formModelPath: f2MDr1
							},
							focusedComponentRequestCount: 1,
							repeatInstanceState: undefined
						}
					],
					expectedSectionsCollapse: []
				});
			});
		});

		// dr1 > dr11
		describe("and a nested detached-repeat detail screen containing a control referencing the field", () => {
			it("returns a link if the nested repeatable group has at least one row", () => {
				let document = DocumentUtils.setValue(baseDocument, f2MPath, 23, models.documentModel);

				// Add two rows to repeatable group
				document = DocumentUtils.setValue(
					document,
					g1RPath,
					[
						{ G1R2: {}, G1R1R: [{}] },
						{ G1R2: {}, G1R1R: [{}] }
					],
					models.documentModel
				);

				const { messages, state } = setupTest({ document, models });
				strictEqual(messages.length, 1, "Expected that there is one validation message");

				const links = getLinks(state, messages[0]);

				assertLink({
					link: links[6],
					expectedFormModelPath: f2MDr1Dr11,
					expectedLocationStack: [
						{
							locationPath: screen1,
							path: [],
							focusedComponent: undefined,
							focusedComponentRequestCount: undefined,
							repeatInstanceState: undefined
						},
						{
							locationPath: detailScreenDr1,
							path: g1RPath,
							focusedComponent: undefined,
							focusedComponentRequestCount: undefined,
							repeatInstanceState: undefined
						},
						{
							locationPath: detailScreenDr1Dr11,
							path: createDocumentPath(["root"], ["G1R"], ["G1R1R"]),
							focusedComponent: {
								formModelPath: f2MDr1Dr11
							},
							focusedComponentRequestCount: 1,
							repeatInstanceState: undefined
						}
					],
					expectedSectionsCollapse: []
				});
			});
		});
	});
});
