// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { Models } from "../../../../../../../back-end/store/internal/store.js";

import type { FieldBasedProps, GroupBasedProps } from "../input-utils.js";
import { mountAndAssertTruncateSuffixForTextLines } from "../input-utils.js";

export function executeTruncateSuffixTest<T extends DocumentModel.FieldType>(
	models: () => Models,
	baseProps: FieldBasedProps<T> | GroupBasedProps
): void {
	async function test(truncateSuffix?: boolean, suffix?: string) {
		await mountAndAssertTruncateSuffixForTextLines({
			component: baseProps.component,
			documentElement: baseProps.documentElement,
			documentElementDataType: baseProps.documentElementDataType,
			renderFunction: baseProps.renderFunction,
			models: models(),
			path: baseProps.path,
			truncateSuffix,
			suffix,
			formModelPath: []
		});
	}
	describe("if a suffix is given", () => {
		describe("if truncateSuffix is false", async () => {
			await it(
				`renders a(n) ${baseProps.component} with prop suffixes containing a TextAffix with ` +
					`prop truncate = false`,
				() => {
					test(false, "testSuffix");
				}
			);
		});
		describe("if truncateSuffix is true", async () => {
			await it(
				`renders a(n) ${baseProps.component} with prop suffixes containing a TextAffix with ` +
					`prop truncate = true`,
				() => {
					test(true, "testSuffix");
				}
			);
		});
		describe("if truncateSuffix is undefined", () => {
			it(
				`renders a(n) ${baseProps.component} with prop suffixes containing a TextAffix with ` +
					`prop truncate = undefined`,
				() => {
					test(undefined, "testSuffix");
				}
			);
		});
	});

	describe("if no suffix is given", () => {
		it(`renders a(n) ${baseProps.component} with prop suffixes = undefined and truncateSuffix has no effect`, () => {
			test(true);
		});
	});
}
