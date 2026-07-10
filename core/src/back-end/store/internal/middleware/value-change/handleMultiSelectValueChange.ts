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

import type { Action, Dispatch } from "redux";

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type {
	DocumentModel,
	EntityInstancePath,
	GroupInstance
} from "@com.mgmtp.a12.kernel/kernel-md-facade";

import type { FormModel } from "../../../../../models/index.js";
import {
	findByPath,
	isMultiSelect
} from "../../../../../models/internal/utils/document-model-utils.js";
import type { MultiSelectData } from "../../../../../models/internal/utils/document-model-utils.js";
import {
	DocumentPath,
	DocumentUtils,
	IndexedControl
} from "../../../../../models/internal/utils/document-utils.js";
import { ReadonlyObjectMap } from "../../../../../models/internal/utils/json.js";
import { assertCondition } from "../../../../utils/internal/assertions.js";
import { Commands } from "../../actions.js";
import { validateChangesAndUpdateMessages } from "../../change-validation.js";
import { collectRelevantFields } from "../../collectRelevantFields.js";
import type { Change } from "../../documentChange.js";
import { ChangeMapCreators } from "../../documentChange.js";
import { messageStateIsEqual } from "../../messageStateIsEqual.js";
import { DataSelectors } from "../../selectors/data.js";
import { ModelSelectors } from "../../selectors/models.js";
import { UiStateSelectors } from "../../selectors/ui-state.js";
import type { EngineState, EngineStore } from "../../store.js";

import type { MiddlewareOptions } from "../middleware-options.js";

import { updateDependencies } from "./updateDependencies.js";
import { updateDocument } from "./updateDocument.js";

/**
 * @internal
 */
export function handleMultiSelectValueChange(
	multiSelectGroupPath: EntityInstancePath,
	value: MultiSelectData,
	state: EngineState,
	dispatch: Dispatch<Action>,
	middlewareOptions: MiddlewareOptions,
	formModelElementPath?: ModelPath
): void {
	const document = DataSelectors.document()(state) as GroupInstance;
	const documentModel = ModelSelectors.documentModel()(state);
	const formModel = ModelSelectors.formModel()(state);
	const validationCode = ModelSelectors.validationCode()(state);
	const messages = UiStateSelectors.messages()(state);

	const multiSelectGroupPathString = DocumentPath.toString(multiSelectGroupPath);

	const multiSelectGroup = findByPath(documentModel, multiSelectGroupPath);
	assertCondition(isMultiSelect(multiSelectGroup));

	const multiSelectFieldName = multiSelectGroup.elements[0].name;

	/*
	 * When the multi-select control is modeled as control with index, it is
	 * necessary to initialize the group instance of the multi-select the first
	 * time its value is set.
	 */
	const documentWithIndexedControlRow = potentiallyAddIndexedControlRow(
		formModel,
		documentModel,
		document,
		multiSelectGroupPath,
		formModelElementPath
	);

	const documentWithMultiSelectValue = DocumentUtils.setValue(
		documentWithIndexedControlRow,
		multiSelectGroupPath,
		value,
		documentModel
	);

	if (documentWithMultiSelectValue === document) {
		return;
	}

	/*
	 * We need to collect two maps of changes:

	 * 1. The changes reported with the Commands.setDocument action, that should
	 * describe how the document was updated from before to the current state.
	 * This description is consumed for example by CDM to change the document
	 * graph and derive the updated cdd from it.
	 *
	 * Next to the changes to update the multi-select group instance itself,
	 * this needs to include any changes resulting from triggered computations
	 * and subsequently triggered dependencies.
	 *
	 * 2. The input changes for the validation, which only consists of
	 * multi-select changes necessary to trigger computations and subsequent
	 * dependencies and the additional changes resulting from that.
	 */
	const multiSelectChangesForReporting = collectMultiSelectChangesForReporting(
		document,
		value,
		multiSelectGroupPath,
		multiSelectFieldName
	);
	const multiSelectChangesForDependencyUpdate = collectMultiSelectChangesForDependencyUpdate(
		value,
		multiSelectGroupPath,
		multiSelectFieldName
	);

	const computationAndDependencyResult = updateDependencies({
		state,
		document: documentWithMultiSelectValue,
		kernelOptions: middlewareOptions.kernelOptionsProvider?.(state),
		changes: multiSelectChangesForDependencyUpdate
	});

	const documentAfterComputation = computationAndDependencyResult.document;

	// The change with the wildcard value path needs to be removed before validation
	const changesWithOutWildCardPath = getChangesWithoutWildCardPath(
		computationAndDependencyResult.changes,
		multiSelectGroupPath,
		multiSelectFieldName
	);

	// We need to remove the multi-select messages because they will not be
	// overwritten by the field validation
	const messageWithoutMultiSelectMessages = getMessagesWithoutMultiSelectMessages(
		messages,
		multiSelectGroupPathString
	);
	const relevantFieldPaths = collectRelevantFieldPaths(state, documentAfterComputation);

	const newMessages = validateChangesAndUpdateMessages({
		changes: changesWithOutWildCardPath,
		document: documentAfterComputation,
		initialMessages: messageWithoutMultiSelectMessages,
		kernelOptions: middlewareOptions.kernelOptionsProvider?.(state),
		models: { documentModel, formModel, validatorProvider: validationCode },
		parsingErrorsAfterComputation: computationAndDependencyResult.parseErrors,
		relevantFieldPaths
	});

	const changesForReporting = getChangesForReporting(
		computationAndDependencyResult.changes,
		multiSelectChangesForReporting,
		multiSelectGroupPathString
	);

	updateDocument(dispatch, state, documentAfterComputation, changesForReporting);

	if (!messageStateIsEqual(messages, newMessages)) {
		dispatch(Commands.setMessageState({ messages: newMessages }));
	}
}

