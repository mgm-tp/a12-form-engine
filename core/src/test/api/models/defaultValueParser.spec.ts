// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { strictEqual } from "node:assert/strict";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";

import { defaultValueParser } from "../../../models/index.js";
import { DocumentModelHelpers } from "../../utils/model-helpers.js";

describe("api.models.defaultValueParser", () => {
	it("returns null if uiValue is an empty string", () => {
		const rootGroup = DocumentModelHelpers.Group({
			name: "root",
			elements: [
				DocumentModelHelpers.Field({
					name: "field"
				})
			]
		});

		const documentModel = DocumentModelHelpers.createDocumentModel(rootGroup);
		const modelPath = ModelPath.fromString("/root/field");
		const result = defaultValueParser(documentModel)(modelPath, "");
		strictEqual(result, null);
	});
});
