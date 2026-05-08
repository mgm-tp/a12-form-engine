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

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";

import type { FormModel } from "../../../models/index.js";
import { createInitialRows } from "../../../models/internal/utils/document-utils.js";
import { createFormModel } from "../../utils/form-model-factory.js";
import { DocumentModelHelpers } from "../../utils/model-helpers.js";
import { setupFixture } from "../../utils/setupFixture.js";

function setupForm(props: {
	containsGroupConfiguration: boolean;
	groupPath?: ModelPath;
}): FormModel {
	return createFormModel({
		groupConfiguration: props.containsGroupConfiguration
			? {
					groupMap: {
						group1: {
							groupRef: "ref1",
							groupPath: props.groupPath || [],
							numberOfInitialRows: 3
						}
					}
				}
			: undefined
	});
}

describe("api.models.createInitialRows", () => {
	const fixture = setupFixture(() => ({
		documentModel: DocumentModelHelpers.createDocumentModel(
			DocumentModelHelpers.Group({
				id: "root",
				name: "root",
				elements: [
					DocumentModelHelpers.Group({
						id: "groupNotRep",
						name: "groupNotRep"
					}),
					DocumentModelHelpers.Group({
						id: "groupRep",
						name: "groupRep",
						repeatability: 10
					}),
					DocumentModelHelpers.Group({
						id: "groupOuter",
						name: "groupOuter",
						repeatability: 10,
						elements: [
							DocumentModelHelpers.Group({
								id: "groupInnerRep",
								name: "groupInnerRep",
								repeatability: 10,
								elements: [
									DocumentModelHelpers.Group({
										id: "groupInnerNested",
										name: "groupInnerNested",
										repeatability: 10
									})
								]
							}),
							DocumentModelHelpers.Group({
								id: "groupInnerNotRep",
								name: "groupInnerNotRep",
								elements: [
									DocumentModelHelpers.Group({
										id: "groupInnerNested",
										name: "groupInnerNested",
										repeatability: 10
									})
								]
							})
						]
					})
				]
			})
		)
	}));
	describe("given a document model", () => {
		describe("and a form model without numberOfInitialRows", () => {
			it("returns the original document", () => {
				const formModel = setupForm({ containsGroupConfiguration: false });

				const originalDocument = {};
				const newDocument = createInitialRows({
					documentModel: fixture.documentModel,
					formModel,
					document: originalDocument
				});

				deepStrictEqual(newDocument, originalDocument);
			});
		});

		describe("and a form model with numberOfInitialRows defined for a group", () => {
			describe("and the group is not repeatable", () => {
				it("returns the original document", () => {
					const formModel = setupForm({
						containsGroupConfiguration: true,
						groupPath: [{ elementName: "root" }, { elementName: "groupNotRep" }]
					});

					const originalDocument = {};
					const newDocument = createInitialRows({
						documentModel: fixture.documentModel,
						formModel,
						document: originalDocument
					});

					deepStrictEqual(newDocument, originalDocument);
				});
			});

			describe("and the group is repeatable", () => {
				describe("and the group is top-level group", () => {
					it("returns a document containing the specified number of initial rows", () => {
						const formModel = setupForm({
							containsGroupConfiguration: true,
							groupPath: [{ elementName: "root" }, { elementName: "groupRep" }]
						});

						const originalDocument = {};
						const newDocument = createInitialRows({
							documentModel: fixture.documentModel,
							formModel,
							document: originalDocument
						});
						const expectedDocument = {
							root: {
								groupRep: [{}, {}, {}]
							}
						};

						deepStrictEqual(newDocument, expectedDocument);
					});
				});

				describe("and the group is a nested group", () => {
					describe("and no fitting outerGroup is given", () => {
						it("returns the original document", () => {
							const formModel = setupForm({
								containsGroupConfiguration: true,
								groupPath: [
									{ elementName: "root" },
									{ elementName: "groupOuter" },
									{ elementName: "groupInnerNotRep" },
									{ elementName: "groupInnerNested" }
								]
							});

							const originalDocument = {};
							const newDocument = createInitialRows({
								documentModel: fixture.documentModel,
								formModel,
								document: originalDocument
							});

							deepStrictEqual(newDocument, originalDocument);
						});
					});

					describe("and a fitting rowPath for the outer group is given", () => {
						describe("and a group nested in outer group is repeatable", () => {
							it("returns the original document", () => {
								const formModel = setupForm({
									containsGroupConfiguration: true,
									groupPath: [
										{ elementName: "root" },
										{ elementName: "groupOuter" },
										{ elementName: "groupInnerRep" },
										{ elementName: "groupInnerNested" }
									]
								});

								const rowPathOuterGroup = [
									{ elementName: "root", index: 1 },
									{ elementName: "groupOuter", index: 1 }
								];

								const originalDocument = {};
								const newDocument = createInitialRows({
									documentModel: fixture.documentModel,
									formModel,
									document: originalDocument,
									rowPathOuterGroup
								});

								deepStrictEqual(newDocument, originalDocument);
							});
						});

						describe("and all groups nested in outer group are not repeatable", () => {
							it("returns a document containing the specified number of initial rows", () => {
								const formModel = setupForm({
									containsGroupConfiguration: true,
									groupPath: [
										{ elementName: "root" },
										{ elementName: "groupOuter" },
										{ elementName: "groupInnerNotRep" },
										{ elementName: "groupInnerNested" }
									]
								});

								const rowPathOuterGroup = [
									{ elementName: "root", index: 1 },
									{ elementName: "groupOuter", index: 1 }
								];

								const originalDocument = {};
								const newDocument = createInitialRows({
									documentModel: fixture.documentModel,
									formModel,
									document: originalDocument,
									rowPathOuterGroup
								});
								const expectedDocument = {
									root: {
										groupOuter: [
											{
												groupInnerNotRep: {
													groupInnerNested: [{}, {}, {}]
												}
											}
										]
									}
								};

								deepStrictEqual(newDocument, expectedDocument);
							});
						});
					});
				});
			});
		});
	});
});
