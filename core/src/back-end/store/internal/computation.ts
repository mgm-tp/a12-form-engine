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

import type { ReadonlyObjectMap } from "../../../models/internal/utils/json.js";

import { validateChangesAndUpdateMessages } from "./change-validation.js";
import type { DetailedUpdateResult } from "./DetailedUpdateResult.js";
import type { Change } from "./documentChange.js";
import { ChangeMapCreators } from "./documentChange.js";
import { convertDependencies } from "./externalComputation.js";
import type { DetailedUpdateResultWithParsingErrors } from "./kernel-adapter.js";
import { computeWithKernel } from "./kernel-adapter.js";
import type { MiddlewareOptions } from "./middleware/middleware-options.js";
import { ModelSelectors } from "./selectors/models.js";
import type { EngineState, EngineStore, Models } from "./store.js";

/** @internal */
export function computeAndEvaluateDependencies(options: {
	readonly document: GroupInstance;
	readonly models: Models;
	readonly kernelConfiguration: {
		readonly now?: Date;
	};
	readonly changes?: ReadonlyObjectMap<Change>;
}): DetailedUpdateResultWithParsingErrors {
	const { document, models, kernelConfiguration, changes } = options;
	const { now } = kernelConfiguration;
	const { validatorProvider } = models;

	if (validatorProvider === undefined) {
		return { document, changes: {} };
	}

	const externalComputations = convertDependencies(models.formModel, models.documentModel);

	return computeWithKernel({
		validatorProvider,
		externalComputations,
		document,
		changes,
		now
	});
}

/** This code is only exported for A12 internal use and should not be used in production. */
export interface ComputationAndValidationResult extends DetailedUpdateResult {
	readonly messages: ReadonlyObjectMap<EngineStore.Validation.Entry>;
}

/** @internal */
export function internalComputeThenValidate(options: {
	readonly state: EngineState;
	readonly middlewareOptions: MiddlewareOptions;
	readonly document: GroupInstance;
	readonly messages: ReadonlyObjectMap<EngineStore.Validation.Entry>;
	readonly existingChanges?: ReadonlyObjectMap<Change>;
}): ComputationAndValidationResult {
	const documentModel = ModelSelectors.documentModel()(options.state);
	const formModel = ModelSelectors.formModel()(options.state);
	const validatorProvider = ModelSelectors.validationCode()(options.state);
	const now = options.middlewareOptions.nowProvider?.(options.state);
	const existingChanges = options.existingChanges ?? {};

	const {
		document,
		changes: computeChanges,
		parseErrors
	} = KernelComputation.computeAndEvaluateDependencies({
		models: { documentModel, formModel, validatorProvider },
		document: options.document,
		kernelConfiguration: {
			now
		}
	});

	const changes = ChangeMapCreators.union(existingChanges, computeChanges);

	const newMessages = validateChangesAndUpdateMessages({
		changes,
		document,
		initialMessages: options.messages,
		kernelConfiguration: {
			now
		},
		models: { documentModel, formModel, validatorProvider },
		parsingErrorsAfterComputation: parseErrors
	});

	return { document, messages: newMessages, changes };
}

/** @internal */
export const KernelComputation = {
	computeAndEvaluateDependencies,
	internalComputeThenValidate
};
