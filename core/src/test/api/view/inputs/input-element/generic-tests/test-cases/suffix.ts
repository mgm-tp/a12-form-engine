// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { Models } from "../../../../../../../back-end/store/internal/store.js";

import type { FieldBasedProps, GroupBasedProps } from "../input-utils.js";
import { mountAndAssertSuffixesForTextLines } from "../input-utils.js";

export function executeSuffixTest<T extends DocumentModel.FieldType>(
	models: () => Models,
	baseProps: FieldBasedProps<T> | GroupBasedProps
): void {
	async function test(suffix?: string) {
		await mountAndAssertSuffixesForTextLines({
			component: baseProps.component,
			documentElement: baseProps.documentElement,
			documentElementDataType: baseProps.documentElementDataType,
			renderFunction: baseProps.renderFunction,
			models: models(),
			path: baseProps.path,
			suffix,
			formModelPath: []
		});
	}
	describe("if given", () => {
		it(`renders a(n) ${baseProps.component} with prop suffixes containing the suffix text in a TextAffix`, async () => {
			await test("testSuffix");
		});
	});
	describe("if not given", () => {
		it(`renders a(n) ${baseProps.component} with prop suffixes being undefined`, async () => {
			await test();
		});
	});
}
