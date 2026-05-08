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

import { strictEqual } from "node:assert/strict";

import { setupModelsFixture } from "../../utils/setupFixture.js";

import type { GroupInstance } from "./correction-mode-test-utils.js";
import {
	assertNumberOfLinks,
	baseDocument,
	createDocumentPath,
	DocumentUtils,
	getLinks,
	getUIIssueReport,
	setupTest
} from "./correction-mode-test-utils.js";

describe("unit.view.validation.correctionMode.visibilityAndUnfixable", () => {
	const models = setupModelsFixture("computation-validation.correctionmode");

	describe("Dependent visibility", () => {
		const baseDocumentForDependencies = {
			...baseDocument,
			GroupForDependencies: {
				MasterFields: {
					MasterFieldDependentField: true,
					MasterFieldDependentGroup: true,
					MasterFieldDependentControl: true
				},
				repeatableGroup: [
					{
						/** Empty first row */
					},
					{
						MasterFields: {
							MasterFieldDependentFieldRep: true,
							MasterFieldDependentGroupRep: true,
							MasterFieldDependentControlRep: true
						},
						DependentFields: {
							DependentGroup: {}
						},
						nestedRepeatableGroup: [
							{
								/** Empty first row */
							},
							{
								MasterFields: {
									MasterFieldDependentFieldNestedRep: true,
									MasterFieldDependentGroupNestedRep: true,
									MasterFieldDependentControlNestedRep: true
								},
								DependentFields: {
									DependentGroup: {}
								}
							}
						]
					}
				]
			}
		};

		function executeTest(document: GroupInstance): void {
			const { messages, state } = setupTest({ document, models });
			strictEqual(messages.length, 1, "Expected that there is one validation message");
			const links = getLinks(state, messages[0]);
			assertNumberOfLinks(links.length, 0);
		}

		describe("given a control inside a top level screen", () => {
			describe("which is hidden due to dependent control", () => {
				it("does not return a link", () => {
					const dependentField = createDocumentPath(
						["GroupForDependencies"],
						["DependentFields"],
						["DependentControl"]
					);
					const document = DocumentUtils.setValue(
						baseDocumentForDependencies,
						dependentField,
						12, // will throw error
						models.documentModel
					);
					executeTest(document);
				});
			});
		});

		describe("given a control inside a detached repeat detail screen", () => {
			describe("which is hidden due to dependent control", () => {
				it("does not return a link", () => {
					const dependentField = createDocumentPath(
						["GroupForDependencies"],
						["repeatableGroup", 2],
						["nestedRepeatableGroup", 2],
						["DependentFields"],
						["DependentControl"]
					);
					const document = DocumentUtils.setValue(
						baseDocumentForDependencies,
						dependentField,
						12, // will throw error
						models.documentModel
					);
					executeTest(document);
				});
			});
		});

		describe("given a control inside a nested detached repeat detail screen", () => {
			describe("which is hidden due to dependent control", () => {
				it("does not return a link", () => {
					const dependentField = createDocumentPath(
						["GroupForDependencies"],
						["repeatableGroup", 2],
						["DependentFields"],
						["DependentControl"]
					);
					const document = DocumentUtils.setValue(
						baseDocumentForDependencies,
						dependentField,
						12, // will throw error
						models.documentModel
					);
					executeTest(document);
				});
			});
		});

		describe("given a control inside an embedded repeat detail control grid", () => {
			describe("which is hidden due to dependent control", () => {
				it("does not return a link", () => {
					const dependentField = createDocumentPath(
						["GroupForDependencies"],
						["repeatableGroup", 2],
						["DependentFields"],
						["DependentControl"]
					);
					const document = DocumentUtils.setValue(
						baseDocumentForDependencies,
						dependentField,
						12, // will throw error
						models.documentModel
					);
					executeTest(document);
				});
			});
		});
	});

	describe("Errors with no correction mode link", () => {
		describe("given an error for which no correction mode link can be shown, but the error can be fixed on the current form", () => {
			it("returns no items and fixable=true", () => {
				const document = {
					...baseDocument,
					NoErrorLinks: {
						errorField: "test",
						repGroup: [{}]
					}
				};

				const { messages, state } = setupTest({ document, models });
				strictEqual(messages.length, 1, "Expected that there is one validation message");
				const uiIssueReport = getUIIssueReport(state, messages[0]);
				strictEqual(uiIssueReport.fixable, true);
				if (uiIssueReport.fixable) {
					assertNumberOfLinks(uiIssueReport.items.length, 0);
				}
			});
		});

		describe("given an error for which no correction mode link can be shown, but the error can not be fixed on the current form", () => {
			it("returns no items and fixable=false", () => {
				const document = { ...baseDocument, NoErrorLinks: { triggerField: "test" } };

				const { messages, state } = setupTest({ document, models });
				strictEqual(messages.length, 1, "Expected that there is one validation message");
				const uiIssueReport = getUIIssueReport(state, messages[0]);
				strictEqual(uiIssueReport.fixable, false);
			});
		});
	});
});
