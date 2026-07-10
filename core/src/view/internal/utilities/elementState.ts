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
import type { EntityInstancePath, GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { isComputedField } from "../../../back-end/store/internal/kernel-adapter.js";
import type { Models } from "../../../back-end/store/internal/store.js";
import { getDocumentPath } from "../../../back-end/utils/internal/path.js";
import type { FormModel } from "../../../models/index.js";
import { DocumentUtils, IndexedControl } from "../../../models/internal/utils/document-utils.js";

/*
 * Note: We don't have separate filters for Dependent Field and Dependent Group
 * because DependentGroupCase is a subset of DependentFieldCase (at the moment)
 */
interface EntryCaseFilter {
	(entryCase: FormModel.DependentGroupCase): boolean;
}

/**
 * @internal
 *
 * FieldState related features: setting a field and therefore all controls that reference this field hidden or readonly.
 * @ignore
 */
export const ElementStateUtil = {
	/**
	 * @internal
	 *
	 * evaluate if a field is supposed to be read-only
	 */
	evaluateFieldReadOnly(
		document: object,
		models: Models,
		elementPath: ModelPath,
		context: EntityInstancePath
	): boolean {
		const fieldState = ElementStateUtil.evaluateStateAttributeField(
			document,
			models,
			elementPath,
			readOnlyFilter,
			context
		);

		if (fieldState) {
			return true;
		}

		const groupState = evaluateStateAttributeGroup(
			document,
			models,
			elementPath,
			readOnlyFilter,
			context
		);

		if (groupState) {
			return true;
		}

		return models.validatorProvider
			? isComputedField(models.validatorProvider, elementPath)
			: false;
	},

	/**
	 * @internal
	 *
	 * evaluate whether a field is not relevant
	 */
	evaluateFieldNotRelevant(
		document: object,
		models: Models,
		fieldPath: ModelPath,
		context: EntityInstancePath
	): boolean {
		const fieldState = ElementStateUtil.evaluateStateAttributeField(
			document,
			models,
			fieldPath,
			notRelevantFilter,
			context
		);

		const groupState = evaluateStateAttributeGroup(
			document,
			models,
			fieldPath,
			notRelevantFilter,
			context
		);
		return fieldState || groupState;
	},

	/**
	 * @internal
	 *
	 * evaluate if a group is supposed to be read-only
	 */
	evaluateGroupReadOnly(
		document: object,
		models: Models,
		fieldPath: ModelPath,
		context: EntityInstancePath
	): boolean {
		return evaluateStateAttributeGroup(document, models, fieldPath, readOnlyFilter, context);
	},

	/**
	 * @internal
	 *
	 * evaluate whether a group is not relevant
	 */
	evaluateGroupNotRelevant(
		document: object,
		models: Models,
		fieldPath: ModelPath,
		context: EntityInstancePath
	): boolean {
		return evaluateStateAttributeGroup(document, models, fieldPath, notRelevantFilter, context);
	},

	/**
	 * @internal
	 *
	 * Evaluate if a screen element is supposed to be hidden
	 * due to a DependentControl dependency
	 */
	evaluateHiddenDependentScreenElement(
		document: object,
		models: Models,
		id: string,
		context: EntityInstancePath
	): boolean {
		const dependentScreenElements = models.formModel.content.dependentScreenElements;

		const entry = dependentScreenElements[id];
		if (entry === undefined) {
			return false;
		}

		return Object.values(entry.controls).some(c => {
			if (!c) {
				return false;
			}

			const controlContext = IndexedControl.getContextOfControlWithIndex({
				elementPath: c.elementPath,
				controlIndex: c.controlIndex,
				documentModel: models.documentModel,
				document: document as GroupInstance,
				currentDataContext: context
			});

			const masterFieldDocumentPath = getDocumentPath(
				models.documentModel,
				c.elementPath,
				controlContext
			);

			const masterValue = DocumentUtils.getValue({
				document: document as GroupInstance,
				path: masterFieldDocumentPath
			});

			return c.values.every(v => v !== masterValue);
		});
	},

	/**
	 * @internal
	 *
	 * evaluates if any of the dependent field or group affects the property readonly or hidden
	 * (implicitly defined by a filter function) for this field.
	 */
	evaluateStateAttributeField(
		document: object,
		models: Models,
		fieldPath: ModelPath,
		filter: EntryCaseFilter,
		context: EntityInstancePath
	): boolean {
		const fce = models.formModel.content.fieldConfiguration.fieldMap[ModelPath.toString(fieldPath)];

		if (fce && fce.dependentField) {
			const masterFieldPath = fce.dependentField.masterFieldPath;
			const entryCases = fce.dependentField.case.filter(filter);
			return evaluateCases(masterFieldPath, entryCases, document, models, context);
		} else {
			return false;
		}
	},

	/**
	 * @internal
	 *
	 * Evaluates whether an element is hidden due to its hide condition
	 */
	evaluateHiddenByCondition(
		document: object,
		models: Models,
		id: string,
		context: EntityInstancePath
	): boolean {
		const conditionallyHiddenElements = models.formModel.content.conditionallyHiddenElements;
		const entry = conditionallyHiddenElements?.[id];
		if (!entry) {
			return false;
		}

		const masterFieldModelPath = entry.masterFieldModelPath;

		const masterFieldDocumentPath = getDocumentPath(
			models.documentModel,
			masterFieldModelPath,
			context
		);

		const masterValue = DocumentUtils.getValue({
			document: document as GroupInstance,
			path: masterFieldDocumentPath
		});

		return entry.values.some(value => value === masterValue);
	}
};

/** @internal */
const readOnlyFilter: EntryCaseFilter = (entryCase: FormModel.DependentGroupCase) =>
	entryCase.readonly === true;
/** @internal */
const notRelevantFilter: EntryCaseFilter = (entryCase: FormModel.DependentGroupCase) =>
	entryCase.notRelevant === true;

/**
 * @internal
 *
 * evaluates if any of the dependent field or group affects the property readonly or hidden
 * (implicitly defined by a filter function) for this field.
 */
function evaluateStateAttributeGroup(
	document: object,
	models: Models,
	path: ModelPath,
	filter: EntryCaseFilter,
	context: EntityInstancePath
): boolean {
	let remainingPath = path;
	while (remainingPath.length > 0) {
		const groupConfigEntry =
			models.formModel.content.groupConfiguration.groupMap[ModelPath.toString(remainingPath)];
		if (groupConfigEntry && groupConfigEntry.dependentGroup) {
			const masterFieldPath = groupConfigEntry.dependentGroup.masterFieldPath;
			const entryCase = groupConfigEntry.dependentGroup.case.filter(filter);
			const result = evaluateCases(masterFieldPath, entryCase, document, models, context);
			if (result) {
				return true;
			}
		}

		remainingPath = remainingPath.slice(0, remainingPath.length - 1);
	}

	return false;
}

// evaluate if at least for one case the value of the master field equals the desired master value
function evaluateCases(
	masterFieldPath: ModelPath,
	entryCases: FormModel.DependentGroupCase[],
	document: object,
	models: Models,
	context: EntityInstancePath
) {
	const { documentModel } = models;
	const masterFieldDocumentPath = getDocumentPath(documentModel, masterFieldPath, context);
	const masterValue = DocumentUtils.getValue({
		document: document as GroupInstance,
		path: masterFieldDocumentPath
	});

	return entryCases.some(entryCase => {
		return masterValue === entryCase.masterValueTyped;
	});
}
