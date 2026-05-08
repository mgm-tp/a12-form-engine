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

import { getEffectiveRelevantFields } from "../../back-end/store/internal/getEffectiveRelevantFields.js";

describe("unit.back-end.store.getEffectiveRelevantFields", () => {
	describe("Given a list of paths, where no path contains 0-indices", () => {
		it("does not filter out any paths", () => {
			const relevantPaths = [
				[
					{ elementName: "G1", index: 1 },
					{ elementName: "F1", index: 1 }
				],
				[
					{ elementName: "G2", index: 1 },
					{ elementName: "F2", index: 1 }
				]
			];

			const result = getEffectiveRelevantFields(relevantPaths);

			deepStrictEqual(result, relevantPaths);
		});
	});

	describe("Given a list of paths, where all paths contains 0-indices", () => {
		it("does not filter out any paths", () => {
			const relevantPaths = [
				[
					{ elementName: "G1", index: 0 },
					{ elementName: "F1", index: 1 }
				],
				[
					{ elementName: "G2", index: 0 },
					{ elementName: "F2", index: 1 }
				]
			];

			const result = getEffectiveRelevantFields(relevantPaths);

			deepStrictEqual(result, relevantPaths);
		});
	});

	describe("Given a list of paths, where some paths contain 0-indices", () => {
		describe("and no redundant paths without a 0-index", () => {
			it("does not filter out any paths", () => {
				const relevantPaths = [
					[
						{ elementName: "G1", index: 0 },
						{ elementName: "F1", index: 1 }
					],
					[
						{ elementName: "G2", index: 3 },
						{ elementName: "F2", index: 1 }
					],
					[
						{ elementName: "G3", index: 7 },
						{ elementName: "F3", index: 1 }
					]
				];

				const result = getEffectiveRelevantFields(relevantPaths);

				deepStrictEqual(result, relevantPaths);
			});
		});

		describe("and at least one redundant path without a 0-index", () => {
			it("filters out any redundant paths", () => {
				const redundantPaths = [
					[
						{ elementName: "G1", index: 2 },
						{ elementName: "F1", index: 1 }
					],
					[
						{ elementName: "G1", index: 5 },
						{ elementName: "F1", index: 1 }
					]
				];

				const expectedResult = [
					[
						{ elementName: "G1", index: 0 },
						{ elementName: "F1", index: 1 }
					],
					[
						{ elementName: "G2", index: 3 },
						{ elementName: "F2", index: 1 }
					],
					[
						{ elementName: "G3", index: 0 },
						{ elementName: "F3", index: 1 }
					]
				];

				const result = getEffectiveRelevantFields([...expectedResult, ...redundantPaths]);

				deepStrictEqual(result, expectedResult);
			});
		});
	});
});
