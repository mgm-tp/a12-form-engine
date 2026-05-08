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

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type {
	DocumentModel,
	EntityInstancePath,
	GroupInstance
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { FormModel } from "../../../models/index.js";
import { DocumentModelUtils } from "../../../models/internal/utils/document-model-utils.js";
import { DocumentPath } from "../../../models/internal/utils/document-utils.js";
import { ReadonlyObjectMap } from "../../../models/internal/utils/json.js";
import { ElementStateUtil } from "../../../view/internal/utilities/elementState.js";

import { Change } from "./documentChange.js";
import { getEffectiveRelevantFields } from "./getEffectiveRelevantFields.js";
import type { Models } from "./store.js";
import { EngineStore } from "./store.js";
import { validateElements } from "./validation.js";

/**
 * @internal
 *
 * Based on the specific type of the given changes,
 * - removes all existing validation messages for removed groups
 * - removes all existing validation messages for changed, but not relevant fields
 * - validates all relevant fields and adds their (new) validation messages
 * - adds the given parsingErrorsAfterComputation
 */
export function validateChangesAndUpdateMessages(options: {
	readonly document: GroupInstance;
	readonly changes: ReadonlyObjectMap<Change>;
	readonly models: Models;
	readonly initialMessages: ReadonlyObjectMap<EngineStore.Validation.Entry>;
	readonly parsingErrorsAfterComputation?: ReadonlyObjectMap<EngineStore.Validation.Entry>;
	readonly kernelConfiguration: {
		readonly now?: Date;
	};
	readonly relevantFieldPaths?: EntityInstancePath[];
}): ReadonlyObjectMap<EngineStore.Validation.Entry> {
	const { models, changes, document, initialMessages, kernelConfiguration, relevantFieldPaths } =
		options;
	const { now } = kernelConfiguration;
	const { documentModel, validatorProvider, formModel } = models;

	const categorizedChanges = categorizeChanges(
		documentModel,
		changes,
		relevantFieldPaths ? getEffectiveRelevantFields(relevantFieldPaths) : undefined
	);

	let messages = removeOutdatedMessages(
		document,
		initialMessages,
		categorizedChanges.groupRemovedPaths,
		categorizedChanges.nonRelevantPaths,
		categorizedChanges.relevantPaths,
		documentModel,
		formModel
	);

	// update messages with validation of all (relevant) changed elements
	messages = validateElements({
		document,
		initialMessages: messages,
		now,
		relevantElements: categorizedChanges.relevantPaths,
		validatorProvider: validatorProvider,
		type: "field"
	});

	/**
	 * If there are parsing errors after the computation,
	 * then there is no value present, hence there can be no
	 * validation error. Therefore the parsing errors can just be spread
	 * into the map
	 */
	return options.parsingErrorsAfterComputation
		? {
				...messages,
				...options.parsingErrorsAfterComputation
			}
		: messages;
}
/**
 * Separates the changes to relevant fields from those changes to non-relevant
 * fields when a list of relevant fields is given.
 * (non-relevant fields should not receive validation error messages)
 *
 * When "GroupAdded" changes are contained in the list of changes, they most
 * likely result from the added rows of multi file upload. They are added to the
 * relevant paths.
 *
 * Furthermore, returns the list of removed group instances.
 */
function categorizeChanges(
	documentModel: DocumentModel,
	changes: ReadonlyObjectMap<Change>,
	relevantFieldPaths?: EntityInstancePath[]
): CategorizedChanges {
	const changeList = Array.from(ReadonlyObjectMap.values(changes));

	const valueChangedPaths = changeList.filter(Change.isValueChanged).map(({ path }) => path);
	const groupRemovedPaths = changeList.filter(Change.isGroupRemoved).map(({ path }) => path);
	const groupAddedPaths = changeList.filter(Change.isGroupAdded).map(({ path }) => path);

	if (relevantFieldPaths) {
		return [...valueChangedPaths].reduce<CategorizedChanges>(
			(acc, path) => {
				const isRelevant = relevantFieldPaths.some(relevantPath => {
					const element = DocumentModelUtils.findByPath(documentModel, relevantPath);

					// for multi select and attachments, `relevantPath` points to the group (and not its fields)
					// so we need to remove the field from the value path for comparing
					const pathForComparison =
						DocumentModelUtils.isMultiSelect(element) || DocumentModelUtils.isAttachment(element)
							? path.slice(0, -1)
							: path;

					return DocumentPath.matches(pathForComparison, relevantPath);
				});

				if (isRelevant) {
					acc.relevantPaths.push(path);
				} else {
					acc.nonRelevantPaths.push(path);
				}
				return acc;
			},
			{
				relevantPaths: [],
				nonRelevantPaths: [],
				groupRemovedPaths
			}
		);
	} else {
		return {
			relevantPaths: [...valueChangedPaths, ...groupAddedPaths],
			nonRelevantPaths: [],
			groupRemovedPaths
		};
	}
}
interface CategorizedChanges {
	readonly relevantPaths: EntityInstancePath[];
	readonly nonRelevantPaths: EntityInstancePath[];
	readonly groupRemovedPaths: EntityInstancePath[];
}
/**
 * @internal
 *
 * Removes all existing messages that should no longer be present after the given value change(s)
 */
export function removeOutdatedMessages(
	document: GroupInstance,
	messages: ReadonlyObjectMap<EngineStore.Validation.Entry>,
	groupRemovedPaths: EntityInstancePath[],
	nonRelevantPaths: EntityInstancePath[],
	relevantPaths: EntityInstancePath[],
	documentModel: DocumentModel,
	formModel: FormModel
): ReadonlyObjectMap<EngineStore.Validation.Entry> {
	let remainingMessages = messages;

	// remove all parse errors for all changed fields
	if (relevantPaths.length > 0) {
		const pathsAsString = relevantPaths.map(path => DocumentPath.toString(path));
		remainingMessages = ReadonlyObjectMap.filter(
			remainingMessages,
			key => !pathsAsString.includes(key)
		);
	}

	// remove messages for all non-relevant field changes
	if (nonRelevantPaths.length > 0) {
		const pathsAsString = nonRelevantPaths.map(path => DocumentPath.toString(path));
		remainingMessages = ReadonlyObjectMap.filter(
			remainingMessages,
			key => !pathsAsString.includes(key)
		);
	}
	// remove messages for removed groups and rewrite existing messages (i.e. to adjust indices)
	for (const path of groupRemovedPaths) {
		const contextGroup = DocumentModelUtils.computeGranularity(documentModel, path);
		const modelElement = DocumentModelUtils.findByPath(documentModel, contextGroup);
		if (modelElement.type !== "Group") {
			throw new Error(`Element ${ModelPath.toString(path)} is not a group!`);
		}
		remainingMessages = removeRowEntriesInMessages(path, remainingMessages, documentModel);
	}

	// remove messages for all non-relevant fields and groups (due to dependency)
	return ReadonlyObjectMap.filter(remainingMessages, errorFieldPath => {
		const documentPath = DocumentPath.fromString(errorFieldPath);
		return !ElementStateUtil.evaluateFieldNotRelevant(
			document,
			{ documentModel, formModel },
			// model path
			documentPath,
			// data context
			documentPath
		);
	});
}

/** @internal */
export function removeRowEntriesInMessages(
	rowPath: EntityInstancePath,
	messages: ReadonlyObjectMap<EngineStore.Validation.Entry>,
	documentModel: DocumentModel
): ReadonlyObjectMap<EngineStore.Validation.Entry> {
	const instanceIdentifier = DocumentPath.toString(rowPath);
	const messagesWithoutRemoved = ReadonlyObjectMap.filter(
		messages,
		identifier => !identifier.startsWith(instanceIdentifier)
	);

	return EngineStore.Validation.Message.updateMessagesPaths(
		messagesWithoutRemoved,
		rowPath,
		documentModel
	);
}
