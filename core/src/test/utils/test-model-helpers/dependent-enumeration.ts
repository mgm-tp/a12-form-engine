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
