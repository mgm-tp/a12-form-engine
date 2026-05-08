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

export namespace FORM_MODEL {
	export const detachedRepeatScreen = "DetachedRepeat";
	export const embeddedRepeatScreen = "EmbeddedRepeat";

	export namespace DR {
		export const idOfRepeatNoFilterExpression = "a12-detachedrepeat-0f91e-table";
		export const idOfRepeatWithFilterExpressionNoPrivate = "a12-detachedrepeat-ac2f2-table";
		export const idOfRepeatWithFilterExpressionPrivate = "a12-detachedrepeat-aa9dc-table";
		export const idOfRepeatWithFilterExpressionEmptyNumber = "a12-detachedrepeat-de078-table";
		export const idOfRepeatWithFilterExpressionAdvertisementAllowed =
			"a12-detachedrepeat-cf132-table";
		export const idOfRepeatWithFilterExpressionAdvertisementnotAllowed =
			"a12-detachedrepeat-49911-table";
		export const idOfRepeatWithFilterExpressionMale = "a12-detachedrepeat_94389-table";
		export const idOfRepeatWithFilterExpressionFemale = "a12-detachedrepeat_815c5-table";
	}

	export namespace ER {
		export const idOfRepeatNoFilterExpression = "embeddedrepeat-ca873";
		export const idOfRepeatWithFilterExpressionNoPrivate = "embeddedrepeat-82a4b";
		export const idOfRepeatWithFilterExpressionPrivate = "embeddedrepeat-de813";
		export const idOfRepeatWithFilterExpressionEmptyNumber = "embeddedrepeat-f3086";
		export const idOfRepeatWithFilterExpressionAdvertisementAllowed = "embeddedrepeat_36712";
		export const idOfRepeatWithFilterExpressionAdvertisementnotAllowed = "embeddedrepeat_84902";
		export const idOfRepeatWithFilterExpressionMale = "embeddedrepeat_39e3c";
		export const idOfRepeatWithFilterExpressionFemale = "embeddedrepeat_cb093";
	}
}
