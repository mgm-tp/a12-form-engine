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

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type * as Collections from "@com.mgmtp.a12.kernel/kernel-core-runtime-api-ts/a12internal";
import type {
	IMetaField,
	IResult
} from "@com.mgmtp.a12.kernel/kernel-core-runtime-api-ts/a12internal";
import {
	ErrorType,
	IIdentifier,
	IMetaKeys
} from "@com.mgmtp.a12.kernel/kernel-core-runtime-api-ts/a12internal";
import type {
	ComputedFieldInstance,
	Document,
	EntityInstancePath,
	GeneratedCodeRtConfig,
	GroupInstance,
	IGeneratedCodeAccessor,
	Message
} from "@com.mgmtp.a12.kernel/kernel-md-facade";
import { DocumentRtServiceFactoryA12internal } from "@com.mgmtp.a12.kernel/kernel-md-facade/a12internal";
import type { ExternalComputation } from "@com.mgmtp.a12.kernel/kernel-md-facade/a12internal";
import type { Localizable } from "@com.mgmtp.a12.utils/utils-localization";

import { DocumentPath } from "../../../models/internal/utils/document-utils.js";
import type { ReadonlyObjectMap } from "../../../models/internal/utils/json.js";

import type { DetailedUpdateResult } from "./DetailedUpdateResult.js";
import type { Change } from "./documentChange.js";
import type { EngineStore } from "./store.js";

/**
 * @internal
 */
export function isPartOfComputation(
	validatorProvider: IGeneratedCodeAccessor,
	fieldPath: ModelPath
): boolean {
	const id = ModelPath.toString(fieldPath);
	const metaField: IMetaField = validatorProvider
		.getMetaModel()
		.getValue(IMetaKeys.MODEL_META_FIELD, id);
	const result: Set<IIdentifier> = metaField.getValue(
		IMetaKeys.FIELD_TARGET_SET_FOR_CALC,
		"Server"
	);
	return result.size > 0;
}

interface ComputeOptions {
	readonly validatorProvider: IGeneratedCodeAccessor;
	readonly document: GroupInstance;
	readonly externalComputations: ExternalComputation[];
	readonly changes?: ReadonlyObjectMap<Change>;

	readonly kernelOptions?: GeneratedCodeRtConfig;
}

/** @internal */
export interface DetailedUpdateResultWithParsingErrors extends DetailedUpdateResult {
	readonly parseErrors?: ReadonlyObjectMap<EngineStore.Validation.Entry>;
}

/**
 * @internal
 * Compute all computable values in the given document.
 *
 * Clear values that returned errors or that did not return a result at all.
 *
 * If no value could be computed, the given document is returned unchanged.
 *
 * @returns the updated document, field changes and a list of parsing error messages
 *
 */
export function computeWithKernel(options: ComputeOptions): DetailedUpdateResultWithParsingErrors {
	const { document, validatorProvider, externalComputations, changes, kernelOptions } = options;
	const {
		currentDateForTest,
		customConditionFactory,
		customFieldTypeFactory,
		ignoreUnknownFields
	} = kernelOptions || {};

	const fieldValueChanges = changes
		? Object.values(changes).reduce<EntityInstancePath[]>((acc, change) => {
				if (change?.type === "ValueChanged") {
					acc.push(change.path);
				}
				return acc;
			}, [])
		: undefined;

	const computedFields = validatorProvider
		.getMetaModel()
		.getValue(IMetaKeys.MODEL_CALC_FIELDS, "Server") as Collections.HashSet<IMetaField>;

	if (computedFields.size === 0 && externalComputations.length === 0) {
		return { document, changes: {} };
	}

	const documentService = DocumentRtServiceFactoryA12internal.createDocumentRtService(
		validatorProvider,
		{
			currentDateForTest,
			customConditionFactory,
			customFieldTypeFactory,
			ignoreUnknownFields: ignoreUnknownFields !== false
		}
	);

	const kernelDoc = document as Document;

	const computationResult = documentService.computeA12internal(
		kernelDoc,
		externalComputations,
		fieldValueChanges
	);

	const newDoc = computationResult.appliedTo(document as Document);

	const changedFields = convertComputedFieldInstancesToChanges(
		computationResult.computedFieldInstancesWithChanges,
		computationResult.clearedFieldInstances
	);

	const parseErrors = convertComputedFieldsWithErrorsToValidationMessages(
		computationResult.computedFieldInstancesWithErrors
	);

	return { document: newDoc, changes: changedFields, parseErrors };
}

