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

import { strictEqual } from "node:assert/strict";

import type { ButtonProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/main/button.api.js";
import type { MenuItem } from "@com.mgmtp.a12.widgets/widgets-core/lib/menu/main/menu.api.js";

import type { Models } from "../../../../../back-end/store/index.js";
import type { WidgetMap } from "../../../../../view/index.js";
import { US_LOCALE } from "../../../../utils/localization.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { BUTTONS } from "../../../../utils/test-model-helpers/button.melies.js";
import {
	createDocumentPath,
	createModelPath
} from "../../../../utils/test-model-helpers/dependent-enumeration.js";

import triggerProps from "./trigger.js";

const { setupFormEngineRendererWithRtl } = SetupHelpers;

export function testAriaLabel(params: {
	models: Models;
	label: string;
	description: string;
	fallback: string;
	labelDescriptionId: string;
	labelId: string;
	descriptionId: string;
	fallbackDescriptionId?: string;
	fallbackId?: string;
	buttonType?: "menuItem" | "navigationButton";
}): void {
	const {
		models,
		label,
		description,
		fallback,
		labelDescriptionId,
		labelId,
		descriptionId,
		fallbackDescriptionId,
		fallbackId,
		buttonType
	} = params;

	const thing = buttonType === "menuItem" ? "item" : "button";
	const menuItem = buttonType === "menuItem";

	function setup(): WidgetMap {
		const { widgetMap } = setupFormEngineRendererWithRtl({
			models,
			locale: US_LOCALE,
			data: {},
			ui: {
				screenLocation: [
					{
						path: createDocumentPath(),
						locationPath: createModelPath(BUTTONS.ariaLabel)
					}
				]
			}
		});

		return widgetMap;
	}

	describe("aria label", () => {
		describe("given a button with label and description", () => {
			it(`should render a ${thing} with aria-label 'label - description'`, () => {
				const widgetMap = setup();
				const thing = triggerProps(menuItem)(widgetMap)(labelDescriptionId);
				const ariaLabel = getAriaLabel(menuItem, thing);
				strictEqual(ariaLabel, `${label} - ${description}`);
			});
		});

		describe("given a button with only a label", () => {
			it(`should render a ${thing} with aria-label 'label'`, () => {
				const widgetMap = setup();
				const thing = triggerProps(menuItem)(widgetMap)(labelId);
				const ariaLabel = getAriaLabel(menuItem, thing);
				strictEqual(ariaLabel, label);
			});
		});

		describe("given a button with only a description", () => {
			it(`should render a ${thing} with aria-label 'description'`, () => {
				const widgetMap = setup();
				const thing = triggerProps(menuItem)(widgetMap)(descriptionId);
				const ariaLabel = getAriaLabel(menuItem, thing);
				strictEqual(ariaLabel, description);
			});
		});

		if (fallbackDescriptionId) {
			describe("given a navigation button with description and no label but targeting a screen with a title as fallback", () => {
				it(`should render a ${thing} with aria-label 'fallback - description'`, () => {
					const widgetMap = setup();
					const thing = triggerProps(menuItem)(widgetMap)(fallbackDescriptionId);
					const ariaLabel = getAriaLabel(menuItem, thing);
					strictEqual(ariaLabel, `${fallback} - ${description}`);
				});
			});
		}

		if (fallbackId) {
			describe("given a navigation button without label but targeting a screen with a title as fallback", () => {
				it(`should render a ${thing} with aria-label 'fallback'`, () => {
					const widgetMap = setup();
					const thing = triggerProps(menuItem)(widgetMap)(fallbackId);
					const ariaLabel = getAriaLabel(menuItem, thing);
					strictEqual(ariaLabel, fallback);
				});
			});
		}

		function getAriaLabel(menuItem: boolean, props: ButtonProps | MenuItem | undefined) {
			if (props === undefined) {
				return undefined;
			}
			return menuItem
				? (props as MenuItem).ariaLabel
				: (props as ButtonProps)?.buttonAttributes?.["aria-label"];
		}
	});
}
