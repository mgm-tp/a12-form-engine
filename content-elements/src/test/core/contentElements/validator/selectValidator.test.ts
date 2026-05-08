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

import { deepStrictEqual, strictEqual } from "node:assert/strict";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { ValidationMessage } from "@com.mgmtp.a12.contentengine/contentengine-core";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { checkValidElementForSelect } from "../../../../main/core/contentElements/modules/select/selectValidator.js";

describe("SelectValidator", () => {
	describe("checkValidElementForSelect", () => {
		it("returns no error for a reference to a supported field", () => {
			const validTypes = ["BooleanType", "EnumerationType"] as const;

			validTypes.forEach(t => {
				const messages = checkValidElementForSelect({
					element: field(t),
					path: modelPath()
				});

				strictEqual(messages.length, 0);
			});
		});

		it("returns an error for a reference to an unsupported field", () => {
			const messages = checkValidElementForSelect({
				element: field("StringType"),
				path: modelPath()
			});

			deepStrictEqual(messages, [errorMessage()]);
		});

		it("returns an error for a reference to a group", () => {
			const messages = checkValidElementForSelect({ element: group(), path: modelPath() });

			deepStrictEqual(messages, [errorMessage()]);
		});
	});
});

function errorMessage(): ValidationMessage {
	return {
		severity: "Error",
		message:
			`Invalid reference to element ${ModelPath.toString(modelPath())}. ` +
			`Only fields of type BooleanType or EnumerationType are supported.`
	};
}

function field(fieldType: "BooleanType" | "EnumerationType" | "StringType"): DocumentModel.Element {
	return {
		id: "id",
		name: "name",
		type: "Field",
		fieldType: {
			type: fieldType,
			values: []
		}
	};
}

function group(): DocumentModel.Element {
	return {
		id: "id",
		name: "name",
		type: "Group",
		repeatability: 1,
		elements: []
	};
}

function modelPath(): ModelPath {
	return [{ elementName: "my" }, { elementName: "model" }, { elementName: "path" }];
}
