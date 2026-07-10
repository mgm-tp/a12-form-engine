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
 * 1. Open-Source License - EUPL v1.2
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

import type {
	Document,
	GeneratedCodeRtConfig,
	GroupInstance,
	IGeneratedCodeAccessor
} from "@com.mgmtp.a12.kernel/kernel-md-facade";
import { DocumentRtServiceFactory } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import type { Change, EngineStore } from "../../../../../back-end/store/index.js";
import { convertComputedFieldsWithErrorsToValidationMessages } from "../../../../../back-end/store/internal/kernel-adapter.js";
import { DocumentPath } from "../../../../../models/index.js";
import type { ReadonlyObjectMap } from "../../../../../models/index.js";

export function computeDocument(options: {
	readonly document: GroupInstance;
	readonly validatorProvider?: IGeneratedCodeAccessor;
	readonly kernelOptions?: GeneratedCodeRtConfig;
}): {
	changes: ReadonlyObjectMap<Change>;
	document: GroupInstance;
	messages: ReadonlyObjectMap<EngineStore.Validation.Entry>;
} {
	const { document, validatorProvider, kernelOptions } = options;
	const {
		currentDateForTest,
		customConditionFactory,
		customFieldTypeFactory,
		ignoreUnknownFields
	} = kernelOptions ?? {};

	if (!validatorProvider) {
		return { document, messages: {}, changes: {} };
	}

	const documentService = DocumentRtServiceFactory.createDocumentRtService(validatorProvider, {
		currentDateForTest,
		customConditionFactory,
		customFieldTypeFactory,
		ignoreUnknownFields: ignoreUnknownFields !== false
	});

	const computationResult = documentService.compute(document as Document);

	const changes: ReadonlyObjectMap<Change> =
		computationResult.computedFieldInstancesWithoutErrors.reduce((acc, cur) => {
			return {
				...acc,
				[DocumentPath.toString(cur.path)]: { type: "ValueChanged", path: cur.path }
			};
		}, {});

	const newDoc = computationResult.appliedTo(document as Document);

	const parseErrors = convertComputedFieldsWithErrorsToValidationMessages(
		computationResult.computedFieldInstancesWithErrors
	);

	return {
		changes,
		document: newDoc,
		messages: parseErrors
	};
}

/**@internal */
export const DocumentComputation = {
	computeDocument
};
