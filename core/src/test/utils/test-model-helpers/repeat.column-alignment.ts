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
 * 1. Open-Source License - EUPL v1.2
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

export const IDS = {
	IR: {
		screen: "InlineRepeatScreen",
		HORIZONTAL: {
			ID_REPEAT_DEFAULT: "inlinerepeat-3a686",
			ID_REPEAT_READONLY: "inlinerepeat-63b38",
			ID_REPEAT_CENTER: "inlinerepeat-e7a13",
			ID_REPEAT_CENTER_ONLY_HEAD: "inlinerepeat-4ceb2",
			ID_REPEAT_CENTER_ONLY_BODY: "inlinerepeat-85bbc",
			ID_NUMBER_BODY_CELL_CENTER_ONLY_HEAD: "fieldbasedrepeatoverviewcolumn-86a4c"
		},
		VERTICAL: {
			ID_REPEAT_DEFAULT_WITHOUT_EXPRESSION: "inlinerepeat-64f46",
			ID_REPEAT_DEFAULT_WITH_EXPRESSION: "inlinerepeat-c1570",
			ID_REPEAT_BOTTOM: "inlinerepeat-3bc52",
			ID_REPEAT_HEADER_WITHOUT_EXPRESSION: "inlinerepeat-482c4",
			ID_REPEAT_HEADER_WITH_EXPRESSION: "inlinerepeat-8319e",
			ID_REPEAT_BODY: "inlinerepeat-be5c4"
		}
	},
	DR: {
		screen: "DetachedRepeatScreen",
		HORIZONTAL: {
			ID_REPEAT_DEFAULT: "detachedrepeat-20c0c",
			ID_REPEAT_CENTER: "detachedrepeat-dcd34",
			ID_REPEAT_CENTER_ONLY_HEAD: "detachedrepeat-c9713",
			ID_REPEAT_CENTER_ONLY_BODY: "detachedrepeat-62e1a",
			ID_NUMBER_BODY_CELL_CENTER_ONLY_HEAD: "fieldbasedrepeatoverviewcolumn-296d1"
		},
		VERTICAL: {
			ID_REPEAT_DEFAULT: "detachedrepeat-1949f",
			ID_REPEAT_BOTTOM: "detachedrepeat-19152"
		}
	},
	ER: {
		screen: "EmbeddedRepeatScreen",
		HORIZONTAL: {
			ID_REPEAT_DEFAULT: "embeddedrepeat-0c847",
			ID_REPEAT_CENTER: "embeddedrepeat-e77b5",
			ID_REPEAT_CENTER_ONLY_HEAD: "embeddedrepeat-038ac",
			ID_REPEAT_CENTER_ONLY_BODY: "embeddedrepeat-1cf11",
			ID_NUMBER_BODY_CELL_CENTER_ONLY_HEAD: "fieldbasedrepeatoverviewcolumn-58420"
		},
		VERTICAL: {
			ID_REPEAT_DEFAULT: "embeddedrepeat-767c7",
			ID_REPEAT_BOTTOM: "embeddedrepeat-63230"
		}
	}
} as const;
