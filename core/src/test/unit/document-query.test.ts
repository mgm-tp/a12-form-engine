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

import { deepStrictEqual, strictEqual } from "node:assert/strict";
import { mock } from "node:test";

import type {
	DocumentModel,
	EntityInstancePath,
	FieldInstanceValue,
	GroupInstance
} from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { walk } from "../../models/internal/utils/document-utils.js";

import { createDocumentPath } from "../utils/createDocumentPath.js";
import { DocumentModelHelpers } from "../utils/DocumentModelHelpers.js";

describe("unit.DocumentQuery", () => {
	describe("walk", () => {
		it(
			"calls the given visitor function exactly once for all relevant " +
				"elements in the correct order",
			() => {
				const testData = prepareTestData();

				const visitSpy = mock.fn();
				walk(testData.element, testData.modelElement, visitSpy);

				strictEqual(visitSpy.mock.callCount(), testData.expectedVisitorArguments.length);
				const visitorArguments = visitSpy.mock.calls;
				for (let i = 0; i < visitorArguments.length; i++) {
					deepStrictEqual(
						visitorArguments[i].arguments[0],
						testData.expectedVisitorArguments[i],
						`not equal for index ${i}`
					);
				}
			}
		);
	});
});

function prepareTestData(): {
	element: GroupInstance;
	modelElement: DocumentModel.Group;
	expectedVisitorArguments: {
		path: EntityInstancePath;
		element?: GroupInstance | FieldInstanceValue;
		modelElement: DocumentModel.Element;
	}[];
} {
	// Start: Document values -------------------------------------------------
	const dummyString = "ABC";
	const dummyDateRange = [new Date("2022-12-12"), new Date("2022-12-24")];

	const nestedRepeatableGroupData = [
		{
			stringFieldNestedRep: dummyString,
			dateRangeFieldNestedRep: dummyDateRange
		},
		{
			stringFieldNestedRep: dummyString,
			dateRangeFieldNestedRep: dummyDateRange
		}
	];
	const repeatableGroupData = [
		{
			stringFieldRep: dummyString,
			dateRangeFieldRep: dummyDateRange
		},
		{
			stringFieldRep: dummyString,
			dateRangeFieldRep: dummyDateRange,
			nestedRepeatableGroup: nestedRepeatableGroupData
		}
	];
	const groupData = {
		stringField: dummyString,
		dateRangeField: dummyDateRange
	};
	const rootData = { group: groupData, repeatableGroup: repeatableGroupData };
	// End: Document values -------------------------------------------------

	// Start: Document Model elements ---------------------------------------
	const stringField = DocumentModelHelpers.Field({ name: "stringField" });
	const stringFieldRep = DocumentModelHelpers.Field({ name: "stringFieldRep" });
	const stringFieldNestedRep = DocumentModelHelpers.Field({ name: "stringFieldNestedRep" });

	const dateRangeField = DocumentModelHelpers.Field({
		name: "dateRangeField",
		fieldType: { type: "DateRangeType", format: "yyyy-MM-dd", rangeSeparator: "/" }
	});
	const dateRangeFieldRep = DocumentModelHelpers.Field({
		name: "dateRangeFieldRep",
		fieldType: { type: "DateRangeType", format: "yyyy-MM-dd", rangeSeparator: "/" }
	});
	const dateRangeFieldNestedRep = DocumentModelHelpers.Field({
		name: "dateRangeFieldNestedRep",
		fieldType: { type: "DateRangeType", format: "yyyy-MM-dd", rangeSeparator: "/" }
	});

	const nestedRepeatableGroup = DocumentModelHelpers.Group({
		name: "nestedRepeatableGroup",
		repeatability: 5,
		elements: [stringFieldNestedRep, dateRangeFieldNestedRep]
	});
	const repeatableGroup = DocumentModelHelpers.Group({
		name: "repeatableGroup",
		repeatability: 5,
		elements: [stringFieldRep, dateRangeFieldRep, nestedRepeatableGroup]
	});
	const group = DocumentModelHelpers.Group({
		name: "group",
		elements: [stringField, dateRangeField]
	});

	const emptyNestedRepeatableGroup = DocumentModelHelpers.Group({
		name: "emptyNestedRepeatableGroup",
		repeatability: 5
	});
	const emptyRepeatableGroup = DocumentModelHelpers.Group({
		name: "emptyRepeatableGroup",
		repeatability: 5,
		elements: [emptyNestedRepeatableGroup]
	});
	const emptyGroup = DocumentModelHelpers.Group({ id: "emptyGroup", name: "emptyGroup" });
	const rootGroup = DocumentModelHelpers.Group({
		name: "rootGroup",
		elements: [group, emptyGroup, repeatableGroup, emptyRepeatableGroup]
	});
	// End: Document Model elements ---------------------------------------

	const expectedVisitorArguments = [
		{
			path: createDocumentPath(),
			element: rootData,
			modelElement: rootGroup
		},
		{
			path: createDocumentPath(["group"]),
			element: groupData,
			modelElement: group
		},
		{
			path: createDocumentPath(["group"], ["stringField"]),
			element: dummyString,
			modelElement: stringField
		},
		{
			path: createDocumentPath(["group"], ["dateRangeField"]),
			element: dummyDateRange,
			modelElement: dateRangeField
		},
		{
			path: createDocumentPath(["emptyGroup"]),
			element: undefined,
			modelElement: emptyGroup
		},
		{
			path: createDocumentPath(["repeatableGroup", 1]),
			element: repeatableGroupData[0],
			modelElement: repeatableGroup
		},
		{
			path: createDocumentPath(["repeatableGroup", 1], ["stringFieldRep"]),
			element: dummyString,
			modelElement: stringFieldRep
		},
		{
			path: createDocumentPath(["repeatableGroup", 1], ["dateRangeFieldRep"]),
			element: dummyDateRange,
			modelElement: dateRangeFieldRep
		},
		{
			path: createDocumentPath(["repeatableGroup", 2]),
			element: repeatableGroupData[1],
			modelElement: repeatableGroup
		},
		{
			path: createDocumentPath(["repeatableGroup", 2], ["stringFieldRep"]),
			element: dummyString,
			modelElement: stringFieldRep
		},
		{
			path: createDocumentPath(["repeatableGroup", 2], ["dateRangeFieldRep"]),
			element: dummyDateRange,
			modelElement: dateRangeFieldRep
		},
		{
			path: createDocumentPath(["repeatableGroup", 2], ["nestedRepeatableGroup", 1]),
			element: nestedRepeatableGroupData[0],
			modelElement: nestedRepeatableGroup
		},
		{
			path: createDocumentPath(
				["repeatableGroup", 2],
				["nestedRepeatableGroup", 1],
				["stringFieldNestedRep"]
			),
			element: dummyString,
			modelElement: stringFieldNestedRep
		},
		{
			path: createDocumentPath(
				["repeatableGroup", 2],
				["nestedRepeatableGroup", 1],
				["dateRangeFieldNestedRep"]
			),
			element: dummyDateRange,
			modelElement: dateRangeFieldNestedRep
		},
		{
			path: createDocumentPath(["repeatableGroup", 2], ["nestedRepeatableGroup", 2]),
			element: nestedRepeatableGroupData[1],
			modelElement: nestedRepeatableGroup
		},
		{
			path: createDocumentPath(
				["repeatableGroup", 2],
				["nestedRepeatableGroup", 2],
				["stringFieldNestedRep"]
			),
			element: dummyString,
			modelElement: stringFieldNestedRep
		},
		{
			path: createDocumentPath(
				["repeatableGroup", 2],
				["nestedRepeatableGroup", 2],
				["dateRangeFieldNestedRep"]
			),
			element: dummyDateRange,
			modelElement: dateRangeFieldNestedRep
		}
	];

	return {
		element: rootData,
		modelElement: rootGroup,
		expectedVisitorArguments
	};
}
