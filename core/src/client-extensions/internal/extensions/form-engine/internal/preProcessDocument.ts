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

import type {
	DocumentModel,
	GroupInstance,
	IGeneratedCodeAccessor
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { Change, EngineStore } from "../../../../../back-end/store/index.js";
import { KernelComputation } from "../../../../../back-end/store/internal/computation.js";
import { isObjectEmpty } from "../../../../../back-end/utils/internal/guards.js";
import type { FormModel } from "../../../../../models/index.js";
import { ReadonlyObjectMap } from "../../../../../models/index.js";
import {
	DocumentPath,
	DocumentQuery
} from "../../../../../models/internal/utils/document-utils.js";

import { DocumentComputation } from "./computeDocument.js";

/**
 * @experimental
 *
 * Type of the preProcessDocument function parameter object
 */
export type PreProcessDocumentParams = {
	/**
	 * The document to preprocess, either an existing instance or a new instance
	 * with the initial values already set via createEmptyDocument
	 */
	readonly document: GroupInstance;

	/**
	 * The form model, document model and validation code used for the preprocessing
	 */
	readonly models: {
		readonly formModel: FormModel;
		readonly documentModel: DocumentModel;
		readonly validatorProvider: IGeneratedCodeAccessor;
	};

	/**
	 * Determines whether the preprocessing for a new or an existing document should be executed
	 */
	readonly isNewInstance: boolean;

	/**
	 * Allows setting an alternative value for the current time that is used
	 * when evaluating computations.
	 *
	 * Intended for testing purposes only.
	 */
	readonly now?: Date;
};

/**
 * @experimental
 *
 * Result type of the preProcessDocument function
 */
export type PreProcessDocumentResult = {
	/**
	 * The processed document
	 */
	readonly document: GroupInstance;

	/**
	 * Object for reporting changes made to the document during preprocessing
	 *
	 * The keys are string representations of the instance paths of the changed fields.
	 * The values are the change for these fields.
	 */
	readonly changes: Record<string, Change>;

	/**
	 * Object of messages for errors that occurred during preprocessing
	 *
	 * The keys are string representations of the instance paths of the error fields.
	 * The values are the message entry for these fields.
	 */
	readonly messages?: Record<string, EngineStore.Validation.Entry>;
};

/**
 * @experimental
 *
 * Can be used to preprocess a document, e.g. in client data providers.
 *
 * In case of newly created documents it is assumed, that initial values and
 * rows have already been filled via 'createEmptyDocument'.
 *
 * The preprocessing mode is determined from the respective settings in the
 * provided form model and depending on the provided isNewInstance flag.
 *
 * If no setting is provided in the form model, by default
 * - for new instances only the computations without dependency evaluation are executed
 * - for existing instances the document is returned without any preprocessing
 */
export function preProcessDocument(params: PreProcessDocumentParams): PreProcessDocumentResult {
	const { document, models, isNewInstance, now } = params;
	const { formModel, validatorProvider } = models;
	const preProcessingMode: FormModel.OpenDocumentPreProcessing = isNewInstance
		? (formModel.content.openNewDocumentPreProcessing ?? "COMPUTATIONS")
		: (formModel.content.openExistingDocumentPreProcessing ?? "NONE");

	switch (preProcessingMode) {
		case "NONE":
			return {
				document,
				changes: {}
			};
		case "COMPUTATIONS": {
			const computationResult = DocumentComputation.computeDocument({
				document,
				validatorProvider,
				kernelConfiguration: { now }
			});

			return {
				document: computationResult.document,
				changes: getAsRecord(computationResult.changes),
				...(!isObjectEmpty(computationResult.messages)
					? { messages: getAsRecord(computationResult.messages) }
					: {})
			};
		}
		case "COMPUTATIONS_AND_DEPENDENCIES": {
			const evaluationResult = KernelComputation.computeAndEvaluateDependencies({
				document,
				models,
				kernelConfiguration: { now },

				// For new documents we need to provide changes for the initial
				// values so that the kernel is able to evaluate chains that
				// start with dependencies (external computations)
				// For existing documents, only chains starting with
				// computations should be evaluated.
				changes: isNewInstance
					? createChangesForInitialFieldInstances(document, models.documentModel)
					: undefined
			});

			return {
				document: evaluationResult.document,
				changes: getAsRecord(evaluationResult.changes),
				...(evaluationResult.parseErrors && !isObjectEmpty(evaluationResult.parseErrors)
					? { messages: getAsRecord(evaluationResult.parseErrors) }
					: {})
			};
		}
		default:
			throw new Error("Unknown pre-processing mode");
	}
}

/**@internal */
export const PreProcessor = {
	preProcessDocument
};

function getAsRecord<T>(map: ReadonlyObjectMap<T>): Record<string, T> {
	// removes entries with undefined values
	return Object.fromEntries(ReadonlyObjectMap.entries(map));
}

/**
 * Creates a map of entityInstancePath to 'ValueChanged' change for all field instances in an
 * initialized document.
 *
 * Attachments and Multi-Selects are ignored here since no initial value can be
 * defined for these at the moment.
 */
function createChangesForInitialFieldInstances(
	document: GroupInstance,
	documentModel: DocumentModel
): ReadonlyObjectMap<Change> {
	const result: Record<string, Change> = {};
	DocumentQuery.walk(
		document,
		documentModel.content.modelRoot,
		({ path, element, modelElement }) => {
			if (modelElement.type === "Field" && element !== undefined) {
				result[DocumentPath.toString(path)] = { type: "ValueChanged", path };
			}
		}
	);

	return result;
}
