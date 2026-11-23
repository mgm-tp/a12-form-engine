// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
