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

import { isAllowedImageUploadSrc } from "../../../view/internal/components/widgets/form-engine/attachments/MarkdownEditorField.js";

describe("unit.attachments", () => {
	describe("isAllowedImageUploadSrc", () => {
		it("allows data URIs, unlike the editor's own default image URL policy", () => {
			strictEqual(isAllowedImageUploadSrc("data:image/png;base64,iVBORw0KGgo="), true);
		});

		it("allows http(s) URLs", () => {
			strictEqual(isAllowedImageUploadSrc("https://example.com/a.png"), true);
			strictEqual(isAllowedImageUploadSrc("http://example.com/a.png"), true);
		});

		it("allows schemeless (relative) addresses", () => {
			strictEqual(isAllowedImageUploadSrc("images/a.png"), true);
		});

		it("rejects a dangerous scheme such as javascript:", () => {
			strictEqual(isAllowedImageUploadSrc("javascript:alert(1)"), false);
		});

		it("rejects a dangerous scheme smuggled past a naive check with control characters", () => {
			strictEqual(isAllowedImageUploadSrc("java\tscript:alert(1)"), false);
		});
	});
});
