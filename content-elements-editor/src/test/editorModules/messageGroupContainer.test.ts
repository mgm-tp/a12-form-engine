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

import { strictEqual } from "assert";
import { mock } from "node:test";

import type { ContentModel } from "@com.mgmtp.a12.contentengine/contentengine-core";
import type { GlobalSearch } from "@com.mgmtp.a12.contentengine/contentengine-editor";
import {
	FORM_ELEMENTS_NAMESPACE,
	MESSAGE_GROUP_CONTAINER_TYPE,
	type MessageGroupContainerNode
} from "@com.mgmtp.a12.formengine/formengine-content-elements";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { createGetSearchMatches } from "../../editorModules/messageGroupContainer.js";

describe("editorModules", () => {
	describe("MessageGroupContainer", () => {
		describe("getSearchMatches", () => {
			it("should call findMatches for every field/group in the props", () => {
				const mockFindMatches = mock.fn(() => []);

				const getSearchMatches = createGetSearchMatches({ findMatches: mockFindMatches });

				const testQuery = "test-query";
				const testContext = {
					node: mockNode(),
					contentModel: {} as ContentModel,
					referencedModels: [dm()]
				};
				const testOptions = {
					options: "test"
				} as unknown as GlobalSearch.SearchOptions;

				getSearchMatches(testQuery, testContext, testOptions);

				strictEqual(mockFindMatches.mock.calls.length, 4);

				const expectedPaths = [
					"/root/group1/field1",
					"/root/group2/field2",
					"/root/group1",
					"/root/group2"
				];

				for (const [idx, element] of expectedPaths.entries()) {
					strictEqual(mockFindMatches.mock.calls[idx].arguments.at(0), element);
					strictEqual(mockFindMatches.mock.calls[idx].arguments.at(1), testQuery);
					strictEqual(mockFindMatches.mock.calls[idx].arguments.at(2), testOptions);
				}
			});

			it("should return matches containing the results of findMatches for every field/group", () => {
				const mockHighlights: GlobalSearch.HighlightRange[] = [
					{ start: 0, end: 2 },
					{ start: 5, end: 7 }
				];
				const getSearchMatches = createGetSearchMatches({ findMatches: () => mockHighlights });

				const result = getSearchMatches(
					"test-query",
					{
						node: mockNode(),
						contentModel: {} as ContentModel,
						referencedModels: [dm()]
					},
					{
						options: "test"
					} as unknown as GlobalSearch.SearchOptions
				);

				strictEqual(result.length, 4);

				const expectedMatches = [
					{ prop: "fields", propPath: "/fields[1]", dmPath: "/root/group1/field1" },
					{ prop: "fields", propPath: "/fields[2]", dmPath: "/root/group2/field2" },
					{ prop: "groups", propPath: "/groups[1]", dmPath: "/root/group1" },
					{ prop: "groups", propPath: "/groups[2]", dmPath: "/root/group2" }
				];

				for (const [idx, match] of result.entries()) {
					const expectedMatch = expectedMatches.at(idx);

					strictEqual(match.propertyName, expectedMatch?.prop);
					strictEqual(match.propertyPath, expectedMatch?.propPath);
					strictEqual(match.matchedValue, expectedMatch?.dmPath);
					strictEqual(match.highlightRanges, mockHighlights);
				}
			});
		});
	});
});

function mockNode(): MessageGroupContainerNode {
	return {
		id: "test-node-id",
		type: MESSAGE_GROUP_CONTAINER_TYPE,
		namespace: FORM_ELEMENTS_NAMESPACE,
		props: {
			fields: ["field1", "field2"],
			groups: ["group1", "group2"]
		}
	};
}

function field(name: string): DocumentModel.Field {
	return {
		id: name,
		name: name,
		type: "Field",
		fieldType: {
			type: "StringType"
		}
	};
}

function group(
	name: string,
	repeatability: number,
	elements: DocumentModel.Element[]
): DocumentModel.Group {
	return {
		id: name,
		name: name,
		type: "Group",
		repeatability,
		elements
	};
}

function dm(): DocumentModel {
	return {
		header: { modelType: "document" },
		content: {
			modelInfo: {},
			modelConfig: {},
			modelRoot: {
				id: "ROOT",
				type: "Group",
				name: "ROOT_GROUP",
				repeatability: 1,
				elements: [
					{
						id: "root",
						type: "Group",
						repeatability: 1,
						name: "root",
						elements: [group("group1", 1, [field("field1")]), group("group2", 5, [field("field2")])]
					}
				]
			}
		}
	} as unknown as DocumentModel;
}
