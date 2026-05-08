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

import { setupModelsFixture } from "../../../utils/setupFixture.js";
import { BUTTONS } from "../../../utils/test-model-helpers/button.melies.js";
import {
	EVENT_BUTTONS,
	MENU_ITEMS,
	NAVIGATION_BUTTONS
} from "../../../utils/test-model-helpers/test-button-enablements.js";

import { testAriaLabel } from "./buttons/ariaLabel.js";
import { testAriaRole } from "./buttons/ariaRole.js";
import { testEnablement } from "./buttons/enablement.js";
import { testEnablementOption } from "./buttons/enablementOption.js";
import { testIconTheme } from "./buttons/iconTheme.js";
import { testLabelHidden } from "./buttons/labelHidden.js";
import { testValidation } from "./buttons/validation.js";

describe("api.view.Buttons", () => {
	const models = setupModelsFixture("buttons");
	const enablementModels = setupModelsFixture("buttons", "enablement");

	describe("Event", () => {
		testValidation({
			models,
			type: "EVENT",
			noValidation: {
				id: BUTTONS.EVENT_3_BUTTON,
				expectedEvent: ["Event3", BUTTONS.EVENT_3_BUTTON_PATH]
			},
			partialValidation: {
				id: BUTTONS.EVENT_2_BUTTON,
				expectedEvent: ["Event2", BUTTONS.EVENT_2_BUTTON_PATH]
			},
			fullValidation: {
				id: BUTTONS.EVENT_1_BUTTON,
				expectedEvent: ["Event1", BUTTONS.EVENT_1_BUTTON_PATH]
			}
		});

		testEnablementOption({ models: enablementModels });

		testEnablement({
			models,
			enablementModels,
			drId: BUTTONS.EVENT_5_BUTTON,
			alwaysId: EVENT_BUTTONS.BUTTON_ALWAYS_SHOWN_ID,
			alwaysName: EVENT_BUTTONS.BUTTON_ALWAYS_SHOWN_NAME,
			hiddenRoId: EVENT_BUTTONS.BUTTON_HIDDEN_IN_RO_MODE_ID,
			hiddenRoName: EVENT_BUTTONS.BUTTON_HIDDEN_IN_RO_MODE_NAME,
			disabledRoId: EVENT_BUTTONS.BUTTON_DISABLED_IN_RO_MODE_ID,
			disabledRoName: EVENT_BUTTONS.BUTTON_DISABLED_IN_RO_MODE_NAME,
			hiddenEditId: EVENT_BUTTONS.BUTTON_HIDDEN_IN_EDIT_MODE_ID,
			hiddenEditName: EVENT_BUTTONS.BUTTON_HIDDEN_IN_EDIT_MODE_NAME,
			disabledEditId: EVENT_BUTTONS.BUTTON_DISABLED_IN_EDIT_MODE_ID,
			disabledEditName: EVENT_BUTTONS.BUTTON_DISABLED_IN_EDIT_MODE_NAME
		});

		testIconTheme({
			models,
			filledId: BUTTONS.ICON_THEMES.EVENT.filled,
			outlinedId: BUTTONS.ICON_THEMES.EVENT.outlined,
			customId: BUTTONS.ICON_THEMES.EVENT.custom
		});

		testAriaLabel({
			models,
			label: "label",
			description: "description",
			fallback: "fallback",
			labelDescriptionId: BUTTONS.ARIA_LABEL.EVENT.labelDescription,
			labelId: BUTTONS.ARIA_LABEL.EVENT.label,
			descriptionId: BUTTONS.ARIA_LABEL.EVENT.description
		});

		testAriaRole({ models, id: BUTTONS.EVENT_4_BUTTON, linkExpected: false });

		testLabelHidden({
			models,
			withLabelId: BUTTONS.LABEL_HIDDEN.EVENT.withLabel
		});
	});

	describe("Navigation", () => {
		testValidation({
			models,
			type: "NAVIGATION",
			noValidation: {
				id: BUTTONS.NAVIGATION_BUTTON_NEXT,
				expectedEvent: ["#next"]
			},
			partialValidation: {
				id: BUTTONS.NAVIGATION_BUTTON_NEXT_VALIDATE,
				expectedEvent: ["#next"]
			},
			fullValidation: {
				id: BUTTONS.NAVIGATION_BUTTON_NEXT_FULL_VALIDATE,
				expectedEvent: ["#next"]
			}
		});

		testEnablement({
			models,
			enablementModels,
			buttonType: "navigationButton",
			drId: BUTTONS.NAVIGATION_BUTTON_IN_DR,
			alwaysId: NAVIGATION_BUTTONS.BUTTON_ALWAYS_SHOWN_ID,
			alwaysName: NAVIGATION_BUTTONS.BUTTON_ALWAYS_SHOWN_NAME,
			hiddenRoId: NAVIGATION_BUTTONS.BUTTON_HIDDEN_IN_RO_MODE_ID,
			hiddenRoName: NAVIGATION_BUTTONS.BUTTON_HIDDEN_IN_RO_MODE_NAME,
			disabledRoId: NAVIGATION_BUTTONS.BUTTON_DISABLED_IN_RO_MODE_ID,
			disabledRoName: NAVIGATION_BUTTONS.BUTTON_DISABLED_IN_RO_MODE_NAME,
			hiddenEditId: NAVIGATION_BUTTONS.BUTTON_HIDDEN_IN_EDIT_MODE_ID,
			hiddenEditName: NAVIGATION_BUTTONS.BUTTON_HIDDEN_IN_EDIT_MODE_NAME,
			disabledEditId: NAVIGATION_BUTTONS.BUTTON_DISABLED_IN_EDIT_MODE_ID,
			disabledEditName: NAVIGATION_BUTTONS.BUTTON_DISABLED_IN_EDIT_MODE_NAME
		});

		testIconTheme({
			models,
			filledId: BUTTONS.ICON_THEMES.NAVIGATION.filled,
			outlinedId: BUTTONS.ICON_THEMES.NAVIGATION.outlined,
			customId: BUTTONS.ICON_THEMES.NAVIGATION.custom
		});

		testAriaLabel({
			models,
			label: "label",
			description: "description",
			fallback: "fallback",
			labelDescriptionId: BUTTONS.ARIA_LABEL.NAVIGATION.labelDescription,
			labelId: BUTTONS.ARIA_LABEL.NAVIGATION.label,
			descriptionId: BUTTONS.ARIA_LABEL.NAVIGATION.description,
			fallbackDescriptionId: BUTTONS.ARIA_LABEL.NAVIGATION.fallbackDescription,
			fallbackId: BUTTONS.ARIA_LABEL.NAVIGATION.fallback
		});

		testAriaRole({
			models,
			id: BUTTONS.NAVIGATION_BUTTON,
			linkExpected: true
		});

		testLabelHidden({
			models,
			withLabelId: BUTTONS.LABEL_HIDDEN.NAVIGATION.withLabel,
			withFallbackId: BUTTONS.LABEL_HIDDEN.NAVIGATION.withFallbackLabel
		});
	});

	describe("Menu Item", () => {
		testEnablement({
			models,
			enablementModels,
			buttonType: "menuItem",
			drId: BUTTONS.MENU_ITEM,
			alwaysId: MENU_ITEMS.ITEM_ALWAYS_SHOWN_ID,
			alwaysName: MENU_ITEMS.ITEM_ALWAYS_SHOWN_NAME,
			hiddenRoId: MENU_ITEMS.ITEM_HIDDEN_IN_RO_MODE_ID,
			hiddenRoName: MENU_ITEMS.ITEM_HIDDEN_IN_RO_MODE_NAME,
			disabledRoId: MENU_ITEMS.ITEM_DISABLED_IN_RO_MODE_ID,
			disabledRoName: MENU_ITEMS.ITEM_DISABLED_IN_RO_MODE_NAME,
			hiddenEditId: MENU_ITEMS.ITEM_HIDDEN_IN_EDIT_MODE_ID,
			hiddenEditName: MENU_ITEMS.ITEM_HIDDEN_IN_EDIT_MODE_NAME,
			disabledEditId: MENU_ITEMS.ITEM_DISABLED_IN_EDIT_MODE_ID,
			disabledEditName: MENU_ITEMS.ITEM_DISABLED_IN_EDIT_MODE_NAME
		});

		testIconTheme({
			models,
			filledId: BUTTONS.ICON_THEMES.MENU_ITEM.filled,
			outlinedId: BUTTONS.ICON_THEMES.MENU_ITEM.outlined,
			customId: BUTTONS.ICON_THEMES.MENU_ITEM.custom
		});

		testAriaLabel({
			models,
			label: "label",
			description: "description",
			fallback: "fallback",
			labelDescriptionId: BUTTONS.ARIA_LABEL.MENU_ITEM.labelDescription,
			labelId: BUTTONS.ARIA_LABEL.MENU_ITEM.label,
			descriptionId: BUTTONS.ARIA_LABEL.MENU_ITEM.description,
			fallbackDescriptionId: BUTTONS.ARIA_LABEL.MENU_ITEM.fallbackDescription,
			fallbackId: BUTTONS.ARIA_LABEL.MENU_ITEM.fallback,
			buttonType: "menuItem"
		});

		testLabelHidden({
			models,
			withLabelId: BUTTONS.LABEL_HIDDEN.MENU_ITEM.withLabel,
			withFallbackId: BUTTONS.LABEL_HIDDEN.MENU_ITEM.withFallbackLabel,
			isMenuItem: true
		});
	});
});
