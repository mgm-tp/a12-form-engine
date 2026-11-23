// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { EngineState } from "../store.js";

// TODO: Add docu, also for the generic type
export type Selector<R> = (state: EngineState) => R;
