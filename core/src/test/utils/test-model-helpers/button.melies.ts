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

import { DocumentPath } from "../../../models/internal/utils/document-utils.js";

import { DocumentHelpers } from "../document-helpers.js";
import { ModelHelpers } from "../model-helpers.js";

const { createDocumentPath } = DocumentHelpers;
const { createModelPath } = ModelHelpers;

export namespace BUTTONS {
	export const screen1 = "Screen1";
	export const iconThemes = "IconThemes";
	export const ariaLabel = "AriaLabel";
	export const labelHidden = "IconButtons";

	export const groupDocumentPath = createDocumentPath(["A12T_Buttons"], ["Group"]);
	export const detachedRepeatDetailScreen = createModelPath("Screen1", "Repeat", "Details");
	export const buttonPanel = createModelPath("Screen1", "bp");
	export const embeddedRepeat = createModelPath("Screen1", "Embedded-Repeat");

	export const nestedEmbeddedRepeatDetailControlGrid = [
		...detachedRepeatDetailScreen,
		...createModelPath("embedded-repeat-Group2", "embedded-repeat-Group2-control-grid")
	];

	export const EVENT_1_BUTTON = "a12-button-3f18e";
	export const EVENT_1_BUTTON_PATH = createModelPath("subHeaderBox", "Event 1");

	export const EVENT_2_BUTTON = "a12-button-35e02";
	export const EVENT_2_BUTTON_PATH = createModelPath("subHeaderBox", "Event 2");

	export const EVENT_3_BUTTON = "a12-button-a39c3";
	export const EVENT_3_BUTTON_PATH = createModelPath("subHeaderBox", "Event 3");

	export const EVENT_4_BUTTON = "a12-button-689b8";
	export const EVENT_5_BUTTON = "a12-button-18526";
	export const NAVIGATION_BUTTON = "a12-button-4516a";
	export const NAVIGATION_BUTTON_IN_DR = "a12-button-6e890";
	export const NAVIGATION_BUTTON_NEXT = "a12-screen-1-next";
	export const NAVIGATION_BUTTON_NEXT_VALIDATE = "a12-screen-1-next-validate";
	export const NAVIGATION_BUTTON_NEXT_FULL_VALIDATE = "a12-button-f8216";
	export const MENU_ITEM = "a12-button-8665a";

	export const DETACHED_REPEAT_BUTTON_ADD_APPLY = "a12-add-apply-button-detachedrepeat-f7f50";
	export const DETACHED_REPEAT_BUTTON_ADD_CANCEL = "a12-add-cancel-button-detachedrepeat-f7f50";
	export const DETACHED_REPEAT_BUTTON_EDIT_APPLY = "a12-edit-apply-button-detachedrepeat-f7f50";
	export const DETACHED_REPEAT_BUTTON_EDIT_CANCEL = "a12-edit-cancel-button-detachedrepeat-f7f50";
	export const DETACHED_REPEAT_BUTTON_RETURN = "a12-return-button-detachedrepeat-f7f50";

	export const DETACHED_REPEAT_CONFIRMATION_BUTTON_CONFIRM =
		"a12-edit-cancel-button-detachedrepeat-f7f50-confirm";
	export const DETACHED_REPEAT_CONFIRMATION_BUTTON_CANCEL =
		"a12-edit-cancel-button-detachedrepeat-f7f50-cancel";

	export const NUMBER_FIELD_DOCUMENT_PATH = DocumentPath.fromString(
		"/A12T_Buttons[1]/NumberField[1]"
	);
	export const NUMBER_FIELD_MODEL_PATH = ModelHelpers.createModelPath(
		"Screen1",
		"CG1",
		"cg1-r1",
		"c1"
	);
	export const REQUIRED_FIELD_DOCUMENT_PATH = DocumentPath.fromString(
		"/A12T_Buttons[1]/RequiredField[1]"
	);

	export namespace ICON_THEMES {
		export namespace MENU_ITEM {
			export const filled = "a12-button_a5ffe";
			export const outlined = "a12-button_eb240";
			export const custom = "a12-button_69df1";
		}

		export namespace NAVIGATION {
			export const filled = "a12-button_05397";
			export const outlined = "a12-button_8ce0c";
			export const custom = "a12-button_90758";
		}

		export namespace EVENT {
			export const filled = "a12-button_78770";
			export const outlined = "a12-button_bb73c";
			export const custom = "a12-button_d582c";
		}
	}

	export namespace ARIA_LABEL {
		export namespace MENU_ITEM {
			export const labelDescription = "a12-button_72be1";
			export const label = "a12-button_345b1";
			export const description = "a12-button_08119";
			export const fallbackDescription = "a12-button_281ae";
			export const fallback = "a12-button_8b2e4";
		}

		export namespace NAVIGATION {
			export const labelDescription = "a12-button_62be1";
			export const label = "a12-button_a45b1";
			export const description = "a12-button_b8119";
			export const fallbackDescription = "a12-button_181ae";
			export const fallback = "a12-button_eb2e4";
		}

		export namespace EVENT {
			export const labelDescription = "a12-button_6c961";
			export const label = "a12-button_df0d8";
			export const description = "a12-button_b0e19";
		}
	}

	export namespace LABEL_HIDDEN {
		export namespace MENU_ITEM {
			export const withLabel = "a12-button-f5eef";
			export const withFallbackLabel = "a12-button_591c1";
		}

		export namespace NAVIGATION {
			export const withLabel = "a12-button-9599d";
			export const withFallbackLabel = "a12-button_610e4";
		}

		export namespace EVENT {
			export const withLabel = "a12-button-890bf";
		}
	}
}
