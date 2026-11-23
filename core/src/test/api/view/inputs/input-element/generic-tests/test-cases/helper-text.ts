// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { Models } from "../../../../../../../back-end/store/internal/store.js";

import type { FieldBasedProps, GroupBasedProps } from "../input-utils.js";
import { primitivePropsTest } from "../input-utils.js";

export function executeHelperTextTest<T extends DocumentModel.FieldType>(
	models: () => Models,
	baseProps: FieldBasedProps<T> | GroupBasedProps
): void {
	function test(helperText?: string) {
		primitivePropsTest({
			models: models(),
			baseProps,
			component: baseProps.component,
			modelElement: { helperText },
			propName: "helperText",
			propValue: helperText,
			path: baseProps.path,
			formModelPath: []
		});
	}
	describe("if given", () => {
		it(`renders a(n) ${baseProps.component} with prop helperText containing the helperText text`, () => {
			test("testHelperText");
		});
	});
	describe("if not given", () => {
		it(`renders a(n) ${baseProps.component} with prop helperText being undefined`, () => {
			test();
		});
	});
}
