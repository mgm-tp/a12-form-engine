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

import { equal, notEqual, ok } from "node:assert/strict";

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { Models } from "../../../../../../../back-end/store/internal/store.js";

import type { FieldBasedProps, GroupBasedProps } from "../input-utils.js";
import { mountComponent } from "../input-utils.js";

export function executeAriaDescribedbyTest<T extends DocumentModel.FieldType>(
	models: () => Models,
	baseProps: FieldBasedProps<T> | GroupBasedProps,
	testSuffix?: boolean
): void {
	async function test(params: {
		hintText?: string;
		info?: string;
		warning?: string;
		error?: string;
		suffix?: string;
	}) {
		const { hintText, info, warning, error, suffix } = params;
		const hasMessage = info || warning || error;
		const validationMessages = hasMessage
			? {
					infos: info ? [[{ key: "foo", defaults: { en: info } }]] : [],
					warnings: warning ? [[{ key: "foo", defaults: { en: warning } }]] : [],
					errors: error ? [[{ key: "foo", defaults: { en: error } }]] : []
				}
			: undefined;
		const messageExposition = hasMessage ? "TOOLTIP" : undefined;

		const wrapper = await mountComponent({
			component: baseProps.component,
			documentElement: baseProps.documentElement,
			documentElementDataType: baseProps.documentElementDataType,
			models: models(),
			validationMessages,
			path: baseProps.path,
			renderFunction: baseProps.renderFunction,
			modelElement: {
				hintText,
				messageExposition,
				suffix
			},
			uiId: "MyId",
			formModelPath: []
		});

		const ariaDescribedby = wrapper.input.ariaDescribedby;

		const testItems = [
			{ item: hintText, ariaDescribedBy: "MyId-hint-tooltip" },
			{ item: info, ariaDescribedBy: "MyId-infos-tooltip" },
			{ item: warning, ariaDescribedBy: "MyId-warnings-tooltip" },
			{ item: error, ariaDescribedBy: "MyId-errors-tooltip" },
			{ item: suffix, ariaDescribedBy: "MyId-suffix" }
		];

		testItems.forEach(({ item, ariaDescribedBy: ariaDescribedBySuffix }) => {
			if (item) {
				notEqual(ariaDescribedby, undefined);
				ok(ariaDescribedby!.includes(ariaDescribedBySuffix));
			} else {
				if (ariaDescribedby) {
					ok(!ariaDescribedby.includes(ariaDescribedBySuffix));
				}
			}
		});

		if (!hintText && !info && !warning && !error && !suffix) {
			equal(ariaDescribedby, undefined);
		}
	}

	it("references the hint tooltip in aria-describedby if the field has a hintText in the model", async () => {
		await test({ hintText: "test" });
	});

	describe('with messageExposition ="TOOLTIP"', () => {
		it("references the infos tooltip in aria-describedby if there is an info for the field", async () => {
			await test({ info: "test" });
		});

		it("references the warnings tooltip in aria-describedby if there is a warning for the field", async () => {
			await test({ warning: "test" });
		});

		it("references the error tooltip in aria-describedby if there is an error for the field", async () => {
			await test({ error: "test" });
		});

		it("references the errors, warnings, infos and hint tooltip in aria-describedby if there is an error, a warning, an info and a hintText for the field", async () => {
			await test({ hintText: "test", info: "test", warning: "test", error: "test" });
		});
	});

	if (testSuffix === true) {
		it("references the suffix id in aria-described if the field has a suffix in the model", async () => {
			await test({ suffix: "test" });
		});
	}

	it("does not render aria-describedby if the field has no hintText in the model and no info, warning or error message", async () => {
		await test({});
	});
}
