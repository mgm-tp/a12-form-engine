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

import type { Dispatch } from "redux";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type { EntityInstancePath, GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { findElementByFormModelPath, ReadonlyObjectMap } from "../../../models/index.js";
import type { FormModel } from "../../../models/index.js";
import {
	isFormModelControl,
	isFormModelFieldOverviewColumn,
	isFormModelSection
} from "../../../models/internal/FormModelGuards.js";
import { DocumentPath, DocumentUtils } from "../../../models/internal/utils/document-utils.js";

import { Commands } from "./actions.js";
import type { RelevantFieldPaths } from "./collectRelevantFields.js";
import { getEffectiveRelevantFields } from "./getEffectiveRelevantFields.js";
import { messageStateIsEqual } from "./messageStateIsEqual.js";
import type { MiddlewareOptions } from "./middleware/middleware-options.js";
import { DataSelectors } from "./selectors/data.js";
import { ModelSelectors } from "./selectors/models.js";
import { UiStateSelectors } from "./selectors/ui-state.js";
import type { EngineState, EngineStore } from "./store.js";
import { validateElements } from "./validation.js";

/**
 * @internal
 *
 * Function does a partial validation and updates the error messages.
 * If focusFirstError is true it also focuses the first error.
 *
 * @returns true if the update was successful.
 */
export function validatePartlyWithFocusHandling(options: {
	state: EngineState;
	dispatch: Dispatch;
	middlewareOptions: MiddlewareOptions;
	relevantElements: RelevantFieldPaths[];
	focusFirstError?: boolean;
}): boolean {
	const { state, dispatch, middlewareOptions, relevantElements, focusFirstError } = options;
	const formModel = ModelSelectors.formModel()(state);
	const sectionState = UiStateSelectors.sectionState()(state);
	const storeMessages = UiStateSelectors.messages()(state);
	const validatorProvider = ModelSelectors.validationCode()(state);
	const document = DataSelectors.document()(state) as GroupInstance;

	const initialMessages = removeStaleParseErrors(storeMessages, document);

	const messages = validateElements({
		document,
		initialMessages,
		kernelOptions: middlewareOptions.kernelOptionsProvider?.(state),
		relevantElements: getEffectiveRelevantFields(relevantElements.map(e => e.documentPath)),
		validatorProvider,
		type: "partial"
	});

	if (!messageStateIsEqual(messages, storeMessages)) {
		dispatch(Commands.setMessageState({ messages }));
	}

	const errorPaths = Object.keys(messages)
		.filter(
			path =>
				messages[path]?.parseError ||
				messages[path]?.validationMessages.some(m => m.severity === "ERROR")
		)
		.map(path => DocumentPath.fromString(path));

	if (errorPaths.length > 0) {
		if (focusFirstError) {
			const visibleElements = relevantElements.filter(
				(e): e is { documentPath: EntityInstancePath; formModelPath: ModelPath } =>
					e.formModelPath !== undefined
			);

			const focusedComponent = findFirstErrorElement(
				errorPaths,
				visibleElements,
				sectionState,
				formModel
			);

			if (focusedComponent) {
				dispatch(
					Commands.changeScreenState({
						focusedComponent,
						index: UiStateSelectors.screenLocationStack()(state).length - 1
					})
				);
			}
		}

		return false;
	}

	return true;
}

function findFirstErrorElement(
	errorPaths: EntityInstancePath[],
	visibleFields: { documentPath: EntityInstancePath; formModelPath: ModelPath }[],
	sectionState: ReadonlyObjectMap<boolean>,
	formModel: FormModel
): EngineStore.FocusedComponent | undefined {
	for (const visibleField of visibleFields) {
		const path = errorPaths.find(path => DocumentPath.matches(path, visibleField.documentPath));
		if (path && isReachable(formModel, visibleField.formModelPath, sectionState)) {
			const element = findElementByFormModelPath(formModel, visibleField.formModelPath);
			if (element && isFormModelFieldOverviewColumn(element)) {
				return {
					formModelPath: visibleField.formModelPath,
					index: path[path.length - 2].index - 1
				};
			} else if (element && isFormModelControl(element)) {
				return {
					formModelPath: visibleField.formModelPath
				};
			}
		}
	}

	return undefined;
}

/**
 * Removes parse errors that are no longer consistent with the document.
 * When a parse error is created, the document value is set to null.
 * If the document value is no longer null, the data was externally reset
 * (e.g. via setData) and the parse error is stale.
 */
function removeStaleParseErrors(
	messages: ReadonlyObjectMap<EngineStore.Validation.Entry>,
	document: GroupInstance
): ReadonlyObjectMap<EngineStore.Validation.Entry> {
	function isStaleParseError(key: string, entry: EngineStore.Validation.Entry): boolean {
		if (entry.parseError === undefined) {
			return false;
		}
		const path = DocumentPath.fromString(key);
		const documentValue = DocumentUtils.getValue({ document, path });
		return documentValue !== null;
	}

	return ReadonlyObjectMap.filter(messages, (key, entry) => !isStaleParseError(key, entry));
}

function isReachable(
	formModel: FormModel,
	elementPath: ModelPath,
	sectionState: ReadonlyObjectMap<boolean>
): boolean {
	for (let i = 0; i < elementPath.length - 1; i++) {
		const path = elementPath.slice(0, i + 1);
		const parent = findElementByFormModelPath(formModel, path);
		if (parent && isFormModelSection(parent)) {
			const stateOfSection = sectionState[ModelPath.toString(path)];
			if (stateOfSection === false) {
				return false;
			}
		}
	}

	return true;
}
