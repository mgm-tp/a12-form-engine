// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { deepStrictEqual } from "node:assert/strict";

import type { FieldInstanceValue } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { calculateSummaryResult } from "../../../../data/internal/calculateSummaryResult.js";
import type { Value } from "../../../../view/index.js";
import type { RepeatRow } from "../../../../view/internal/components/form-engine/repeat/components/tableColumnTypes.js";
import { DocumentHelpers } from "../../../utils/document-helpers.js";
import { createExpressionColumn, createFieldColumn } from "../../../utils/form-model-factory.js";

describe("unit.view.repeat.calculateSummaryResult", () => {
	it("creates a summary mapping for all field columns with summaryRow enabled", () => {
		const columns = [
			createFieldColumn({ showSummary: true, id: "a", elementPath: [{ elementName: "a" }] }),
			createFieldColumn({ showSummary: true, id: "b", elementPath: [{ elementName: "b" }] }),
			createFieldColumn({ showSummary: true, id: "c", elementPath: [{ elementName: "c" }] }),
			createExpressionColumn({ id: "d" }),
			createFieldColumn({ id: "e", elementPath: [{ elementName: "e" }] })
		];
		const rows = [
			createRow([
				createValue("a", 1),
				createValue("b", 2),
				createValue("c", 3),
				createValue("d", ""),
				createValue("e", 4)
			]),
			createRow([
				createValue("a", 1),
				createValue("b", 2),
				createValue("c", 3),
				createValue("d", ""),
				createValue("e", 4)
			]),
			createRow([
				createValue("a", 1),
				createValue("b", 2),
				createValue("c", 3),
				createValue("d", ""),
				createValue("e", 4)
			])
		];

		const result = calculateSummaryResult(columns, rows);

		deepStrictEqual(result, {
			a: 3,
			b: 6,
			c: 9
		});
	});

	it("does not create a sum entry is all values of a relevant field column are empty", () => {
		const columns = [
			createFieldColumn({ showSummary: true, id: "a", elementPath: [{ elementName: "a" }] }),
			createFieldColumn({ showSummary: true, id: "b", elementPath: [{ elementName: "b" }] }),
			createFieldColumn({ showSummary: true, id: "c", elementPath: [{ elementName: "c" }] })
		];
		const rows = [
			createRow([createValue("a", 0), createValue("b", null), createValue("c", undefined)]),
			createRow([createValue("a", 0), createValue("b", null), createValue("c", undefined)]),
			createRow([createValue("a", 0), createValue("b", null), createValue("c", undefined)])
		];

		const result = calculateSummaryResult(columns, rows);

		deepStrictEqual(result, {
			a: 0,
			b: undefined,
			c: undefined
		});
	});

	describe("skips values in relevant field columns if", () => {
		it("they are empty", () => {
			const columns = [
				createFieldColumn({ showSummary: true, id: "a", elementPath: [{ elementName: "a" }] }),
				createFieldColumn({ showSummary: true, id: "b", elementPath: [{ elementName: "b" }] }),
				createFieldColumn({ showSummary: true, id: "c", elementPath: [{ elementName: "c" }] })
			];
			const rows = [
				createRow([createValue("a", 1), createValue("b", null), createValue("c", undefined)]),
				createRow([createValue("a", null), createValue("b", undefined), createValue("c", 3)]),
				createRow([createValue("a", undefined), createValue("b", 2), createValue("c", null)])
			];

			const result = calculateSummaryResult(columns, rows);

			deepStrictEqual(result, {
				a: 1,
				b: 2,
				c: 3
			});
		});

		it("they are not of type number", () => {
			const columns = [
				createFieldColumn({ showSummary: true, id: "a", elementPath: [{ elementName: "a" }] }),
				createFieldColumn({ showSummary: true, id: "b", elementPath: [{ elementName: "b" }] })
			];
			const rows = [
				createRow([createValue("a", 1), createValue("b", 2)]),
				createRow([createValue("a", "not a number"), createValue("b", false)]),
				createRow([createValue("a", true), createValue("b", new Date())])
			];

			const result = calculateSummaryResult(columns, rows);

			deepStrictEqual(result, {
				a: 1,
				b: 2
			});
		});
	});

	describe("creates an empty map if ", () => {
		it("no columns exist", () => {
			const rows = [
				createRow([createValue("a", 1), createValue("b", 2), createValue("c", 3)]),
				createRow([createValue("a", 1), createValue("b", 2), createValue("c", 3)]),
				createRow([createValue("a", 1), createValue("b", 2), createValue("c", 3)])
			];

			const result = calculateSummaryResult([], rows);

			deepStrictEqual(result, {});
		});

		it("no row data exists", () => {
			const columns = [
				createFieldColumn({ showSummary: true, id: "a", elementPath: [{ elementName: "a" }] }),
				createFieldColumn({ showSummary: true, id: "b", elementPath: [{ elementName: "b" }] }),
				createFieldColumn({ showSummary: true, id: "c", elementPath: [{ elementName: "c" }] })
			];

			const result = calculateSummaryResult(columns, []);

			deepStrictEqual(result, {
				a: undefined,
				b: undefined,
				c: undefined
			});
		});
	});
});

function createValue(fieldName: string, data: FieldInstanceValue | undefined): Value {
	return {
		data,
		path: DocumentHelpers.createDocumentPath([fieldName])
	} as Value;
}

function createRow(values: Value[]): RepeatRow {
	return { values } as RepeatRow;
}
