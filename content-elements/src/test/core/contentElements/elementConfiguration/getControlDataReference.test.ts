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

import { strictEqual } from "node:assert/strict";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import { DocumentPath } from "@com.mgmtp.a12.client/client-data";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { getControlDataReference } from "../../../../main/core/contentElements/elementConfiguration/getControlDataReference.js";

describe("core.contentElements", () => {
	describe("getControlDataReference", () => {
		it("resolves a field against the given data context", () => {
			const dataReference = getControlDataReference({
				getModelPathById: () => ModelPath.fromString("/root/group/field"),
				getElementByPath: createField,
				elementId: "field-id",
				dataContext: DocumentPath.fromString("/root[1]/group[2]")
			});

			strictEqual(dataReference, "/root[1]/group[2]/field[1]");
		});

		it("indexes a repeatable multi-select group with the whole-group index", () => {
			const dataReference = getControlDataReference({
				getModelPathById: () => ModelPath.fromString("/root/multiSelect"),
				getElementByPath: createMultiSelectGroup,
				elementId: "multi-select-id",
				dataContext: DocumentPath.fromString("/root[1]")
			});

			strictEqual(dataReference, "/root[1]/multiSelect[0]");
		});

		it("does not apply the group indexing to a repeatable group without a usage type", () => {
			const dataReference = getControlDataReference({
				getModelPathById: () => ModelPath.fromString("/root/repeatable"),
				getElementByPath: createRepeatableGroup,
				elementId: "repeatable-id",
				dataContext: DocumentPath.fromString("/root[1]")
			});

			strictEqual(dataReference, "/root[1]/repeatable[1]");
		});
	});
});

function createField(): DocumentModel.Field {
	return { id: "field-id", name: "field", type: "Field" } as DocumentModel.Field;
}

function createMultiSelectGroup(): DocumentModel.Group {
	return {
		id: "multi-select-id",
		name: "multiSelect",
		type: "Group",
		repeatability: 10,
		usageType: "multi-select"
	} as DocumentModel.Group;
}

function createRepeatableGroup(): DocumentModel.Group {
	return {
		id: "repeatable-id",
		name: "repeatable",
		type: "Group",
		repeatability: 10
	} as DocumentModel.Group;
}
