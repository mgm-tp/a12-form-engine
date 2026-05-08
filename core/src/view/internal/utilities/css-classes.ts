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

import { addPrefix } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/utils.js";

/**
 * @internal
 * @ignore
 * see https://www.mgm-tp.com/a12.htmlshowcase/#/basics/helper-classes
 */
export namespace HelperClasses {
	export const FLOAT_LEFT = addPrefix("h_floatLeft");
	export const FLOAT_RIGHT = addPrefix("h_floatRight");

	export const INLINE_BLOCK = addPrefix("h_inlineBlock");

	export const HIDDEN = addPrefix("h_hidden");

	export const MIDDLE_ALIGN = addPrefix("h_middleAlign");
	export const RIGHT_ALIGN = addPrefix("h_rightAlign");
}

/**
 * @internal
 * @ignore
 * see https://www.mgm-tp.com/a12.htmlshowcase/#/basics/utility-classes
 */
export namespace UtilityClasses {
	export const PADDING = addPrefix("-u-padding-t-md");

	export const MARGIN_TOP_SM = addPrefix("-u-margin-t-sm");
	export const MARGIN_BOTTOM_SM = addPrefix("-u-margin-b-sm");
	export const MARGIN_BOTTOM_0 = addPrefix("-u-margin-b-0");

	export const UNSEEN_BUT_READ = addPrefix("-u-unseenButRead");

	export const OUTLINE_NONE = addPrefix("-u-outline-none");
}
