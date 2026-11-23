// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { deepStrictEqual } from "node:assert/strict";

import * as repeatfilter from "../../../models/internal/jison/repeatfilter.cjs";

describe("unit.models.jison", () => {
	describe("repeatfilter", () => {
		describe("field", () => {
			it("parses characters correctly", () => {
				parseAndAssert('[name] = "Tester"', {
					type: "filter",
					content: "Tester",
					operation: "=",
					context: { type: "field", name: "name" }
				});
			});

			it("parses digits correctly", () => {
				parseAndAssert('[0815] = "Tester"', {
					type: "filter",
					content: "Tester",
					operation: "=",
					context: { type: "field", name: "0815" }
				});
			});

			it("parses symbols correctly", () => {
				parseAndAssert('[_-] = "Tester"', {
					type: "filter",
					content: "Tester",
					operation: "=",
					context: { type: "field", name: "_-" }
				});
			});
		});

		describe("operation", () => {
			it("parses '=' correctly", () => {
				parseAndAssert('[value] = ""', {
					type: "filter",
					content: "",
					operation: "=",
					context: { type: "field", name: "value" }
				});
			});

			it("parses '!=' correctly", () => {
				parseAndAssert('[value] != ""', {
					type: "filter",
					content: "",
					operation: "!=",
					context: { type: "field", name: "value" }
				});
			});
		});

		describe("group", () => {
			it("parses contexts correctly", () => {
				parseAndAssert('kontext(cname1){ [name] } = "Tester"', {
					type: "filter",
					content: "Tester",
					operation: "=",
					context: {
						type: "group",
						name: "cname1",
						context: {
							type: "field",
							name: "name"
						}
					}
				});
			});

			it("parses nested contexts correctly", () => {
				parseAndAssert('kontext(cname1){ kontext(cname2){ [name] } } = "Tester"', {
					type: "filter",
					content: "Tester",
					operation: "=",
					context: {
						type: "group",
						name: "cname1",
						context: {
							type: "group",
							name: "cname2",
							context: {
								type: "field",
								name: "name"
							}
						}
					}
				});
			});
		});
	});
});

function parseAndAssert(input: string, expected: repeatfilter.FilterNode) {
	deepStrictEqual(repeatfilter.parse(input), expected);
}
