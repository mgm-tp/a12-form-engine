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
