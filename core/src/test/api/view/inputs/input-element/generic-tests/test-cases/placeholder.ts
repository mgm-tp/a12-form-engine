// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { Models } from "../../../../../../../back-end/store/internal/store.js";

import type { FieldBasedProps, GroupBasedProps } from "../input-utils.js";
import { primitivePropsTest } from "../input-utils.js";

export function executePlaceholderTest<T extends DocumentModel.FieldType>(
	models: () => Models,
	baseProps: FieldBasedProps<T> | GroupBasedProps
): void {
	async function test(placeholder?: string) {
		await primitivePropsTest({
			models: models(),
			baseProps,
			modelElement: { placeholder: placeholder },
			propName: baseProps.placeholderPropName || "placeholder",
			propValue: placeholder,
			path: baseProps.path,
			formModelPath: [],
			value: { data: undefined, ui: "", path: [] }
		});
	}
	describe("if given", () => {
		it(`renders a(n) ${baseProps.component} with prop placeholder containing the placeholder text`, async () => {
			await test("testPlaceholder");
		});
	});
	describe("if not given", () => {
		it(`renders a(n) ${baseProps.component} with prop placeholder being undefined`, async () => {
			await test();
		});
	});
}
