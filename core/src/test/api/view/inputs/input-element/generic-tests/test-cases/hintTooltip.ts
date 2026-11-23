// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { equal, ok } from "node:assert/strict";

import { query } from "@com.mgmtp.a12.devtools/react";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { Models } from "../../../../../../../back-end/store/internal/store.js";

import type { FieldBasedProps, GroupBasedProps } from "../input-utils.js";
import { mountComponent } from "../input-utils.js";

export function executeTestForHintTooltips<T extends DocumentModel.FieldType>(
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

	it("shows a hint tooltip if the element contains a hint", async () => {
		const wrapper = await mountComponent({
			...errorBaseProps,
			models: models(),
			modelElement: { messageExposition: "TOOLTIP", hintText: "Hint" }
		});

		const widgetInput = wrapper.input;

		query(wrapper.widgetMap.HintTooltip).assertRendered();

		if (baseProps.breakTooltipsToNewLine) {
			ok(widgetInput.tooltips !== undefined, "Expected that tooltips are present");
		} else {
			equal(widgetInput.tooltips, undefined, "Expected that prop tooltips is undefined");
			ok(widgetInput.addonAfter !== undefined, "Expected that tooltips are present");
		}
	});

	it("shows no hint tooltips if there are no hints for the element", async () => {
		const wrapper = await mountComponent({
			...errorBaseProps,
			models: models(),
			modelElement: { messageExposition: "TOOLTIP" }
		});

		const widgetInput = wrapper.input;

		query(wrapper.widgetMap.HintTooltip).assertNotRendered();
		equal(widgetInput.addonAfter, undefined, "Invalid addonAfter prop");
	});
}