function potentiallyAddIndexedControlRow(
	formModel: FormModel,
	documentModel: DocumentModel,
	document: GroupInstance,
	multiSelectGroupPath: EntityInstancePath,
	formModelElementPath?: ModelPath
): GroupInstance {
	return formModelElementPath
		? IndexedControl.initializeRowOfControlWithIndex(
				formModel,
				formModelElementPath,
				documentModel,
				document,
				multiSelectGroupPath.slice(0, -1)
			)
		: document;
}

function collectMultiSelectChangesForReporting(
	document: GroupInstance,
	currentMultiSelectValue: MultiSelectData,
	multiSelectGroupPath: EntityInstancePath,
	multiSelectFieldName: string
): ReadonlyObjectMap<Change> {
	const previousMultiSelectValue = findPreviousMultiSelectValue(document, multiSelectGroupPath);
	const previousValues = getMultiSelectFieldValues(previousMultiSelectValue);
	const currentValues = getMultiSelectFieldValues(currentMultiSelectValue);

	return calculateMultiSelectChangesForReporting(
		previousValues,
		currentValues,
		multiSelectGroupPath,
		multiSelectFieldName
	);
}

function collectMultiSelectChangesForDependencyUpdate(
	value: MultiSelectData,
	multiSelectGroupPath: EntityInstancePath,
	multiSelectFieldName: string
): ReadonlyObjectMap<Change> {
	const multiSelectFieldPaths = getCurrentMultiSelectFieldPaths(
		value,
		multiSelectGroupPath,
		multiSelectFieldName
	);
	const multiSelectValueWildCardPath = getMultiSelectValueWildCardPath(
		multiSelectGroupPath,
		multiSelectFieldName
	);

	return multiSelectFieldPaths.length > 0
		? ChangeMapCreators.createValueChanges(multiSelectFieldPaths)
		: ChangeMapCreators.createValueChanged(multiSelectValueWildCardPath); // The values were removed
}

function getChangesWithoutWildCardPath(
	changesAfterComputation: ReadonlyObjectMap<Change>,
	multiSelectGroupPath: EntityInstancePath,
	multiSelectFieldName: string
) {
	const multiSelectValueWildCardPath = getMultiSelectValueWildCardPath(
		multiSelectGroupPath,
		multiSelectFieldName
	);
	return ReadonlyObjectMap.filter(
		changesAfterComputation,
		key => !DocumentPath.equal(DocumentPath.fromString(key), multiSelectValueWildCardPath)
	);
}

