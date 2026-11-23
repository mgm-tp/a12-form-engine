// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { deepStrictEqual, strictEqual } from "node:assert/strict";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { ValidationMessage } from "@com.mgmtp.a12.contentengine/contentengine-core";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { checkValidElementForMultiSelect } from "../../../../main/core/contentElements/modules/multiSelect/multiSelectValidator.js";

describe("MultiSelectValidator", () => {
	describe("checkValidElementType", () => {
		it("returns no error for a reference to a multi-select group", () => {
			const messages = checkValidElementForMultiSelect({
				element: group("multi-select"),
				path: modelPath()
			});

			strictEqual(messages.length, 0);
		});

		it("returns an error for a reference to a group without usageType 'multi-select'", () => {
			const messages = checkValidElementForMultiSelect({
				element: group(),
				path: modelPath()
			});

			deepStrictEqual(messages, [errorMessage()]);
		});

		it("returns an error for a reference to a field", () => {
			const messages = checkValidElementForMultiSelect({
				element: field(),
				path: modelPath()
			});

			deepStrictEqual(messages, [errorMessage()]);
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
