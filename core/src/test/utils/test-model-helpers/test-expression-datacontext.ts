// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