function getMessagesWithoutMultiSelectMessages(
	messages: ReadonlyObjectMap<EngineStore.Validation.Entry>,
	multiSelectGroupPathString: string
): ReadonlyObjectMap<EngineStore.Validation.Entry> {
	return ReadonlyObjectMap.filter(
		messages,
		identifier => !identifier.startsWith(getMultiSelectGroupPathPrefix(multiSelectGroupPathString))
	);
}

function collectRelevantFieldPaths(
	state: EngineState,
	document: GroupInstance
): EntityInstancePath[] {
	/**
	 * FIXME: This is only necessary to collect the set of relevant fields
	 * on the updated document.
	 * It should be removed again with A12E-3365
	 */
	const intermediateState: EngineState = {
		...state,
		data: {
			...state.data,
			document
		}
	};

	return collectRelevantFields(intermediateState).map(field => field.documentPath);
}

/**
 * Returns the changes for reporting, e.g. used in CDM.
 *
 * These consist of the changes to update the multi-select group instance and
 * any changes outside of the multi-select group instance, that have resulted
 * from computations and dependencies triggered by the multi-select value
 * change.
 */
function getChangesForReporting(
	computationChanges: ReadonlyObjectMap<Change>,
	multiSelectChangesForReporting: ReadonlyObjectMap<Change>,
	multiSelectGroupPathString: string
): Change[] {
	const multiSelectGroupPathPrefix = getMultiSelectGroupPathPrefix(multiSelectGroupPathString);
	const changesOutsideMultiSelect = ReadonlyObjectMap.filter(
		computationChanges,
		key => !key.startsWith(multiSelectGroupPathPrefix)
	);

	return [
		...ReadonlyObjectMap.values(multiSelectChangesForReporting),
		...ReadonlyObjectMap.values(changesOutsideMultiSelect)
	];
}

/**
 * Returns the multi select value before the value change
 */
function findPreviousMultiSelectValue(
	document: GroupInstance,
	multiSelectGroupPath: EntityInstancePath
): MultiSelectData {
	const previousMultiSelectValue = DocumentUtils.getAssignedObject(document, multiSelectGroupPath);
	return DocumentUtils.isGroupInstances(previousMultiSelectValue)
		? (previousMultiSelectValue as MultiSelectData)
		: [];
}

/**
 * Extracts the multi-select field values as array
 */
function getMultiSelectFieldValues(data: MultiSelectData): string[] {
	return data.map(entry => entry[Object.keys(entry)[0]]);
}

/**
 * Returns the changes for reporting that are necessary to update the
 * multi-select group instance.
 */
