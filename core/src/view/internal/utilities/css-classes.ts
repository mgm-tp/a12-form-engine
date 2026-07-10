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

import { addPrefix } from "@com.mgmtp.a12.widgets/widgets-core";

/**
 * @internal
 * @ignore
 * see https://www.mgm-tp.com/a12.htmlshowcase/#/basics/helper-classes
 */
export const HelperClasses = {
	FLOAT_LEFT: addPrefix("h_floatLeft"),
	FLOAT_RIGHT: addPrefix("h_floatRight"),

	INLINE_BLOCK: addPrefix("h_inlineBlock"),

	HIDDEN: addPrefix("h_hidden"),

	MIDDLE_ALIGN: addPrefix("h_middleAlign"),
	RIGHT_ALIGN: addPrefix("h_rightAlign")
};

/**
 * @internal
 * @ignore
 * see https://www.mgm-tp.com/a12.htmlshowcase/#/basics/utility-classes
 */
export const UtilityClasses = {
	PADDING: addPrefix("-u-padding-t-md"),

	MARGIN_TOP_SM: addPrefix("-u-margin-t-sm"),
	MARGIN_BOTTOM_SM: addPrefix("-u-margin-b-sm"),
	MARGIN_BOTTOM_0: addPrefix("-u-margin-b-0"),

	UNSEEN_BUT_READ: addPrefix("-u-unseenButRead"),

	OUTLINE_NONE: addPrefix("-u-outline-none"),
	HEIGHT_FULL: addPrefix("-u-height-full")
};
