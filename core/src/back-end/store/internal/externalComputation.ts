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
import type { DocumentModel, EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import type { ExternalComputation } from "@com.mgmtp.a12.kernel/kernel-md-facade/a12internal";

import type { FormModel } from "../../../models/index.js";
import { DocumentPath } from "../../../models/index.js";
import * as DocumentModelUtils from "../../../models/internal/utils/document-model-utils.js";

type DependentFieldMap = { [fieldRef: string]: FormModel.DependentField };
type DependentEnumMap = { [fieldRef: string]: FormModel.DependentEnumeration };

/**
 * @internal
 *
 * Adapts dependent field and dependent enumeration dependencies from form model field config entries to the
 * Kernel external computation interface.
 * As external computations they can be integrated with document model computations using Kernels document compute API.
 */
export function convertDependencies(
	formModel: FormModel,
	documentModel: DocumentModel
): ExternalComputation[] {
	const dependentFields =
		formModel.content.fieldConfiguration.field?.reduce<DependentFieldMap>((acc, f) => {
			if (f.dependentField !== undefined && isDataDependency(f.dependentField)) {
				acc[ModelPath.toString(f.elementPath)] = f.dependentField;
			}
			return acc;
		}, {}) ?? {};

	const dependentEnums =
		formModel.content.fieldConfiguration.field?.reduce<DependentEnumMap>((acc, f) => {
			if (f.dependentEnumeration !== undefined) {
				acc[ModelPath.toString(f.elementPath)] = f.dependentEnumeration;
			}
			return acc;
		}, {}) ?? {};

	return [
		...Object.entries(dependentFields).map(([path, dependentField]) =>
			convertDependentField(ModelPath.fromString(path), dependentField, documentModel)
		),
		...Object.entries(dependentEnums).map(([path, dependentEnum]) =>
			convertDependentEnum(ModelPath.fromString(path), dependentEnum, documentModel)
		)
	];
}

function isDataDependency(depField: FormModel.DependentField): boolean {
	return depField.case.some(caze => caze.valueTyped !== undefined || caze.fieldPath !== undefined);
}

function convertDependentField(
	targetFieldPath: ModelPath,
	depField: FormModel.DependentField,
	documentModel: DocumentModel
): ExternalComputation {
	const masterFieldPath = depField.masterFieldPath;

	const refFieldPaths = depField.case.reduce<ModelPath[]>((acc, caze) => {
		if (caze.fieldPath !== undefined) {
			acc.push(caze.fieldPath);
		}
		return acc;
	}, []);

	return {
		// refFields should never lead to actual cycles, but not checking them can lead to nondeterministic execution
		inputs: [masterFieldPath, ...refFieldPaths],
		output: targetFieldPath,
		execute: (operands: ExternalComputation.Operand[]) => {
			const result: ExternalComputation.Result[] = [];
			operands.forEach(op => {
				if (ModelPath.equal(op.field, masterFieldPath)) {
					op.instances.forEach(masterFieldInstance => {
						if (masterFieldInstance.hasChanged) {
							const matchingCase = depField.case.find(
								caze => caze.masterValueTyped === masterFieldInstance.value
							);

							// we don't want to update any dependent field values if
							// 1. there is no matching case
							// 2. there is a matching case, but it specifies no value change
							// the 2nd case only occurs, if the dependent field value should change for another master value
							if (
								!matchingCase ||
								(matchingCase.valueTyped === undefined && matchingCase.fieldPath === undefined)
							) {
								return;
							}

							const refFieldPath = matchingCase?.fieldPath;

							if (refFieldPath) {
								// target field value comes from a referenced field (given as an operand)

								// steps
								// 0. compute the common prefix of master field instance and ref fields
								// 1. compute the list of referenced field instances per master field instance using the common prefix
								// 2. compute the list of target field instances per referenced field instance & master field instance
								//	  (this computation has to take the relative position of master and ref field into account)
								// 3. return the result for the combination of target field instance and ref field instance
								let isCommonPrefix = true;
								const commonPrefixPath = masterFieldInstance.field.reduce((acc, element, idx) => {
									isCommonPrefix =
										isCommonPrefix && refFieldPath[idx].elementName === element.elementName;
									if (isCommonPrefix) {
										acc.push(element);
									}
									return acc;
								}, [] as EntityInstancePath);

								const refFieldInstances = findReferencedFieldsByMasterInstance(
									operands,
									refFieldPath,
									commonPrefixPath
								);

								const targetFieldInstances = findTargetFieldsByRefFieldAndMasterFieldInstance(
									targetFieldPath,
									refFieldInstances,
									masterFieldInstance.field,
									documentModel
								);

								targetFieldInstances.forEach(({ targetFieldInstance, refFieldInstance }) => {
									result.push({
										field: targetFieldInstance,
										type: "Field",
										value: refFieldInstance.value
									});
								});
							} else {
								const targetDocumentPath = calculateTargetDocumentPathFromBaseFieldInstance(
									targetFieldPath,
									masterFieldInstance.field,
									documentModel
								);

								const value = matchingCase?.valueTyped ?? null;

								result.push({
									field: targetDocumentPath,
									type: "Field",
									value
								});
							}
						}
					});
				}
			});
			return result;
		}
	};
}

function findReferencedFieldsByMasterInstance(
	operands: ExternalComputation.Operand[],
	refFieldPath: ModelPath,
	commonPrefixPath: EntityInstancePath
): ExternalComputation.FieldInstance[] {
	return operands
		.filter(op => ModelPath.equal(op.field, refFieldPath))
		.flatMap(op => op.instances)
		.filter(instance => DocumentPath.contains(instance.field, commonPrefixPath));
}

function findTargetFieldsByRefFieldAndMasterFieldInstance(
	targetFieldPath: ModelPath,
	refFieldInstances: ExternalComputation.FieldInstance[],
	masterFieldInstance: EntityInstancePath,
	documentModel: DocumentModel
): {
	targetFieldInstance: EntityInstancePath;
	refFieldInstance: ExternalComputation.FieldInstance;
}[] {
	if (refFieldInstances.length === 0) {
		return [];
	}
	// TODO: can we skip the granularity check here and just look at the number of refFieldInstances?
	// if there is more than 1, ref field must be nested in a deeper repeatable group in relation to the master field
	// then we should derive the target field instances from that
	// otherwise, there should only be a single ref field instance per master field instance and we can derive the
	// target field instances from the master field instance
	const masterGranularity = DocumentModelUtils.computeGranularity(
		documentModel,
		masterFieldInstance
	);
	const refFieldGranularity = DocumentModelUtils.computeGranularity(
		documentModel,
		refFieldInstances[0].field
	);

	if (refFieldGranularity.length >= masterGranularity.length) {
		// referenced fields are more specific than master field -> derive target field instances from ref fields
		return refFieldInstances.flatMap(refFieldInstance => ({
			refFieldInstance,
			targetFieldInstance: calculateTargetDocumentPathFromBaseFieldInstance(
				targetFieldPath,
				refFieldInstance.field,
				documentModel
			)
		}));
	} else {
		// master field is more specific than ref field -> derive target field instances from master field
		return refFieldInstances.flatMap(refFieldInstance => ({
			refFieldInstance,
			targetFieldInstance: calculateTargetDocumentPathFromBaseFieldInstance(
				targetFieldPath,
				masterFieldInstance,
				documentModel
			)
		}));
	}
}

/**
 * Computes all possible document paths for the target field that can exist for a given base field.
 * The base field cannot have a greater granularity than the target field.
 * Thus, all concrete repeatability indices for the target field instance either come from the common path between
 * base field instance and target field OR must be 0 to indicate all repetitions for repeatable groups between base
 * field instance and target field instance.
 */
function calculateTargetDocumentPathFromBaseFieldInstance(
	targetModelPath: ModelPath,
	baseFieldInstance: EntityInstancePath,
	documentModel: DocumentModel
): EntityInstancePath {
	let isCommonPrefix = true;
	const currentPath: ModelPath = [];

	return targetModelPath.map((element, idx) => {
		isCommonPrefix = isCommonPrefix && element.elementName === baseFieldInstance[idx].elementName;
		currentPath.push(element);
		return {
			elementName: element.elementName,
			index: isCommonPrefix
				? baseFieldInstance[idx].index
				: DocumentModelUtils.isRepeatableGroup(documentModel, currentPath)
					? 0
					: 1
		};
	});
}

function convertDependentEnum(
	targetFieldPath: ModelPath,
	depEnum: FormModel.DependentEnumeration,
	documentModel: DocumentModel
): ExternalComputation {
	const masterFieldPath = depEnum.masterFieldPath;
	return {
		inputs: [masterFieldPath],
		output: targetFieldPath,
		execute: (operands: ExternalComputation.Operand[]) => {
			const result: ExternalComputation.Result[] = [];
			operands.forEach(op => {
				if (ModelPath.equal(op.field, masterFieldPath)) {
					op.instances.forEach(opInstance => {
						if (opInstance.hasChanged) {
							const targetDocumentPath = calculateTargetDocumentPathFromBaseFieldInstance(
								targetFieldPath,
								opInstance.field,
								documentModel
							);
							result.push({
								field: targetDocumentPath,
								type: "Field",
								// dependent enumerations always reset to either null or the specified initial value
								value:
									depEnum.constraint?.find(c => c.masterValue === opInstance.value)
										?.valueForMasterChange ?? null
							});
						}
					});
				}
			});
			return result;
		}
	};
}
