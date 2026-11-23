// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { Change, EngineStore, Models } from "../../back-end/store/index.js";
import { KernelComputation } from "../../back-end/store/internal/computation.js";
import type { ReadonlyObjectMap } from "../../models/internal/utils/json.js";

export function computeInitialDocument(options: {
	readonly document: GroupInstance;
	readonly models: Models;
}): {
	readonly document: GroupInstance;
	readonly changes: ReadonlyObjectMap<Change>;
	readonly parseErrors?: ReadonlyObjectMap<EngineStore.Validation.Entry>;
} {
	return KernelComputation.computeAndEvaluateDependencies({ ...options, kernelConfiguration: {} });
}
