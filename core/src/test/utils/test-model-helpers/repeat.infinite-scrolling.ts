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

import { ModelHelpers } from "../model-helpers.js";

export const { createModelPath } = ModelHelpers;

export namespace FORM_MODEL {
	export const irScreen = "InlineRepeat";
	export const drScreen = "DetachedRepeat";
	export const erScreen = "EmbeddedRepeat";

	export const inlineRepeat = createModelPath(irScreen, "infinite-scrolling-ir");
	export const detachedRepeat = createModelPath(drScreen, "infinite-scrolling-dr");
	export const embeddedRepeat = createModelPath(erScreen, "infinite-scrolling-er");
	export const embeddedRepeatDetailControlGrid = createModelPath(
		erScreen,
		"infinite-scrolling-er",
		"cg"
	);

	export const defaultRowHeightIR = "inlinerepeat-f9a78";
	export const defaultRowHeightDR = "detachedrepeat-0cdda";

	export const customActionColumnWidthIRId = "a12-inlinerepeat-5b40f-table";
	export const customActionColumnWidthDRId = "a12-inlinerepeat-5b40f-table";

	export const irOversizedContentString = "fieldbasedrepeatoverviewcolumn-8e79b";
	export const irOversizedContentMultiSelect = "fieldbasedrepeatoverviewcolumn-fd41b";
}
