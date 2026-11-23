// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
