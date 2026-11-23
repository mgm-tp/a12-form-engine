// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { createModelPath } from "./dependent-enumeration.js";

export namespace IDS {
	export const nonCollapsibleSectionCollapseOff = "a12-section-r0-not-collapsible";
	export const collapsibleSectionWithCollapseOpen = "a12-section-r0-collapsible-opened";
	export const cgCollapsibleSectionWithCollapseOpen = "a12-controlgrid-8eed5";

	export const collapsibleSectionWithCollapseClosed = "a12-section-r0-collapsible-closed";
	export const cgCollapsibleSectionWithCollapseClosed = "a12-controlgrid-b7a94";
}

export namespace FORM_MODEL {
	export const collapsibleSectionWithCollapseOpen = createModelPath(
		"Screen1",
		"collapsible-opened"
	);
	export const collapsibleSectionWithCollapseClosed = createModelPath(
		"Screen1",
		"collapsible-closed"
	);
	export const nonCollapsibleSectionCollapseOff = createModelPath("Screen1", "not-collapsible");
}
