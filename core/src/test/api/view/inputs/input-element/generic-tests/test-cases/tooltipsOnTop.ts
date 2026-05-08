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
import { mountAndAssertTooltipPositionForTextLines } from "../input-utils.js";

export async function executeTooltipsOnTopTest<T extends DocumentModel.FieldType>(
	models: () => Models,
	baseProps: FieldBasedProps<T> | GroupBasedProps
): Promise<void> {
	async function test(tooltipsOnTop?: boolean, breakTooltipsToNewLine?: boolean) {
		await mountAndAssertTooltipPositionForTextLines({
			component: baseProps.componentToolTip ?? baseProps.component,
			documentElement: baseProps.documentElement,
			documentElementDataType: baseProps.documentElementDataType,
			renderFunction: baseProps.renderFunction,
			models: models(),
			path: baseProps.path,
			tooltipsOnTop,
			breakTooltipsToNewLine,
			formModelPath: []
		});
	}

	if (baseProps.breakTooltipsToNewLine !== true) {
		await describe("false", () => {
			it(`renders a(n) ${baseProps.component} with prop addonAfter != undefined and tooltips = undefined`, () => {
				test(false, false);
			});
		});

		await describe("undefined", () => {
			it(`renders a(n) ${baseProps.component} with prop addonAfter != undefined and tooltips = undefined`, () => {
				test(undefined);
			});
		});

		await describe("true", () => {
			it(`renders a(n) ${baseProps.component} with prop addonAfter = undefined and tooltips != undefined`, () => {
				test(true);
			});
		});
	} else {
		await describe("false", () => {
			it(`renders a(n) ${baseProps.component} with prop tooltips != undefined and breakTooltipsToNewLine = false`, () => {
				test(false, true);
			});
		});

		await describe("undefined", () => {
			it(`renders a(n) ${baseProps.component} with prop breakTooltipsToNewLine = false`, () => {
				test(undefined, true);
			});
		});

		await describe("true", () => {
			it(`renders a(n) ${baseProps.component} with prop breakTooltipsToNewLine = true`, () => {
				test(true, true);
			});
		});
	}
}
