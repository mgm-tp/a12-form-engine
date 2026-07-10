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
