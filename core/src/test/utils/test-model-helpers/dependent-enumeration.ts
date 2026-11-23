// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { DocumentHelpers } from "../document-helpers.js";
import { ModelHelpers } from "../model-helpers.js";

export const { createModelPath } = ModelHelpers;
export const { createDocumentPath } = DocumentHelpers;
export namespace DEP_ENUMERATION {
	export const screenName = "Dependent Enumeration Screen";

	export const dr_restricted_locationPath = createModelPath(
		"Dependent Enumeration Screen",
		"Restricted",
		"drRestricted",
		"drRestricted-detail-screen"
	);
	export const dr_locationPath = createModelPath(
		"Dependent Enumeration Screen",
		"Repeat",
		"repeat-screen"
	);

	export const er_locationPath = createModelPath("Dependent Enumeration Screen", "Embedded-Repeat");
	export const er_restricted_locationPath = createModelPath(
		"Dependent Enumeration Screen",
		"Restricted",
		"erRestricted"
	);

	export const pathToRestrictedCars = createDocumentPath(
		["A12T_DependentEnumeration"],
		["Restricted"],
		["Cars"]
	);
	export const pathToCars = createDocumentPath(["A12T_DependentEnumeration"], ["Cars"]);

	export const ID_TOP_LEVEL_MODEL = "a12-Model-id11198";
	export const ID_TOP_LEVEL_BRAND = "a12-Brand-id11197";

	export const ID_MODEL_MASTER_OUTSIDE_IN_DR = "a12-Model-F40";
	export const ID_MODEL_IN_DR = "a12-Model-id32000";

	export const ID_MODEL_MASTER_OUTSIDE_IN_ER = "a12-Model-F40-2";
	export const ID_MODEL_IN_ER = "a12-Model-id32000-2";

	export const ID_MODEL_MASTER_OUTSIDE_IN_IR = "a12-fieldbasedrepeatoverviewcolumn-30be7-cell-0";
	export const ID_MODEL_IN_IR = "a12-fieldOverviewColumn-4-cell-0";
}
