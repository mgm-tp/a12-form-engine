// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type {
	Document,
	GroupInstance,
	IGeneratedCodeAccessor
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { DocumentRtServiceFactory } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/facade.js";

import type { Change, EngineStore } from "../../../../../back-end/store/index.js";
import { convertComputedFieldsWithErrorsToValidationMessages } from "../../../../../back-end/store/internal/kernel-adapter.js";
import { DocumentPath } from "../../../../../models/index.js";
import type { ReadonlyObjectMap } from "../../../../../models/index.js";

export function computeDocument(options: {
	readonly document: GroupInstance;
	readonly validatorProvider?: IGeneratedCodeAccessor;
	readonly kernelConfiguration: {
		readonly now?: Date;
	};
}): {
	changes: ReadonlyObjectMap<Change>;
	document: GroupInstance;
	messages: ReadonlyObjectMap<EngineStore.Validation.Entry>;
} {
	const { document, validatorProvider, kernelConfiguration } = options;

	if (!validatorProvider) {
		return { document, messages: {}, changes: {} };
	}

	const documentService = DocumentRtServiceFactory.createDocumentRtService(validatorProvider, {
		currentDateForTest: kernelConfiguration.now,
		ignoreUnknownFields: true
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
