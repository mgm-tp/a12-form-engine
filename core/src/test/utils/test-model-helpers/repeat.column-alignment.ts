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

export namespace IDS {
	export namespace IR {
		export const screen = "InlineRepeatScreen";

		export namespace HORIZONTAL {
			export const ID_REPEAT_DEFAULT = "inlinerepeat-3a686";
			export const ID_REPEAT_READONLY = "inlinerepeat-63b38";
			export const ID_REPEAT_CENTER = "inlinerepeat-e7a13";

			export const ID_REPEAT_CENTER_ONLY_HEAD = "inlinerepeat-4ceb2";
			export const ID_REPEAT_CENTER_ONLY_BODY = "inlinerepeat-85bbc";

			export const ID_NUMBER_BODY_CELL_CENTER_ONLY_HEAD = "fieldbasedrepeatoverviewcolumn-86a4c";
		}

		export namespace VERTICAL {
			export const ID_REPEAT_DEFAULT_WITHOUT_EXPRESSION = "inlinerepeat-64f46";
			export const ID_REPEAT_DEFAULT_WITH_EXPRESSION = "inlinerepeat-c1570";
			export const ID_REPEAT_BOTTOM = "inlinerepeat-3bc52";
			export const ID_REPEAT_HEADER_WITHOUT_EXPRESSION = "inlinerepeat-482c4";
			export const ID_REPEAT_HEADER_WITH_EXPRESSION = "inlinerepeat-8319e";
			export const ID_REPEAT_BODY = "inlinerepeat-be5c4";
		}
	}

	export namespace DR {
		export const screen = "DetachedRepeatScreen";

		export namespace HORIZONTAL {
			export const ID_REPEAT_DEFAULT = "detachedrepeat-20c0c";
			export const ID_REPEAT_CENTER = "detachedrepeat-dcd34";

			export const ID_REPEAT_CENTER_ONLY_HEAD = "detachedrepeat-c9713";
			export const ID_REPEAT_CENTER_ONLY_BODY = "detachedrepeat-62e1a";

			export const ID_NUMBER_BODY_CELL_CENTER_ONLY_HEAD = "fieldbasedrepeatoverviewcolumn-296d1";
		}

		export namespace VERTICAL {
			export const ID_REPEAT_DEFAULT = "detachedrepeat-1949f";
			export const ID_REPEAT_BOTTOM = "detachedrepeat-19152";
		}
	}

	export namespace ER {
		export const screen = "EmbeddedRepeatScreen";

		export namespace HORIZONTAL {
			export const ID_REPEAT_DEFAULT = "embeddedrepeat-0c847";
			export const ID_REPEAT_CENTER = "embeddedrepeat-e77b5";

			export const ID_REPEAT_CENTER_ONLY_HEAD = "embeddedrepeat-038ac";
			export const ID_REPEAT_CENTER_ONLY_BODY = "embeddedrepeat-1cf11";

			export const ID_NUMBER_BODY_CELL_CENTER_ONLY_HEAD = "fieldbasedrepeatoverviewcolumn-58420";
		}

		export namespace VERTICAL {
			export const ID_REPEAT_DEFAULT = "embeddedrepeat-767c7";
			export const ID_REPEAT_BOTTOM = "embeddedrepeat-63230";
		}
	}
}