/**
 * @internal
 * Export for testing
 */
export function convertComputedFieldInstancesToChanges(
	computedFieldInstances: ComputedFieldInstance[],
	clearedFieldInstances: ComputedFieldInstance[]
): ReadonlyObjectMap<Change> {
	const result = computedFieldInstances.reduce(
		(changeMap, fieldInstance) => ({
			...changeMap,
			[DocumentPath.toString(fieldInstance.path)]: {
				type: "ValueChanged",
				path: fieldInstance.path
			}
		}),
		{}
	);

	return clearedFieldInstances.reduce((changeMap, fieldInstance) => {
		return {
			...changeMap,
			[DocumentPath.toString(fieldInstance.path)]: {
				type: "ValueChanged",
				path: fieldInstance.path
			}
		};
	}, result);
}

/** @internal */
export function convertComputedFieldsWithErrorsToValidationMessages(
	invalidFieldInstances: ComputedFieldInstance[]
): ReadonlyObjectMap<EngineStore.Validation.Entry> {
	return invalidFieldInstances.reduce<ReadonlyObjectMap<EngineStore.Validation.Entry>>(
		(acc, cur) => {
			if (cur.errorMessage) {
				return {
					...acc,
					[DocumentPath.toString(cur.path)]: {
						parseError: {
							message: mapMessageTypes(cur.errorMessage),
							value: cur.stringValue ?? ""
						},
						validationMessages: []
					}
				};
			}
			return acc;
		},
		{}
	);
}

/** @internal */
export function mapMessageTypes(kernelMessage: Message): EngineStore.Validation.Message {
	return {
		element: kernelMessage.entityInstance,
		errorCode: kernelMessage.errorCode,
		errorKey: kernelMessage.rulePath ?? "formalePruefung",
		errorText: kernelMessage.errorText,
		referencedFields:
			kernelMessage.messageType === "OMISSION_ERROR"
				? computeUniqueDocumentPaths(kernelMessage.refOmissionErrorResponsible)
				: computeUniqueDocumentPaths(kernelMessage.referencedFields),
		severity: kernelMessage.severity
	};
}

// makes sure that duplicates are removed from the given list of document paths
function computeUniqueDocumentPaths(input: EntityInstancePath[]): EntityInstancePath[] {
	const result: EntityInstancePath[] = [];
	const visited: { [key: string]: true | undefined } = {};
	input.forEach(path => {
		const stringifiedPath = DocumentPath.toString(path);
		if (!visited[stringifiedPath]) {
			visited[stringifiedPath] = true;
			result.push(path);
		}
	});
	return result;
}

/**
 * @internal
 * @ignore
 *
 * Return if the given field is (unconditionally) required.
 *
 * TODO: change to a function that is only called once per render cycle!!!
 * TODO: "required groups" for "complex types"
 * TODO: Tests
 */
export function isFieldRequired(
	fieldPath: ModelPath,
	validatorProvider?: IGeneratedCodeAccessor
): boolean {
	const id = ModelPath.toString(fieldPath);
	const metaField = validatorProvider?.getMetaModel().getValue(IMetaKeys.MODEL_META_FIELD, id) as
		| IMetaField
		| undefined;

	// Attachment/MultiSelect can never be required
	if (metaField === undefined) {
		return false;
	}

	return !!metaField.getValue(IMetaKeys.FIELD_MANDATORY_GLOBAL_OR_IN_SURROUNDING_REPEATABLE_GROUP);
}

