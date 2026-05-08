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

import { query } from "@com.mgmtp.a12.devtools/react";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { Models } from "../../../../../../../back-end/store/internal/store.js";

import type { FieldBasedProps, GroupBasedProps } from "../input-utils.js";
import { mountComponent } from "../input-utils.js";

export function executeTestForValidationTooltips<T extends DocumentModel.FieldType>(
	models: () => Models,
	baseProps: FieldBasedProps<T> | GroupBasedProps
): void {
	const errorBaseProps = {
		path: baseProps.path,
		component: baseProps.componentErrorProp || baseProps.component,
		documentElement: baseProps.documentElement,
		documentElementDataType: baseProps.documentElementDataType,
		renderFunction: baseProps.renderFunction,
		formModelPath: []
	};

	describe("Error", () => {
		it("shows a tooltip next to the input with the error messages when messageExposition = tooltip", async () => {
			const wrapper = await mountComponent({
				...errorBaseProps,
				models: models(),
				validationMessages: {
					errors: [[{ key: "foo", defaults: { en: "error1" } }]]
				},
				modelElement: { messageExposition: "TOOLTIP" }
			});

			const widgetInput = wrapper.input;

			const errorTooltip = query(wrapper.widgetMap.ErrorTooltip).maybeProps();
			notEqual(errorTooltip, undefined);

			if (baseProps.breakTooltipsToNewLine) {
				ok(widgetInput.tooltips !== undefined, "Expected that tooltips are present");
			} else {
				equal(widgetInput.tooltips, undefined, "Expected that prop tooltips is undefined");
				ok(widgetInput.addonAfter !== undefined, "Expected that tooltips are present");
			}
		});
	});

	describe("Warning", () => {
		it("shows a tooltip next to the input with the warning messages when messageExposition = tooltip", async () => {
			const wrapper = await mountComponent({
				...errorBaseProps,
				models: models(),
				validationMessages: {
					warnings: [[{ key: "foo", defaults: { en: "warning1" } }]]
				},
				modelElement: { messageExposition: "TOOLTIP" }
			});

			const widgetInput = wrapper.input;

			const tooltip = query(wrapper.widgetMap.WarningTooltip).maybeProps();
			notEqual(tooltip, undefined);

			if (baseProps.breakTooltipsToNewLine) {
				ok(widgetInput.tooltips !== undefined, "Expected that tooltips are present");
			} else {
				equal(widgetInput.tooltips, undefined, "Expected that prop tooltips is undefined");
				ok(widgetInput.addonAfter !== undefined, "Expected that tooltips are present");
			}
		});
	});

	describe("Info", () => {
		it("shows a tooltip next to the input with the info messages when messageExposition = tooltip", async () => {
			const wrapper = await mountComponent({
				...errorBaseProps,
				models: models(),
				validationMessages: {
					infos: [[{ key: "foo", defaults: { en: "info1" } }]]
				},
				modelElement: { messageExposition: "TOOLTIP" }
			});

			const widgetInput = wrapper.input;

			const tooltip = query(wrapper.widgetMap.HintTooltip).maybeProps();
			notEqual(tooltip, undefined);

			if (baseProps.breakTooltipsToNewLine) {
				ok(widgetInput.tooltips !== undefined, "Expected that tooltips are present");
			} else {
				equal(widgetInput.tooltips, undefined, "Expected that prop tooltips is undefined");
				ok(widgetInput.addonAfter !== undefined, "Expected that tooltips are present");
			}
		});
	});

	describe("No Warning or error", () => {
		it("shows no validation tooltips but addonAfter, if there is a hint", async () => {
			const wrapper = await mountComponent({
				...errorBaseProps,
				models: models(),
				modelElement: { messageExposition: "TOOLTIP", hintText: "Hint" }
			});

			const warningTooltip = query(wrapper.widgetMap.WarningTooltip).maybeProps();
			const errorTooltip = query(wrapper.widgetMap.ErrorTooltip).maybeProps();

			equal(warningTooltip, undefined);
			equal(errorTooltip, undefined);

			if (!baseProps.breakTooltipsToNewLine) {
				notEqual(wrapper.input.addonAfter, undefined, "Invalid addonAfter prop");
			}
		});

		it("shows no validation tooltips and no addonAfter, if there is no hint", async () => {
			const wrapper = await mountComponent({
				...errorBaseProps,
				models: models(),
				modelElement: { messageExposition: "TOOLTIP" }
			});

			const warningTooltip = query(wrapper.widgetMap.WarningTooltip).maybeProps();
			const errorTooltip = query(wrapper.widgetMap.ErrorTooltip).maybeProps();

			equal(warningTooltip, undefined);
			equal(errorTooltip, undefined);
			equal(wrapper.input.addonAfter, undefined, "Invalid addonAfter prop");
		});
	});
}
