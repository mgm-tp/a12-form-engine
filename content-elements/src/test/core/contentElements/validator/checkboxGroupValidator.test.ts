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

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type { ValidationMessage } from "@com.mgmtp.a12.contentengine/contentengine-core";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { checkValidElementForCheckboxGroup } from "../../../../main/core/contentElements/modules/checkboxGroup/checkboxGroupValidator.js";

describe("core.contentElements.validator", () => {
	describe("CheckboxGroupValidator", () => {
		describe("checkValidElementForCheckboxGroup", () => {
			it("returns no error for a reference to a multi-select group", () => {
				const messages = checkValidElementForCheckboxGroup({
					element: group("multi-select"),
					path: modelPath()
				});

				strictEqual(messages.length, 0);
			});

			it("returns an error for a reference to a group without usageType 'multi-select'", () => {
				const messages = checkValidElementForCheckboxGroup({
					element: group(),
					path: modelPath()
				});

				deepStrictEqual(messages, [errorMessage()]);
			});

			it("returns an error for a reference to a field", () => {
				const messages = checkValidElementForCheckboxGroup({
					element: field(),
					path: modelPath()
				});

				deepStrictEqual(messages, [errorMessage()]);
			});
		});
	});
});

function errorMessage(): ValidationMessage {
	return {
		severity: "Error",
		message:
			`Invalid reference to element ${ModelPath.toString(modelPath())}. ` +
			`Only multi-select groups are supported.`
	};
}

function field(): DocumentModel.Element {
	return {
		id: "id",
		name: "name",
		type: "Field",
		fieldType: {
			type: "StringType"
		}
	};
}

function group(usageType?: string): DocumentModel.Element {
	return {
		id: "id",
		name: "name",
		type: "Group",
		repeatability: 5,
		usageType,
		elements: []
	};
}

function modelPath(): ModelPath {
	return [{ elementName: "my" }, { elementName: "model" }, { elementName: "path" }];
}
