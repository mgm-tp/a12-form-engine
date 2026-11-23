// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { deepStrictEqual, strictEqual } from "node:assert/strict";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { ValidationMessage } from "@com.mgmtp.a12.contentengine/contentengine-core";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { checkValidElementForAutocomplete } from "../../../../main/core/contentElements/modules/autoComplete/autocompleteValidator.js";

describe("AutocompleteValidator", () => {
	describe("checkValidElementForAutocomplete", () => {
		it("returns no error for a reference to a supported field", () => {
			const validTypes = ["EnumerationType", "StringWithHintList"] as const;

			validTypes.forEach(t => {
				const messages = checkValidElementForAutocomplete({
					element: field(t),
					path: modelPath()
				});

				strictEqual(messages.length, 0);
			});
		});

		it("returns an error for a reference to a string field without a hint list", () => {
			const messages = checkValidElementForAutocomplete({
				element: field("StringType"),
				path: modelPath()
			});

			deepStrictEqual(messages, [errorMessage()]);
		});

		it("returns an error for a reference to an unsupported field", () => {
			const messages = checkValidElementForAutocomplete({
				element: field("BooleanType"),
				path: modelPath()
			});

			deepStrictEqual(messages, [errorMessage()]);
		});

		it("returns an error for a reference to a group", () => {
			const messages = checkValidElementForAutocomplete({
				element: group(),
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
			`Only fields of type EnumerationType or StringType (with hint list) are supported.`
	};
}

function field(
	fieldType: "EnumerationType" | "StringWithHintList" | "StringType" | "BooleanType"
): DocumentModel.Element {
	return {
		id: "id",
		name: "name",
		type: "Field",
		fieldType: {
			type: fieldType === "StringWithHintList" ? "StringType" : fieldType,
			values: [],
			hintList: fieldType === "StringWithHintList" ? [] : undefined
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
