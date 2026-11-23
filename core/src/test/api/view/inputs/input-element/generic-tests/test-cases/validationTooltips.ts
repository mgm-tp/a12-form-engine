// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
