// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { equal } from "node:assert/strict";

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { Models } from "../../../../../../../back-end/store/internal/store.js";

import type { FieldBasedProps, GroupBasedProps } from "../input-utils.js";
import { mountComponent } from "../input-utils.js";

export function executeAutocompleteTest<T extends DocumentModel.FieldType>(
	models: () => Models,
	baseProps: FieldBasedProps<T> | GroupBasedProps
): void {
	async function test(autoComplete?: string) {
		const wrapper = await mountComponent({
			component: baseProps.component,
			documentElement: baseProps.documentElement,
			documentElementDataType: baseProps.documentElementDataType,
			models: models(),
			path: baseProps.path,
			renderFunction: baseProps.renderFunction,
			modelElement: { autoComplete },
			formModelPath: []
		});

		equal(wrapper.input.inputProps?.autoComplete, autoComplete);
	}

	it("renders a StringInput with autocomplete='test' if autoComplete is set", async () => {
		await test("test");
	});

	it("renders a StringInput with undefined autocomplete if autoComplete is not set", async () => {
		await test();
	});
}
