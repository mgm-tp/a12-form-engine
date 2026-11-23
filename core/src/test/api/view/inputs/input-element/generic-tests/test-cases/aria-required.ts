// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { equal } from "node:assert/strict";

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { Models } from "../../../../../../../back-end/store/internal/store.js";

import type { FieldBasedProps, GroupBasedProps } from "../input-utils.js";
import { mountComponent } from "../input-utils.js";

export function executeAriaRequiredTest<T extends DocumentModel.FieldType>(
	models: () => Models,
	baseProps: FieldBasedProps<T> | GroupBasedProps
): void {
	async function test(required: boolean) {
		const wrapper = await mountComponent({
			component: baseProps.component,
			documentElement: baseProps.documentElement,
			documentElementDataType: baseProps.documentElementDataType,
			models: models(),
			path: baseProps.path,
			renderFunction: baseProps.renderFunction,
			modelElement: { required },
			formModelPath: []
		});

		const ariaRequired = wrapper.input.inputProps?.["aria-required"];
		const expected = required ? true : undefined;
		equal(ariaRequired, expected);
	}

	it("renders a StringInput with aria-required=true if the field is required", async () => {
		await test(true);
	});

	it("renders a StringInput with empty inputProps if the field is not required", async () => {
		await test(false);
	});
}
