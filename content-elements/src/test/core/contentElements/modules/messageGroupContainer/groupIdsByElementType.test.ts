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

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { groupIdsByElementType } from "../../../../../main/core/contentElements/modules/messageGroupContainer/useCollectDocumentElementIds.js";

describe("core.contentElements", () => {
	describe("groupIdsByElementType", () => {
		it("should return empty results when no ids are given", () => {
			deepStrictEqual(groupIdsByElementType([], createFieldElement), {
				fieldIds: [],
				groupIds: []
			});
		});

		it("should collect field ids", () => {
			deepStrictEqual(groupIdsByElementType(["field1", "field2"], createFieldElement), {
				fieldIds: ["field1", "field2"],
				groupIds: []
			});
		});

		it("should collect group ids", () => {
			deepStrictEqual(groupIdsByElementType(["group1", "group2"], createGroupElement), {
				fieldIds: [],
				groupIds: ["group1", "group2"]
			});
		});

		it("should collect fields and groups separately, each in the given order", () => {
			const documentElements: Record<string, DocumentModel.Element> = {
				field1: createFieldElement("field1"),
				group1: createGroupElement("group1"),
				field2: createFieldElement("field2")
			};

			const result = groupIdsByElementType(
				["field1", "group1", "field2"],
				id => documentElements[id]
			);

			deepStrictEqual(result, { fieldIds: ["field1", "field2"], groupIds: ["group1"] });
		});

		it("should skip ids that resolve to neither a field nor a group", () => {
			const documentElements: Record<string, DocumentModel.Element> = {
				field1: createFieldElement("field1")
			};

			const result = groupIdsByElementType(
				["field1", "unknown"],
				id => documentElements[id] ?? ({} as DocumentModel.Element)
			);

			deepStrictEqual(result, { fieldIds: ["field1"], groupIds: [] });
		});
	});
});

function createFieldElement(id: string): DocumentModel.Field {
	return { id, name: id, type: "Field", fieldType: { type: "StringType" } };
}

function createGroupElement(id: string): DocumentModel.Group {
	return { id, name: id, type: "Group", repeatability: 5, elements: [] };
}
