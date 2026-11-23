// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { ReadonlyObjectMap } from "../../../../../models/internal/utils/json.js";
import { KernelComputation } from "../../computation.js";
import type { Change } from "../../documentChange.js";
import { ModelSelectors } from "../../selectors/models.js";
import type { EngineState, EngineStore } from "../../store.js";

import type { MiddlewareOptions } from "../middleware-options.js";

/**
 * @internal
 */
export function updateDependencies({
	document: initialDocument,
	options,
	state,
	changes
}: UpdateDependenciesArgs): UpdateDependenciesResult {
	const document = initialDocument;
	const documentModel = ModelSelectors.documentModel()(state);
	const validationCode = ModelSelectors.validationCode()(state);
	const formModel = ModelSelectors.formModel()(state);

	const computationResult = KernelComputation.computeAndEvaluateDependencies({
		document,
		models: { documentModel, formModel, validatorProvider: validationCode },
		kernelConfiguration: {
			now: options.nowProvider?.(state)
		},
		changes
	});

	return {
		changed: initialDocument !== document,
		document: computationResult.document,
		changes: { ...changes, ...computationResult.changes },
		parseErrors: computationResult.parseErrors
	};
}

interface UpdateDependenciesArgs {
	readonly state: EngineState;
	readonly document: GroupInstance;
	readonly options: Pick<MiddlewareOptions, "nowProvider">;
	readonly changes: ReadonlyObjectMap<Change>;
}

interface UpdateDependenciesResult {
	readonly document: GroupInstance;
	readonly changed: boolean;
	readonly changes: ReadonlyObjectMap<Change>;
	readonly parseErrors?: ReadonlyObjectMap<EngineStore.Validation.Entry>;
}
