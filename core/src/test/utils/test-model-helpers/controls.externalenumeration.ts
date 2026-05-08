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

import { createDocumentPath, createModelPath } from "./dependent-enumeration.js";

export namespace CONTROLS {
	export const ID_EXTERNAL_ENUM_COMPACT = "a12-ExternalEnumeration-field_127e7";
	export const ID_EXTERNAL_ENUM_AUTOCOMPLETE = "a12-ExternalEnumerationAllowCustom-field_78eea";
	export const ID_EXTERNAL_ENUM_CASE_SENSITIVE = "a12-ExternalEnumerationCaseSensitive-field_e60d8";
	export const ID_EXTERNAL_ENUM_FULL = "a12-ExternalEnumerationFull-field_d8403";
	export const ID_EXTERNAL_ENUM_INLINE = "a12-ExternalEnumerationInline-field_75bf2";
	export const ID_EXPRESSION = "expressioncell-52ab8-htmlTextDiv";
	export const ID_MULTI_SELECT_EXTERNAL_ENUM = "a12-stringMultiSelect-group_6c9f9";
}

export namespace INLINE_REPEAT {
	export const ID_REPEAT = "a12-inlinerepeat-1347a";
	export const ID_EXTERNAL_ENUM_COMPACT = "a12-fieldbasedrepeatoverviewcolumn-d34a9-cell-0";
	export const ID_EXTERNAL_ENUM_AUTOCOMPLETE = "a12-fieldbasedrepeatoverviewcolumn-caf88-cell-0";
	export const ID_EXTERNAL_ENUM_AUTOCOMPLETE_1 = "a12-fieldbasedrepeatoverviewcolumn-caf88-cell-1";
	export const ID_EXTERNAL_ENUM_AUTOCOMPLETE_2 = "a12-fieldbasedrepeatoverviewcolumn-caf88-cell-2";
	export const ID_EXTERNAL_ENUM_CASE_SENSITIVE = "a12-fieldbasedrepeatoverviewcolumn-a4f99-cell-0";
	export const ID_EXTERNAL_ENUM_FULL = "a12-fieldbasedrepeatoverviewcolumn-0465f-cell-0";
	export const ID_EXTERNAL_ENUM_INLINE = "a12-fieldbasedrepeatoverviewcolumn-41a5a-cell-0";
	export const ID_MULTI_SELECT_EXTERNAL_ENUM = "a12-fieldbasedrepeatoverviewcolumn-f1955-cell-0";

	export const repeatFormModelPath = createModelPath("Screen", "inline-repeat");
	export const firstRowPath = createDocumentPath(["Root"], ["Config"], ["NewGroup_1"]);
	export const sortingColumn = "fieldbasedrepeatoverviewcolumn-caf88";
}

export namespace DETACHED_REPEAT {
	export const ID_EXTERNAL_ENUM_COMPACT = "a12-ExternalEnumeration-fieldimpl_a8348";
	export const ID_EXTERNAL_ENUM_AUTOCOMPLETE = "a12-ExternalEnumerationAllowCustom-fieldimpl_31cec";
	export const ID_EXTERNAL_ENUM_CASE_SENSITIVE =
		"a12-ExternalEnumerationCaseSensitive-fieldimpl_3ea9b";

	export const ID_MULTI_SELECT_EXTERNAL_ENUM = "a12-stringMultiSelect-group_babc1";

	export const detailScreenPath = createDocumentPath(["Root"], ["Config"], ["NewGroup_1"]);
	export const detailScreenLocationPath = createModelPath(
		"Screen",
		"detached-repeat",
		"inline-repeat-NewGroup_1-detail-screen"
	);
	export const repeatFormModelPath = createModelPath("Screen", "detached-repeat");
}

export namespace EMBEDDED_REPEAT {
	export const ID_EXTERNAL_ENUM_COMPACT = "a12-ExternalEnumeration-fieldimpl_a8348-2";
	export const ID_EXTERNAL_ENUM_AUTOCOMPLETE =
		"a12-ExternalEnumerationAllowCustom-fieldimpl_31cec-2";
	export const ID_EXTERNAL_ENUM_CASE_SENSITIVE =
		"a12-ExternalEnumerationCaseSensitive-fieldimpl_3ea9b-2";
	export const ID_MULTI_SELECT_EXTERNAL_ENUM = "a12-stringMultiSelect-group_babc1-2";

	export const repeatableGroupPath = createDocumentPath(["Root"], ["Config"], ["NewGroup_1"]);
	export const detailScreenLocationPath = createModelPath("Screen", "embedded-repeat", "cg");
	export const repeatFormModelPath = createModelPath("Screen", "embedded-repeat");
}
