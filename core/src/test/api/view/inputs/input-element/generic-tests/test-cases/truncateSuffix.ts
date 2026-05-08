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
 * 1. Open-Source License – EUPL v1.2
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
