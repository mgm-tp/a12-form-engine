// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