export function isFieldGlobal(
	validatorProvider: IGeneratedCodeAccessor,
	fieldPath: ModelPath
): boolean {
	const id = ModelPath.toString(fieldPath);
	const metaField = validatorProvider
		.getMetaModel()
		.getValue(IMetaKeys.MODEL_META_FIELD, id) as IMetaField;

	// Attachment/MultiSelect can never be global
	if (metaField === undefined) {
		return false;
	}

	return !!metaField.getValue(IMetaKeys.FIELD_GLOBAL);
}

/**
 * @internal
 */
export function isComputedField(
	validatorProvider: IGeneratedCodeAccessor,
	fieldPath: ModelPath
): boolean {
	const id = ModelPath.toString(fieldPath);

	const result = validatorProvider
		.getMetaModel()
		.getValue(IMetaKeys.MODEL_CALC_FIELDS, "Server") as Collections.HashSet<IMetaField>;

	return (
		result !== null &&
		result !== undefined &&
		Array.from(result).some(meta => meta.getValue(IMetaKeys.FIELD_FULLNAME) === id)
	);
}

/** @internal */
export class ValidationResult implements IResult {
	public readonly messages: EngineStore.Validation.Message[] = [];

	addError(
		ruleName: string,
		errorCode: string,
		errorField: IIdentifier,
		errorMessage: Localizable[],
		type: ErrorType,
		referencedFields: Set<IIdentifier>,
		refOmissionErrorResponsible: Set<IIdentifier>
		// TODO: should we also handle this?
		// unknowns: Set<IIdentifier>
	): void {
		this.addMessage(
			ruleName,
			errorCode,
			errorField,
			errorMessage,
			type,
			referencedFields,
			refOmissionErrorResponsible,
			"ERROR"
		);
	}

	addHint(
		ruleName: string,
		hintCode: string,
		hintField: IIdentifier,
		hintMessage: Localizable[],
		type: ErrorType,
		referencedFields: Set<IIdentifier>,
		refOmissionErrorResponsible: Set<IIdentifier>
	): void {
		this.addMessage(
			ruleName,
			hintCode,
			hintField,
			hintMessage,
			type,
			referencedFields,
			refOmissionErrorResponsible,
			"WARNING"
		);
	}

	addInfo(
		ruleName: string,
		infoCode: string,
		infoField: IIdentifier,
		infoMessage: Localizable[],
		type: ErrorType,
		referencedFields: Set<IIdentifier>,
		refOmissionErrorResponsible: Set<IIdentifier>
	): void {
		this.addMessage(
			ruleName,
			infoCode,
			infoField,
			infoMessage,
			type,
			referencedFields,
			refOmissionErrorResponsible,
			"INFO"
		);
	}

	private addMessage(
		ruleName: string,
		errorCode: string,
		errorField: IIdentifier,
		errorMessage: Localizable[],
		type: ErrorType,
		referencedFields: Set<IIdentifier>,
		refOmissionErrorResponsible: Set<IIdentifier>,
		severity: "ERROR" | "WARNING" | "INFO"
	): void {
		this.messages.push({
			element: toDocumentPath(errorField),
			errorText: errorMessage,
			errorCode,
			errorKey: ruleName,
			severity,
			referencedFields: Array.from(
				type === ErrorType.OMISSION_ERROR ? refOmissionErrorResponsible : referencedFields
			).map(toDocumentPath)
		});
	}

	getCountOf(): number {
		throw new Error("not supported");
	}

	isValid(): boolean {
		return this.messages.find(m => m.severity === "ERROR") === undefined;
	}
}

export function toDocumentPath(id: IIdentifier): EntityInstancePath {
	return id
		.getName()
		.split(IIdentifier.SEPARATOR)
		.slice(1)
		.map((elementName, i) => ({ elementName, index: id.getIndices()[i] }));
}
