// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";

import type { ReadonlyObjectMap } from "../../../models/internal/utils/json.js";

import type { EngineStore } from "./store.js";

export interface CorrectionModeItem {
	readonly formModelPath: ModelPath;
	readonly locationStack: ReadonlyArray<EngineStore.ScreenState>;
	readonly sectionsCollapse: ReadonlyArray<{
		readonly path: ModelPath;
		readonly collapse: boolean;
	}>;
	readonly repeatStaticState?: ReadonlyObjectMap<EngineStore.Repeat.StaticState>;
}
