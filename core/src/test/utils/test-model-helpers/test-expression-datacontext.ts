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

import { ModelHelpers } from "../model-helpers.js";

namespace IDS {
	export namespace TOP_LEVEL {
		export const SCREEN_NAME = "Screen1";
		export const REPEAT_NAME = "detached-repeat1";
	}

	export namespace MID_LEVEL {
		export const SCREEN_NAME = "detached-repeat1-detail-screen";
		export const REPEAT_NAME = "detached-repeat2";
	}

	export namespace BOTTOM_LEVEL {
		export const SCREEN_NAME = "detached-repeat2-detail-screen";
		export const REPEAT_NAME = "embedded-repeat3";
		export const COLUMN = "a12-fieldbasedrepeatoverviewcolumn-5b9df";
	}
}

export namespace MODEL_PATH {
	export const TOP_LEVEL_SCREEN = ModelHelpers.createModelPath(IDS.TOP_LEVEL.SCREEN_NAME);

	export const DR1 = ModelHelpers.createModelPath(
		IDS.TOP_LEVEL.SCREEN_NAME,
		IDS.TOP_LEVEL.REPEAT_NAME
	);

	export const MID_LEVEL_SCREEN = ModelHelpers.createModelPath(
		IDS.TOP_LEVEL.SCREEN_NAME,
		IDS.TOP_LEVEL.REPEAT_NAME,
		IDS.MID_LEVEL.SCREEN_NAME
	);

	export const DR2 = ModelHelpers.createModelPath(
		IDS.TOP_LEVEL.SCREEN_NAME,
		IDS.TOP_LEVEL.REPEAT_NAME,
		IDS.MID_LEVEL.SCREEN_NAME,
		IDS.MID_LEVEL.REPEAT_NAME,
		IDS.BOTTOM_LEVEL.SCREEN_NAME,
		IDS.BOTTOM_LEVEL.REPEAT_NAME
	);

	export const BOTTOM_LEVEL_SCREEN = ModelHelpers.createModelPath(
		IDS.TOP_LEVEL.SCREEN_NAME,
		IDS.TOP_LEVEL.REPEAT_NAME,
		IDS.MID_LEVEL.SCREEN_NAME,
		IDS.MID_LEVEL.REPEAT_NAME,
		IDS.BOTTOM_LEVEL.SCREEN_NAME
	);

	export const ER = ModelHelpers.createModelPath(
		IDS.TOP_LEVEL.SCREEN_NAME,
		IDS.TOP_LEVEL.REPEAT_NAME,
		IDS.MID_LEVEL.SCREEN_NAME,
		IDS.MID_LEVEL.REPEAT_NAME,
		IDS.BOTTOM_LEVEL.SCREEN_NAME,
		IDS.BOTTOM_LEVEL.REPEAT_NAME
	);
}

export namespace DOCUMENT {
	export const ROOT_GROUP = "root";
	export const TOP_LEVEL_REP_GROUP = "repeat1";
	export const MID_LEVEL_REP_GROUP = "repeat2";
	export const BOTTOM_LEVEL_REP_GROUP = "repeat3";
}