function calculateMultiSelectChangesForReporting(
	valuesBefore: string[],
	valuesAfter: string[],
	multiSelectGroupPath: EntityInstancePath,
	multiSelectFieldName: string
): ReadonlyObjectMap<Change> {
	const KERNEL_OFFSET = 1;

	if (valuesBefore.length === 0 && valuesAfter.length > 0) {
		// first value(s) added
		const changedPaths: EntityInstancePath[] = [];
		for (let i = 0; i < valuesAfter.length; i++) {
			changedPaths.push(
				createMultiSelectValueFieldInstancePath(
					multiSelectGroupPath,
					i + KERNEL_OFFSET,
					multiSelectFieldName
				)
			);
		}
		return ChangeMapCreators.createValueChanges(changedPaths);
	} else if (valuesBefore.length > 0 && valuesAfter.length === 0) {
		// last value(s) removed or all values unselected or removed at once
		return ChangeMapCreators.createGroupRemoved(multiSelectGroupPath);
	} else if (valuesBefore.length > valuesAfter.length && valuesAfter.length > 0) {
		// some value(s) removed, assuming values cannot be removed and added at the same time

		// Note: The case of multiple (but not all) group instances of
		// the same group removed at once needs to be handled in a special way:
		// Since in cdm the changes are applied one by one, a subsequent
		// groupRemoved change should use a path as if the previous change
		// already had been applied to the document.
		// This is only theoretical since in the runtime values are removed one
		// by one or all at once (second case).
		const { removed } = findChangedIndices(valuesBefore, valuesAfter);
		const changes: Change[] = removed.map((removalIndex, index) => {
			return {
				type: "GroupRemoved",
				path: createMultiSelectGroupInstance(
					multiSelectGroupPath,
					removalIndex - index + KERNEL_OFFSET
				)
			};
		});
		return ChangeMapCreators.fromList(changes);
	} else {
		// some value(s) added, assuming values cannot be removed and added at the same time
		// The first adding index and all following need to be changed.
		const { added } = findChangedIndices(valuesBefore, valuesAfter);
		const firstAddingIndex = added.at(0) ?? 0;
		const changedPaths: EntityInstancePath[] = [];
		for (let i = firstAddingIndex; i < valuesAfter.length; i++) {
			changedPaths.push(
				createMultiSelectValueFieldInstancePath(
					multiSelectGroupPath,
					i + KERNEL_OFFSET,
					multiSelectFieldName
				)
			);
		}
		return ChangeMapCreators.createValueChanges(changedPaths);
	}
}

/**
 * Returns the 0-based multi-select path with the path to the value
 */
function getMultiSelectValueWildCardPath(
	multiSelectGroupPath: EntityInstancePath,
	multiSelectFieldName: string
): EntityInstancePath {
	return createMultiSelectValueFieldInstancePath(multiSelectGroupPath, 0, multiSelectFieldName);
}

/**
 * Finds all indices of entries that have been either added or removed in the
 * after array in comparison to the before array.
 */
function findChangedIndices(
	before: ReadonlyArray<unknown>,
	after: ReadonlyArray<unknown>
): { added: number[]; removed: number[] } {
	let i = 0,
		j = 0;
	const added: number[] = [];
	const removed: number[] = [];
	while (i < before.length || j < after.length) {
		if (i < before.length && j < after.length && before[i] === after[j]) {
			// Values match, move both pointers
			i++;
			j++;
		} else if (j < after.length && (i === before.length || before[i] !== after[j])) {
			// Value added in 'after'
			added.push(j);
			j++;
		} else if (i < before.length && (j === after.length || before[i] !== after[j])) {
			// Value removed from 'before'
			removed.push(i);
			i++;
		}
	}
	return { added, removed };
}

/**
 * Extracts an array of value field instance paths from the current multi-select
 * value.
 */
function getCurrentMultiSelectFieldPaths(
	multiSelectValue: MultiSelectData,
	multiSelectGroupPath: EntityInstancePath,
	multiSelectFieldName: string
): EntityInstancePath[] {
	return multiSelectValue.map((_, index) => {
		return createMultiSelectValueFieldInstancePath(
			multiSelectGroupPath,
			index + 1,
			multiSelectFieldName
		);
	});
}

function createMultiSelectValueFieldInstancePath(
	multiSelectGroupPath: EntityInstancePath,
	multiSelectGroupInstanceIndex: number,
	multiSelectFieldName: string
): EntityInstancePath {
	return [
		...createMultiSelectGroupInstance(multiSelectGroupPath, multiSelectGroupInstanceIndex),
		{ elementName: multiSelectFieldName, index: 1 }
	];
}

function createMultiSelectGroupInstance(
	multiSelectGroupPath: EntityInstancePath,
	multiSelectGroupInstanceIndex: number
): EntityInstancePath {
	return multiSelectGroupPath.with(-1, {
		elementName: multiSelectGroupPath[multiSelectGroupPath.length - 1].elementName,
		index: multiSelectGroupInstanceIndex
	});
}

/**
 * Returns the multi-select group instance path string without the last index
 */
function getMultiSelectGroupPathPrefix(multiSelectGroupPathString: string): string {
	return multiSelectGroupPathString.slice(0, multiSelectGroupPathString.lastIndexOf("["));
}
