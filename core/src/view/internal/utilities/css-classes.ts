// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
