// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
